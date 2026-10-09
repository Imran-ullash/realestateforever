import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVehicleInventory, type Vehicle, type VehicleCategory } from "@/lib/vehicles.functions";

const tabs: { key: "all" | VehicleCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cars", label: "Cars & Trucks" },
  { key: "boats", label: "Boats" },
  { key: "rvs", label: "RVs & Trailers" },
  { key: "equipment", label: "Heavy Equipment" },
];
const money = (n: number | null) =>
  n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Toggle flags to show/hide fee and address (set to true to restore at any time)
const SHOW_ENTRY_FEE = false;
const SHOW_LOCATION = false;

export function VehicleInventory() {
  const [items, setItems] = useState<Vehicle[] | null>(null);
  const [tab, setTab] = useState<"all" | VehicleCategory>("all");

  useEffect(() => {
    getVehicleInventory()
      .then((r) => setItems(r.items))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => (items ?? []).filter((v) => tab === "all" || v.category === tab), [items, tab]);
  const shown = filtered;

  return (
    <section
      id="vehicles"
      className="mx-auto max-w-[1600px] scroll-mt-20 border-t border-border px-5 py-16 sm:px-6 sm:py-24 md:px-10 md:py-[60px]"
    >
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3 sm:mb-4"></div>
          <h2 className="text-balance font-display text-[2.2rem] font-medium tracking-tight sm:text-5xl sm:leading-none md:text-6xl text-foreground">
            Available vehicles
          </h2>
        </div>
      </div>

      <div className="mb-8 rounded-lg luxury-glass-panel p-3.5 sm:mb-12 sm:p-4.5 md:p-5">
        <div className="flex items-center gap-3">
          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
            {tabs.map((t) => (
              <Button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key);
                }}
                className={`h-9 shrink-0 rounded-md px-3.5 text-[11px] font-bold uppercase tracking-widest sm:h-10 sm:px-4.5 ${
                  tab === t.key ? "luxury-btn-primary" : "luxury-btn-outline"
                }`}
              >
                {t.label}
              </Button>
            ))}
          </div>
          <p className="hidden whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:block">
            {items ? <><span className="text-primary font-semibold">{filtered.length}</span> available</> : "Loading"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {items === null &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-md border border-primary/15 bg-card/40" />
          ))}
        {shown.map((v) => (
          <article
            key={v.id}
            className="reveal-up group min-w-0 flex flex-col rounded-md luxury-card-depth overflow-hidden"
          >
            <div className="relative aspect-[16/10] luxury-image-frame overflow-hidden bg-muted">
              {v.image && (
                <img
                  src={v.image}
                  alt={v.title}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              )}
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
                    <p className="font-display text-xl font-medium text-primary sm:text-2xl drop-shadow-[0_1px_8px_rgba(190,149,67,0.3)]">{money(v.entryFee)}</p>
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

      {items !== null && filtered.length === 0 && (
        <div className="rounded-lg luxury-glass-panel px-6 py-14 text-center">
          <p className="font-display text-2xl sm:text-3xl text-foreground">No assets currently available in this category.</p>
        </div>
      )}

    </section>
  );
}
