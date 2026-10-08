import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// A visit is valid only when the browser tab presents the same random token that
// the server stored at unlock time, and the visit is still within its time limits.
type GateSession = { token?: string; issuedAt?: number; lastSeen?: number };

const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes without activity
const ABSOLUTE_LIMIT_MS = 4 * 60 * 60 * 1000; // 4 hours maximum per visit

const DEFAULT_SESSION_SECRET = "c9b0e27a69f4d7b29a8f4c2e6d9b0e27a69f4d7b29a8f4c2e6d9b0e27a69f4d7";
const DEFAULT_ACCESS_PASSWORD = "1111";

function getSessionConfig() {
  const password = process.env["SESSION_SECRET"] || DEFAULT_SESSION_SECRET;

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
    try {
      const expected = process.env["SITE_ACCESS_PASSWORD"] || DEFAULT_ACCESS_PASSWORD;
      if (!digestEquals(String(data.password ?? ""), expected)) return { ok: false as const, token: "" };

      const token = randomBytes(32).toString("hex");
      const now = Date.now();
      const session = await useSession<GateSession>(getSessionConfig());
      await session.clear();
      await session.update({ token, issuedAt: now, lastSeen: now });
      return { ok: true as const, token };
    } catch (err) {
      console.error("[gate] unlock error:", err);
      return { ok: false as const, token: "" };
    }
  });

export const getComingSoonContent = createServerFn({ method: "GET" })
  .inputValidator((data: { token?: string } | undefined) => ({ token: String(data?.token ?? "") }))
  .handler(async ({ data }) => {
    try {
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
    } catch (err) {
      console.error("[gate] getComingSoonContent session error:", err);
      return {
        unlocked: false,
        brand: "Real Estate Forever",
        company: "Real Estate Forever",
        eyebrow: "Coming soon",
        headline: "Something Exceptional Is Coming.",
        description: "An exceptional collection of real estate is coming soon.",
        email: "Info@RealEstateForever.com",
        domain: "realestateforever.com",
      };
    }
  });
