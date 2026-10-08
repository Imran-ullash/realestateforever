import { ArrowRight, ChevronDown, Mail, Menu } from "lucide-react";
import heroResidence from "@/assets/hero-residence.jpg";
import coastalVilla from "@/assets/coastal-villa.jpg";
import cityPenthouse from "@/assets/city-penthouse.jpg";
import mountainRetreat from "@/assets/mountain-retreat.jpg";
import galleryLoft from "@/assets/gallery-loft.jpg";
import { BrandLogo } from "@/components/brand-logo";

const properties = [
  { image: coastalVilla, width: 1200, height: 912, name: "Casa del Mar", place: "Mallorca, Spain", details: "5 beds · 6 baths · 6,480 sq ft", price: "$8,900,000", span: "lg:col-span-7" },
  { image: cityPenthouse, width: 1008, height: 1200, name: "The Skyline Residence", place: "New York, USA", details: "4 beds · 4 baths · 3,920 sq ft", price: "$12,500,000", span: "lg:col-span-5" },
  { image: mountainRetreat, width: 1200, height: 912, name: "Pine House", place: "Aspen, USA", details: "4 beds · 5 baths · 4,700 sq ft", price: "$7,250,000", span: "lg:col-span-5" },
  { image: galleryLoft, width: 1200, height: 912, name: "Atrium House", place: "Los Angeles, USA", details: "3 beds · 4 baths · 4,100 sq ft", price: "$6,800,000", span: "lg:col-span-7" },
];

export function FullSite() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <a href="#top" aria-label="Real Estate Forever home"><BrandLogo /></a>
          <nav className="hidden items-center gap-8 text-xs uppercase text-muted-foreground lg:flex">
            <a href="#collection" className="transition-colors hover:text-foreground">Properties</a>
            <a href="#about" className="transition-colors hover:text-foreground">Our approach</a>
            <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
          </nav>
          <a href="mailto:Info@RealEstateForever.com" className="hidden items-center gap-2 border-b border-primary pb-1 text-xs uppercase md:flex">Private inquiry <ArrowRight className="size-3.5" /></a>
          <Menu className="size-5 md:hidden" aria-label="Menu" />
        </div>
      </header>

      <section id="top" className="relative min-h-[92vh] overflow-hidden">
        <img src={heroResidence} width={1600} height={1008} alt="Modern residence with an infinity pool at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/35" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[1500px] items-end px-5 pb-12 md:px-10 md:pb-16">
          <div className="reveal-up max-w-4xl">
            <p className="mb-5 text-xs uppercase text-primary">A collection without compromise</p>
            <h1 className="font-display text-5xl font-normal leading-[0.94] sm:text-7xl lg:text-8xl">Exceptional homes.<br />Enduring value.</h1>
            <div className="mt-7 flex flex-col gap-5 border-t border-foreground/30 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-lg text-sm leading-6 text-foreground/80">Remarkable architecture in the world&apos;s most desirable places, selected for beauty, provenance, and the lives they make possible.</p>
              <a href="#collection" className="flex items-center gap-3 text-xs uppercase">Explore the collection <ArrowRight className="size-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          {["Location", "Property type", "Price range"].map((label) => <button key={label} className="flex h-20 items-center justify-between px-5 text-left text-xs uppercase md:px-8">{label}<ChevronDown className="size-4 text-muted-foreground" /></button>)}
          <button className="h-20 bg-primary px-5 text-left text-xs font-semibold uppercase text-primary-foreground transition-opacity hover:opacity-90 md:px-8">Search properties</button>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
          <div><p className="mb-3 text-xs uppercase text-primary">The collection</p><h2 className="font-display text-4xl md:text-6xl">Homes of distinction</h2></div>
          <span className="hidden text-xs uppercase text-muted-foreground sm:block">04 featured residences</span>
        </div>
        <div className="grid gap-x-5 gap-y-12 lg:grid-cols-12">
          {properties.map((property, index) => (
            <article key={property.name} className={`${property.span} group`}>
              <div className={`overflow-hidden bg-card ${index === 1 || index === 2 ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
                <img src={property.image} loading="lazy" width={property.width} height={property.height} alt={property.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-5 border-t border-border pt-4">
                <div><h3 className="font-display text-2xl md:text-3xl">{property.name}</h3><p className="mt-1 text-xs uppercase text-muted-foreground">{property.place} · {property.details}</p></div>
                <p className="shrink-0 text-sm">{property.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-12 lg:py-28">
          <p className="text-xs uppercase text-primary lg:col-span-3">Our point of view</p>
          <div className="lg:col-span-8"><h2 className="font-display text-4xl leading-tight md:text-6xl">Real estate is temporary.<br /><span className="text-muted-foreground">A remarkable home is forever.</span></h2><p className="mt-8 max-w-2xl text-sm leading-7 text-muted-foreground">We represent fewer properties so we can know each one completely. From the first private introduction to the final key, every detail receives our full attention.</p></div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs uppercase text-primary">Begin a conversation</p>
            <h2 className="font-display text-5xl md:text-7xl">Find your forever.</h2>
            <p className="mt-7 max-w-xl font-display text-2xl leading-snug text-muted-foreground md:text-4xl">
              Buy real estate — they don&apos;t make more of it. <span className="text-foreground">We make it easy.</span>
            </p>
          </div>
          <a href="mailto:Info@RealEstateForever.com" className="group flex shrink-0 items-center gap-4 border-b border-primary pb-4">
            <Mail className="size-5" />
            <span className="font-display text-2xl tracking-wide md:text-3xl">Info@RealEstateForever.com</span>
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 md:px-10"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 text-xs text-muted-foreground sm:flex-row"><span>© 2026 Real Estate Forever</span><a href="https://www.RealEstateForever.com">www.RealEstateForever.com</a></div></footer>
    </main>
  );
}
