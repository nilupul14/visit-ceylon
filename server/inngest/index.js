import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import sendEmail, { buildBookingConfirmationEmail } from "../configs/nodeMailer.js";

// Create a client to send and receive events
// export const inngest = new Inngest({ id: "movie-ticket-booking" });
export const inngest = new Inngest({ id: "visit-ceylon-booking" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    { event: 'clerk/user.created' },
    async ({ event })=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    { event: 'clerk/user.deleted' },
    async ({ event })=>{
        
       const {id} = event.data
       await User.findByIdAndDelete(id)
    }
)

// Inngest Function to update user data in database 
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    { event: 'clerk/user.updated' },
    async ({ event })=>{
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to cancel booking after 10 minutes if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id: 'release-seats-delete-booking'},
    {event: "app/checkpayment"},
    async ({ event, step })=>{
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async ()=>{
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            // If payment is not made, release seats and delete booking
            if(!booking){
                return { skipped: true, message: "Booking not found" }
            }

            if(!booking.isPaid){
                await Booking.findByIdAndDelete(booking._id)
                return { deleted: true }
            }

            return { retained: true }
        })
    }
)

// Inngest Function to send email when a booking is confirmed
const sendBookingConfirmationEmail = inngest.createFunction(
    {id: "send-booking-confirmation-email"},
    {event: "app/booking.confirmed"},
    async ({ event, step })=>{
        const { bookingId } = event.data;

        return step.run("send-booking-email", async ()=>{
            const booking = await Booking.findById(bookingId)
                .populate({ path: "user", select: "name email" })
                .populate({ path: "destination", select: "title" });

            if(!booking){
                throw new Error(`Booking ${bookingId} not found`);
            }

            const userEmail = booking.userEmail || booking.user?.email;
            if(!userEmail){
                return { skipped: true, message: "Booking has no user email" };
            }

            const userName = booking.userName || booking.user?.name || "Traveler";
            const destinationTitle = booking.destinationTitle || booking.destination?.title || "your trip";
            const timeZone = "Asia/Colombo";

            const visitDateTime = booking.visitDate
                ? new Date(booking.visitDate)
                : null;

            const formattedDate = visitDateTime
                ? visitDateTime.toLocaleDateString("en-US", { timeZone })
                : "Date not available";

            const formattedTime = booking.visitTime || "Time not available";

            const amountLabel = booking.amount
              ? `LKR ${Number(booking.amount).toLocaleString()}`
              : "N/A";

            const defaultLogoUrl =
              "https://res.cloudinary.com/dirqkqwps/image/upload/v1767511889/visitCeylonLogo_fdlawx.png";

            await sendEmail({
                to: userEmail,
                subject: `Booking confirmed: ${destinationTitle}`,
                body: await buildBookingConfirmationEmail({
                  userName,
                  destinationTitle,
                  bookingId: booking.bookingId || booking._id?.toString(),
                  email: userEmail,
                  visitDate: formattedDate,
                  visitTime: formattedTime,
                  amount: amountLabel,
                  logoUrl: process.env.EMAIL_LOGO_URL || defaultLogoUrl
                })
            })

            return { sent: true, to: userEmail };
        })
    }
)

// Daily reminders for next-day visits
const sendDestinationReminders = inngest.createFunction(
    { id: "send-destination-reminders" },
    { cron: "0 9 * * *" }, // every day at 09:00 UTC
    async ({ step })=>{
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2));

        const bookings = await Booking.find({
            isPaid: true,
            visitDate: { $gte: start, $lt: end }
        })
        .populate({ path: "user", select: "name email" })
        .populate({ path: "destination", select: "title" })
        .lean();

        if(!bookings.length){
            return { sent: 0, message: "No reminders to send" };
        }

        const timeZone = "Asia/Colombo";
        const results = await step.run("send-reminder-emails", async ()=>{
            return Promise.allSettled(bookings.map(b => {
                const to = b.userEmail || b.user?.email;
                if(!to) return Promise.resolve({ skipped: true });

                const userName = b.userName || b.user?.name || "Traveler";
                const destinationTitle = b.destinationTitle || b.destination?.title || "your trip";
                const visitDateTime = b.visitDate ? new Date(b.visitDate) : null;
                const dateLabel = visitDateTime
                    ? visitDateTime.toLocaleDateString("en-US", { timeZone })
                    : "soon";
                const timeLabel = b.visitTime || "the scheduled time";

                return sendEmail({
                    to,
                    subject: `Reminder: ${destinationTitle} is tomorrow`,
                    body: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
                            <h2 style="margin-bottom: 8px;">Hi ${userName},</h2>
                            <p style="margin: 0 0 12px;">Just a heads-up: your VisitCeylon booking is tomorrow.</p>
                            <p style="margin: 0 0 12px;"><strong style="color: #F84565;">${destinationTitle}</strong></p>
                            <p style="margin: 0 0 12px;">
                                <strong>Date:</strong> ${dateLabel}<br/>
                                <strong>Time:</strong> ${timeLabel}
                            </p>
                            <p style="margin: 0;">See you soon,<br/>VisitCeylon Team</p>
                        </div>`
                })
            }))
        });

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;
        return { sent, failed };
    }
)

// Notify all users when a new destination is added
const sendNewDestinationNotifications = inngest.createFunction(
    { id: "send-new-destination-notifications" },
    { event: "app/destination.added" },
    async ({ event })=>{
        const { destinationTitle } = event.data;
        const users = await User.find({}).select("name email").lean();
        if(!users.length){
            return { sent: 0, message: "No users to notify" };
        }

        for(const user of users){
            if(!user.email) continue;
            await sendEmail({
                to: user.email,
                subject: `New destination: ${destinationTitle}`,
                body: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
                        <h2 style="margin-bottom: 8px;">Hi ${user.name || "Traveler"},</h2>
                        <p style="margin: 0 0 12px;">We just added a new experience to VisitCeylon.</p>
                        <p style="margin: 0 0 12px;"><strong style="color: #F84565;">${destinationTitle}</strong></p>
                        <p style="margin: 0;">Check it out in the app!<br/>VisitCeylon Team</p>
                    </div>`
            })
        }

        return { sent: users.length };
    }
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendDestinationReminders,
    sendNewDestinationNotifications
];
