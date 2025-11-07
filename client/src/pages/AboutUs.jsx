import React from "react";
import BlurCircle from "../components/BlurCircle";

const AboutUs = () => {
  return (
    <section className="relative min-h-screen bg-[#030406] px-4 py-20 text-white flex items-center justify-center overflow-hidden z-[-3]">
      <BlurCircle top="-80px" left="-15%" />
      <BlurCircle bottom="-60px" right="-10%" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#01343640] to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[70%] max-w-4xl h-full bg-teal-400/10 blur-[180px]" />
      </div>
      <article className="relative w-full max-w-5xl rounded-[32px] border border-white/5 bg-gradient-to-r from-[#04161c] via-[#031116] to-[#05080c] shadow-[0_30px_55px_rgba(0,0,0,0.45)] p-6 sm:p-10 overflow-hidden">
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/logo.svg"
            alt="VisitCeylon logo"
            className="h-16 w-auto opacity-90"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-center space-y-2">
            <p className="text-white/70 text-sm uppercase tracking-[0.2em]">
              About VisitCeylon
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              The VisitCeylon Story
            </h1>
          </div>
          <div className="space-y-3 text-base leading-relaxed text-white/80">
            <p style={{ marginBottom: "0.75rem" }}>
              VisitCeylon is an innovative online platform designed to transform the way travelers
              explore and experience Sri Lanka’s world-renowned heritage sites. Inspired by the
              island’s rich cultural legacy and vibrant history, VisitCeylon serves as a centralized
              digital gateway for tourists – both local and international – to discover, book, and
              manage their visits with ease.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              In today’s fast-moving world, travelers seek convenience, transparency, and
              authenticity. Traditional ticketing methods at Sri Lanka’s heritage sites often lead to
              long queues, limited payment options, and inconsistent pricing structures. VisitCeylon
              was created to bridge this gap by introducing a modern, user-friendly, and
              eco-conscious system that automates the ticketing process while celebrating the
              cultural essence of the island.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              Beyond convenience, VisitCeylon empowers heritage site administrators with real-time
              visitor analytics, sales tracking, and data-driven insights, helping improve resource
              management and tourism planning.
            </p>
            <p>
              Our mission is simple yet powerful – to preserve Sri Lanka’s cultural treasures through
              technology that enhances accessibility, sustainability, and visitor satisfaction.
              VisitCeylon is more than just a ticketing system – it’s your gateway to Sri Lanka’s
              wonders, where every visit tells a story.
            </p>
          </div>
          <BlurCircle bottom="-60px" right="-5%" />
        </div>
      </article>
    </section>
  );
};

export default AboutUs;
