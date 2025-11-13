import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Destination from "../models/Destination.js";


// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const auth = typeof req.auth === "function" ? req.auth() : req.auth;
        const userId = auth?.userId;

        if(!userId){
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const bookings = await Booking.find({user: userId}).sort({createdAt: -1 }).lean();
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res)=>{
    try {
        console.log("Request Body:", req.body);
        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})

        res.json({success: true, message: "Favorite movies updated" })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req, res) =>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        // Getting movies from database
        const destinations = await Destination.find({_id: {$in: favorites}})

        console.log('destinations', destinations)

        res.json({success: true, destinations})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}
