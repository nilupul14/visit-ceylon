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
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4">Destinations</h1>

      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {availableDestinations.map((destination) => (
          <DestinationCard
            key={destination._id || destination.id}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
};

export default Destinations;
