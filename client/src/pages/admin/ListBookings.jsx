import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dummyBookingData } from "../../assets/assets";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  // const { axios, getToken, user } = useAppContext();
  const { axios, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("User in ListBookings:", bookings);

  const getAllBookings = async () => {
    try {
      // const { data } = await axios.get("/api/admin/all-bookings", {
      //   headers: { Authorization: `Bearer ${await getToken()}` }
      // });
      const { data } = await axios.get("/api/bookings");
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message);
        setBookings(dummyBookingData);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse  rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Traveler Name</th>
              <th className="p-2 font-medium">Destination</th>
              <th className="p-2 font-medium">Date</th>
              <th className="p-2 font-medium">Time</th>
              <th className="p-2 font-medium">Tickets</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item.userName}</td>
                <td className="p-2">{item.destinationTitle}</td>
                <td className="p-2">{dateFormat(item.visitDate)}</td>
                <td className="p-2">{item.visitTime}</td>
                {/* <td className="p-2">
                  {Object.keys(item.bookedSeats)
                    .map((seat) => item.bookedSeats[seat])
                    .join(", ")}
                </td> */}
                <td className="p-2">{item.amount}</td>{" "}
                {/* this is for number of tickets */}
                <td className="p-2">
                  {currency} {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
