import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// A visit is valid only when the browser tab presents the same random token that
// the server stored at unlock time, and the visit is still within its time limits.
type GateSession = { token?: string; issuedAt?: number; lastSeen?: number };

const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes without activity
const ABSOLUTE_LIMIT_MS = 4 * 60 * 60 * 1000; // 4 hours maximum per visit

function getSessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("Site session is not configured");

  return {
    password,
    // renamed to invalidate every earlier unlock session (v2 and before)
    name: "real-estate-forever-gate-v4",
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function digestEquals(input: string, expected: string): boolean {
  const inputDigest = createHash("sha256").update(input, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(inputDigest, expectedDigest);
}

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["SITE_ACCESS_PASSWORD"];
    if (!expected) throw new Error("Site access is not configured");
    if (!digestEquals(String(data.password ?? ""), expected)) return { ok: false as const, token: "" };

    const token = randomBytes(32).toString("hex");
    const now = Date.now();
    const session = await useSession<GateSession>(getSessionConfig());
    await session.clear();
    await session.update({ token, issuedAt: now, lastSeen: now });
    return { ok: true as const, token };
  });

export const getComingSoonContent = createServerFn({ method: "GET" })
  .inputValidator((data: { token?: string } | undefined) => ({ token: String(data?.token ?? "") }))
  .handler(async ({ data }) => {
  const session = await useSession<GateSession>(getSessionConfig());
  const { token, issuedAt = 0, lastSeen = 0 } = session.data;
  const now = Date.now();
  const unlocked =
    !!token &&
    !!data.token &&
    digestEquals(data.token, token) &&
    now - lastSeen < IDLE_LIMIT_MS &&
    now - issuedAt < ABSOLUTE_LIMIT_MS;
  if (unlocked) await session.update({ lastSeen: now });
  else if (token && now - issuedAt >= ABSOLUTE_LIMIT_MS) await session.clear();
  return {
    unlocked,
    brand: "Real Estate Forever",
    company: "Real Estate Forever",
    eyebrow: "Coming soon",
    headline: "Something Exceptional Is Coming.",
    description: "An exceptional collection of real estate is coming soon.",
    email: "Info@RealEstateForever.com",
    domain: "realestateforever.com",
  };
});
