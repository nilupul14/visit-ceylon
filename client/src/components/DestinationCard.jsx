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
    <div className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-gradient-to-b from-[#101a22] via-[#0f1820] to-[#0b1117] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
      <img
        onClick={() => {
          navigate(`/destinations/${destination._id}`);
          scrollTo(0, 0);
        }}
        src={posterSrc}
        alt=""
        className="h-52 w-full cursor-pointer rounded-xl object-cover object-right-bottom transition duration-300 group-hover:scale-[1.02]"
      />

      <p className="mt-3 truncate text-sm font-semibold text-white">
        {destination.title}
      </p>

      {categoryList.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          • {categoryList.slice(0, 2).join(" | ")}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between pb-2">
        <button
          onClick={() => {
            navigate(`/destinations/${destination._id}`);
            scrollTo(0, 0);
          }}
          className="rounded-full bg-primary/90 px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-dull"
        >
          Buy Tickets
        </button>

        <p className="mt-1 flex items-center gap-1 pr-1 text-xs text-slate-300">
          <StarIcon className="h-4 w-4 text-emerald-300 fill-emerald-300" />
          {Number(destination.vote_average ?? 0).toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
