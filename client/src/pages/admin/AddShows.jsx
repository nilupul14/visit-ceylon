import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, image_base_url, destinations } =
    useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  const availableDestinations = useMemo(
    () => (Array.isArray(destinations) ? destinations : []),
    [destinations]
  );

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes
      };
    });
  };

  const handleCategoryAdd = () => {
    const value = categoryInput.trim();
    if (!value || categories.includes(value)) return;
    setCategories((prev) => [...prev, value]);
    setCategoryInput("");
  };

  const handleCategoryRemove = (value) => {
    setCategories((prev) => prev.filter((item) => item !== value));
  };

  const resetForm = () => {
    setSelectedMovie(null);
    setDateTimeSelection({});
    setShowPrice("");
    setTitle("");
    setDescription("");
    setTagline("");
    setImage("");
    setCategories([]);
    setCategoryInput("");
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (
        !selectedMovie ||
        !title.trim() ||
        !description.trim() ||
        !tagline.trim() ||
        !image.trim() ||
        categories.length === 0 ||
        Object.keys(dateTimeSelection).length === 0 ||
        !showPrice
      ) {
        toast.error("Missing required fields");
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).flatMap(
        ([date, times]) => times.map((time) => ({ date, time }))
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
        title: title.trim(),
        description: description.trim(),
        tagline: tagline.trim(),
        image: image.trim(),
        categories
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data?.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data?.message || "Failed to add show");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAddingShow(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Destinations" />
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

            return (
              <div
                key={destination._id || destination.id}
                className={`relative w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 ${
                  selectedMovie === (destination._id || destination.id)
                    ? "opacity-100"
                    : ""
                }`}
                onClick={() =>
                  setSelectedMovie(destination._id || destination.id)
                }
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
                      {(destination.vote_average ?? 0).toFixed(1)}
                    </p>
                    <p className="text-gray-300">
                      {kConverter(destination.vote_count ?? 0)} Votes
                    </p>
                  </div>
                </div>
                {selectedMovie === (destination._id || destination.id) && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                    <CheckIcon
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <p className="font-medium truncate">{destination.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                  {destination.tagline ||
                    destination.release_date ||
                    "Sri Lanka"}
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
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Add a short tagline"
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
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/cover.jpg"
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
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md bg-transparent"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-primary px-2 py-1 flex items-center rounded"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {addingShow ? "Adding…" : "Add Destination"}
      </button>
    </>
  );
};

export default AddShows;
