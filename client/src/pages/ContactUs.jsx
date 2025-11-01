import React from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
// import { Contact } from "lucide-react";

const ContactUs = () => {
  const { shows } = useAppContext();

  return shows.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    // <div className="flex flex-col items-center justify-center h-screen">
    //   <h1 className="text-3xl font-bold text-center">Contact Us</h1>
    //   <p className="text-lg text-center mt-4 max-w-xl">
    //     If you have any questions, feedback, or inquiries, feel free to reach
    //     out to us! We're here to help and would love to hear from you. You can
    //     contact us via email at{" "}
    //     <a href="mailto:support@visitceylon.lk" className="text-blue-500">
    //       support@visitceylon.lk
    //     </a>
    //   </p>
    // </div>
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Contact Us</h1>

      <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
        We’d love to hear from you! Whether you have a question, need support,
        or want to share feedback about your experience, the VisitCeylon team is
        always ready to assist.
        <br />
        <br />
        VisitCeylon aims to make heritage exploration in Sri Lanka simple,
        smooth, and memorable — and your feedback helps us improve every day.
      </p>

      <div className="mt-10 bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Get in Touch
        </h2>
        <p className="mb-2">
          <span className="font-semibold">📍 Address:</span> VisitCeylon Support
          Center, Colombo, Sri Lanka
        </p>
        <p className="mb-2">
          <span className="font-semibold">📧 Email:</span>{" "}
          <a
            href="mailto:support@visitceylon.lk"
            className="text-blue-600 hover:underline"
          >
            support@visitceylon.lk
          </a>
        </p>
        <p className="mb-2">
          <span className="font-semibold">🌐 Website:</span>{" "}
          <a
            href="https://www.visitceylon.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.visitceylon.lk
          </a>
        </p>
        <p className="mb-2">
          <span className="font-semibold">📱 Hotline:</span> +94 77 123 4567
        </p>
      </div>

      <p className="text-sm text-gray-600 mt-6">
        Our support team is available Monday to Friday, 9:00 AM – 5:00 PM
        (GMT+5:30).
        <br />
        We’ll respond as soon as possible to ensure your journey through Sri
        Lanka’s heritage sites remains unforgettable.
      </p>
    </div>
  );
};

export default ContactUs;
