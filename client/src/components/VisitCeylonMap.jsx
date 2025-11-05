import { useMemo, useRef, useState, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";

/**
 * Props:
 * - destinations: Array<{
 *     _id: string,
 *     title: string,
 *     tagline?: string,
 *     poster_path?: string,
 *     backdrop_path?: string,
 *     price?: number,
 *     lat: number,
 *     lng: number
 *   }>
 * - height?: string (e.g., "500px")
 */
const VisitCeylonMap = ({ destinations = [], height = "520px" }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Center on Sri Lanka by default
  const defaultCenter = useMemo(() => ({ lat: 7.8731, lng: 80.7718 }), []);
  const mapRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    // Fit bounds if we have coords
    const points = destinations.filter(d => Number.isFinite(d.lat) && Number.isFinite(d.lng));
    if (points.length) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 64);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(7);
    }
  }, [destinations, defaultCenter]);

  const flyTo = useCallback((lat, lng) => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
  }, []);

  const selected = useMemo(() => destinations.find(d => d._id === selectedId), [destinations, selectedId]);

  if (loadError) return <div className="p-4 text-red-600">Failed to load Google Maps.</div>;
  if (!isLoaded) return <div className="p-4">Loading map…</div>;

  return (
    <div className="w-full space-y-4">
      {/* Map */}
      <div className="w-full rounded-2xl overflow-hidden shadow">
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={{ width: "100%", height }}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            gestureHandling: "greedy",
          }}
        >
          {destinations.map((d) => (
            Number.isFinite(d.lat) && Number.isFinite(d.lng) && (
              <MarkerF
                key={d._id}
                position={{ lat: d.lat, lng: d.lng }}
                onClick={() => setSelectedId(d._id)}
              />
            )
          ))}

          {selected && (
            <InfoWindowF
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="max-w-[260px]">
                <img
                  src={selected.poster_path || selected.backdrop_path}
                  alt={selected.title}
                  className="w-full h-32 object-cover rounded-md"
                  loading="lazy"
                />
                <div className="mt-2">
                  <h3 className="font-semibold text-sm">{selected.title}</h3>
                  {selected.tagline && (
                    <p className="text-xs text-gray-600 mt-1">{selected.tagline}</p>
                  )}
                  {typeof selected.price === "number" && (
                    <p className="text-xs mt-2">From <span className="font-medium">${selected.price}</span></p>
                  )}
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>

      {/* Gallery strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {destinations.map((d) => {
          const img = d.poster_path || d.backdrop_path;
          return (
            <button
              key={d._id}
              onClick={() => {
                setSelectedId(d._id);
                if (Number.isFinite(d.lat) && Number.isFinite(d.lng)) flyTo(d.lat, d.lng);
              }}
              className={`group relative text-left rounded-xl overflow-hidden border hover:shadow transition ${selectedId === d._id ? "ring-2 ring-blue-500" : ""}`}
              title={d.title}
            >
              <img
                src={img}
                alt={d.title}
                className="w-full h-36 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs bg-gradient-to-t from-black/70 to-transparent">
                <div className="line-clamp-2">{d.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VisitCeylonMap;
