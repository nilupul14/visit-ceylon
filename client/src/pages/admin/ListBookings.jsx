import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dummyBookingData } from "../../assets/assets";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const {
    axios,
    user,
    adminBookings,
    fetchAdminBookings,
    isAdmin,
    bookingsApi
  } =
    useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [sortKey, setSortKey] = useState("created_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const rowsPerPage = 10;

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings", {
        params: { limit: 1000 },
      });
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
      if (isAdmin) {
        fetchAdminBookings?.().finally(() => setIsLoading(false));
      } else {
        getAllBookings();
      }
    }
  }, [user, isAdmin, fetchAdminBookings]);

  const bookingRows =
    isAdmin && adminBookings.length > 0
      ? adminBookings
      : bookingsApi.length > 0
        ? bookingsApi
        : bookings;

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookingRows;

    return bookingRows.filter((booking) => {
      const getValue = (field) => {
        switch (field) {
          case "traveler":
            return booking.userName || "";
          case "destination":
            return booking.destinationTitle || "";
          case "time":
            return booking.visitTime || "";
          case "bookingId":
            return booking.bookingId || "";
          case "date":
            return booking.visitDate ? dateFormat(booking.visitDate) : "";
          default:
            return [
              booking.userName,
              booking.destinationTitle,
              booking.visitTime,
              booking.bookingId,
              booking.visitDate ? dateFormat(booking.visitDate) : "",
            ]
              .filter(Boolean)
              .join(" ");
        }
      };

      const values = getValue(searchField).toLowerCase();

      return values.includes(query);
    });
  }, [bookingRows, searchQuery, searchField]);

  const sortedBookings = useMemo(() => {
    const normalizeDate = (value) => {
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const dateFromObjectId = (id) => {
      if (!id || typeof id !== "string" || id.length < 8) return null;
      const timestamp = Number.parseInt(id.slice(0, 8), 16);
      return Number.isNaN(timestamp) ? null : new Date(timestamp * 1000);
    };

    const items = [...filteredBookings];
    items.sort((a, b) => {
      if (sortKey === "visit_asc" || sortKey === "visit_desc") {
        const aDate = normalizeDate(a.visitDate);
        const bDate = normalizeDate(b.visitDate);
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return sortKey === "visit_asc"
          ? aDate - bDate
          : bDate - aDate;
      }

      if (sortKey === "tickets_desc") {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }

      const aCreated =
        normalizeDate(a.createdAt) ||
        normalizeDate(a.updatedAt) ||
        dateFromObjectId(a._id);
      const bCreated =
        normalizeDate(b.createdAt) ||
        normalizeDate(b.updatedAt) ||
        dateFromObjectId(b._id);

      if (!aCreated && !bCreated) return 0;
      if (!aCreated) return 1;
      if (!bCreated) return -1;
      return bCreated - aCreated;
    });

    return items;
  }, [filteredBookings, sortKey]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBookings.length / rowsPerPage)
  );

  const currentPageSafe = Math.min(currentPage, totalPages);

  const pagedBookings = useMemo(() => {
    const start = (currentPageSafe - 1) * rowsPerPage;
    return sortedBookings.slice(start, start + rowsPerPage);
  }, [sortedBookings, currentPageSafe]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const reportRows = sortedBookings;

  const reportSummary = useMemo(() => {
    const totalTickets = reportRows.reduce(
      (sum, booking) => sum + (Number(booking.amount) || 0),
      0
    );
    const totalRevenue = reportRows.reduce(
      (sum, booking) => sum + (Number(booking.amount) || 0),
      0
    );
    const uniqueTravelers = new Set(
      reportRows.map((booking) => booking.user || booking.userName).filter(Boolean)
    );

    return {
      totalTickets,
      totalRevenue,
      totalBookings: reportRows.length,
      uniqueTravelers: uniqueTravelers.size,
    };
  }, [reportRows]);

  const exportReportCsv = () => {
    if (!reportRows.length) return;
    const headers = [
      "Traveler Name",
      "Destination",
      "Visit Date",
      "Time",
      "Tickets",
      "Amount",
      "Booking ID",
      "Payment Status",
    ];
    const rows = reportRows.map((booking) => [
      booking.userName || "",
      booking.destinationTitle || "",
      booking.visitDate ? dateFormat(booking.visitDate) : "",
      booking.visitTime || "",
      booking.amount || 0,
      booking.amount || 0,
      booking.bookingId || "",
      booking.isPaid ? "Paid" : "Pending",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ticket-details-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!reportRows.length) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHtml = reportRows
      .map(
        (booking) => `
        <tr>
          <td>${booking.userName || ""}</td>
          <td>${booking.destinationTitle || ""}</td>
          <td>${booking.visitDate ? dateFormat(booking.visitDate) : ""}</td>
          <td>${booking.visitTime || ""}</td>
          <td>${booking.amount || 0}</td>
          <td>${currency} ${booking.amount || 0}</td>
          <td>${booking.bookingId || ""}</td>
          <td>${booking.isPaid ? "Paid" : "Pending"}</td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Details Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            p { margin: 0 0 16px; color: #475569; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>Ticket Details Report</h1>
          <p>Total bookings: ${reportSummary.totalBookings} • Tickets: ${reportSummary.totalTickets} • Revenue: ${currency} ${reportSummary.totalRevenue}</p>
          <table>
            <thead>
              <tr>
                <th>Traveler Name</th>
                <th>Destination</th>
                <th>Visit Date</th>
                <th>Time</th>
                <th>Tickets</th>
                <th>Amount</th>
                <th>Booking ID</th>
                <th>Payment Status</th>
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

  const analytics = useMemo(() => {
    const safeDate = (value) => {
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const toUtcDay = (date) =>
      new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const addDaysUtc = (date, days) => {
      const next = new Date(date);
      next.setUTCDate(next.getUTCDate() + days);
      return next;
    };

    const dateKey = (date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const isSameUtcDay = (a, b) =>
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate();

    const dateFromObjectId = (id) => {
      if (!id || typeof id !== "string" || id.length < 8) return null;
      const timestamp = Number.parseInt(id.slice(0, 8), 16);
      return Number.isNaN(timestamp) ? null : new Date(timestamp * 1000);
    };

    const today = toUtcDay(new Date());
    const tomorrow = addDaysUtc(today, 1);
    const weekStart = addDaysUtc(today, -6);
    const monthStart = addDaysUtc(today, -29);
    const upcomingWeekEnd = addDaysUtc(today, 7);

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = addDaysUtc(today, -6 + index);
      return {
        key: dateKey(date),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        tickets: 0,
      };
    });

    const last7DaysMap = new Map(last7Days.map((day) => [day.key, day]));

    let weeklyTickets = 0;
    let monthlyTickets = 0;
    let tomorrowTickets = 0;
    let expiredTickets = 0;
    let upcomingWeekTickets = 0;
    let pendingTickets = 0;
    let totalTickets = 0;

    const destinationTotals = new Map();

    bookingRows.forEach((booking) => {
      const ticketCount = Number(booking.amount) || 0;
      totalTickets += ticketCount;

      const createdAt =
        safeDate(booking.createdAt) ||
        safeDate(booking.updatedAt) ||
        dateFromObjectId(booking._id) ||
        safeDate(booking.visitDate);

      const visitDate = safeDate(booking.visitDate);
      const visitDay = visitDate ? toUtcDay(visitDate) : null;
      const createdDay = createdAt ? toUtcDay(createdAt) : null;

      if (createdDay && createdDay >= weekStart) {
        weeklyTickets += ticketCount;
        const key = dateKey(createdDay);
        const bucket = last7DaysMap.get(key);
        if (bucket) bucket.tickets += ticketCount;
      }

      if (createdDay && createdDay >= monthStart) {
        monthlyTickets += ticketCount;
        const destinationName =
          booking.destinationTitle ||
          booking.destinationName ||
          booking.destination ||
          "Unknown";
        destinationTotals.set(
          destinationName,
          (destinationTotals.get(destinationName) || 0) + ticketCount
        );
      }

      if (visitDay) {
        if (isSameUtcDay(visitDay, tomorrow)) {
          tomorrowTickets += ticketCount;
        }
        if (visitDay < today) {
          expiredTickets += ticketCount;
        }
        if (visitDay >= today && visitDay < upcomingWeekEnd) {
          upcomingWeekTickets += ticketCount;
        }
      }

      if (booking.isPaid === false) {
        pendingTickets += ticketCount;
      }
    });

    let topDestination = "—";
    let topDestinationTickets = 0;
    destinationTotals.forEach((count, name) => {
      if (count > topDestinationTickets) {
        topDestinationTickets = count;
        topDestination = name;
      }
    });

    const maxDailyTickets =
      Math.max(...last7Days.map((day) => day.tickets), 1) || 1;

    return {
      weeklyTickets,
      monthlyTickets,
      tomorrowTickets,
      expiredTickets,
      upcomingWeekTickets,
      pendingTickets,
      totalTickets,
      topDestination,
      topDestinationTickets,
      last7Days,
      maxDailyTickets,
    };
  }, [bookingRows]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="mt-6 grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Tickets Sold (7 Days)</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.weeklyTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">Based on booking date</p>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Tickets Sold (30 Days)</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.monthlyTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">Rolling 30-day window</p>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Tickets For Tomorrow</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.tomorrowTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">
            Visit date is tomorrow
          </p>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Expired Tickets</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.expiredTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">Visit date has passed</p>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Upcoming 7 Days</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.upcomingWeekTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">
            Tickets scheduled this week
          </p>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Pending Payment</p>
          <p className="mt-2 text-2xl font-semibold">
            {analytics.pendingTickets.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/50">
            Bookings not marked as paid
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full flex-col rounded-md border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">Sales Pulse (Last 7 Days)</p>
              <p className="mt-2 text-lg font-medium">
                {analytics.totalTickets.toLocaleString()} total tickets
              </p>
            </div>
            <div className="text-sm text-white/70">
              Top destination (30d):{" "}
              <span className="text-white">
                {analytics.topDestination}{" "}
                {analytics.topDestinationTickets > 0
                  ? `(${analytics.topDestinationTickets})`
                  : ""}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-end gap-3">
            {analytics.last7Days.map((day) => (
              <div key={day.key} className="flex flex-col items-center gap-2">
                <div className="h-24 w-6 rounded-full bg-primary/10 flex items-end overflow-hidden">
                  <div
                    className="w-full rounded-full bg-primary/60"
                    style={{
                      height: `${
                        (day.tickets / analytics.maxDailyTickets) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-white/60">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-full flex-col rounded-md border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm text-white/70">Ticket Details Report</p>
          <p className="mt-2 text-lg font-medium">
            {reportSummary.totalBookings.toLocaleString()} bookings
          </p>
          <div className="mt-3 grid gap-2 text-xs text-white/60">
            <span>
              Tickets: {reportSummary.totalTickets.toLocaleString()}
            </span>
            <span>
              Revenue: {currency}{" "}
              {reportSummary.totalRevenue.toLocaleString()}
            </span>
            <span>
              Unique travelers: {reportSummary.uniqueTravelers.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Generate Report
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportReportCsv}
                className="flex-1 rounded-full border border-primary/30 px-3 py-1.5 text-xs text-white/80 hover:border-primary/60 hover:text-white transition-colors"
              >
                Export CSV (Excel)
              </button>
              <button
                type="button"
                onClick={printReport}
                className="flex-1 rounded-full border border-primary/30 px-3 py-1.5 text-xs text-white/80 hover:border-primary/60 hover:text-white transition-colors"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-20 -mx-4 mt-6 bg-gray-900/90 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-white/70">Search bookings</p>
          <p className="text-xs text-white/50">
            Search by traveler, destination, time, or booking ID.
          </p>
        </div>
        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={searchField}
              onChange={(event) => setSearchField(event.target.value)}
              className="rounded-full border border-primary/30 bg-gray-900/80 px-4 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option className="bg-gray-900 text-white" value="all">
                All fields
              </option>
              <option className="bg-gray-900 text-white" value="traveler">
                Traveler
              </option>
              <option className="bg-gray-900 text-white" value="destination">
                Destination
              </option>
              <option className="bg-gray-900 text-white" value="date">
                Visit date
              </option>
              <option className="bg-gray-900 text-white" value="time">
                Visit time
              </option>
              <option className="bg-gray-900 text-white" value="bookingId">
                Booking ID
              </option>
            </select>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              className="rounded-full border border-primary/30 bg-gray-900/80 px-4 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option className="bg-gray-900 text-white" value="created_desc">
                Newest bookings
              </option>
              <option className="bg-gray-900 text-white" value="visit_asc">
                Visit date (earliest)
              </option>
              <option className="bg-gray-900 text-white" value="visit_desc">
                Visit date (latest)
              </option>
              <option className="bg-gray-900 text-white" value="tickets_desc">
                Tickets (high to low)
              </option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search bookings..."
              className="w-full rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40 sm:flex-1"
            />
          </div>
        </div>
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
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
            {pagedBookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item.userName}</td>
                <td className="p-2">{item.destinationTitle}</td>
                <td className="p-2">{dateFormat(item.visitDate)}</td>
                <td className="p-2">{item.visitTime}</td>
                <td className="p-2">{item.amount}</td>{" "}
                <td className="p-2">
                  {currency} {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
          Showing {(currentPageSafe - 1) * rowsPerPage + 1}-
          {Math.min(currentPageSafe * rowsPerPage, sortedBookings.length)} of{" "}
          {sortedBookings.length} bookings
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="rounded-full border border-primary/30 px-4 py-1.5 text-sm text-white/80 hover:border-primary/60 hover:text-white transition-colors disabled:opacity-40"
            disabled={currentPageSafe === 1}
          >
            Prev
          </button>
          <span className="text-sm text-white/70">
            Page {currentPageSafe} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            className="rounded-full border border-primary/30 px-4 py-1.5 text-sm text-white/80 hover:border-primary/60 hover:text-white transition-colors disabled:opacity-40"
            disabled={currentPageSafe === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-5xl rounded-xl border border-primary/20 bg-gray-950 p-6 text-white shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Ticket Details Report</h2>
                <p className="mt-1 text-sm text-white/60">
                  {reportSummary.totalBookings.toLocaleString()} bookings •{" "}
                  {reportSummary.totalTickets.toLocaleString()} tickets •{" "}
                  {currency} {reportSummary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportReportCsv}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm text-white/80 hover:border-primary/60 hover:text-white transition-colors"
                >
                  Export CSV (Excel)
                </button>
                <button
                  type="button"
                  onClick={printReport}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm text-white/80 hover:border-primary/60 hover:text-white transition-colors"
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="mt-6 max-h-[60vh] overflow-auto rounded-lg border border-primary/20">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-primary/20 text-left text-white">
                  <tr>
                    <th className="p-3">Traveler</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Visit Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Tickets</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {reportRows.map((booking, index) => (
                    <tr
                      key={booking._id || booking.bookingId || index}
                      className="border-b border-primary/10 even:bg-primary/5"
                    >
                      <td className="p-3">{booking.userName}</td>
                      <td className="p-3">{booking.destinationTitle}</td>
                      <td className="p-3">
                        {booking.visitDate ? dateFormat(booking.visitDate) : "—"}
                      </td>
                      <td className="p-3">{booking.visitTime || "—"}</td>
                      <td className="p-3">{booking.amount || 0}</td>
                      <td className="p-3">
                        {currency} {booking.amount || 0}
                      </td>
                      <td className="p-3">
                        {booking.bookingId || booking._id || "—"}
                      </td>
                      <td className="p-3">
                        {booking.isPaid ? "Paid" : "Pending"}
                      </td>
                    </tr>
                  ))}
                  {reportRows.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-white/50" colSpan={8}>
                        No bookings found for this report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
