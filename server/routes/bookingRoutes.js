import express from 'express';
import { addBooking, getBookings, getBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/', addBooking);
bookingRouter.get('/', getBookings);
bookingRouter.get('/:id', getBooking);

export default bookingRouter;