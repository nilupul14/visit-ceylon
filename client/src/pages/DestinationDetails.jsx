import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { dummyDateTimeData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, MapPinIcon, StarIcon } from "lucide-react";
import DateSelect from "../components/DateSelect";
import DestinationCard from "../components/DestinationCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const DestinationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const API = "/api/bookings"; // same origin proxy

async function seed() {
  const items = [
  {
    bookingId: "seed_booking_1",
    user: "seed_user_alex",
    destination: "seed_destination_sigiriya",
    visitDate: "2025-06-30",
    visitTime: "08:30",
    amount: 2,
    userName: "Alex Popkov",
    destinationTitle: "Sigiriya Rock Fortress"
  },
  {
    bookingId: "seed_booking_2",
    user: "seed_user_julia",
    destination: "seed_destination_ella",
    visitDate: "2025-07-02",
    visitTime: "06:00",
    amount: 3,
    userName: "Julia Rogers",
    destinationTitle: "Ella"
  },
  {
    bookingId: "seed_booking_3",
    user: "seed_user_kamal",
    destination: "seed_destination_galle_fort",
    visitDate: "2025-08-12",
    visitTime: "10:00",
    amount: 1,
    userName: "Kamal Perera",
    destinationTitle: "Galle Fort"
  },
  {
    bookingId: "seed_booking_4",
    user: "seed_user_sarah",
    destination: "seed_destination_kandy_temple",
    visitDate: "2025-09-05",
    visitTime: "14:30",
    amount: 4,
    userName: "Sarah Johnson",
    destinationTitle: "Temple of the Sacred Tooth Relic"
  },
  {
    bookingId: "seed_booking_5",
    user: "seed_user_nimal",
    destination: "seed_destination_lotus_tower",
    visitDate: "2025-11-10",
    visitTime: "19:00",
    amount: 2,
    userName: "Nimal Silva",
    destinationTitle: "Colombo Lotus Tower"
  }
];
  for (const b of items) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(b),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Failed:", b.bookingId, err);
    }
  }
}
seed();


  const {
    // shows,
    destinations,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies = [],
    image_base_url
  } = useAppContext();

  // pick 4 movies for "You may also like"
  const suggestedMovies =
    // shows && shows.length > 0 ? shows.slice(0, 4) : dummyShowsData.slice(0, 4)
    destinations && destinations.length > 0 && destinations.slice(0, 4);

  const getShow = async () => {
    // 1) try real API
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data?.success && data?.destination) {
        setShow(data); // server shape: { success, destination, dateTime }
        return;
      }
    } catch (error) {
      // ignore; we'll fall back below
      console.log("API error, using dummy data...", error);
    }

    // 2) fallback to dummy
    const numericId = Number(id);
    const fallbackMovie =
      destinations.find(
        (location) => location._id === id || location.id === numericId
      ) || destinations[0];

    setShow({
      destination: fallbackMovie,
      // you already import dummyDateTimeData
      dateTime: dummyDateTimeData
    });
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
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

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  const { destination, dateTime } = show;

  // poster can be absolute (dummy) or relative (API)
  const posterSrc = destination.poster_path?.startsWith("http")
    ? destination.poster_path
    : image_base_url + destination.poster_path;

  const openMap = () => {
    const query = encodeURIComponent(destination.title + " Sri Lanka");
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={posterSrc}
          alt={destination.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">{"🇱🇰 - VC".toUpperCase()}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {destination.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {(destination.vote_average ?? 0).toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {destination.description}
          </p>

          <p>
            {destination.category
              ? destination.category.map((g) => g.name).join(", ")
              : "—"}{" "}
            •{" "}
            {destination.release_date
              ? destination.release_date.split("-")[0]
              : "Upcoming"}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95" onClick={() => openMap()}>
              <MapPinIcon className="w-5 h-5" /> Map View
            </button>

            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>

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

      {/* Date / time selection */}
      <DateSelect dateTime={dateTime || dummyDateTimeData} id={id} />

      {/* Suggestions */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {suggestedMovies.map((location, index) => (
          <DestinationCard
            key={location._id || location.id || index}
            destination={location}
          />
        ))}
      </div>

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
    </div>
  );
};

export default DestinationDetails;
