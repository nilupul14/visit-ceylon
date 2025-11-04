import fs from "fs";
import path from "path";
import Destination from "../models/Destination.js";
import Visit from "../models/Visit.js";
import { inngest } from "../inngest/index.js";

// Helper: build Date from parts like YYYY-MM-DD and HH:mm
function buildDateFromParts(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`);
}

// POST /api/destinations/seed
// Accepts either:
//  - req.body.destinations: array of destination objects (preferred)
//  - or auto-extracts dummyShowsData from client/src/assets/assets.js (best-effort)
export const seedDestinations = async (req, res) => {
  try {
    let destinations = Array.isArray(req.body?.destinations)
      ? req.body.destinations
      : null;

    // Fallback: try extracting from client dummy file without importing assets
    if (!destinations) {
      // Try both repo-root and parent-of-server locations
      const candidatePaths = [
        path.resolve(process.cwd(), "client/src/assets/assets.js"),
        path.resolve(process.cwd(), "../client/src/assets/assets.js"),
      ];

      const clientAssetsPath = candidatePaths.find((p) => fs.existsSync(p));
      if (!clientAssetsPath) {
        return res.status(400).json({
          success: false,
          message:
            "No destinations provided and client assets file not found. POST { destinations: [...] } to seed.",
        });
      }

      const src = fs.readFileSync(clientAssetsPath, "utf8");
      const startToken = "export const dummyShowsData = [";
      const endToken = "export const dummyDateTimeData"; // next export after array
      const startIdx = src.indexOf(startToken);
      const endIdx = src.indexOf(endToken, startIdx);
      if (startIdx === -1 || endIdx === -1) {
        return res.status(400).json({
          success: false,
          message:
            "Could not locate dummyShowsData in assets.js. POST { destinations: [...] } instead.",
        });
      }

      const arrayMatch = src
        .slice(startIdx, endIdx)
        .match(/export const dummyShowsData\s*=\s*(\[[\s\S]*\])/);

      if (!arrayMatch) {
        return res.status(400).json({
          success: false,
          message: "Failed to parse dummyShowsData array; please POST destinations manually.",
        });
      }

      const arrayLiteral = arrayMatch[1];

      // Evaluate a clean JS array literal safely in a limited Function scope
      // eslint-disable-next-line no-new-func
      const parsed = new Function(`return ${arrayLiteral};`)();
      if (!Array.isArray(parsed)) {
        return res
          .status(400)
          .json({ success: false, message: "Parsed data is not an array." });
      }
      destinations = parsed;
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No destinations to seed." });
    }

    // Upsert by _id to avoid duplicates on repeated seeding
    const ops = destinations.map((doc) => ({
      updateOne: {
        filter: { _id: String(doc._id) },
        update: {
          $set: {
            _id: String(doc._id),
            id: Number(doc.id),
            title: doc.title,
            description: doc.description,
            poster_path: doc.poster_path,
            backdrop_path: doc.backdrop_path,
            category: doc.category,
            tagline: doc.tagline || "",
            vote_average: Number(doc.vote_average || 0),
            vote_count: Number(doc.vote_count || 0),
            runtime: Number(doc.runtime || 0),
          },
        },
        upsert: true,
      },
    }));

    if (ops.length > 0) {
      await Destination.bulkWrite(ops, { ordered: false });
    }

    return res.json({ success: true, count: ops.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations
export const getDestinations = async (_req, res) => {
  try {
    const destinations = await Destination.find({})
      .sort({ title: 1 })
      .lean();
    return res.json({ success: true, destinations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/:destinationId
export const getDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const destination = await Destination.findById(destinationId).lean();
    if (!destination) {
      return res
        .status(404)
        .json({ success: false, message: "Destination not found" });
    }
    return res.json({ success: true, destination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/destinations/visits
// Body: { destinationId: string, visitsInput: [{ date: 'YYYY-MM-DD', time: ['HH:mm', ...] }], price: number }
export const addVisit = async (req, res) => {
  try {
    const { destinationId, visitsInput, price } = req.body || {};
    if (!destinationId || !Array.isArray(visitsInput) || price == null) {
      return res.status(400).json({
        success: false,
        message: "destinationId, visitsInput and price are required",
      });
    }

    const destination = await Destination.findById(destinationId).lean();
    if (!destination) {
      return res
        .status(404)
        .json({ success: false, message: "Destination not found" });
    }

    const docs = [];
    for (const block of visitsInput) {
      const date = block?.date;
      const times = Array.isArray(block?.time) ? block.time : [];
      for (const t of times) {
        docs.push({
          destination: String(destinationId),
          visitDateTime: buildDateFromParts(date, t),
          price: Number(price),
          bookedUsers: {},
        });
      }
    }

    if (docs.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No visit slots to create" });
    }

    await Visit.insertMany(docs);

    await inngest.send({
      name: "app/visit.added",
      data: { destinationTitle: destination.title, destinationId },
    });

    return res.json({ success: true, created: docs.length });
  } catch (error) {
    // If unique index is later added, this would catch duplicates
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Some visit slots already exist (duplicate)",
        duplicateKey: error.keyValue,
      });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/:destinationId/visits
// Returns grouped by date: { 'YYYY-MM-DD': [{ time, visitId }] }
export const getVisits = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const now = new Date();
    const visits = await Visit.find({
      destination: String(destinationId),
      visitDateTime: { $gte: now },
    })
      .sort({ visitDateTime: 1 })
      .lean();

    const dateTime = {};
    for (const v of visits) {
      const date = new Date(v.visitDateTime).toISOString().split("T")[0];
      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({ time: v.visitDateTime, visitId: v._id });
    }

    return res.json({ success: true, dateTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
