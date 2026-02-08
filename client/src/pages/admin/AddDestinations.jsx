import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { DeleteIcon, PencilIcon, StarIcon, XIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const normalizeCategoryValues = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);
};

const normalizeNearestPlaceValues = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);
};

const AddDestinations = () => {
  const { axios, getToken, image_base_url, destinations, fetchShows } =
    useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [nearestPlaces, setNearestPlaces] = useState([]);
  const [nearestPlaceInput, setNearestPlaceInput] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [addingDestination, setAddingDestination] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDestination, setEditingDestination] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const availableDestinations = useMemo(
    () => (Array.isArray(destinations) ? destinations : []),
    [destinations]
  );

  const handleCategoryAdd = () => {
    const value = categoryInput.trim();
    if (!value || categories.includes(value)) return;
    setCategories((prev) => [...prev, value]);
    setCategoryInput("");
  };

  const handleCategoryRemove = (value) => {
    setCategories((prev) => prev.filter((item) => item !== value));
  };

  const handleNearestPlaceAdd = () => {
    const value = nearestPlaceInput.trim();
    if (!value || nearestPlaces.includes(value)) return;
    setNearestPlaces((prev) => [...prev, value]);
    setNearestPlaceInput("");
  };

  const handleNearestPlaceRemove = (value) => {
    setNearestPlaces((prev) => prev.filter((item) => item !== value));
  };

  const clearFormFields = () => {
    setTitle("");
    setDescription("");
    setDateAndTime("");
    setCategories([]);
    setCategoryInput("");
    setNearestPlaces([]);
    setNearestPlaceInput("");
    setImage("");
    setPrice("");
  };

  const resetForm = () => {
    clearFormFields();
    setEditingDestination(null);
  };

  const handleEditStart = (destination) => {
    setEditingDestination(destination);
    setTitle(destination.title || "");
    setDescription(destination.description || "");
    setDateAndTime(
      destination.dateAndTime ||
        destination.date_time ||
        destination.release_date ||
        ""
    );
    setCategories(normalizeCategoryValues(destination.category));
    setCategoryInput("");
    setNearestPlaces(
      normalizeNearestPlaceValues(
        destination.nearestPlaces || destination.nearbyPlaces
      )
    );
    setNearestPlaceInput("");
    setImage(destination.poster_path || destination.image || "");
    setPrice(
      destination.price != null ? String(destination.price) : ""
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const isEditing = Boolean(editingDestination);

  const handleSubmit = async () => {
    try {
      setAddingDestination(true);

      const pendingNearestPlace = nearestPlaceInput.trim();
      const nearestPlacesPayload = pendingNearestPlace
        ? Array.from(new Set([...nearestPlaces, pendingNearestPlace]))
        : nearestPlaces;

      if (
        !title.trim() ||
        !description.trim() ||
        !dateAndTime.trim() ||
        !image.trim() ||
        categories.length === 0 ||
        !price
      ) {
        toast.error("Missing required fields");
        return;
      }

      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        toast.error("Price must be a positive number");
        return;
      }

      const payload = {
        price: numericPrice,
        title: title.trim(),
        description: description.trim(),
        dateAndTime: dateAndTime.trim(),
        image: image.trim(),
        poster_path: image.trim(),
        categories,
        nearestPlaces: nearestPlacesPayload
      };

      if (isEditing) {
        if (editingDestination?.vote_average != null) {
          payload.vote_average = editingDestination.vote_average;
        }
        if (editingDestination?.vote_count != null) {
          payload.vote_count = editingDestination.vote_count;
        }
      }

      const token = await getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      const endpoint = isEditing
        ? `/api/destinations/${editingDestination._id}`
        : "/api/destinations/add";

      const request = isEditing
        ? axios.put(endpoint, payload, config)
        : axios.post(endpoint, payload, config);

      const { data } = await request;

      if (data?.success) {
        toast.success(
          data.message ||
            (isEditing
              ? "Destination updated successfully"
              : "Destination added successfully")
        );
        await fetchShows?.();
        resetForm();
      } else {
        toast.error(data?.message || "Failed to save destination");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAddingDestination(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Destinations" />
      {isEditing && (
        <div className="mt-4 flex items-center justify-between gap-4 border border-primary/40 bg-primary/5 px-4 py-3 rounded-lg">
          <div>
            <p className="text-sm text-gray-300">Editing destination</p>
            <p className="font-semibold">{editingDestination.title}</p>
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-red-400 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <XIcon className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}
      <p className="mt-10 text-lg font-medium">Current Destinations</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {availableDestinations.length === 0 && (
            <p className="text-gray-400 text-sm">No destinations found yet.</p>
          )}
          {availableDestinations.map((destination) => {
            const poster =
              destination.image ||
              (destination.poster_path &&
              destination.poster_path.startsWith("http")
                ? destination.poster_path
                : image_base_url + (destination.poster_path || ""));
            const rating = Number(destination.vote_average ?? 0).toFixed(1);
            const votes = Number(destination.vote_count ?? 0);
            const when =
              destination.dateAndTime ||
              destination.date_time ||
              destination.release_date ||
              "Sri Lanka";
            const isActive =
              editingDestination?._id === destination._id;

            return (
              <div
                key={destination._id || destination.id}
                className={`relative w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 ${
                  isActive ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleEditStart(destination)}
              >
                <div className="relative rounded-lg overflow-hidden h-56">
                  <img
                    src={poster}
                    alt={destination.title}
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                    <p className="flex items-center gap-1 text-gray-400">
                      <StarIcon className="w-4 h-4 text-primary fill-primary" />
                      {rating}
                    </p>
                    <p className="text-gray-300">
                      {kConverter(votes)} Votes
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <p className="font-medium truncate flex-1">
                    {destination.title}
                  </p>
                  <PencilIcon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                  {when}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter destination title"
            className="w-full border border-gray-600 bg-transparent rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date and Time</label>
          <input
            type="text"
            value={dateAndTime}
            onChange={(e) => setDateAndTime(e.target.value)}
            placeholder="Add a short date & time"
            className="w-full border border-gray-600 bg-transparent rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the destination"
            className="w-full border border-gray-600 bg-transparent rounded-md px-3 py-2 outline-none focus:border-primary transition-colors resize-y min-h-[120px]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCategoryAdd();
                  }
                }}
                placeholder="Add category and press Enter"
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleCategoryAdd}
                className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 border border-primary px-3 py-1 rounded-full text-sm"
                >
                  {category}
                  <DeleteIcon
                    width={14}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleCategoryRemove(category)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Nearest Places
          </label>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
              <input
                type="text"
                value={nearestPlaceInput}
                onChange={(e) => setNearestPlaceInput(e.target.value)}
                onBlur={handleNearestPlaceAdd}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNearestPlaceAdd();
                  }
                }}
                placeholder="Add nearby place and press Enter"
                className="flex-1 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleNearestPlaceAdd}
                className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
          {nearestPlaces.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {nearestPlaces.map((place) => (
                <span
                  key={place}
                  className="inline-flex items-center gap-1 border border-primary px-3 py-1 rounded-full text-sm"
                >
                  {place}
                  <DeleteIcon
                    width={14}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleNearestPlaceRemove(place)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://res.cloudinary.com/dirqkqwps/image/upload/[image_name].jpg"
            className="w-full border border-gray-600 bg-transparent rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
          />
          {image && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Preview</p>
              <img
                src={image}
                alt="Destination preview"
                className="max-h-48 rounded-md object-cover border border-gray-700/60"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={addingDestination}
          className="bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {addingDestination
            ? isEditing
              ? "Updating…"
              : "Adding…"
            : isEditing
            ? "Update Destination"
            : "Add Destination"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Reset Form
          </button>
        )}
      </div>
    </>
  );
};

export default AddDestinations;
