import React from "react";
import BlurCircle from "../components/BlurCircle";

const ContactUs = () => {
  return (
    <section className="relative min-h-screen bg-[#030406] px-4 py-20 text-white flex items-center justify-center overflow-hidden z-[-3]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#01343640] to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[75%] max-w-4xl h-full bg-teal-300/15 blur-[200px]" />
      </div>

      <article className="w-full max-w-4xl rounded-[32px] border border-white/5 bg-gradient-to-r from-[#04161c] via-[#031116] to-[#05080c] shadow-[0_30px_55px_rgba(0,0,0,0.45)] p-6 sm:p-10 backdrop-blur">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <img
            src="/src/assets/logo.svg"
            alt="VisitCeylon logo"
            className="h-14 w-auto opacity-90"
          />
          <div className="space-y-2">
            <p className="text-white/70 text-sm uppercase tracking-[0.3em]">
              Your VisitCeylon Crew
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Tell us how we can help
            </h1>
          </div>
          <p className="text-base sm:text-lg text-white/70 max-w-3xl leading-relaxed">
            We’d love to hear from you! Whether you have a question, need
            support, or want to share feedback about your experience, the
            VisitCeylon team is always ready to assist. Every message helps us
            craft smoother, more magical journeys.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
              Write to us
            </p>
            <p className="text-xl font-semibold mt-2">support@visitceylon.lk</p>
            <p className="text-white/70 text-sm mt-1">
              We reply within one business day.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
              Call the desk
            </p>
            <p className="text-xl font-semibold mt-2">+94 77 123 4567</p>
            <p className="text-white/70 text-sm mt-1">
              Monday to Friday · 9:00 AM – 5:00 PM (GMT+5:30)
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
              Visit us
            </p>
            <p className="text-xl font-semibold mt-2">
              VisitCeylon Support Center
            </p>
            <p className="text-white/70 text-sm mt-1">
              Colombo 07, Western Province, Sri Lanka
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
              Explore online
            </p>
            <p className="text-xl font-semibold mt-2">www.visitceylon.lk</p>
            <p className="text-white/70 text-sm mt-1">
              Follow live updates on new destinations and promos.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ContactUs;
