// Uses the Google Maps JS API already on the page
const geoLatitudeLongitude = (google, title, country = "Sri Lanka") => {
  const geocoder = new google.maps.Geocoder();
  const q = `${title}, ${country}`;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: q }, (results, status) => {
      if (status !== "OK" || !results?.length) {
        return reject(new Error(`Geocode failed: ${status || "UNKNOWN"}`));
      }
      const loc = results[0].geometry.location;
      resolve({ lat: loc.lat(), lng: loc.lng() });
    });
  });
}

export default geoLatitudeLongitude;