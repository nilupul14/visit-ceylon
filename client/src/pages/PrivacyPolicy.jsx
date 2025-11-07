import React from "react";
import { Link } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";

const policySections = [
  {
    title: "Information we collect",
    body: [
      "Account details you share when signing up with Clerk (name, email address, and profile photo).",
      "Booking information such as selected destinations, travel dates, ticket counts, and payment confirmations.",
      "Device and usage data (browser type, approximate location, session analytics) that help us keep VisitCeylon secure and performant."
    ]
  },
  {
    title: "How we use your data",
    body: [
      "To process bookings, issue confirmations, and send reminders or service emails.",
      "To personalize recommendations, favorites, and map experiences across web and mobile.",
      "To detect fraud, monitor platform health, and comply with legal or regulatory obligations."
    ]
  },
  {
    title: "Sharing & third parties",
    body: [
      "Payment providers such as Stripe receive only the information needed to complete secure transactions.",
      "Inngest, Clerk, and analytics partners process limited data under strict contractual safeguards.",
      "We never sell personal information, and we require partners to honor confidentiality and data protection standards."
    ]
  },
  {
    title: "Your choices & rights",
    body: [
      "Access or update profile information via your VisitCeylon account dashboard.",
      "Download or delete your data by emailing privacy@visitceylon.lk; we respond within 30 days.",
      "Manage marketing preferences from the footer of any campaign email."
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <section className="relative min-h-screen bg-[#030406] px-4 pt-36 pb-20 text-white flex items-center justify-center overflow-hidden z-[-3]">
      <BlurCircle top="-80px" left="-15%" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#01343640] to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[75%] max-w-4xl h-full bg-teal-300/15 blur-[220px]" />
      </div>

      <article className="w-full max-w-5xl rounded-[32px] border border-white/5 bg-gradient-to-r from-[#04161c] via-[#031116] to-[#05080c] shadow-[0_30px_55px_rgba(0,0,0,0.45)] p-6 sm:p-10 backdrop-blur space-y-10">
        <div className="text-center space-y-4">
          <img
            src="/src/assets/logo.svg"
            alt="VisitCeylon logo"
            className="h-14 w-auto opacity-90 mx-auto"
          />
          <p className="text-white/70 text-sm uppercase tracking-[0.3em]">
            Privacy Commitment
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-3xl mx-auto leading-relaxed">
            VisitCeylon protects your personal information so you can focus on
            planning unforgettable journeys across Sri Lanka. This page explains
            what we collect, why we collect it, and the controls available to
            you. The latest update was published on{" "}
            <strong>March 5, 2026</strong>.
          </p>
        </div>

        <div className="space-y-6">
          {policySections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <ul className="list-disc space-y-2 pl-5 text-white/80 text-base leading-relaxed">
                {section.body.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center space-y-3">
          <h3 className="text-xl font-semibold text-primary">Questions?</h3>
          <p className="text-white/80">
            Reach the VisitCeylon privacy desk at{" "}
            <a
              className="underline decoration-dotted"
              href="mailto:privacy@visitceylon.lk"
            >
              privacy@visitceylon.lk
            </a>{" "}
            or visit our <Link to="/contact-us" className="underline">
              contact page
            </Link>{" "}
            for additional support.
          </p>
        </div>
      </article>
    </section>
  );
};

export default PrivacyPolicy;
