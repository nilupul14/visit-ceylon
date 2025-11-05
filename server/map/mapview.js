// node scripts/geocode-google.js
import fs from "fs/promises";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // set this in your env

const geocodeTitle = async (title) => {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", `${title}, Sri Lanka`);
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.status !== "OK" || !data.results.length) return null;

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export default geocodeTitle();

// …same batching code as above, just calling geocodeTitle(...)
