import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon
} from "lucide-react";
import React, { useMemo } from "react";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { bookingsApi = [], destinations = [], image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

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
        totalAmount: 0,
      };

      current.totalBookings += 1;
      current.totalAmount += Number(booking.amount) || 0;

      map.set(destinationId, current);
    });

    return map;
  }, [bookingsApi]);

  const totals = useMemo(() => {
    const totalBookings = bookingsApi.length;
    const totalRevenue = bookingsApi.reduce(
      (sum, booking) => sum + (Number(booking.amount) || 0),
      0
    );
    const travelerIds = new Set(
      bookingsApi
        .map((booking) => booking.user || booking.userId || booking.userName)
        .filter(Boolean)
    );

    return {
      totalBookings,
      totalRevenue,
      activeDestinations: destinations.length,
      totalUsers: travelerIds.size,
    };
  }, [bookingsApi, destinations]);

  const topDestinations = useMemo(() => {
    return destinations
      .map((destination) => {
        const stats = statsByDestination.get(destination._id) || {
          totalBookings: 0,
          totalAmount: 0,
        };

        return {
          destination,
          stats,
        };
      })
      .sort((a, b) => b.stats.totalBookings - a.stats.totalBookings)
      .slice(0, 6);
  }, [destinations, statsByDestination]);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: totals.totalBookings.toLocaleString(),
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency} ${totals.totalRevenue.toLocaleString()}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Destinations",
      value: totals.activeDestinations.toLocaleString(),
      icon: PlayCircleIcon,
    },
    {
      title: "Unique Travelers",
      value: totals.totalUsers.toLocaleString(),
      icon: UsersIcon,
    },
  ];

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Top Destinations</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />
        {topDestinations.length === 0 && (
          <p className="text-sm text-gray-400">
            No bookings yet — bookings will appear here once you start receiving reservations.
          </p>
        )}

        {topDestinations.map(({ destination, stats }, index) => {
          const posterSrc = destination.poster_path?.startsWith("http")
            ? destination.poster_path
            : image_base_url + destination.poster_path;

          return (
            <div
              key={destination._id || index}
              className="w-55 rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
            >
              <img
                src={posterSrc}
                alt={destination.title}
                className="h-60 w-full object-cover"
              />
              <p className="font-medium p-3 truncate">{destination.title}</p>
              <div className="flex items-center justify-between px-3 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {(destination.vote_average ?? 0).toFixed(1)}
                </span>
                <span>{stats.totalBookings.toLocaleString()} bookings</span>
              </div>
              <div className="px-3 pt-2 text-sm text-gray-400">
                Revenue: {currency} {stats.totalAmount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
