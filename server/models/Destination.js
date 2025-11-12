import mongoose from "mongoose";

const normalizeCategories = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && typeof item.name === "string") {
        return item.name.trim();
      }
      return "";
    })
    .filter(Boolean);
};

const destinationSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    dateAndTime: { type: String, required: true, trim: true },
    poster_path: { type: String, required: true, trim: true },
    category: {
      type: [String],
      default: [],
      set: normalizeCategories,
      get: normalizeCategories,
    },
    price: { type: Number, required: true, min: 0 },
    vote_average: { type: Number, default: 5 },
    vote_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

destinationSchema.set("toJSON", { getters: true });
destinationSchema.set("toObject", { getters: true });

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
