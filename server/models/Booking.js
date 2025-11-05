import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
      bookingId: { type: String, required: true, unique: true },
      user: { type: String, required: true, ref: "User" },
      destination: { type: String, required: true, ref: "Destination" },
      visitDate: { type: Date, required: true },
      visitTime: { type: String, required: true },
      amount: { type: Number, required: true, min: 1 },
  
      userName: { type: String, immutable: true },
      destinationTitle: { type: String, immutable: true }
    },
    { timestamps: true }
  );
  
  // Auto-fill snapshots on create
  bookingSchema.pre('validate', async function (next) {
    try {
      if ((!this.userName || !this.destinationTitle) && (this.user && this.destination)) {
        const User = mongoose.model('User');
        const Destination = mongoose.model('Destination');
  
        // fetch only what you need
        const [u, d] = await Promise.all([
          User.findById(this.user).select('name').lean(),
          Destination.findById(this.destination).select('title').lean(),
        ]);
  
        if (!this.userName && u?.name) this.userName = u.name;
        if (!this.destinationTitle && d?.title) this.destinationTitle = d.title;
      }
      next();
    } catch (err) { next(err); }
  });


const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
