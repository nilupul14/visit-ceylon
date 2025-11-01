import React from "react";
// import { useAppContext } from "../context/AppContext";

const AboutUs = () => {
  //   const { shows } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">About Us</h1>
      <div>
        <p className="text-lg text-center mt-4 max-w-xl">
          VisitCeylon is an innovative online platform designed to transform the
          way travelers explore and experience Sri Lanka’s world-renowned
          heritage sites. Inspired by the island’s rich cultural legacy and
          vibrant history, VisitCeylon serves as a centralized digital gateway
          for tourists — both local and international — to discover, book, and
          manage their visits with ease.
        </p>
        <p className="text-lg text-center mt-4 max-w-xl">
          In today’s fast-moving world, travelers seek convenience,
          transparency, and authenticity. Traditional ticketing methods at Sri
          Lanka’s heritage sites often lead to long queues, limited payment
          options, and inconsistent pricing structures. VisitCeylon was created
          to bridge this gap by introducing a modern, user-friendly, and
          eco-conscious system that automates the ticketing process while
          celebrating the cultural essence of the island.
        </p>
        <p className="text-lg text-center mt-4 max-w-xl">
          Beyond convenience, VisitCeylon empowers heritage site administrators
          with real-time visitor analytics, sales tracking, and data-driven
          insights, helping improve resource management and tourism planning.
        </p>
        <p className="text-lg text-center mt-4 max-w-xl">
          Our mission is simple yet powerful — to preserve Sri Lanka’s cultural
          treasures through technology that enhances accessibility,
          sustainability, and visitor satisfaction. VisitCeylon is more than
          just a ticketing system — it’s your gateway to Sri Lanka’s wonders,
          where every visit tells a story.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
