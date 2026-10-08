import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

const marketClocks = [
  { city: "California", zone: "America/Los_Angeles" },
  { city: "Nevada", zone: "America/Los_Angeles" },
  { city: "Florida", zone: "America/New_York" },
  { city: "Texas", zone: "America/Chicago" },
  { city: "New York", zone: "America/New_York" },
  { city: "Washington DC", zone: "America/New_York" },
];

function getClockParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone,
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "0";
  const hour12 = Number(value("hour")) % 12;
  const period = value("dayPeriod");
  const hour = hour12 + (period === "PM" ? 12 : 0);
  const minute = Number(value("minute"));
  const second = Number(value("second"));
  const elapsedSeconds = hour * 3600 + minute * 60 + second;
  const elapsedPercent = (elapsedSeconds / 86_400) * 100;

  return {
    digital: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone,
    }).format(date),
    short: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone,
    })
      .format(date)
      .replace(/\s?(AM|PM)$/i, ""),
    period: value("dayPeriod"),
    hourAngle: (hour12 + minute / 60 + second / 3600) * 30,
    minuteAngle: (minute + second / 60) * 6,
    secondAngle: second * 6,
  };
}

function MarketClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div aria-label="Current market times" className="hidden items-stretch justify-between gap-2 lg:flex">
      {marketClocks.map((market) => {
        const clock = now ? getClockParts(now, market.zone) : null;
        return (
          <div key={market.city} className="flex flex-col items-center w-[87px] 2xl:w-[104px]">
            <div className="relative size-[68px] xl:size-[76px]">
              <svg
                viewBox="0 0 72 72"
                aria-hidden="true"
                className="size-full overflow-visible drop-shadow-[0_0_5px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]"
              >
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="var(--color-background)"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-primary"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="29.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.45"
                  className="text-primary/55"
                />
                {Array.from({ length: 12 }, (_, index) => (
                  <line
                    key={index}
                    x1="36"
                    y1="8.5"
                    x2="36"
                    y2={index % 3 === 0 ? "13" : "11.5"}
                    stroke="currentColor"
                    strokeWidth={index % 3 === 0 ? "1.35" : "0.75"}
                    transform={`rotate(${index * 30} 36 36)`}
                    className="text-primary"
                  />
                ))}
                <line
                  x1="36"
                  y1="36"
                  x2="36"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  transform={`rotate(${clock?.hourAngle ?? 0} 36 36)`}
                  className="text-primary transition-transform duration-1000 ease-linear"
                />
                <line
                  x1="36"
                  y1="36"
                  x2="36"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  transform={`rotate(${clock?.minuteAngle ?? 0} 36 36)`}
                  className="text-primary transition-transform duration-1000 ease-linear"
                />
                <line
                  x1="36"
                  y1="38"
                  x2="36"
                  y2="13.5"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  transform={`rotate(${clock?.secondAngle ?? 0} 36 36)`}
                  className="text-primary/85 transition-transform duration-1000 ease-linear"
                />
                <circle cx="36" cy="36" r="1.8" fill="currentColor" className="text-primary" />
              </svg>
            </div>
            <span className="mt-2 whitespace-nowrap font-display text-[11px] font-semibold uppercase leading-none text-primary xl:text-[13px]">
              {market.city}
            </span>
            <time
              dateTime={now?.toISOString()}
              aria-label={clock ? `${clock.digital} in ${market.city}` : market.city}
              className="mt-1.5 whitespace-nowrap font-sans text-[10px] font-medium leading-none text-foreground/90 xl:text-[12px]"
            >
              {clock ? `${clock.short} ${clock.period}` : "--:-- --"}
            </time>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The premium site header shared by every page. `home` prefixes the section links
 * so pages outside "/" (e.g. /inventory) send visitors back to the homepage anchors.
 */
export function SiteHeader({ home = "" }: { home?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = () => {
      const bar = barRef.current;
      const header = headerRef.current;
      if (!bar || !header) return;
      const border = Number.parseFloat(window.getComputedStyle(header).borderBottomWidth) || 0;
      document.documentElement.style.setProperty("--site-header-height", `${Math.round(bar.offsetHeight + border)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (barRef.current) observer.observe(barRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-foreground/15 bg-background/95 shadow-lg shadow-background/40 backdrop-blur-xl"
    >
      <div
        ref={barRef}
        className="mx-auto grid py-2 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-5 sm:px-6  lg:grid-cols-[auto_1fr_1fr] lg:px-10"
      >
        <Link
          to="/"
          aria-label="Real Estate Forever home"
          className="min-w-0 justify-self-start transition-opacity hover:opacity-80"
          onClick={() => {
            if (window.location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <BrandLogo className="w-40 sm:w-48 xl:w-[240px]" />
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center justify-center gap-4 text-[16px] font-semibold uppercase text-foreground lg:flex xl:gap-[28px]"
        >
          <Link to="/inventory" className="transition-colors hover:text-primary">
            INVENTORY
          </Link>
          <a href={`${home}#contact`} className="transition-colors hover:text-primary">
            CONTACT US
          </a>
        </nav>
        <div className="flex shrink-0 items-center justify-self-end gap-2 sm:gap-3">
          <MarketClocks />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-none border border-foreground/20 text-foreground hover:bg-card hover:text-primary lg:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="grid border-t border-foreground/15 bg-background px-5 py-3 text-[15px] font-semibold uppercase text-foreground shadow-xl lg:hidden"
        >
          <Link
            to="/inventory"
            onClick={() => setMenuOpen(false)}
            className="border-b border-foreground/10 py-4 transition-colors hover:text-primary"
          >
            Inventory
          </Link>
          <a
            href={`${home}#contact`}
            onClick={() => setMenuOpen(false)}
            className="py-4 transition-colors hover:text-primary"
          >
            Contact Us
          </a>
        </nav>
      )}
    </header>
  );
}
