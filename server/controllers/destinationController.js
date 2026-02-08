import mongoose from "mongoose";
import Destination from "../models/Destination.js";
import Visit from "../models/Visit.js";
import { inngest } from "../inngest/index.js";

// Helper: build Date from parts like YYYY-MM-DD and HH:mm
function buildDateFromParts(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`);
}

const normalizeCategoryInput = (input) => {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && typeof item.name === "string") {
        return item.name.trim();
      }
      return "";
    })
    .filter(Boolean);
};

const normalizeNearestPlacesInput = (input) => {
  if (!Array.isArray(input)) return [];
  const unique = new Set();

  input.forEach((item) => {
    const place =
      typeof item === "string"
        ? item.trim()
        : item && typeof item === "object" && typeof item.name === "string"
          ? item.name.trim()
          : "";

    if (place) unique.add(place);
  });

  return Array.from(unique);
};

const buildDestinationFilter = (identifier) => {
  if (!identifier) return null;
  const clauses = [];

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    clauses.push({ _id: new mongoose.Types.ObjectId(identifier) });
  }

  clauses.push({ _id: identifier });

  const numericId = Number(identifier);
  if (!Number.isNaN(numericId)) {
    clauses.push({ id: numericId });
  }

  if (clauses.length === 0) return null;
  return { $or: clauses };
};

// POST /api/destinations/add
export const addDestination = async (req, res) => {
  try {
    const {
      title,
      description,
      dateAndTime,
      image,
      poster_path: posterPathFromBody,
      categories,
      category,
      nearestPlaces,
      nearbyPlaces,
      price,
      vote_average,
      vote_count,
    } = req.body || {};

    if (
      !title?.trim() ||
      !description?.trim() ||
      !dateAndTime?.trim() ||
      !(image?.trim() || posterPathFromBody?.trim()) ||
      price == null
    ) {
      return res.status(400).json({
        success: false,
        message: "title, description, dateAndTime, image and price are required",
      });
    }

    const categoryList = normalizeCategoryInput(categories ?? category);
    const nearestPlacesList = normalizeNearestPlacesInput(
      nearestPlaces ?? nearbyPlaces
    );
    const posterPath = (posterPathFromBody || image).trim();
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be a positive number",
      });
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dateAndTime: dateAndTime.trim(),
      poster_path: posterPath,
      category: categoryList,
      nearestPlaces: nearestPlacesList,
      price: parsedPrice,
    };

    if (vote_average != null) {
      payload.vote_average = Number(vote_average) || 0;
    }
    if (vote_count != null) {
      payload.vote_count = Number(vote_count) || 0;
    }

    const destination = await Destination.create(payload);

    await inngest.send({
      name: "app/destination.added",
      data: { destinationTitle: destination.title, destinationId: destination._id.toString() },
    });

    return res.status(201).json({
      success: true,
      message: "Destination added successfully",
      destination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/destinations/:destinationId
export const updateDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const filter = buildDestinationFilter(destinationId);
    if (!filter) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    const {
      title,
      description,
      dateAndTime,
      image,
      poster_path: posterPathFromBody,
      categories,
      category,
      nearestPlaces,
      nearbyPlaces,
      price,
      vote_average,
      vote_count,
    } = req.body || {};

    if (
      !title?.trim() ||
      !description?.trim() ||
      !dateAndTime?.trim() ||
      !(image?.trim() || posterPathFromBody?.trim()) ||
      price == null
    ) {
      return res.status(400).json({
        success: false,
        message: "title, description, dateAndTime, image and price are required",
      });
    }

    const existing = await Destination.findOne(filter);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    const categoryList = normalizeCategoryInput(categories ?? category);
    const nearestPlacesList = normalizeNearestPlacesInput(
      nearestPlaces ?? nearbyPlaces
    );
    const posterPath = (posterPathFromBody || image).trim();
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be a positive number",
      });
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dateAndTime: dateAndTime.trim(),
      poster_path: posterPath,
      category: categoryList,
      nearestPlaces: nearestPlacesList,
      price: parsedPrice,
    };

    if (vote_average != null) {
      payload.vote_average = Number(vote_average) || 0;
    }
    if (vote_count != null) {
      payload.vote_count = Number(vote_count) || 0;
    }

    const updated = await Destination.findOneAndUpdate(filter, payload, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      message: "Destination updated successfully",
      destination: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations
export const getDestinations = async (_req, res) => {
  try {
    const destinationsDocs = await Destination.find({}, {
      // project only what your UI needs
      _id: 1,
      title: 1,
      poster_path: 1,
      category: 1,
      description: 1,
      dateAndTime: 1,
      nearestPlaces: 1,
      price: 1,
      vote_average: 1,
      vote_count: 1,
    })
      .sort({ title: 1 })
      .lean();

    const destinations = destinationsDocs.map((doc) => ({
      ...doc,
      category: normalizeCategoryInput(doc?.category ?? []),
      nearestPlaces: normalizeNearestPlacesInput(doc?.nearestPlaces ?? []),
    }));

    return res.json({ success: true, destinations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/:destinationId
export const getDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const filter = buildDestinationFilter(destinationId);
    if (!filter) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    const destinationDoc = await Destination.findOne(filter).lean();

    if (!destinationDoc) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    const destination = {
      ...destinationDoc,
      category: normalizeCategoryInput(destinationDoc?.category ?? []),
      nearestPlaces: normalizeNearestPlacesInput(
        destinationDoc?.nearestPlaces ?? []
      ),
    };
    return res.json({ success: true, destination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/destinations/:destinationId
export const deleteDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const filter = buildDestinationFilter(destinationId);
    if (!filter) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    const destination = await Destination.findOne(filter);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    await Visit.deleteMany({ destination: String(destination._id) });
    await destination.deleteOne();

    return res.json({ success: true, message: "Destination deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/destinations/visits
// Body: { destinationId: string, visitsInput: [{ date: 'YYYY-MM-DD', time: ['HH:mm', ...] }], price: number }
export const addVisit = async (req, res) => {
  try {
    const { destinationId, visitsInput, price } = req.body || {};
    if (!destinationId || !Array.isArray(visitsInput) || price == null) {
      return res.status(400).json({
        success: false,
        message: "destinationId, visitsInput and price are required",
      });
    }

    const destination = await Destination.findById(destinationId).lean();
    if (!destination) {
      return res
        .status(404)
        .json({ success: false, message: "Destination not found" });
    }

    const docs = [];
    for (const block of visitsInput) {
      const date = block?.date;
      const times = Array.isArray(block?.time) ? block.time : [];
      for (const t of times) {
        docs.push({
          destination: String(destinationId),
          visitDateTime: buildDateFromParts(date, t),
          price: Number(price),
          bookedUsers: {},
        });
      }
    }

    if (docs.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No visit slots to create" });
    }

    await Visit.insertMany(docs);

    return res.json({ success: true, created: docs.length });
  } catch (error) {
    // If unique index is later added, this would catch duplicates
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Some visit slots already exist (duplicate)",
        duplicateKey: error.keyValue,
      });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/:destinationId/visits
// Returns grouped by date: { 'YYYY-MM-DD': [{ time, visitId }] }
export const getVisits = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const now = new Date();
    const visits = await Visit.find({
      destination: String(destinationId),
      visitDateTime: { $gte: now },
    })
      .sort({ visitDateTime: 1 })
      .lean();

    const dateTime = {};
    for (const v of visits) {
      const date = new Date(v.visitDateTime).toISOString().split("T")[0];
      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({ time: v.visitDateTime, visitId: v._id });
    }

    return res.json({ success: true, dateTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
