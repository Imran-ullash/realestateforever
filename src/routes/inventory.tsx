import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Bath, BedDouble, Car, ChevronDown, ChevronLeft, ChevronRight, Images, List, Map as MapIcon, MapPin, Ruler, SlidersHorizontal, Video, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listings, type Listing } from "@/data/listings";
import { PropertyGalleryModal } from "@/components/property-gallery-modal";
import { getComingSoonContent } from "@/lib/gate.functions";
import { getVisitToken } from "@/lib/visit-token";
import { getVehicleInventory, type Vehicle } from "@/lib/vehicles.functions";
import { vehicleLocationZips } from "@/data/vehicle-locations";

const InventoryMap = lazy(() => import("@/components/inventory-map").then((m) => ({ default: m.InventoryMap })));
const states = [...new Set(listings.map((listing) => listing.state))].sort();
const entryNumber = (listing: Listing) => Number(listing.entry.replace(/[^\d.]/g, "")) || 0;
const selectClass = "h-10 min-w-0 appearance-none border border-border bg-background px-3 pr-8 text-[12px] tracking-[0.05em] text-foreground outline-none transition-colors focus:border-primary";
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

type InventoryItem =
  | { kind: "property"; key: string; listing: Listing }
  | { kind: "vehicle"; key: string; vehicle: Vehicle };

export const Route = createFileRoute("/inventory")({
  ssr: false,
  loader: async () => {
    const content = await getComingSoonContent({ data: { token: getVisitToken() } });
    if (!content.unlocked) throw redirect({ to: "/welcome" });
    return content;
  },
  head: () => ({ meta: [
    { title: "RealEstateForever.com | Real Estate Investments." },
    { name: "description", content: "Explore Real Estate Forever's curated real estate inventory across the United States with an interactive map." },
    { property: "og:title", content: "RealEstateForever.com | Real Estate Investments." },
    { property: "og:description", content: "Explore Real Estate Forever's curated real estate inventory across the United States with an interactive map." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: InventoryPage,
});

function InventoryPage() {
  const [kind, setKind] = useState("all");
  const [price, setPrice] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [bathrooms, setBathrooms] = useState("all");
  const [state, setState] = useState("all");
  const [sort, setSort] = useState("latest");
  const [expanded, setExpanded] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [galleryListing, setGalleryListing] = useState<Listing | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cardMediaIndexes, setCardMediaIndexes] = useState<Record<number, number>>({});
  const cardRefs = useRef(new Map<string, HTMLElement>());

  const getListingMediaList = (listing: Listing) => {
    const media: { type: "image" | "video"; url: string; label: string }[] = [];
    const imgs = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
    imgs.forEach((url, i) => media.push({ type: "image", url, label: `Photo ${i + 1}` }));
    if (listing.videos && listing.videos.length > 0) {
      listing.videos.forEach((url, i) => media.push({ type: "video", url, label: `Video ${i + 1}` }));
    }
    return media;
  };

  const nextCardMedia = (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    const count = getListingMediaList(listing).length;
    if (count <= 1) return;
    setCardMediaIndexes((prev) => ({
      ...prev,
      [listing.id]: ((prev[listing.id] ?? 0) + 1) % count,
    }));
  };

  const prevCardMedia = (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    const count = getListingMediaList(listing).length;
    if (count <= 1) return;
    setCardMediaIndexes((prev) => ({
      ...prev,
      [listing.id]: ((prev[listing.id] ?? 0) - 1 + count) % count,
    }));
  };

  useEffect(() => {
    let active = true;
    getVehicleInventory().then((result) => { if (active && result.items.length) setVehicles(result.items); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const items = useMemo<InventoryItem[]>(() => [
    ...listings.map((listing) => ({ kind: "property" as const, key: `p-${listing.id}`, listing })),
    ...vehicles.map((vehicle) => ({ kind: "vehicle" as const, key: `v-${vehicle.id}`, vehicle })),
  ], [vehicles]);

  const filtered = useMemo(() => {
    const result = items.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (item.kind === "property") {
        const amount = entryNumber(item.listing);
        return (price === "all" || (price === "under10" ? amount < 10000 : price === "10to25" ? amount >= 10000 && amount < 25000 : amount >= 25000))
          && (bedrooms === "all" || Number(item.listing.beds) >= Number(bedrooms))
          && (bathrooms === "all" || Number(item.listing.baths) >= Number(bathrooms))
          && (state === "all" || item.listing.state === state);
      }
      const amount = item.vehicle.entryFee ?? 0;
      const vehicleState = item.vehicle.location?.split(", ").pop() ?? "";
      return (bedrooms === "all" && bathrooms === "all")
        && (price === "all" || (price === "under10" ? amount < 10000 : price === "10to25" ? amount >= 10000 && amount < 25000 : amount >= 25000))
        && (state === "all" || vehicleState === state);
    });
    const amountOf = (item: InventoryItem) => item.kind === "property" ? entryNumber(item.listing) : (item.vehicle.entryFee ?? 0);
    if (sort === "low") result.sort((a, b) => amountOf(a) - amountOf(b));
    if (sort === "high") result.sort((a, b) => amountOf(b) - amountOf(a));
    return result;
  }, [items, kind, price, bedrooms, bathrooms, state, sort]);
  // Vehicles get negative map ids (-(index+1)) so they can share the property map; vehicleMapKeys translates back to vehicle keys.
  const vehicleMapKeys = useMemo(() => {
    const map = new Map<number, string>();
    vehicles.forEach((vehicle, index) => { if (vehicle.location && vehicleLocationZips[vehicle.location]) map.set(-(index + 1), `v-${vehicle.id}`); });
    return map;
  }, [vehicles]);
  const mapListings = useMemo(() => filtered.flatMap((item) => {
    if (item.kind === "property") return [item.listing];
    const zip = item.vehicle.location ? vehicleLocationZips[item.vehicle.location] : undefined;
    if (!zip) return [];
    const index = vehicles.indexOf(item.vehicle);
    return [{
      id: -(index + 1),
      image: item.vehicle.image ?? "",
      city: item.vehicle.title,
      state: item.vehicle.location ?? "",
      zip,
      beds: item.vehicle.subtitle ?? "",
      baths: item.vehicle.financing ?? "",
      area: item.vehicle.monthlyPayment != null ? `${money(item.vehicle.monthlyPayment)}/mo` : "",
      entry: item.vehicle.entryFee != null ? money(item.vehicle.entryFee) : "On request",
      down: "",
      arv: "",
      type: item.vehicle.category,
      lister: "",
      isNew: false,
    }];
  }), [filtered, vehicles]);
  const selectedId = useMemo(() => {
    if (selectedKey == null) return null;
    const id = selectedKey.startsWith("p-") ? Number(selectedKey.slice(2))
      : [...vehicleMapKeys].find(([, key]) => key === selectedKey)?.[0];
    return id != null && mapListings.some((listing) => listing.id === id) ? id : null;
  }, [selectedKey, mapListings, vehicleMapKeys]);
  const hasFilters = kind !== "all" || price !== "all" || bedrooms !== "all" || bathrooms !== "all" || state !== "all";

  useEffect(() => {
    if (selectedKey != null && !filtered.some((item) => item.key === selectedKey)) setSelectedKey(null);
  }, [filtered, selectedKey]);

  useEffect(() => {
    if (mobileView === "map") window.setTimeout(() => window.dispatchEvent(new Event("resize")), 80);
  }, [mobileView]);

  const selectFromMap = (id: number) => {
    const key = id > 0 ? `p-${id}` : vehicleMapKeys.get(id);
    if (!key) return;
    setSelectedKey(key);
    if (window.innerWidth < 1024) setMobileView("list");
    window.setTimeout(() => cardRefs.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };
  const reset = () => { setKind("all"); setPrice("all"); setBedrooms("all"); setBathrooms("all"); setState("all"); setSort("latest"); setSelectedKey(null); };

  return <main className="min-h-screen bg-background pt-[var(--site-header-height,81px)] text-foreground">
    <SiteHeader home="/" />
    <div className="relative flex w-full flex-col border-b border-border lg:h-[calc(100dvh-var(--site-header-height,81px))] lg:min-h-[600px] lg:flex-row">
      <div className={`${mobileView === "list" ? "hidden lg:block" : "block"} relative isolate h-[min(67dvh,600px)] min-h-[360px] w-full bg-muted lg:h-full lg:w-[58%]`}>
        <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>}>
          <InventoryMap listings={mapListings} selectedId={selectedId} onSelect={selectFromMap} />
        </Suspense>
        <p className="absolute right-2 top-2 z-[500] bg-background/90 px-2 py-1 text-[10px] text-foreground">Approximate ZIP areas · not addresses</p>
      </div>
      <div className="flex min-h-0 w-full flex-col border-l border-border bg-background lg:w-[42%]">
        <div className="shrink-0 border-b border-border px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Marketplace</p><h2 className="font-display text-2xl font-medium sm:text-3xl text-foreground">Explore listings</h2></div>
            <span aria-live="polite" className="shrink-0 text-[13px] text-muted-foreground/90 font-sans">{filtered.length} listings found</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <label className="relative"><span className="sr-only">Listing type</span><select value={kind} onChange={(e) => setKind(e.target.value)} className={`${selectClass} w-full`}><option value="all">Type</option><option value="property">Properties</option><option value="vehicle">Vehicles</option></select><ChevronDown className="pointer-events-none absolute right-2 top-3 size-4 text-primary" /></label>
            <label className="relative"><span className="sr-only">Entry amount</span><select value={price} onChange={(e) => setPrice(e.target.value)} className={`${selectClass} w-full`}><option value="all">Entry</option><option value="under10">Under $10,000</option><option value="10to25">$10,000–$24,999</option><option value="25plus">$25,000+</option></select><ChevronDown className="pointer-events-none absolute right-2 top-3 size-4 text-primary" /></label>
            <label className="relative"><span className="sr-only">Bedrooms</span><select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={`${selectClass} w-full`}><option value="all">Beds</option><option value="2">2+ beds</option><option value="3">3+ beds</option><option value="4">4+ beds</option><option value="5">5+ beds</option></select><ChevronDown className="pointer-events-none absolute right-2 top-3 size-4 text-primary" /></label>
            <label className="relative"><span className="sr-only">Bathrooms</span><select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={`${selectClass} w-full`}><option value="all">Baths</option><option value="2">2+ baths</option><option value="3">3+ baths</option><option value="4">4+ baths</option></select><ChevronDown className="pointer-events-none absolute right-2 top-3 size-4 text-primary" /></label>
            <Button type="button" variant="outline" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="h-10 rounded-none border-primary/25 px-2 text-[12px] text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"><SlidersHorizontal className="size-4" /> All filters</Button>
          </div>
          {expanded && <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-primary/15 pt-3"><label className="flex items-center gap-2 text-[12px] text-muted-foreground">State <select aria-label="State" value={state} onChange={(e) => setState(e.target.value)} className={selectClass}><option value="all">All states</option>{states.map((s) => <option key={s} value={s}>{s}</option>)}</select></label><Button type="button" variant="ghost" onClick={reset} className="text-primary hover:bg-card hover:text-primary">Clear filters <X className="size-4" /></Button></div>}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary/15 pt-3 text-[12px] text-muted-foreground"><span className="flex items-center gap-3">{filtered.length} of {items.length} listings{hasFilters && <button type="button" onClick={reset} className="flex items-center gap-1 text-primary underline-offset-4 outline-none hover:underline focus-visible:underline" aria-label="Clear all filters"><X className="size-3.5" /> Clear filters</button>}</span><label className="flex items-center gap-2">Sort <select aria-label="Sort listings" value={sort} onChange={(e) => setSort(e.target.value)} className="bg-background text-[12px] text-foreground outline-none"><option value="latest">Original order</option><option value="low">Entry: Low to High</option><option value="high">Entry: High to Low</option></select></label></div>
        </div>
        <div className="min-h-0 flex-1 lg:overflow-y-auto" aria-label="Listings">
          {filtered.length === 0 && <div className="p-8 text-center"><p className="font-display text-2xl">No matching listings</p><Button variant="outline" onClick={reset} className="mt-4 rounded-none border-primary text-primary hover:bg-card hover:text-primary">Clear filters</Button></div>}
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-1 xl:grid-cols-2">
            {filtered.map((item) => item.kind === "property" ? (() => {
              const mediaList = getListingMediaList(item.listing);
              const hasMultipleMedia = mediaList.length > 1;
              const currentIndex = (cardMediaIndexes[item.listing.id] ?? 0) % (mediaList.length || 1);
              const currentMedia = mediaList[currentIndex] ?? mediaList[0]!;
              const totalPhotos = item.listing.images && item.listing.images.length > 0 ? item.listing.images.length : 1;
              const totalVideos = item.listing.videos && item.listing.videos.length > 0 ? item.listing.videos.length : 0;
              const isVideo = currentMedia.type === "video";
              const videoNumber = isVideo ? currentIndex - totalPhotos + 1 : 0;

              return (
              <article key={item.key} ref={(el) => { if (el) cardRefs.current.set(item.key, el); else cardRefs.current.delete(item.key); }} className={`group min-w-0 cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${selectedKey === item.key ? "border border-primary bg-primary/15 shadow-[0_0_24px_rgba(190,149,67,0.35)]" : "luxury-card-depth"}`} role="button" tabIndex={0} aria-label={`Select ${item.listing.city}, ${item.listing.state} property`} aria-pressed={selectedKey === item.key} onClick={() => setSelectedKey(item.key)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedKey(item.key); } }}>
                <div className="relative aspect-[16/9] luxury-image-frame overflow-hidden bg-black group/img">
                  {isVideo ? (
                    <video
                      key={currentMedia.url}
                      src={currentMedia.url}
                      controls
                      controlsList="nodownload"
                      disablePictureInPicture
                      playsInline
                      className="size-full object-cover"
                      onClick={(e) => e.stopPropagation()}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <img src={currentMedia.url} alt={`${item.listing.city}, ${item.listing.state} property`} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"/>
                  )}
                  <span className="absolute left-3 top-3 border border-primary/50 bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{item.listing.type}</span>
                  {item.listing.isNew && <span className="absolute top-3 right-3 bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">New</span>}
                  {hasMultipleMedia && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setGalleryListing(item.listing); }}
                        className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary shadow-lg backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {isVideo ? (
                          <>
                            <Video className="size-3" /> Video {videoNumber}/{totalVideos}
                          </>
                        ) : (
                          <>
                            <Images className="size-3" /> Photo {currentIndex + 1}/{totalPhotos}
                            {totalVideos > 0 && ` (+${totalVideos} Videos)`}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => prevCardMedia(e, item.listing)}
                        aria-label="Previous item"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex size-7 items-center justify-center rounded-full border border-primary/40 bg-black/85 text-foreground opacity-90 transition-all hover:bg-primary hover:text-primary-foreground group-hover/img:opacity-100 shadow-md"
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => nextCardMedia(e, item.listing)}
                        aria-label="Next item"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex size-7 items-center justify-center rounded-full border border-primary/40 bg-black/85 text-foreground opacity-90 transition-all hover:bg-primary hover:text-primary-foreground group-hover/img:opacity-100 shadow-md"
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    </>
                  )}
                </div>
                <div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="min-w-0 font-display text-[21px] font-normal leading-tight tracking-[-0.01em] transition-colors group-hover:text-primary">{item.listing.city}, {item.listing.state}</h3><p className="shrink-0 font-display text-xl font-medium text-primary drop-shadow-[0_1px_6px_rgba(190,149,67,0.3)]">{item.listing.entry}</p></div><p className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground/85"><MapPin className="size-3 text-primary" /> {item.listing.state} {item.listing.zip} <span className="ml-auto text-[10px] uppercase tracking-wider">Entry</span></p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-primary/15 pt-3 text-[12px] text-foreground/85"><span className="flex items-center gap-1"><BedDouble className="size-3.5 text-primary" />{item.listing.beds} beds</span><span className="flex items-center gap-1"><Bath className="size-3.5 text-primary" />{item.listing.baths} baths</span><span className="flex items-center gap-1"><Ruler className="size-3.5 text-primary" />{item.listing.area} sq ft</span></div></div>
              </article>
              );
            })() : (
              <article key={item.key} ref={(el) => { if (el) cardRefs.current.set(item.key, el); else cardRefs.current.delete(item.key); }} className={`group min-w-0 cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${selectedKey === item.key ? "border border-primary bg-primary/15 shadow-[0_0_24px_rgba(190,149,67,0.35)]" : "luxury-card-depth"}`} role="button" tabIndex={0} aria-label={`Select ${item.vehicle.title}`} aria-pressed={selectedKey === item.key} onClick={() => setSelectedKey(item.key)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedKey(item.key); } }}>
                <div className="relative aspect-[16/9] luxury-image-frame overflow-hidden bg-muted">{item.vehicle.image ? <img src={item.vehicle.image} alt={item.vehicle.title} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"/> : <div className="flex size-full items-center justify-center"><Car className="size-10 text-primary" /></div>}<span className="absolute left-3 top-3 border border-primary/50 bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{item.vehicle.category}</span></div>
                <div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="min-w-0 font-display text-[21px] font-normal leading-tight tracking-[-0.01em] transition-colors group-hover:text-primary">{item.vehicle.title}</h3>{item.vehicle.entryFee != null && <p className="shrink-0 font-display text-xl font-medium text-primary drop-shadow-[0_1px_6px_rgba(190,149,67,0.3)]">{money(item.vehicle.entryFee)}</p>}</div><p className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground/85"><MapPin className="size-3 text-primary" /> {item.vehicle.location ?? "Location on request"} {item.vehicle.entryFee != null && <span className="ml-auto text-[10px] uppercase tracking-wider">Entry</span>}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-primary/15 pt-3 text-[12px] text-foreground/85">{item.vehicle.subtitle && <span className="flex items-center gap-1"><Car className="size-3.5 text-primary" />{item.vehicle.subtitle}</span>}{item.vehicle.financing && <span className="uppercase">{item.vehicle.financing}</span>}{item.vehicle.monthlyPayment != null && <span>{money(item.vehicle.monthlyPayment)}/mo</span>}</div></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="fixed bottom-5 left-1/2 z-[600] flex -translate-x-1/2 overflow-hidden border border-primary bg-background shadow-xl lg:hidden" aria-label="View mode">
      <Button onClick={() => setMobileView("map")} variant={mobileView === "map" ? "default" : "ghost"} className="h-11 rounded-none px-5 text-[12px] uppercase hover:text-primary"><MapIcon className="size-4"/> Map</Button>
      <Button onClick={() => setMobileView("list")} variant={mobileView === "list" ? "default" : "ghost"} className="h-11 rounded-none px-5 text-[12px] uppercase hover:text-primary"><List className="size-4"/> List</Button>
    </div>
    <PropertyGalleryModal listing={galleryListing} onClose={() => setGalleryListing(null)} />
  </main>;
}
