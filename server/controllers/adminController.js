import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
// API to check if user is admin
export const isAdmin = async (req, res) => {
  const user = req.user;
  const meta = user?.privateMetadata || {};
  const roles = meta.roles ?? meta.role ?? [];
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  console.log('normalizedRoles - ',normalizedRoles);
  console.log('roles', roles);
  console.log('meta', meta);
  console.log('user', user);

  res.json({
    success: true,
    isAdmin: true,
    roles: normalizedRoles.map((role) => String(role)),
  });
};

// API to get dashboard data
export const getDashboardData = async (req, res) =>{
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking)=> acc + booking.amount, 0),
            activeShows,
            totalUser
        }

        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows
export const getAllShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: { $gte: new Date() }}).populate('movie').sort({ showDateTime: 1 })
        res.json({success: true, shows})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) =>{
    try {
        const bookings = await Booking.find({})
          .populate("user")
          .populate("destination")
          .sort({ createdAt: -1 });
        res.json({success: true, bookings })
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

export const addBookings = async (req, res) => {
  try {
    let inserted = 0;

    for (const entry of bookingSeedData) {
      const userId = entry.traveler.id;
      const visitId = entry.visit._id;
      const movieId = entry.destination._id;
      const title = entry.destination.title;
      const encodedTitle = encodeURIComponent(title);
      const totalAmount = entry.price * entry.amount;

      // await User.findByIdAndUpdate(
      //   userId,
      //   {
      //     _id: userId,
      //     name: entry.traveler.name,
      //     email: entry.traveler.email,
      //     image: `https://i.pravatar.cc/150?u=${userId}`,
      //   },
      //   { upsert: true, new: true, setDefaultsOnInsert: true }
      // );

      // await Movie.findByIdAndUpdate(
      //   movieId,
      //   {
      //     _id: movieId,
      //     title,
      //     overview: `${title} guided experience.`,
      //     poster_path: `https://placehold.co/600x900?text=${encodedTitle}`,
      //     backdrop_path: `https://placehold.co/1200x675?text=${encodedTitle}`,
      //     release_date: "2025-01-01",
      //     original_language: "en",
      //     tagline: `Visit ${title}`,
      //     genres: [{ id: 1, name: "Experience" }],
      //     casts: [{ name: entry.traveler.name, character: "Traveler" }],
      //     vote_average: 8,
      //     runtime: 120,
      //   },
      //   { upsert: true, new: true, setDefaultsOnInsert: true }
      // );

      const occupiedSeats = entry.tickets.reduce((acc, ticket) => {
        acc[ticket] = userId;
        return acc;
      }, {});

      await Show.findByIdAndUpdate(
        visitId,
        {
          _id: visitId,
          movie: movieId,
          showDateTime: new Date(entry.visit.visitDateTime),
          showPrice: entry.price,
          occupiedSeats,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const result = await Booking.findByIdAndUpdate(
        entry.bookingId,
        {
          _id: entry.bookingId,
          user: userId,
          show: visitId,
          amount: totalAmount,
          bookedSeats: entry.tickets,
          isPaid: entry.isPaid,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (result) {
        inserted += 1;
      }
    }

    res.json({
      success: true,
      message: `Seeded ${inserted} booking${inserted === 1 ? "" : "s"}.`,
      bookingIds: bookingSeedData.map((item) => item.bookingId),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Failed to seed bookings." });
  }
};
