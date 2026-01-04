import React from "react";
import DestinationCard from "../components/DestinationCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { dummyShowsData } from "../assets/assets";

const Destinations = () => {
  const { shows, destinations } = useAppContext();

  console.log("Destinations page - destinations from context:", destinations);

  const availableDestinations =
    (destinations && destinations.length > 0 && destinations) ||
    (shows && shows.length > 0 && shows) ||
    dummyShowsData ||
    [];

  if (!availableDestinations || availableDestinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          No destinations available
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#060b0f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_55%),radial-gradient(circle_at_20%_30%,_rgba(16,185,129,0.12),_transparent_45%),radial-gradient(circle_at_90%_25%,_rgba(15,118,110,0.18),_transparent_45%)]" />
      <BlurCircle top="140px" left="0px" />
      <BlurCircle bottom="40px" right="40px" />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-28 md:px-12 lg:px-16">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
          Visit Ceylon
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
          Destinations
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
          Explore curated heritage sites, coastal escapes, and cultural
          experiences crafted for unforgettable journeys.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {availableDestinations.map((destination) => (
            <DestinationCard
              key={destination._id || destination.id}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
