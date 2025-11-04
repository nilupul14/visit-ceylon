import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    destination: { type: String, ref: "Destination", required: true },
    visitDateTime: { type: Date, required: true },
    price: { type: Number, required: true },
    bookedUsers: { type: Object, default: {} },
  },
  { minimize: false, timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
