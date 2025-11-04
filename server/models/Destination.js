import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true }
}, { _id: false });

const destinationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    category: { type: [categorySchema], required: true },
    tagline: { type: String },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    runtime: { type: Number, required: true }
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
