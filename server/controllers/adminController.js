import Booking from "../models/Booking.js";
import Destination from "../models/Destination.js";
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
        const [totalUser, activeDestinations] = await Promise.all([
            User.countDocuments(),
            Destination.countDocuments()
        ]);

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking)=> acc + booking.amount, 0),
            activeDestinations,
            totalUser
        }

        res.json({success: true, dashboardData})
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
