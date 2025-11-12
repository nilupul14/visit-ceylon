import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListDestinations = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const {
    axios,
    getToken,
    user,
    destinations,
    bookingsApi,
    fetchShows
  } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDestination, setConfirmDestination] = useState(null);
  const [deletingDestination, setDeletingDestination] = useState(false);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  const statsByDestination = useMemo(() => {
    const map = new Map();

    bookingsApi.forEach((booking) => {
      const destinationId =
        booking.destination ||
        booking.destinationId ||
        booking.show?.movie?._id ||
        booking.show?.movie ||
        null;

      if (!destinationId) return;

      const current = map.get(destinationId) || {
        totalBookings: 0,
        totalAmount: 0
      };

      current.totalBookings += 1;
      current.totalAmount += Number(booking.amount) || 0;

      map.set(destinationId, current);
    });

    return map;
  }, [bookingsApi]);

  const nextVisitsByDestination = useMemo(() => {
    const map = new Map();

    destinations.forEach((destination) => {
      const destinationId = destination?._id;
      if (!destinationId) return;

      const visitDate = destination.createdAt
        ? new Date(destination.createdAt)
        : null;
      if (!visitDate || Number.isNaN(visitDate.getTime())) return;

      const existing = map.get(destinationId);
      if (!existing || visitDate < existing) {
        map.set(destinationId, visitDate);
      }
    });

    return map;
  }, [destinations]);

  const totalBookings = bookingsApi.length;

  const totalRevenue = bookingsApi.reduce(
    (sum, booking) => sum + (Number(booking.amount) || 0),
    0
  );

  const openDeleteModal = (destination) => {
    setConfirmDestination(destination);
  };

  const closeDeleteModal = () => {
    if (deletingDestination) return;
    setConfirmDestination(null);
  };

  const handleDeleteDestination = async () => {
    if (!confirmDestination?._id) return;
    try {
      setDeletingDestination(true);
      const token = await getToken();
      await axios.delete(`/api/destinations/${confirmDestination._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      toast.success("Destination deleted successfully");
      await fetchShows?.();
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete destination"
      );
    } finally {
      setDeletingDestination(false);
    }
  };

  return !loading ? (
    <>
      <Title text1="List" text2="Destinations" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-white shadow-md">
          <p className="text-sm text-white/70">Total Bookings</p>
          <p className="mt-1 text-2xl font-semibold">{totalBookings}</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-white shadow-md">
          <p className="text-sm text-white/70">Total Earnings</p>
          <p className="mt-1 text-2xl font-semibold">
            {currency} {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Destination Name</th>
              <th className="p-2 font-medium">Price Rate</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
              <th className="p-2 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {destinations.map((destination, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{destination.title}</td>
                <td className="p-2">
                  {nextVisitsByDestination.has(destination._id)
                    ? dateFormat(nextVisitsByDestination.get(destination._id))
                    : `${currency} ${destination.price}`}
                </td>
                <td className="p-2">
                  {statsByDestination.get(destination._id)?.totalBookings || 0}
                </td>
                <td className="p-2">
                  {currency}{" "}
                  {(
                    statsByDestination.get(destination._id)?.totalAmount || 0
                  ).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => openDeleteModal(destination)}
                    className="text-sm px-3 py-1 rounded-md border border-red-400 text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDestination && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 p-6 text-center">
            <h3 className="text-xl font-semibold">Delete Destination</h3>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                {confirmDestination.title}
              </span>
              ? This will remove all upcoming visits tied to this destination.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 rounded-md border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                disabled={deletingDestination}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDestination}
                disabled={deletingDestination}
                className="flex-1 rounded-md bg-red-500/80 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60"
              >
                {deletingDestination ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default ListDestinations;
