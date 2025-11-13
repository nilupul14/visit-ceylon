import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { dummyDateTimeData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, MapPinIcon, StarIcon, CalendarClockIcon, HandCoinsIcon } from "lucide-react";
import Calendar from "../components/Calender";
import BookingForm from "../components/BookingForm";
import DestinationCard from "../components/DestinationCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const DestinationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [availability, setAvailability] = useState({});
  const [availabilityStatus, setAvailabilityStatus] = useState("loading");

  const {
    axios,
    getToken,
    user,
    destinations = [],
    fetchFavoriteMovies,
    favoriteMovies = [],
  } = useAppContext();

  const destinationsRef = useRef(destinations);
  useEffect(() => {
    destinationsRef.current = destinations;
  }, [destinations]);

  const resolveFallbackDestination = () => {
    const list = destinationsRef.current;
    if (!Array.isArray(list) || list.length === 0) return null;
    const numericId = Number(id);
    return (
      list.find((item) => {
        const stringMatch =
          String(item._id) === String(id) || String(item.id) === String(id);
        const numericMatch = !Number.isNaN(numericId) && item.id === numericId;
        return stringMatch || numericMatch;
      }) || null
    );
  };

  const suggestedDestinations = useMemo(() => {
    if (!Array.isArray(destinations) || destinations.length === 0) return [];
    return destinations.slice(0, 4);
  }, [destinations]);

  const getDestination = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/destinations/${id}`);
      console.log("Fetched destination data:", data.destination);
      if (data?.success && data?.destination) {
        setDestination(data.destination);
        return;
      }
    } catch (error) {
      console.log("API error, using dummy data...", error);
    }

    const fallback = resolveFallbackDestination();
    if (fallback) {
      setDestination(fallback);
      return;
    }

    toast.error("Destination not found");
    navigate("/destinations");
  }, [axios, id, navigate]);

  const fetchAvailability = useCallback(
    async (destinationId) => {
      if (!destinationId) return;
      setAvailabilityStatus("loading");
      try {
        const { data } = await axios.get(
          `/api/destinations/${destinationId}/visits`
        );
        if (data?.success && data?.dateTime) {
          setAvailability(data.dateTime);
          setAvailabilityStatus(
            Object.keys(data.dateTime).length ? "ready" : "empty"
          );
          return;
        }
        setAvailability({});
        setAvailabilityStatus("empty");
      } catch (error) {
        console.log("Visit availability error, using demo data...", error);
        setAvailability(dummyDateTimeData);
        setAvailabilityStatus("fallback");
      }
    },
    [axios]
  );

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data?.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const availableDates = useMemo(
    () => (availability ? Object.keys(availability).sort() : []),
    [availability]
  );
  const initialCalendarDate = useMemo(() => {
    if (availableDates.length) {
      return new Date(`${availableDates[0]}T00:00:00`);
    }
    return new Date();
  }, [availableDates]);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const [calendarPulse, setCalendarPulse] = useState(false);

  useEffect(() => {
    getDestination();
  }, [getDestination]);

  useEffect(() => {
    if (!destination) return;
    const destinationId = destination?._id || destination?.id;
    if (destinationId) {
      fetchAvailability(destinationId);
    } else {
      setAvailability({});
      setAvailabilityStatus("empty");
    }
  }, [destination, fetchAvailability]);

  if (!destination) return <Loading />;

  const categoryList = Array.isArray(destination.category)
  ? destination.category
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean)
  : [];

  const openMap = () => {
    const query = encodeURIComponent(destination.title + " Sri Lanka");
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={destination?.poster_path}
          alt={destination?.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {destination?.title}
          </h1>

          <div className="flex gap-2 text-gray-300">
            <MapPinIcon className="w-5 h-5 text-primary fill-primary" />
            {destination?.description}
          </div>

          {/* <p>
            {destination?.category
              ? destination?.category.map((g) => g.name).join(", ")
              : "—"}{" "}
            •{" "}
            {!destination?.category
              ? destination?.release_date.split("-")[0]
              : "Explore"}
          </p> */}
          <p>
            {categoryList.length > 0 ? categoryList.join(", ") : "—"} •{" "}
            {destination?.release_date
              ? destination.release_date.split("-")[0]
              : destination?.dateAndTime || "Explore"}
          </p>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary" />
            {(destination?.vote_average ?? 0).toFixed(1)} Google Rating
          </div>


          <div className="flex items-center gap-2 text-gray-300">
            <CalendarClockIcon className="w-5 h-5 text-primary" />
            {destination?.date_time}
          </div>


          <div className="flex items-center gap-2 text-gray-300">
            <HandCoinsIcon className="w-5 h-5 text-primary" />
            Price : ${destination?.price}
          </div>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
              onClick={() => openMap()}
            >
              <MapPinIcon className="w-5 h-5" /> Map View
            </button>

            <button
              onClick={() => {
                setCalendarPulse(true);
                calendarRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                requestAnimationFrame(() => {
                  setTimeout(() => setCalendarPulse(false), 1200);
                });
              }}
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </button>

            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.find((destination) => destination._id === id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Casts */}
      {/* {destination.casts && destination.casts.length > 0 && (
        <>
          <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
          <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
            <div className='flex items-center gap-4 w-max px-4'>
              {destination.casts.slice(0, 12).map((cast, index) => {
                const castImg = cast.profile_path?.startsWith('http')
                  ? cast.profile_path
                  : image_base_url + cast.profile_path
                return (
                  <div
                    key={index}
                    className='flex flex-col items-center text-center'
                  >
                    <img
                      src={castImg}
                      alt={cast.name}
                      className='rounded-full h-20 md:h-20 aspect-square object-cover'
                    />
                    <p className='font-medium text-xs mt-3'>{cast.name}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )} */}

      <section
        className={`mt-16 transition duration-500 ${
          calendarPulse ? "ring-4 ring-primary/50 rounded-[28px]" : ""
        }`}
        ref={calendarRef}
        id="dateSelect"
      >
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-2xl font-semibold">Choose your visit date</h2>
          <p className="text-sm text-gray-300">
            Tap a highlighted date to enable the booking form. Once selected,
            continue below to pick a time and confirm tickets.
          </p>
          {availabilityStatus === "fallback" && (
            <p className="text-xs text-amber-300">
              Showing demo availability while we reconnect to the live schedule.
            </p>
          )}
          {availabilityStatus === "empty" && (
            <p className="text-xs text-slate-300/80">
              No official slots yet—choose any date and we&apos;ll follow up.
            </p>
          )}
          {selectedDate && (
            <p className="text-xs uppercase tracking-wide text-primary">
              Selected:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                dateStyle: "full",
              })}
            </p>
          )}
        </div>
        <Calendar
          initialDate={initialCalendarDate}
          value={selectedDate}
          marks={availableDates}
          onSelect={(date) => setSelectedDate(date)}
        />
      </section>

      <BookingForm
        destination={destination}
        availability={availability || {}}
        selectedDate={selectedDate}
        onResetSelectedDate={() => setSelectedDate(null)}
      />

      {/* Suggestions */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {suggestedDestinations.map((location, index) => (
          <DestinationCard
            key={location._id || location.id || index}
            destination={location}
          />
        ))}
      </div>

      {destinations.length > 4 && (
        <div className="flex justify-center mt-20">
          <button
            onClick={() => {
              navigate("/destinations");
              scrollTo(0, 0);
            }}
            className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;
