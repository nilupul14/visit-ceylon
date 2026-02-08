import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
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
    adminBookings,
    fetchAdminBookings,
    isAdmin,
    fetchShows
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [confirmDestination, setConfirmDestination] = useState(null);
  const [deletingDestination, setDeletingDestination] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState("all");

  const getAllShows = useCallback(async () => {
    try {
      await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [axios, getToken]);

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user, getAllShows]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminBookings?.();
    }
  }, [isAdmin, fetchAdminBookings]);

  const bookings =
    isAdmin && adminBookings.length > 0 ? adminBookings : bookingsApi;

  const getBookingDestinationId = (booking) => {
    const source =
      booking.destination ||
      booking.destinationId ||
      booking.show?.movie?._id ||
      booking.show?.movie ||
      null;

    if (!source) return null;
    if (typeof source === "object") {
      return source?._id ? String(source._id) : null;
    }

    return String(source);
  };

  const filteredBookingsForReport = useMemo(() => {
    return bookings.filter((booking) => {
      const destinationId = getBookingDestinationId(booking);

      if (
        selectedDestinationId !== "all" &&
        destinationId !== selectedDestinationId
      ) {
        return false;
      }

      return true;
    });
  }, [bookings, selectedDestinationId]);

  const statsByDestination = useMemo(() => {
    const map = new Map();

    filteredBookingsForReport.forEach((booking) => {
      const destinationId = getBookingDestinationId(booking);

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
  }, [filteredBookingsForReport]);

  const filteredDestinations = useMemo(() => {
    if (selectedDestinationId === "all") return destinations;
    return destinations.filter(
      (destination) => String(destination?._id) === selectedDestinationId
    );
  }, [destinations, selectedDestinationId]);

  const totalBookings = filteredBookingsForReport.length;

  const totalRevenue = filteredBookingsForReport.reduce(
    (sum, booking) => sum + (Number(booking.amount) || 0),
    0
  );

  const printRevenueReport = () => {
    if (!filteredDestinations.length) {
      toast.error("No destinations available for the selected filters");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const escapeHtml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const rowsHtml = filteredDestinations
      .map((destination) => {
        const stats = statsByDestination.get(destination._id) || {
          totalBookings: 0,
          totalAmount: 0
        };

        return `
          <tr>
            <td>${escapeHtml(destination.title || "—")}</td>
            <td>${escapeHtml(`${currency} ${destination.price ?? 0}`)}</td>
            <td>${escapeHtml(stats.totalBookings)}</td>
            <td>${escapeHtml(`${currency} ${stats.totalAmount.toLocaleString()}`)}</td>
          </tr>
        `;
      })
      .join("");

    const selectedDestinationName =
      selectedDestinationId === "all"
        ? "All destinations"
        : filteredDestinations[0]?.title || "Selected destination";

    printWindow.document.write(`
      <html>
        <head>
          <title>Destination Revenue Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            p { margin: 0 0 14px; color: #475569; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>Destination Revenue Report</h1>
          <p>Filters: ${escapeHtml(selectedDestinationName)}</p>
          <p>Total bookings: ${escapeHtml(totalBookings)} • Total earnings: ${escapeHtml(`${currency} ${totalRevenue.toLocaleString()}`)}</p>
          <table>
            <thead>
              <tr>
                <th>Destination Name</th>
                <th>Price Rate</th>
                <th>Total Bookings</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Revenue For Sites Report</h2>
          <p className="text-sm text-white/60">Filters</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_auto]">
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Destination
            <select
              value={selectedDestinationId}
              onChange={(event) => setSelectedDestinationId(event.target.value)}
              className="rounded-md border border-primary/30 bg-gray-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option className="bg-gray-900 text-white" value="all">
                All destinations
              </option>
              {destinations.map((destination) => (
                <option
                  key={destination._id}
                  className="bg-gray-900 text-white"
                  value={destination._id}
                >
                  {destination.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={printRevenueReport}
            className="h-10 self-end rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Create PDF
          </button>
        </div>

        <div className="w-full mt-6 overflow-x-auto">
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
            {filteredDestinations.map((destination, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{destination.title}</td>
                <td className="p-2">
                  {currency} {destination.price}
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
            {filteredDestinations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-white/60">
                  No destinations found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
