import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  CheckCircle2,
  Gem,
  Home,
  KeyRound,
  MapPin,
  Quote,
  ChevronUp,
  Search,
  Send,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { getComingSoonContent } from "@/lib/gate.functions";
import { getVisitToken } from "@/lib/visit-token";
import { sendFormEmail } from "@/lib/mail.functions";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { VehicleInventory } from "@/components/vehicle-inventory";
import homeMainPoster from "@/assets/home-main-poster.jpg.asset.json";
import homeMainVideo from "@/assets/home-main-video.mp4.asset.json";
import homeMainWebm from "@/assets/home-main-video.webm.asset.json";
import aboutOffice from "@/assets/about-office.png";
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
import { listings } from "@/data/listings";

const homeListingPhotos: Record<number, string> = { 1: cleanFirstListing, 2: homePhoto02.url, 3: homePhoto03.url, 4: homePhoto04.url, 5: homePhoto05.url, 6: homePhoto06.url, 7: homePhoto07.url, 8: homePhoto08.url, 9: homePhoto09.url, 10: homePhoto10.url, 11: homePhoto11.url, 12: homePhoto12.url, 13: homePhoto13.url, 14: homePhoto14.url, 15: homePhoto15.url, 16: homePhoto16.url, 17: homePhoto17.url, 18: homePhoto18.url, 19: homePhoto19.url, 20: homePhoto20.url, 21: homePhoto21.url, 22: homePhoto22.url, 23: homePhoto23.url, 24: homePhoto24.url, 25: homePhoto25.url, 26: homePhoto26.url, 27: homePhoto27.url, 28: homePhoto28.url, 29: homePhoto29.url, 30: homePhoto30.url, 31: homePhoto31.url, 32: homePhoto32.url, 33: homePhoto33.url, 34: homePhoto34.url, 35: homePhoto35.url, 36: homePhoto36.url, 37: homePhoto37.url, 38: homePhoto38.url };

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

export const Route = createFileRoute("/")({
  ssr: false,
  loader: async () => {
    try {
      const content = await getComingSoonContent({ data: { token: getVisitToken() } });
      if (!content.unlocked) throw redirect({ to: "/unlock" });
      return content;
    } catch (err) {
      if ((err as { to?: string })?.to) throw err;
      console.error("[Route loader] error:", err);
      throw redirect({ to: "/unlock" });
    }
  },
  head: () => ({
    meta: [
      { title: "Real Estate Forever | Off-Market Marketplace" },
      {
        name: "description",
        content: "The #1 marketplace for off-market real estate investors. AI-matched deals delivered daily.",
      },
      { property: "og:title", content: "Real Estate Forever | Marketplace" },
      { property: "og:description", content: "Exclusive access to off-market real estate investment properties." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Homepage,
});

function Homepage() {
  const content = Route.useLoaderData();
  const [stateFilter, setStateFilter] = useState("All");
  const [search, setSearch] = useState("");


  const filteredListings = listings.filter((listing) => {
    const matchesState = stateFilter === "All" || listing.state === stateFilter;
    const query = search.trim().toLowerCase();
    if (!query) return matchesState;
    const haystack = `${listing.city} ${listing.state} ${listing.zip} ${listing.type} ${listing.lister}`.toLowerCase();
    const matchesQuery = query
      .split(/[\s,]+/)
      .filter(Boolean)
      .every((term) => haystack.includes(term));
    return matchesState && matchesQuery;
  });
  const visibleListings = filteredListings;

  const updateSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) setStateFilter("All");
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
    <main id="top" className="min-h-screen bg-background pt-[var(--site-header-height,81px)] text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteHeader />

      <section
        aria-label="Real Estate Forever film"
        className="relative h-[calc(100vh-var(--site-header-height,81px))] sm:h-[calc(100dvh-var(--site-header-height,81px))] w-full overflow-hidden border-t border-border bg-black"
      >
        <video
          poster={homeMainPoster.url}
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Real Estate Forever main film"
          className="size-full w-full object-cover object-center"
        >
          <source src={homeMainWebm.url} type="video/webm" />
          <source src={homeMainVideo.url} type="video/mp4" />
        </video>
      </section>

      <section id="about" className="scroll-mt-[var(--site-header-height,81px)] border-t border-border bg-card/25">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] md:gap-12 md:px-10 md:py-16">
          <div className="overflow-hidden rounded-xl border border-primary/25 shadow-2xl shadow-black/80 ring-1 ring-white/5 transition-transform duration-700 hover:scale-[1.01]">
            <img src={aboutOffice} alt="Modern office meeting room" loading="lazy" className="h-auto w-full object-contain" />
          </div>
          <div>
            <h2 className="mb-8 max-w-2xl text-balance font-display text-[2rem] leading-[1.06] sm:mb-10 sm:text-5xl md:text-[3.25rem]">
              <span className="gold-text-sheen font-semibold tracking-wide drop-shadow-[0_2px_14px_rgba(190,149,67,0.25)]">BUILD WEALTH!</span>
              <span className="mt-3 block text-[1.35rem] font-normal italic leading-snug text-foreground/95 sm:text-3xl md:text-[2rem] drop-shadow-sm">AN EXCEPTIONAL &amp; ELEGANT WAY OF LIFE TO THE TOP!</span>
            </h2>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Real Estate Forever</p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-[-0.02em] text-foreground drop-shadow-sm">About Us</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground/90">A real estate investment and development firm. We curate property and investment opportunities for buyers looking beyond the ordinary.</p>
            {sentMsg?.form === "hero" && (
              <p
                role="status"
                className={`mt-5 text-sm font-medium sm:text-base ${sentMsg.ok ? "text-primary" : "text-destructive"}`}
              >
                {sentMsg.ok
                  ? "Email has been sent successfully."
                  : "Sorry, the email could not be sent. Please try again."}
              </p>
            )}
            <form
              onSubmit={submitForm("hero")}
              className="mt-4 grid max-w-3xl gap-3 rounded-2xl luxury-glass-panel px-5 py-4.5 shadow-2xl sm:mt-5 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] sm:items-center sm:gap-3"
            >
              <input
                name="name"
                type="text"
                placeholder="Name"
                aria-label="Name"
                required
                className="h-12 min-w-0 rounded-full border border-primary/25 bg-background/85 px-5 text-[15px] text-foreground outline-none backdrop-blur-md transition-all duration-300 placeholder:text-muted-foreground/75 focus:border-primary focus:shadow-[0_0_14px_rgba(190,149,67,0.3)] sm:text-base"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                aria-label="Email"
                required
                className="h-12 min-w-0 rounded-full border border-primary/25 bg-background/85 px-5 text-[15px] text-foreground outline-none backdrop-blur-md transition-all duration-300 placeholder:text-muted-foreground/75 focus:border-primary focus:shadow-[0_0_14px_rgba(190,149,67,0.3)] sm:text-base"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Cell"
                aria-label="Cell"
                required
                className="h-12 min-w-0 rounded-full border border-primary/25 bg-background/85 px-5 text-[15px] text-foreground outline-none backdrop-blur-md transition-all duration-300 placeholder:text-muted-foreground/75 focus:border-primary focus:shadow-[0_0_14px_rgba(190,149,67,0.3)] sm:text-base"
              />
              <Button
                type="submit"
                disabled={sending === "hero"}
                className="luxury-btn-primary h-12 rounded-[16px] px-5 text-[12px] font-bold uppercase tracking-[0.16em] sm:px-7"
              >
                {sending === "hero" ? "SENDING..." : "SUBMIT TO JOIN"}
              </Button>
            </form>

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
                Active marketplace
              </p>
            </div>
            <h2 className="text-balance font-display text-[2.2rem] font-medium tracking-tight sm:text-5xl sm:leading-none md:text-6xl text-foreground">
              Curated opportunities
            </h2>
          </div>

          <p className="max-w-lg text-pretty text-[15px] leading-7 text-muted-foreground/90 sm:text-base">
            Explore verified opportunities by market and review the core figures before requesting the complete details.
          </p>
        </div>

        <div className="mb-8 rounded-lg luxury-glass-panel p-3.5 sm:mb-12 sm:p-4.5 md:p-5">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="luxury-input-depth flex h-11 items-center gap-3 rounded-md px-3.5 sm:px-4">
              <Search className="size-4 shrink-0 text-primary" />
              <span className="sr-only">Search city, state, or ZIP code</span>
              <input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search city, state or ZIP"
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
            <div className="flex flex-wrap gap-2">
              {listingStates.map((s) => (
                <Button
                  key={s}
                  type="button"
                  onClick={() => {
                    setStateFilter(s);
                  }}
                  className={`h-9 rounded-md px-3.5 text-[11px] font-bold uppercase tracking-widest sm:h-10 sm:px-4.5 ${stateFilter === s ? "luxury-btn-primary" : "luxury-btn-outline"
                    }`}
                >
                  {s === "All" ? "All States" : s}
                </Button>
              ))}
            </div>
            <p className="whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="text-primary font-semibold">{filteredListings.length}</span> active
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {visibleListings.map((listing) => (
            <article
              key={listing.id}
              className="reveal-up group min-w-0 flex flex-col rounded-md luxury-card-depth overflow-hidden"
            >
              <div className="relative aspect-[16/10] luxury-image-frame overflow-hidden">
                <img
                  src={homeListingPhotos[listing.id] ?? listing.image}
                  alt={`Property in ${listing.city}, ${listing.state} ${listing.zip}`}
                  className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="min-w-0 flex-1 basis-28 break-words font-display text-xl font-normal leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    {listing.city}, {listing.state} {listing.zip}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="rounded-lg luxury-glass-panel px-6 py-14 text-center">
            <p className="font-display text-2xl sm:text-3xl text-foreground">No properties match that search.</p>
            <p className="mt-3 text-[15px] text-muted-foreground">Try another city, state or ZIP code.</p>
            <Button
              type="button"
              onClick={() => {
                updateSearch("");
                setStateFilter("All");
              }}
              className="luxury-btn-outline mt-6 h-11 rounded-md px-8 text-[12px] font-bold uppercase tracking-[0.2em]"
            >
              Reset search
            </Button>
          </div>
        )}

      </section>

      <VehicleInventory />

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
                  <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    Full Name
                  </span>
                  <input
                    name="name"
                    required
                    className="peer w-full border-b border-primary/25 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block">
                  <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="peer w-full border-b border-primary/25 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block sm:col-span-2">
                  <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    CELL PHONE
                  </span>
                  <input
                    name="subject"
                    type="text"
                    className="peer w-full border-b border-primary/25 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
                <label className="enquiry-field group relative block sm:col-span-2">
                  <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
                    DIRECT MESSAGE TO LEADERSHIP
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="peer w-full resize-none border-b border-primary/25 bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </label>
              </div>
              <Button
                type="submit"
                disabled={sending === "enquiry"}
                className="luxury-btn-primary group mt-9 h-14 w-full rounded-lg text-[12px] font-bold uppercase tracking-[0.18em]"
              >
                {sending === "enquiry" ? "Sending..." : "SUBMIT TO LEADERSHIP"}{" "}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
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
    </main>
  );
}
