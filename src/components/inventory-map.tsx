import { useEffect, useRef } from "react";
import type { Listing } from "@/data/listings";
import { zipCoordinates } from "@/data/zip-coordinates";
import "leaflet/dist/leaflet.css";

const markerPrice = (listing: Listing) => `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(listing.entry.replace(/[^\d.]/g, "")) || 0)}`;
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
// Listings have ZIP codes rather than street addresses. Spread shared-ZIP pins slightly so all remain selectable.
function position(listing: Listing, items: Listing[]): [number, number] | null {
  const center = zipCoordinates[listing.zip];
  if (!center) return null;
  const shared = items.filter((item) => item.zip === listing.zip);
  const index = shared.findIndex((item) => item.id === listing.id);
  if (shared.length === 1) return center;
  const angle = (index / shared.length) * Math.PI * 2;
  return [center[0] + Math.sin(angle) * .032, center[1] + Math.cos(angle) * .038];
}

export function InventoryMap({ listings, selectedId, onSelect }: { listings: Listing[]; selectedId: number | null; onSelect: (id: number) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef(new Map<number, import("leaflet").Marker>());
  const callbackRef = useRef(onSelect);
  const currentItems = useRef(listings);
  callbackRef.current = onSelect;
  currentItems.current = listings;

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const L = await import("leaflet");
      if (cancelled || !container.current) return;
      leafletRef.current = L;
      const map = L.map(container.current, { zoomControl: false, scrollWheelZoom: false, maxZoom: 18, minZoom: 3 }).setView([36.5, -91], 5);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "bottomleft" }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      draw(currentItems.current);
      map.on("resize", () => {
        const coords = currentItems.current.map((listing) => position(listing, currentItems.current)).filter((coord): coord is [number, number] => coord !== null);
        if (coords.length) map.fitBounds(coords, { padding: [45, 45], maxZoom: 10 });
      });
      setTimeout(() => { if (!cancelled) map.invalidateSize(); }, 150);
    }
    void init();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; layerRef.current = null; markersRef.current.clear(); };
  }, []);

  function draw(items: Listing[]) {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    markersRef.current.clear();
    const coords: [number, number][] = [];
    items.forEach((listing) => {
      const coord = position(listing, items);
      if (!coord) return;
      coords.push(coord);
      const marker = L.marker(coord, { icon: L.divIcon({ html: `<span>${markerPrice(listing)}</span>`, className: `inventory-marker${listing.id === selectedId ? " inventory-marker-selected" : ""}`, iconSize: [48, 48], iconAnchor: [24, 24] }) });
      marker.bindPopup(`<div class="inventory-popup">${listing.image ? `<img src="${escape(listing.image)}" alt=""/>` : ""}<div class="inventory-popup-body"><small>ENTRY ${escape(listing.entry)}</small><strong>${escape(listing.city)}, ${escape(listing.state)} ${escape(listing.zip)}</strong><span>${escape(listing.beds)} beds · ${escape(listing.baths)} baths · ${escape(listing.area)} sq ft</span><em>Approximate ZIP-area location</em></div></div>`, { maxWidth: 260, minWidth: 220 });
      marker.on("click", () => { callbackRef.current(listing.id); map.flyTo(coord, Math.max(map.getZoom(), 8), { duration: .6 }); });
      markersRef.current.set(listing.id, marker);
      marker.addTo(layer);
    });
    if (coords.length) map.fitBounds(coords, { padding: [45, 45], maxZoom: 10 });
  }

  useEffect(() => { draw(listings); }, [listings]);
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    markersRef.current.forEach((marker, id) => {
      const listing = listings.find((item) => item.id === id);
      if (listing) marker.setIcon(L.divIcon({ html: `<span>${markerPrice(listing)}</span>`, className: `inventory-marker${id === selectedId ? " inventory-marker-selected" : ""}`, iconSize: [48, 48], iconAnchor: [24, 24] }));
    });
    if (selectedId != null) {
      const marker = markersRef.current.get(selectedId);
      if (marker) { map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 8), { duration: .6 }); marker.openPopup(); }
    }
  }, [selectedId, listings]);

  return <div ref={container} className="inventory-map h-full min-h-[360px] w-full" role="application" aria-label="Interactive map of inventory by ZIP code" />;
}
