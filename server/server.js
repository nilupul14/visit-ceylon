import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import destinationRouter from './routes/destinationRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;

await connectDB()

// Stripe Webhooks Route (use raw body for signature verification)
app.use('/api/stripe', express.raw({ type: '*/*' }), stripeWebhooks)

// Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


// API Routes
app.get('/', (req, res)=> res.send('Server Is Live'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/destinations', destinationRouter)
app.use('/api/bookings', bookingRouter)


app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));
