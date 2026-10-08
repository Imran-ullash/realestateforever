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
          <h2 className="text-balance font-display text-[2rem] leading-tight sm:text-5xl sm:leading-none md:text-6xl">
            Available vehicles
          </h2>
        </div>
      </div>

      <div className="mb-8 border border-primary/15 bg-card/50 p-3 sm:mb-12 sm:p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
            {tabs.map((t) => (
              <Button
                key={t.key}
                type="button"
                variant={tab === t.key ? "default" : "outline"}
                onClick={() => {
                  setTab(t.key);
                }}
                className="h-9 shrink-0 rounded-none px-3 text-[11px] font-bold uppercase tracking-widest sm:h-10 sm:px-4"
              >
                {t.label}
              </Button>
            ))}
          </div>
          <p className="hidden whitespace-nowrap text-[11px] font-bold uppercase text-muted-foreground sm:block">
            {items ? `${filtered.length} available` : "Loading"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {items === null &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse border border-primary/10 bg-card/40" />
          ))}
        {shown.map((v) => (
          <article
            key={v.id}
            className="reveal-up group min-w-0 flex flex-col border border-primary/10 bg-card/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              {v.image && (
                <img
                  src={v.image}
                  alt={v.title}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 basis-28">
                  <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-primary sm:text-2xl">
                    {v.title}
                  </h3>
                  {v.subtitle && <p className="mt-1 truncate text-[13px] text-muted-foreground">{v.subtitle}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
                    Entry
                  </p>
                  <p className="font-display text-xl text-primary sm:text-2xl">{money(v.entryFee)}</p>
                </div>
              </div>

              {v.location && (
                <p className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  {v.location}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {items !== null && filtered.length === 0 && (
        <div className="border border-primary/15 bg-card/40 px-6 py-14 text-center">
          <p className="font-display text-2xl sm:text-3xl">No assets currently available in this category.</p>
        </div>
      )}

    </section>
  );
}
