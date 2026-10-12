import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Gem,
  Home,
  Images,
  KeyRound,
  MapPin,
  Quote,
  Search,
  Send,
  SlidersHorizontal,
  TrendingUp,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getComingSoonContent } from "@/lib/gate.functions";
import { getVisitToken } from "@/lib/visit-token";
import { sendFormEmail } from "@/lib/mail.functions";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getVehicleInventory, type Vehicle, type VehicleCategory } from "@/lib/vehicles.functions";
import { AboutImageSlider } from "@/components/about-image-slider";
import { PropertyGalleryModal } from "@/components/property-gallery-modal";
import homeMainPoster from "@/assets/home-main-poster.jpg.asset.json";
import homeMainVideo from "@/assets/home-main-video.mp4.asset.json";
import homeMainWebm from "@/assets/home-main-video.webm.asset.json";
import cleanFirstListing from "@/assets/home-listing-01.jpg";
import clearPhoto05 from "@/assets/property-clear-05.jpg";
import clearPhoto08 from "@/assets/property-clear-08.jpg";
import clearPhoto10 from "@/assets/property-clear-10.jpg";
import clearPhoto11 from "@/assets/property-clear-11.jpg";
import clearPhoto26 from "@/assets/property-clear-26.jpg";
import clearPhoto29 from "@/assets/property-clear-29.jpg";
import clearPhoto30 from "@/assets/property-clear-30.jpg";
import clearPhoto33 from "@/assets/property-clear-33.jpg";
import homePhoto02 from "@/assets/home-listings/home-02.jpg.asset.json";
import homePhoto03 from "@/assets/home-listings/home-03.jpg.asset.json";
import homePhoto04 from "@/assets/home-listings/home-04.jpg.asset.json";
import homePhoto05 from "@/assets/home-listings/home-05.jpg.asset.json";
import homePhoto06 from "@/assets/home-listings/home-06.jpg.asset.json";
import homePhoto07 from "@/assets/home-listings/home-07.jpg.asset.json";
import homePhoto08 from "@/assets/home-listings/home-08.jpg.asset.json";
import homePhoto09 from "@/assets/home-listings/home-09.jpg.asset.json";
import homePhoto10 from "@/assets/home-listings/home-10.jpg.asset.json";
import homePhoto11 from "@/assets/home-listings/home-11.jpg.asset.json";
import homePhoto12 from "@/assets/home-listings/home-12.jpg.asset.json";
import homePhoto13 from "@/assets/home-listings/home-13.jpg.asset.json";
import homePhoto14 from "@/assets/home-listings/home-14.jpg.asset.json";
import homePhoto15 from "@/assets/home-listings/home-15.jpg.asset.json";
import homePhoto16 from "@/assets/home-listings/home-16.jpg.asset.json";
import homePhoto17 from "@/assets/home-listings/home-17.jpg.asset.json";
import homePhoto18 from "@/assets/home-listings/home-18.jpg.asset.json";
import homePhoto19 from "@/assets/home-listings/home-19.jpg.asset.json";
import homePhoto20 from "@/assets/home-listings/home-20.jpg.asset.json";
import homePhoto21 from "@/assets/home-listings/home-21.jpg.asset.json";
import homePhoto22 from "@/assets/home-listings/home-22.jpg.asset.json";
import homePhoto23 from "@/assets/home-listings/home-23.jpg.asset.json";
import homePhoto24 from "@/assets/home-listings/home-24.jpg.asset.json";
import homePhoto25 from "@/assets/home-listings/home-25.jpg.asset.json";
import homePhoto26 from "@/assets/home-listings/home-26.jpg.asset.json";
import homePhoto27 from "@/assets/home-listings/home-27.jpg.asset.json";
import homePhoto28 from "@/assets/home-listings/home-28.jpg.asset.json";
import homePhoto29 from "@/assets/home-listings/home-29.jpg.asset.json";
import homePhoto30 from "@/assets/home-listings/home-30.jpg.asset.json";
import homePhoto31 from "@/assets/home-listings/home-31.jpg.asset.json";
import homePhoto32 from "@/assets/home-listings/home-32.jpg.asset.json";
import homePhoto33 from "@/assets/home-listings/home-33.jpg.asset.json";
import homePhoto34 from "@/assets/home-listings/home-34.jpg.asset.json";
import homePhoto35 from "@/assets/home-listings/home-35.jpg.asset.json";
import homePhoto36 from "@/assets/home-listings/home-36.jpg.asset.json";
import homePhoto37 from "@/assets/home-listings/home-37.jpg.asset.json";
import homePhoto38 from "@/assets/home-listings/home-38.jpg.asset.json";

import coastalVilla from "@/assets/coastal-villa.jpg";
import cityPenthouse from "@/assets/city-penthouse.jpg";
import mountainRetreat from "@/assets/mountain-retreat.jpg";
import { listings, type Listing } from "@/data/listings";

const homeListingPhotos: Record<number, string> = { 100: "/listings/temecula-ca/temecula-01-sunset-pool.jpg", 101: "/listings/indio-ca/indio-01-waterfront-villa.png", 102: "/listings/winchester-ca/winchester-01.png", 103: "/listings/twentynine-palms-ca/29palms-01-front.jpg", 1: cleanFirstListing, 2: homePhoto02.url, 3: homePhoto03.url, 4: homePhoto04.url, 5: homePhoto05.url, 6: homePhoto06.url, 7: homePhoto07.url, 8: homePhoto08.url, 9: homePhoto09.url, 10: homePhoto10.url, 11: homePhoto11.url, 12: homePhoto12.url, 13: homePhoto13.url, 14: homePhoto14.url, 15: homePhoto15.url, 16: homePhoto16.url, 17: homePhoto17.url, 18: homePhoto18.url, 19: homePhoto19.url, 20: homePhoto20.url, 21: homePhoto21.url, 22: homePhoto22.url, 23: homePhoto23.url, 24: homePhoto24.url, 25: homePhoto25.url, 26: homePhoto26.url, 27: homePhoto27.url, 28: homePhoto28.url, 29: homePhoto29.url, 30: homePhoto30.url, 31: homePhoto31.url, 32: homePhoto32.url, 33: homePhoto33.url, 34: homePhoto34.url, 35: homePhoto35.url, 36: homePhoto36.url, 37: homePhoto37.url, 38: homePhoto38.url };

const listingStates = ["All", ...Array.from(new Set(listings.map((l) => l.state)))];
Object.assign(homeListingPhotos, {
  5: clearPhoto05,
  8: clearPhoto08,
  10: clearPhoto10,
  11: clearPhoto11,
  19: clearPhoto08,
  26: clearPhoto26,
  27: clearPhoto05,
  29: clearPhoto29,
  30: clearPhoto30,
  33: clearPhoto33,
});

const propertyCategories = [
  { title: "Investment Properties", description: "High-potential income opportunities", icon: TrendingUp },
  { title: "Residential Properties", description: "Luxury homes & modern residences", icon: Home },
  { title: "Development Projects", description: "Land & redevelopment opportunities", icon: Building2 },
  { title: "Exclusive Access", description: "Off-market & private opportunities", icon: Gem },
];

const steps = [
  {
    title: "Define Your Buy Box",
    description:
      "Enter your buying criteria including location, property type, and price range to receive matched off-market deals.",
    icon: Home,
  },
  {
    title: "Review Matched Deals",
    description:
      "Access detailed property characteristics, financial analysis, and AI-matched opportunities tailored to your portfolio.",
    icon: CheckCircle2,
  },
  {
    title: "Negotiate & Close",
    description:
      "Validate details and negotiate directly with sellers using our integrated secure messaging and transaction tools.",
    icon: KeyRound,
  },
];

const testimonials = [
  {
    quote:
      "The dealflow is impeccable. Getting deals has never been easier. I found a property the first day and closed in 30 days.",
    name: "Marcus Thorne",
    role: "Institutional Investor",
  },
  {
    quote:
      "Real Estate Forever is the dominant platform for off-market luxury. Their buyer matching algorithm is unparalleled in the industry.",
    name: "Elena Rodriguez",
    role: "Private Equity Partner",
  },
  {
    quote:
      "A rare combination of market intelligence and discretion. Their portfolio of subject-to deals consistently outperforms.",
    name: "David Chen",
    role: "Portfolio Manager",
  },
];

const SHOW_ENTRY_FEE = false;
const SHOW_LOCATION = false;
const money = (n: number | null) =>
  n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const vehicleTabs: { key: "all" | VehicleCategory; label: string }[] = [
  { key: "all", label: "All Fleet" },
  { key: "cars", label: "Cars & Trucks" },
  { key: "boats", label: "Boats" },
  { key: "rvs", label: "RVs & Trailers" },
  { key: "equipment", label: "Heavy Equipment" },
];

export const Route = createFileRoute("/")({
  ssr: false,
  loader: async () => {
    try {
      const content = await getComingSoonContent({ data: { token: getVisitToken() } });
      if (!content.unlocked) throw redirect({ to: "/welcome" });
      return content;
    } catch (err) {
      if ((err as { to?: string })?.to) throw err;
      console.error("[Route loader] error:", err);
      throw redirect({ to: "/welcome" });
    }
  },
  head: () => ({
    meta: [
      { title: "RealEstateForever.com | Real Estate Investments." },
      {
        name: "description",
        content: "The #1 marketplace for off-market real estate investors. AI-matched deals delivered daily.",
      },
      { property: "og:title", content: "RealEstateForever.com | Real Estate Investments." },
      { property: "og:description", content: "Exclusive access to off-market real estate investment properties." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Homepage,
});

function Homepage() {
  const content = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [inventoryTab, setInventoryTab] = useState<"all" | "properties" | "vehicles">("all");
  const [vehicleCategory, setVehicleCategory] = useState<"all" | VehicleCategory>("all");
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    let alive = true;
    getVehicleInventory()
      .then((r) => {
        if (alive && r?.items) setVehicles(r.items);
      })
      .catch(() => {
        if (alive) setVehicles([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return listings;
    const terms = query.split(/[\s,]+/).filter(Boolean);
    return listings.filter((listing) => {
      const haystack = `${listing.city} ${listing.state} ${listing.zip} ${listing.type} ${listing.lister}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [search]);

  const filteredVehicles = useMemo(() => {
    const list = vehicles ?? [];
    return list.filter((v) => {
      if (vehicleCategory !== "all" && v.category !== vehicleCategory) return false;
      const query = search.trim().toLowerCase();
      if (!query) return true;
      const haystack = `${v.title} ${v.subtitle ?? ""} ${v.category} ${v.location ?? ""} ${v.financing ?? ""}`.toLowerCase();
      const terms = query.split(/[\s,]+/).filter(Boolean);
      return terms.every((term) => haystack.includes(term));
    });
  }, [vehicles, vehicleCategory, search]);

  const visibleListings = filteredListings;
  const visibleVehicles = filteredVehicles;

  const totalMatchingCount =
    inventoryTab === "all"
      ? visibleListings.length + visibleVehicles.length
      : inventoryTab === "properties"
      ? visibleListings.length
      : visibleVehicles.length;

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  const [galleryListing, setGalleryListing] = useState<Listing | null>(null);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<Record<number, number>>({});

  const getListingMediaList = (listing: Listing) => {
    const items: { type: "image" | "video"; url: string; label: string }[] = [];
    const imgs =
      listing.images && listing.images.length > 0
        ? listing.images
        : homeListingPhotos[listing.id]
          ? [homeListingPhotos[listing.id]!]
          : [listing.image];
    imgs.forEach((url, i) => items.push({ type: "image", url, label: `Photo ${i + 1}` }));
    if (listing.videos && listing.videos.length > 0) {
      listing.videos.forEach((url, i) => items.push({ type: "video", url, label: `Video ${i + 1}` }));
    }
    return items;
  };

  const nextCardMedia = (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    const count = getListingMediaList(listing).length;
    if (count <= 1) return;
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [listing.id]: ((prev[listing.id] ?? 0) + 1) % count,
    }));
  };

  const prevCardMedia = (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    const count = getListingMediaList(listing).length;
    if (count <= 1) return;
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [listing.id]: ((prev[listing.id] ?? 0) - 1 + count) % count,
    }));
  };

  const openGallery = (listing: Listing, index = 0) => {
    setGalleryListing(listing);
    setGalleryInitialIndex(index);
  };

  const [sending, setSending] = useState<"hero" | "enquiry" | null>(null);
  const [sentMsg, setSentMsg] = useState<{ form: "hero" | "enquiry"; ok: boolean } | null>(null);
  const submitForm = (form: "hero" | "enquiry") => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const el = event.currentTarget;
    const data = new FormData(el);
    const get = (k: string) => String(data.get(k) ?? "");
    setSending(form);
    setSentMsg(null);
    try {
      const res = await sendFormEmail({
        data: {
          form,
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          subject: get("subject"),
          message: get("message"),
        },
      });
      if (!res.ok) throw new Error(res.error);
      el.reset();
      setSentMsg({ form, ok: true });
    } catch (err) {
      console.error("[mail] Email failed:", err);
      setSentMsg({ form, ok: false });
    } finally {
      setSending(null);
    }
  };
  const sendEnquiry = submitForm("enquiry");

  return (
    <main id="top" className="min-h-screen bg-background pt-[var(--site-header-height,81px)] text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden w-full max-w-full">
      <SiteHeader />

      <section
        aria-label="Real Estate Forever film"
        className="relative h-[48vh] sm:h-[52vh] md:h-[calc(100dvh-var(--site-header-height,81px))] w-full overflow-hidden border-t border-border bg-black"
      >
        <video
          poster={homeMainPoster.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Real Estate Forever main film"
          className="size-full w-full object-cover object-center pointer-events-none select-none"
        >
          <source src={homeMainWebm.url} type="video/webm" />
          <source src={homeMainVideo.url} type="video/mp4" />
        </video>
      </section>

      <section
        id="about"
        className="relative isolate overflow-hidden scroll-mt-[var(--site-header-height,81px)] border-t border-primary/35 bg-gradient-to-b from-card/40 via-background to-card/15 py-16 sm:py-20 md:py-24"
      >
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />

        <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10">
          {/* Section Header */}
          <div className="mb-10 sm:mb-12">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(190,149,67,0.7)]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary sm:text-[12px] sm:tracking-[0.32em]">
                Strategic & Carefully Chosen Leadership
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-balance font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground">
                  About Us
                </h2>
                <p className="mt-2.5 text-base sm:text-lg md:text-xl font-normal tracking-wide text-foreground/95 max-w-2xl">
                  Real Estate Investments & Development
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Gallery Slider + Story */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14 items-stretch">
            {/* Left Column: Gallery Slider (Natural aspect ratio - company name never cut off) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/30 via-transparent to-primary/10 opacity-70 blur-sm transition-opacity group-hover:opacity-100" />
                <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-black/80 shadow-2xl shadow-black/90">
                  <AboutImageSlider />
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/75">
                <span>Real Estate Forever</span>
                <span className="text-primary font-semibold">CORPORATE USE ONLY</span>
              </div>
            </div>

            {/* Right Column: Key Narrative Section (Enlarged to match left image slider height) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex h-full flex-col justify-between rounded-2xl border border-primary/35 bg-card/75 p-7 sm:p-9 lg:p-11 shadow-2xl backdrop-blur-md overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-2.5 border-b border-primary/20 pb-4">
                    <span className="size-2 rotate-45 border border-primary bg-primary shadow-[0_0_8px_rgba(190,149,67,0.7)]" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.28em] text-primary sm:text-[13px]">
                      Real Estate Forever
                    </span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal text-foreground tracking-[-0.01em] leading-[1.14]">
                    Real Estate <span className="text-primary">Investments</span> & <span className="text-primary italic font-light">Development</span>
                  </h3>
                  <p className="mt-5 text-[15px] sm:text-base lg:text-[17px] leading-relaxed text-muted-foreground/90 font-light sm:mt-6">
                    Strategic & carefully chosen leadership focused on uncovering exceptional opportunities, engineering lasting asset value, and cultivating meaningful relationships.
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-5 border-t border-primary/20 flex items-center text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-muted-foreground/75 sm:mt-10">
                  <span className="text-primary font-semibold">Leadership Focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Property category band */}
      <section
        aria-label="Property categories"
        className="hidden scroll-mt-20 border-b border-border bg-background"
      >
        <div className="mx-auto grid max-w-[1600px] sm:grid-cols-2 lg:grid-cols-4">
          {propertyCategories.map(({ title, description, icon: Icon }, index) => (
            <a
              key={title}
              href="#marketplace"
              className={`reveal-up group flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center transition-colors hover:bg-primary/5 sm:min-h-48 sm:px-6 sm:py-[60px] ${index > 0 ? "lg:border-l lg:border-border" : ""} ${index > 1 ? "border-t border-border lg:border-t-0" : ""} ${index === 1 ? "border-t border-border sm:border-l sm:border-t-0 lg:border-border" : ""} ${index === 3 ? "sm:border-l" : ""}`}
            >
              <Icon
                strokeWidth={1.25}
                className="size-8 text-primary transition-transform duration-300 group-hover:-translate-y-1 sm:size-9"
              />
              <h2 className="mt-4 text-[13px] font-bold uppercase tracking-[0.18em] text-foreground sm:mt-5 sm:text-[14px]">{title}</h2>
              <p className="mt-2 text-[14px] leading-6 text-muted-foreground sm:text-[15px]">{description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Expertise */}
      <section className="hidden border-y border-border bg-card/35 text-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32 lg:px-16">
          <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <div>
              <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <span className="h-px w-8 bg-primary sm:w-12" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary sm:text-[12px]">What we offer</span>
              </div>
              <h2 className="max-w-2xl text-balance font-display text-[2rem] leading-[1.08] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
                Expertise in real estate across every stage.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-8">
                We bring investment insight, disciplined curation, and direct guidance to exceptional properties and
                long-term opportunities.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-7 h-12 rounded-none border-primary bg-transparent px-6 text-[12px] font-bold uppercase text-primary hover:bg-primary hover:text-primary-foreground sm:mt-9 sm:h-13 sm:px-7"
              >
                <a href="#buybox">
                  Learn about our process <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  image: coastalVilla,
                  title: "Curated Properties",
                  copy: "Selected residential and investment assets with enduring appeal.",
                },
                {
                  image: cityPenthouse,
                  title: "Real Estate Investment",
                  copy: "Opportunities aligned with your goals and portfolio strategy.",
                },
                {
                  image: mountainRetreat,
                  title: "Development Opportunities",
                  copy: "Properties positioned for value creation and redevelopment.",
                },
              ].map((item, index) => (
                <article key={item.title} className={`group ${index === 1 ? "sm:translate-y-8" : ""}`}>
                  <div className="aspect-[16/10] overflow-hidden sm:aspect-[4/5]">
                    <img
                      src={item.image}
                      alt=""
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-xl leading-tight sm:mt-6 sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-muted-foreground sm:mt-3 sm:text-[15px]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Buy Box / Process Section */}
      <section id="buybox" className="hidden scroll-mt-20 border-y border-border bg-card/30">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32 lg:px-16">
          <div className="mb-10 grid gap-6 sm:mb-16 sm:gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <span className="h-px w-8 bg-primary sm:w-12" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary sm:text-[12px]">Your journey</span>
              </div>
              <h2 className="max-w-4xl text-balance font-display text-[2rem] leading-[1.08] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
                A simple, seamless <span className="text-primary italic">process.</span>
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
                We make it easy to find, evaluate, and acquire the right property.
              </p>
            </div>
            <p className="max-w-md text-pretty text-[15px] leading-7 text-muted-foreground sm:text-base lg:justify-self-end">
              From initial criteria to closing, our team provides focus and clarity at every stage.
            </p>
          </div>
          <div id="process" className="grid scroll-mt-24 border border-border md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`reveal-up group relative p-6 transition-colors hover:bg-primary/5 sm:min-h-80 sm:p-8 md:p-10 ${i > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}
              >
                <div className="mb-8 flex items-start justify-between sm:mb-12">
                  <span className="font-display text-2xl italic text-primary sm:text-3xl">0{i + 1}</span>
                  <step.icon className="size-7 text-primary sm:size-8" />
                </div>
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">{step.title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Listings */}
      <section
        id="marketplace"
        className="mx-auto max-w-[1600px] scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-[60px]"
      >
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(190,149,67,0.7)]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary sm:text-[12px] sm:tracking-[0.32em]">
                Active Marketplace · Subject To Change Hourly
              </p>
            </div>
            <h2 className="text-balance font-display text-[2.2rem] font-medium tracking-tight sm:text-5xl sm:leading-none md:text-6xl text-foreground">
              <span className="text-primary uppercase tracking-tight">Inventory</span>
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-[13px] sm:text-[14px] font-semibold text-primary tracking-wide">
              Inventory is not guaranteed and is subject to hourly changes
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-lg luxury-glass-panel p-3.5 sm:mb-12 sm:p-5">
          {/* Top Level Category Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setInventoryTab("all")}
                className={`h-9 sm:h-10 px-4 rounded-md text-[11px] sm:text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  inventoryTab === "all"
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(190,149,67,0.45)]"
                    : "border border-border/80 text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <span>All Inventory</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    inventoryTab === "all" ? "bg-black/25 text-primary-foreground" : "bg-primary/15 text-primary"
                  }`}
                >
                  {listings.length + (vehicles?.length ?? 0)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInventoryTab("properties")}
                className={`h-9 sm:h-10 px-4 rounded-md text-[11px] sm:text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  inventoryTab === "properties"
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(190,149,67,0.45)]"
                    : "border border-border/80 text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <Building2 className="size-3.5" />
                <span>Real Estate</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    inventoryTab === "properties" ? "bg-black/25 text-primary-foreground" : "bg-primary/15 text-primary"
                  }`}
                >
                  {listings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInventoryTab("vehicles")}
                className={`h-9 sm:h-10 px-4 rounded-md text-[11px] sm:text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  inventoryTab === "vehicles"
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(190,149,67,0.45)]"
                    : "border border-border/80 text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <Car className="size-3.5" />
                <span>Luxury Vehicles</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    inventoryTab === "vehicles" ? "bg-black/25 text-primary-foreground" : "bg-primary/15 text-primary"
                  }`}
                >
                  {vehicles?.length ?? 0}
                </span>
              </button>
            </div>

            <p className="whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="text-primary font-semibold">{totalMatchingCount}</span> active {totalMatchingCount === 1 ? "asset" : "assets"}
            </p>
          </div>

          {/* Search bar + Vehicle category sub-chips */}
          <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="luxury-input-depth flex h-11 items-center gap-3 rounded-md px-3.5 sm:px-4">
              <Search className="size-4 shrink-0 text-primary" />
              <span className="sr-only">Search inventory</span>
              <input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder={
                  inventoryTab === "properties"
                    ? "Search city, state or ZIP..."
                    : inventoryTab === "vehicles"
                    ? "Search make, model, type or location..."
                    : "Search by city, state, ZIP, vehicle make or model..."
                }
                className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/75"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => updateSearch("")}
                  aria-label="Clear search"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>

            {(inventoryTab === "vehicles" || inventoryTab === "all") && (
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
                {vehicleTabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setVehicleCategory(t.key)}
                    className={`h-9 shrink-0 rounded-md px-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      vehicleCategory === t.key
                        ? "bg-primary/20 text-primary border border-primary/50 shadow-sm"
                        : "border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unified Inventory Grid */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Real Estate Properties */}
          {(inventoryTab === "all" || inventoryTab === "properties") &&
            visibleListings.map((listing) => {
              const mediaList = getListingMediaList(listing);
              const hasMultipleMedia = mediaList.length > 1;
              const currentIndex = (cardPhotoIndexes[listing.id] ?? 0) % (mediaList.length || 1);
              const currentMedia = mediaList[currentIndex] ?? mediaList[0]!;
              const totalPhotos = listing.images && listing.images.length > 0 ? listing.images.length : 1;
              const totalVideos = listing.videos && listing.videos.length > 0 ? listing.videos.length : 0;
              const isVideo = currentMedia.type === "video";
              const videoNumber = isVideo ? currentIndex - totalPhotos + 1 : 0;

              return (
                <article
                  key={listing.id}
                  className="reveal-up group relative min-w-0 flex flex-col rounded-md luxury-card-depth overflow-hidden transition-all duration-300 hover:border-transparent"
                >
                  <span className="gold-box-border" aria-hidden="true" />
                  <span className="gold-pulse-line" aria-hidden="true" />
                  <div
                    className="relative aspect-[16/10] luxury-image-frame overflow-hidden cursor-pointer group/img bg-black"
                    onClick={() => openGallery(listing, currentIndex)}
                    title="Click to view full photo and video gallery"
                  >
                    {isVideo ? (
                      <div className="relative size-full bg-black flex items-center justify-center">
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
                      </div>
                    ) : (
                      <img
                        src={currentMedia.url}
                        alt={`Property in ${listing.city}, ${listing.state} ${listing.zip}`}
                        className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    )}
                    {hasMultipleMedia && (
                      <>
                        <span className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/85 px-2.5 py-1 text-[11px] font-bold tracking-wider text-primary shadow-lg backdrop-blur-md pointer-events-none">
                          {isVideo ? (
                            <>
                              <Video className="size-3.5 text-primary" />
                              <span>
                                Video {videoNumber} of {totalVideos}
                              </span>
                            </>
                          ) : (
                            <>
                              <Images className="size-3.5 text-primary" />
                              <span>
                                Photo {currentIndex + 1} of {totalPhotos}
                                {totalVideos > 0 && ` · ${totalVideos} Videos`}
                              </span>
                            </>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => prevCardMedia(e, listing)}
                          aria-label="Previous item"
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full border border-primary/40 bg-black/85 text-foreground opacity-90 transition-all hover:bg-primary hover:text-primary-foreground group-hover/img:opacity-100 shadow-md"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => nextCardMedia(e, listing)}
                          aria-label="Next item"
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full border border-primary/40 bg-black/85 text-foreground opacity-90 transition-all hover:bg-primary hover:text-primary-foreground group-hover/img:opacity-100 shadow-md"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    className="flex flex-1 flex-col p-5 sm:p-6 cursor-pointer"
                    onClick={() => openGallery(listing, currentIndex)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="min-w-0 flex-1 basis-28 break-words font-display text-xl font-normal leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                        {listing.city}, {listing.state} {listing.zip}
                      </h3>
                    </div>

                    {(listing.beds || listing.baths || listing.area) && (
                      <p className="mt-2 text-[13px] tracking-wide text-muted-foreground/90 font-medium">
                        {listing.beds && `${listing.beds} Beds`}
                        {listing.baths && ` · ${listing.baths} Baths`}
                        {listing.area && ` · ${listing.area} sq ft`}
                      </p>
                    )}

                    {listing.lister && (
                      <div className="mt-2.5 border-t border-primary/15 pt-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {listing.lister}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

          {/* Luxury Vehicles & Fleet in the Same Flowing Grid */}
          {(inventoryTab === "all" || inventoryTab === "vehicles") &&
            visibleVehicles.map((v) => (
              <article
                key={v.id}
                className="reveal-up group relative min-w-0 flex flex-col rounded-md luxury-card-depth overflow-hidden transition-all duration-300 hover:border-transparent"
              >
                <span className="gold-box-border" aria-hidden="true" />
                <span className="gold-pulse-line" aria-hidden="true" />
                <div className="relative aspect-[16/10] luxury-image-frame overflow-hidden bg-black">
                  {v.image ? (
                    <img
                      src={v.image}
                      alt={v.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-black/60">
                      <Car className="size-10 text-primary/40" />
                    </div>
                  )}
                  <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-primary/40 bg-black/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-md backdrop-blur-md">
                    {v.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 basis-28">
                      <h3 className="font-display text-xl font-normal leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                        {v.title}
                      </h3>
                      {v.subtitle && <p className="mt-1 truncate text-[13px] text-muted-foreground/80">{v.subtitle}</p>}
                    </div>
                    {SHOW_ENTRY_FEE && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/85 sm:text-[11px]">
                          Entry
                        </p>
                        <p className="font-display text-xl font-medium text-primary sm:text-2xl drop-shadow-[0_1px_8px_rgba(190,149,67,0.3)]">
                          {money(v.entryFee)}
                        </p>
                      </div>
                    )}
                  </div>

                  {SHOW_LOCATION && v.location && (
                    <p className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground/85">
                      <MapPin className="size-3.5 text-primary" />
                      {v.location}
                    </p>
                  )}
                </div>
              </article>
            ))}
        </div>

        {totalMatchingCount === 0 && (
          <div className="rounded-lg luxury-glass-panel px-6 py-14 text-center">
            <p className="font-display text-2xl sm:text-3xl text-foreground">No assets match that search.</p>
            <p className="mt-3 text-[15px] text-muted-foreground">Try another keyword, city, state or ZIP code.</p>
            <Button
              type="button"
              onClick={() => {
                updateSearch("");
                setVehicleCategory("all");
              }}
              className="luxury-btn-outline mt-6 h-11 rounded-md px-8 text-[12px] font-bold uppercase tracking-[0.2em]"
            >
              Reset search
            </Button>
          </div>
        )}

      </section>

      {/* Testimonials */}
      <section className="hidden  border-y border-border bg-card/20 px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1600px] gap-10 sm:gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
              <span className="h-px w-8 bg-primary sm:w-12" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary sm:text-[12px]">Client testimonials</span>
            </div>
            <h2 className="max-w-xl text-balance font-display text-[2rem] leading-[1.08] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
              Trusted by clients.
              <em className="font-normal text-primary">Built on relationships.</em>
            </h2>
          </div>
          <div className="grid border border-border md:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="reveal-up group flex flex-col border-t border-border p-6 transition-colors first:border-t-0 hover:bg-primary/5 sm:min-h-96 sm:p-8 md:border-l md:border-t-0 md:first:border-l-0 lg:p-9"
              >
                <Quote className="mb-5 size-8 text-primary/35 sm:mb-8 sm:size-9" />
                <p className="text-pretty font-display text-xl leading-[1.45] italic text-foreground sm:text-2xl">
                  “{t.quote}”
                </p>
                <div className="mt-auto pt-6 sm:pt-10">
                  <p className="text-[13px] font-bold uppercase text-primary sm:text-[14px]">{t.name}</p>
                  <p className="mt-2 text-[12px] font-semibold uppercase text-muted-foreground">{t.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-20 border-t border-border bg-card/25 px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 sm:gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <span className="h-px w-8 bg-primary sm:w-10" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">CONFIDENTIAL ACCESS</p>
              </div>
              <h2 className="max-w-2xl text-balance font-display text-[2.2rem] font-medium leading-[1.04] sm:text-5xl sm:leading-[0.98] md:text-6xl xl:text-6xl">
                <span className="block text-foreground drop-shadow-sm">AN OPPORTUNITY OF A LIFETIME.</span>
                <span className="block font-normal italic gold-text-sheen mt-1 drop-shadow-[0_2px_12px_rgba(190,149,67,0.3)]">TAKE ADVANTAGES OF IT.</span>
              </h2>
              <p className="mt-5 max-w-lg text-pretty text-[15px] leading-7 text-muted-foreground/90 sm:mt-8 sm:text-base">
                Website is for internal leadership use only. All information is strictly confidential, and is not
                guaranteed to be available.
              </p>
              <div className="mt-8 border-t border-primary/20 pt-6 sm:mt-12 sm:pt-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary/85">EMAIL US</p>
                <a
                  href={`mailto:${content.email}`}
                  className="mt-3 inline-flex items-center gap-3 break-all font-display text-lg tracking-wide text-foreground transition-all duration-300 hover:text-primary hover:translate-x-1 sm:text-2xl"
                >
                  <Send className="size-4 shrink-0 text-primary drop-shadow-[0_0_8px_rgba(190,149,67,0.5)]" />
                  {content.email}
                </a>
              </div>
            </div>

            <form
              onSubmit={sendEnquiry}
              className="enquiry-form reveal-up rounded-xl luxury-glass-panel p-6 shadow-2xl transition-[border-color,box-shadow,transform] duration-500 focus-within:-translate-y-1 focus-within:border-primary/50 focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(190,149,67,0.2)] sm:p-8 md:p-10 lg:col-span-6 lg:col-start-7"
            >
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-7">
                <label className="enquiry-field group relative block">
                  <span className="mb-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    <span>FULL NAME</span>
                    <span className="text-primary font-bold text-sm leading-none select-none" aria-label="required">*</span>
                  </span>
                  <input
                    name="name"
                    required
                    className="peer w-full border-b border-primary/45 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block">
                  <span className="mb-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    <span>EMAIL</span>
                    <span className="text-primary font-bold text-sm leading-none select-none" aria-label="required">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="peer w-full border-b border-primary/45 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block sm:col-span-2">
                  <span className="mb-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    <span>CELL PHONE</span>
                    <span className="text-primary font-bold text-sm leading-none select-none" aria-label="required">*</span>
                  </span>
                  <input
                    name="subject"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    className="peer w-full border-b border-primary/45 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent placeholder:text-muted-foreground/40"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block sm:col-span-2">
                  <span className="mb-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    <span>DIRECT MESSAGE TO LEADERSHIP</span>
                    <span className="text-primary font-bold text-sm leading-none select-none" aria-label="required">*</span>
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="peer w-full resize-none border-b border-primary/45 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={sending === "enquiry"}
                className="leadership-submit-btn group mt-9 relative flex h-16 w-full items-center justify-between rounded-lg px-6 sm:px-8 text-[#0d0d0f] transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="leadership-btn-shimmer" aria-hidden="true" />
                <span className="font-sans text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.22em] text-[#0d0d0f] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  {sending === "enquiry" ? "SENDING..." : "SUBMIT TO LEADERSHIP"}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-[#f3d078] border border-[#f3d078]/60 shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-black group-hover:text-white group-hover:border-white group-hover:shadow-[0_0_16px_rgba(255,215,0,0.7)]">
                  <ArrowRight className="size-5 stroke-[2.75] transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
              {sentMsg?.form === "enquiry" && (
                <p
                  role="status"
                  className={`mt-4 text-center text-sm ${sentMsg.ok ? "text-primary" : "text-destructive"}`}
                >
                  {sentMsg.ok
                    ? "Email has been sent successfully."
                    : "Sorry, the email could not be sent. Please try again."}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-[1600px] py-8 sm:py-12 md:py-16">
          <div className="grid gap-9 border-b border-border pb-10 sm:grid-cols-2 sm:gap-12 sm:pb-14 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-5">
              <Link
                to="/"
                aria-label="Real Estate Forever home"
                className="inline-block transition-opacity hover:opacity-80"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <BrandLogo className="w-44 sm:w-52" />
              </Link>
              <p className="mt-5 max-w-sm text-pretty text-[15px] leading-7 text-muted-foreground sm:mt-6 sm:text-base">
                A Real Estate Investment & Development Firm.
              </p>
            </div>
            <div className="lg:col-span-2 lg:col-start-7">
              <p className="mb-5 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.22em] text-primary">Explore</p>
              <nav className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
                <Link to="/inventory" className="hover:text-foreground">
                  Inventory
                </Link>
                <a href="#contact" className="hover:text-foreground">
                  Contact Us
                </a>
              </nav>
            </div>
            <div className="lg:col-span-2">
              <p className="mb-5 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.22em] text-primary">Company Policies</p>
              <div className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
                <Link to="/privacy" className="transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5 pt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:justify-between">
            <span>Confidential information for internal use only</span>
            <div aria-hidden className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="size-1.5 rotate-45 border border-primary/60" />
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <span>Real Estate Forever · © 2026</span>
          </div>
        </div>
      </footer>

      <PropertyGalleryModal
        listing={galleryListing}
        initialIndex={galleryInitialIndex}
        onClose={() => setGalleryListing(null)}
      />
    </main>
  );
}
