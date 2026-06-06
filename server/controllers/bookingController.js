import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Visit from "../models/Visit.js";
import Destination from "../models/Destination.js";
import mongoose from "mongoose";
import Stripe from "stripe";


// --- helpers ---
const isHHmm = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ""));

const toDateOnly = (d) => {
  // Accept Date, ISO string, or YYYY-MM-DD
  if (d instanceof Date) return d;
  if (typeof d === "string") {
    // If "YYYY-MM-DD", turn into midnight UTC date; otherwise let Date parse
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T00:00:00.000Z`);
    return new Date(d);
  }
  return null;
};

// POST /api/bookings
export const addBooking = async (req, res) => {
  try {
    const authContext = typeof req.auth === "function" ? req.auth() : req.auth;
    const authUserId = authContext?.userId;
    const { origin } = req.headers;

    const {
      bookingId,     // optional; if omitted we'll generate one
      visitId,
      destination,
      visitDate,
      visitTime,
      amount,
      // Optional snapshots; your pre-hook will fill these if omitted:
      userName,
      userEmail,
      destinationTitle,
    } = req.body || {};

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let destinationId = destination ? String(destination) : null;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    let visitDateObj = null;
    let visitTimeValue = null;
    let visitRefId = null;

    if (visitId) {
      if (!mongoose.isValidObjectId(visitId)) {
        return res.status(400).json({
          success: false,
          message: "visitId is invalid",
        });
      }
      const visitDoc = await Visit.findById(visitId).lean();
      if (!visitDoc) {
        return res.status(404).json({
          success: false,
          message: "Visit slot not found",
        });
      }
      visitRefId = visitDoc._id;
      const visitDateIso = new Date(visitDoc.visitDateTime).toISOString();
      visitDateObj = toDateOnly(visitDateIso.slice(0, 10));
      visitTimeValue = visitDateIso.slice(11, 16);

      if (!destinationId) {
        destinationId = String(visitDoc.destination);
      } else if (String(visitDoc.destination) !== destinationId) {
        return res.status(400).json({
          success: false,
          message: "Visit slot does not belong to the provided destination",
        });
      }
    } else {
      if (!destinationId || !visitDate || !visitTime) {
        return res.status(400).json({
          success: false,
          message: "destination, visitDate and visitTime are required",
        });
      }

      if (!isHHmm(visitTime)) {
        return res.status(400).json({
          success: false,
          message: "visitTime must be in HH:mm (24-hour) format",
        });
      }

      visitTimeValue = visitTime;
      visitDateObj = toDateOnly(visitDate);
      if (Number.isNaN(visitDateObj?.getTime())) {
        return res.status(400).json({ success: false, message: "visitDate is invalid" });
      }
    }

    if (!destinationId) {
      return res.status(400).json({
        success: false,
        message: "destination is required",
      });
    }

    const doc = {
      bookingId: bookingId || `bk_${Date.now()}`,
      user: String(authUserId),
      destination: destinationId,
      visitDate: visitDateObj,
      visitTime: visitTimeValue,
      amount: numericAmount,
    };

    if (visitRefId) doc.visit = visitRefId;
    // Allow passing snapshots explicitly, otherwise pre-hook fills them
    if (userName) doc.userName = String(userName);
    if (userEmail) doc.userEmail = String(userEmail);
    if (destinationTitle) doc.destinationTitle = String(destinationTitle);

    const created = await Booking.create(doc);

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(201).json({ success: true, booking: created });
    }

    const stripeClient = new Stripe(stripeSecret);

    const destinationDoc = await Destination.findById(destinationId)
      .select("title price")
      .lean();

    const productName =
      destinationDoc?.title ||
      destinationTitle ||
      "Visit Ceylon Reservation";

    const pricePerTicket = Number(destinationDoc?.price);
    const unitAmount = Math.max(
      1,
      Math.round(
        (Number.isFinite(pricePerTicket) && pricePerTicket > 0
          ? pricePerTicket
          : 1) * 100
      )
    );
    const quantity = Math.max(1, numericAmount);

    const baseUrl =
      origin ||
      process.env.CLIENT_URL ||
      process.env.VITE_BASE_URL ||
      "http://localhost:5173";

    try {
      const session = await stripeClient.checkout.sessions.create({
        success_url: `${baseUrl}/my-bookings?status=success`,
        cancel_url: `${baseUrl}/my-bookings?status=cancelled`,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: productName },
              unit_amount: unitAmount,
            },
            quantity,
          },
        ],
        mode: "payment",
        metadata: {
          bookingId: created._id.toString(),
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      created.paymentLink = session.url;
      created.checkoutSessionId = session.id;
      await created.save();

      await inngest.send({
        name: "app/checkpayment",
        data: {
          bookingId: created._id.toString(),
        },
      });

      return res.status(201).json({
        success: true,
        booking: created,
        url: session.url,
      });
    } catch (paymentError) {
      console.error("Stripe checkout error:", paymentError);
      return res.status(201).json({
        success: true,
        booking: created,
        message: "Booking saved but payment link failed to generate. Please retry from My Bookings.",
      });
    }

  } catch (err) {
    // handle duplicate bookingId nicely
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "bookingId already exists" });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings
// Query params supported:
//   page, limit
//   user, destination
//   dateFrom (YYYY-MM-DD or ISO), dateTo (inclusive)
//   bookingId (exact)
//   q (search in bookingId / userName / destinationTitle)
export const getBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user,
      destination,
      dateFrom,
      dateTo,
      bookingId,
      q,
    } = req.query || {};

    const filter = {};

    if (bookingId) filter.bookingId = String(bookingId);
    if (user) filter.user = String(user);
    if (destination) filter.destination = String(destination);

    // date range on visitDate (date-only)
    const gte = dateFrom ? toDateOnly(dateFrom) : null;
    const lte = dateTo ? toDateOnly(dateTo) : null;
    if (gte || lte) {
      filter.visitDate = {};
      if (gte) filter.visitDate.$gte = gte;
      if (lte) {
        // make end inclusive by adding one day and using $lt
        const end = new Date(lte);
        end.setUTCDate(end.getUTCDate() + 1);
        filter.visitDate.$lt = end;
      }
    }

    if (q) {
      const text = String(q);
      filter.$or = [
        { bookingId: { $regex: text, $options: "i" } },
        { userName: { $regex: text, $options: "i" } },
        { destinationTitle: { $regex: text, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Booking.find(filter)
        .sort({ visitDate: 1, visitTime: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) || 1),
      bookings: items,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/:id
// :id can be Mongo _id OR bookingId
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const isObjectId = mongoose.isValidObjectId(id);
    const booking = await Booking.findOne(
      isObjectId ? { _id: id } : { bookingId: String(id) }
    ).lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
