import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapIcon } from "lucide-react";
import { assets } from "../assets/assets";

const Cover = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-screen bg-cover bg-center bg-[url('/backgroundImage.png')]">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10">
        <img src={assets.sriFlag} alt="" className="max-h-11 lg:h-11 mt-20" />

        <h1 className="text-5xl md:text-[70px] md:leading-[1.2] font-semibold max-w-110">
          Discover the beauty of
          <br />
          Sri Lanka
        </h1>

        <p className="max-w-md text-gray-300 mt-2">
          <MapIcon className="w-4.5 h-4.5 inline-block" /> A cinematic journey
          across the breathtaking island of Sri Lanka — where golden beaches
          meet mist-covered mountains, ancient temples whisper history, and
          vibrant culture comes alive in every moment. From wild safaris and
          lush rain forests to tranquil tea fields and coastal sunsets, this
          visual story captures the heart, soul, and spirit of true island
          paradise.
        </p>

        <button
          onClick={() => navigate("/destinations")}
          className="mt-4 flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Explore Ceylon
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Cover;
