import { createServerFn } from "@tanstack/react-start";

export type VehicleCategory = "cars" | "boats" | "rvs" | "equipment";

export type Vehicle = {
  id: string;
  category: VehicleCategory;
  title: string;
  subtitle: string | null;
  financing: string | null;
  entryFee: number | null;
  monthlyPayment: number | null;
  monthsLeft: number | null;
  interestRate: number | null;
  location: string | null;
  image: string | null;
};

const SOURCE = "https://subtocarguy.com";
const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; items: Vehicle[] } | null = null;

const categoryMap: Record<string, VehicleCategory> = {
  vehicles: "cars",
  car: "cars",
  cars: "cars",
  trucks: "cars",
  boats: "boats",
  boat: "boats",
  rvs: "rvs",
  rv: "rvs",
  trailers: "rvs",
  equipment: "equipment",
  "heavy-equipment": "equipment",
};

function str(chunk: string, key: string) {
  const m = chunk.match(new RegExp(`[,{]${key}:(?:"([^"]*)"|'([^']*)'|\`([^\`]*)\`)`));
  return m ? (m[1] ?? m[2] ?? m[3] ?? null) : null;
}
function num(chunk: string, key: string) {
  const m = chunk.match(new RegExp(`[,{]${key}:(-?[\\d.]+(?:e\\d+)?)`));
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function parseBundle(js: string): Vehicle[] {
  const items: Vehicle[] = [];
  const seen = new Set<string>();
  for (const raw of js.split('{id:"').slice(1)) {
    const chunk = `{id:"${raw.slice(0, 4000)}`;
    const id = chunk.match(/^\{id:"([^"]+)"/)?.[1];
    const cat = str(chunk, "category");
    if (!id || !cat || !categoryMap[cat] || seen.has(id)) continue;
    if (!/entryFee:/.test(chunk.slice(0, 1500))) continue;
    if (/[,{]isAvailable:!1/.test(chunk.slice(0, chunk.indexOf("isAvailable:") + 14))) continue;
    seen.add(id);
    const year = num(chunk, "year");
    const make = str(chunk, "make");
    const model = str(chunk, "model");
    const trim = str(chunk, "trim");
    const deal = str(chunk, "dealType");
    const city = str(chunk, "city");
    const state = str(chunk, "state");
    const photo = chunk.match(/photos:\w+\("([^"]+)",(\d+)\)/);
    const photoList = chunk.match(/photos:\[\s*"([^"]+)"/);
    const image = photo
      ? `${SOURCE}/vehicles/${photo[1]}/01.jpg`
      : photoList
        ? new URL(photoList[1] ?? "", SOURCE).toString()
        : null;
    items.push({
      id,
      category: categoryMap[cat],
      title: [year, make, model].filter(Boolean).join(" ") || id,
      subtitle: trim ? trim.replace(/^"|"$/g, "") : null,
      financing: deal ? deal.replace(/-/g, " ") : null,
      entryFee: num(chunk, "entryFee"),
      monthlyPayment: num(chunk, "monthlyPayment"),
      monthsLeft: num(chunk, "monthsLeft"),
      interestRate: num(chunk, "interestRate"),
      location: [city, state].filter(Boolean).join(", ") || null,
      image,
    });
  }
  return items;
}

export const getVehicleInventory = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < CACHE_MS) return { ok: true as const, items: cache.items };
  try {
    const html = await (await fetch(SOURCE)).text();
    const scripts = Array.from(html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)).map((m) => m[1]);
    let items: Vehicle[] = [];
    for (const src of scripts) {
      const js = await (await fetch(SOURCE + src)).text();
      items = parseBundle(js);
      if (items.length) break;
    }
    if (items.length) cache = { at: Date.now(), items };
    return { ok: true as const, items: items.length ? items : (cache?.items ?? []) };
  } catch (err) {
    console.error("[vehicles] source fetch failed", err);
    return { ok: false as const, items: cache?.items ?? [] };
  }
});
