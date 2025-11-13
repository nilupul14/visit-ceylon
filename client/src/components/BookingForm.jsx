import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import BlurCircle from "./BlurCircle";

const VISIT_TIME_OPTIONS = [
  { label: "Morning", value: "08:00" },
  { label: "Evening", value: "17:00" },
  { label: "Full Day", value: "09:00" },
];

const formatDateInput = (date) => date.toISOString().slice(0, 10);

const generateBookingId = () => {
  if (typeof crypto?.randomUUID === "function") {
    return `bk_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  }
  return `bk_${Date.now()}`;
};

const BookingForm = ({
  destination,
  availability = {},
  selectedDate,
  onResetSelectedDate,
}) => {
  const { axios, getToken, user, fetchBookings } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [bookingId, setBookingId] = useState(generateBookingId);
  const [selectedSlotValue, setSelectedSlotValue] = useState("");
  const [amount, setAmount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const availableDates = useMemo(() => Object.keys(availability || {}).sort(), [availability]);
  const hasAvailability = availableDates.length > 0;
  const slotOptions = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = formatDateInput(selectedDate);
    const entries = Array.isArray(availability?.[dateKey]) ? availability[dateKey] : [];

    const normalizedSlots = entries
      .map((entry, index) => {
        const rawTime = entry?.time || entry?.visitDateTime || entry;
        if (!rawTime) return null;
        const dateValue = new Date(rawTime);
        if (Number.isNaN(dateValue.getTime())) return null;
        const hhmm = dateValue.toISOString().slice(11, 16);
        return {
          key: String(entry?.visitId || entry?._id || entry?.showId || `${hhmm}-${index}`),
          value: hhmm,
          label: dateValue.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          visitId: entry?.visitId || entry?._id || entry?.showId || null,
          isFallback: false,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.value.localeCompare(b.value));

    if (normalizedSlots.length) {
      return normalizedSlots;
    }

    return VISIT_TIME_OPTIONS.map((option, index) => ({
      key: `fallback-${option.value}-${index}`,
      value: option.value,
      label: `${option.label} (${option.value})`,
      isFallback: true,
      visitId: null,
    }));
  }, [availability, selectedDate]);

  const selectedSlot = useMemo(
    () => slotOptions.find((option) => option.value === selectedSlotValue) || null,
    [slotOptions, selectedSlotValue]
  );

  useEffect(() => {
    if (!selectedDate) {
      setSelectedSlotValue("");
      return;
    }
    setSelectedSlotValue((prev) => {
      if (prev && slotOptions.some((option) => option.value === prev)) {
        return prev;
      }
      return slotOptions[0]?.value || "";
    });
  }, [selectedDate, slotOptions]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("You must be signed in to create a booking.");
      return;
    }

    if (!destination?._id) {
      toast.error("Destination data is missing.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please choose a visit date from the calendar.");
      return;
    }

    if (!selectedSlotValue || !selectedSlot) {
      toast.error("Please choose a valid visit time.");
      return;
    }

    const payload = {
      bookingId,
      destination: destination._id,
      visitDate: formatDateInput(selectedDate),
      visitTime: selectedSlot.value,
      visitId: selectedSlot.visitId,
      amount: Number(amount),
      userName: user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      destinationTitle: destination.title,
    };

    if (!payload.amount || Number.isNaN(payload.amount) || payload.amount <= 0) {
      toast.error("Enter a valid ticket quantity.");
      return;
    }

    try {
      setSubmitting(true);
      const headers = {};
      if (getToken) {
        const token = await getToken().catch(() => null);
        if (token) headers.Authorization = `Bearer ${token}`;
      }

      const { data } = await axios.post("/api/bookings", payload, { headers });

      if (data?.success) {
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
        toast.success("Booking created successfully.");
        setBookingId(generateBookingId());
        setAmount(1);
        onResetSelectedDate?.();
        fetchBookings?.();
      } else {
        toast.error(data?.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayDate = selectedDate ? formatDateInput(selectedDate) : "";
  const isFormEnabled = Boolean(selectedDate);
  const pricePerTicket = Number(destination?.price) || 0;
  const totalEstimate = pricePerTicket * (Number(amount) || 0);

  return (
    <section className="relative mt-16 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-6 text-slate-100 shadow-xl backdrop-blur">
      <BlurCircle top="-140px" left="-120px" />
      <BlurCircle top="160px" right="-140px" />
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Plan Your Visit</h2>
          <p className="text-sm text-slate-200/80">
            Secure your tickets for{" "}
            <span className="font-medium text-primary">{destination?.title}</span>.
          </p>
          {!hasAvailability && (
            <p className="mt-1 text-xs uppercase tracking-wide text-rose-200">
              No scheduled visits yet. You can still reserve a date.
            </p>
          )}
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Booking ID: {bookingId}
        </span>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-200">Traveler</label>
              <input
                value={user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Guest"}
                disabled
                className="mt-1 rounded-lg border border-primary/25 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-200">Destination</label>
              <input
                value={destination?.title || "—"}
                disabled
                className="mt-1 rounded-lg border border-primary/25 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-200">Visit Date</label>
              <input
                value={displayDate}
                readOnly
                placeholder="Select a date from the calendar"
                onFocus={(event) => event.target.blur()}
                className="mt-1 rounded-lg border border-primary/25 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-200">Visit Time</label>
              <select
                value={selectedSlotValue}
                onChange={(event) => setSelectedSlotValue(event.target.value)}
                disabled={!isFormEnabled || slotOptions.length === 0}
                className="mt-1 rounded-lg border border-primary/25 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              >
                {!isFormEnabled && <option value="">Pick a date first</option>}
                {isFormEnabled && slotOptions.length === 0 && (
                  <option value="">No slots for this date</option>
                )}
                {isFormEnabled &&
                  slotOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              {isFormEnabled && selectedSlot?.isFallback && (
                <p className="mt-1 text-xs text-amber-200">
                  This is a custom request—we&apos;ll confirm the exact time after you submit.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:max-w-xs">
            <label className="text-sm font-medium text-slate-200">Tickets</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) => {
                const next = Number(event.target.value);
                setAmount(Number.isNaN(next) ? 1 : Math.max(1, next));
              }}
              disabled={!isFormEnabled}
              className="mt-1 rounded-lg border border-primary/25 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-end gap-2">
          {pricePerTicket > 0 && (
            <p className="text-sm text-slate-300">
              Estimated total:{" "}
              <span className="font-semibold text-white">
                {currency} {totalEstimate.toLocaleString()}
              </span>
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !isFormEnabled || !selectedSlotValue}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow shadow-primary/40 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BookingForm;
