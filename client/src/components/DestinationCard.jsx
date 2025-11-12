import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const categoryList = Array.isArray(destination.category)
    ? destination.category
        .map((item) => (typeof item === "string" ? item : item?.name))
        .filter(Boolean)
    : [];

  const posterSrc = destination.poster_path?.startsWith("http")
    ? destination.poster_path
    : image_base_url + destination.poster_path;

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/destinations/${destination._id}`);
          scrollTo(0, 0);
        }}
        src={posterSrc}
        alt=""
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{destination.title}</p>

      {categoryList.length > 0 && (
        <p className="text-sm text-gray-400 mt-2">
          • {categoryList.slice(0, 2).join(" | ")}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/destinations/${destination._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {Number(destination.vote_average ?? 0).toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
