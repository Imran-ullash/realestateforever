import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { getComingSoonContent } from "@/lib/gate.functions";
import { getVisitToken } from "@/lib/visit-token";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/terms")({
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
      { title: "RealEstateForever.com | Real Estate Investments." },
      { name: "description", content: "The terms that govern your use of the Real Estate Forever private marketplace." },
      { property: "og:title", content: "RealEstateForever.com | Real Estate Investments." },
      { property: "og:description", content: "The terms that govern your use of the Real Estate Forever private marketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Use of this site",
    body: [
      "By accessing this private marketplace, you confirm that you are accessing it with a valid password provided by Real Estate Forever and that the information you share with us is accurate.",
      "Listings, deal information, and market data on this site are provided for your personal evaluation only. You may not reproduce, redistribute, or resell any content from this site without our written permission.",
    ],
  },
  {
    title: "Property information",
    body: [
      "Property details — including square footage, pricing, and investment figures — are provided in good faith from our sources and believed to be reliable at the time of publication, but they are not guaranteed.",
      "All opportunities are subject to change, prior sale, or withdrawal without notice. You are responsible for conducting your own due diligence on any property before acting on it.",
    ],
  },
  {
    title: "No investment advice",
    body: [
      "Nothing on this site constitutes financial, legal, or tax advice, and nothing here is a recommendation to buy, sell, or hold any property or security.",
      "Real estate investment involves risk, including possible loss of principal. Past performance of any deal or market does not guarantee future results. Consult your own professional advisors before making investment decisions.",
    ],
  },
  {
    title: "Confidentiality",
    body: [
      "Deal information shared through this marketplace is confidential. We ask that you treat it accordingly and do not share listing details, pricing, or seller information outside of your approved advisors and partners.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Real Estate Forever is not liable for any indirect, incidental, or consequential damages arising from your use of this site or reliance on the information it contains.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time. Continued use of the marketplace after changes are posted means you accept the updated terms. The current version will always be available on this page.",
    ],
  },
];

function TermsPage() {
  const content = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:h-20 sm:px-8">
          <BrandLogo className="w-32 sm:w-44" />
          <Link
            to="/"
            className="group inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to site
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[800px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/70" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary sm:text-[12px]">Legal</p>
        </div>
        <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Terms of Service</h1>
        <p className="mt-5 text-pretty text-[15px] leading-7 text-muted-foreground sm:text-base">
          These terms govern your use of the Real Estate Forever private marketplace. By using the site, you agree to them.
        </p>

        <div className="mt-12 space-y-10 sm:mt-14">
          {sections.map((section) => (
            <article key={section.title} className="border-l-2 border-primary/25 pl-5 sm:pl-7">
              <h2 className="text-balance font-display text-2xl leading-tight sm:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-pretty text-[15px] leading-7 text-muted-foreground sm:text-base">{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 border border-primary/20 bg-card/60 p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl">Questions</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base">
            For any question about these terms, contact{" "}
            <a href={`mailto:${content.email}`} className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline">
              <Mail className="size-4" />
              {content.email}
            </a>{" "}
            or visit{" "}
            <a href={`https://${content.domain}`} className="text-primary underline-offset-4 hover:underline">
              {content.domain}
            </a>.
          </p>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          © 2026 {content.brand}. All rights reserved. · Last updated September 2026
        </p>
      </section>
    </main>
  );
}
