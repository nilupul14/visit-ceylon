import React, { useEffect, useState } from "react";
// import { dummyBookingData } from '../assets/assets'
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url, bookingsApi, destinations } =
    useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data?.success) {
        if (Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings(data.bookings);
        } else {
          setBookings(bookingsApi);
        }
      } else {
        setBookings(bookingsApi);
      }
    } catch (error) {
      console.log("booking fetch error:", error);
      setBookings(bookingsApi);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if user logged in, try real API
    if (user) {
      getMyBookings();
    } else {
      setBookings(bookingsApi);
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) return <Loading />;

  const getImageUrl = (destinations, id) => {
    const item = destinations.find((d) => String(d._id) === String(id));
    return item ? item.poster_path : null;
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>

      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">You don't have any bookings yet.</p>
      ) : (
        bookings.map((item, index) => {
          const posterPath = getImageUrl(destinations, item?.destination);
          const posterSrc =
            posterPath && posterPath.startsWith("http")
              ? posterPath
              : image_base_url + posterPath;

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={posterSrc}
                  alt={item?.destinationTitle || "Booking"}
                  className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
                />
                <div className="flex flex-col p-4">
                  <p className="text-lg font-semibold">
                    {item?.destinationTitle || "Sri Lanka Destination"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {item?.visitTime
                      ? item.visitTime
                      : "Duration not available"}
                  </p>
                  <p className="text-gray-400 text-sm mt-auto">
                    {item?.visitDate
                      ? dateFormat(item.visitDate)
                      : "Date not set"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold mb-3">
                    {currency}
                    {destinations?.find((p) => p._id === item?.destination)
                      ?.price * item?.amount || "0"}
                  </p>
                  {!item?.isPaid && item?.paymentLink && (
                    <Link
                      to={item.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
                <div className="text-sm">
                  <p>
                    <span className="text-gray-400">Total Tickets:</span>{" "}
                    {item?.amount}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;
