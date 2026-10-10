import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { getComingSoonContent } from "@/lib/gate.functions";
import { getVisitToken } from "@/lib/visit-token";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/privacy")({
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
      { name: "description", content: "How Real Estate Forever collects, uses, and protects your information." },
      { property: "og:title", content: "RealEstateForever.com | Real Estate Investments." },
      { property: "og:description", content: "How Real Estate Forever collects, uses, and protects your information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Information we collect",
    body: [
      "When you contact Real Estate Forever or submit an enquiry through this site, we collect the details you choose to share with us — typically your name, email address, phone number, and the substance of your message.",
      "Like most websites, we may also receive standard technical information from your browser, such as your IP address, browser type, and the pages you visit. This is used only to operate and improve the site.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use the information you provide to respond to your enquiry, share opportunities that match your stated criteria, and communicate with you about our services.",
      "We do not sell your personal information, and we do not share it with third parties except where it is necessary to serve you (for example, a title company or lender you approve) or where the law requires it.",
    ],
  },
  {
    title: "Private marketplace access",
    body: [
      "Access to this marketplace is restricted to qualified buyers and investors. We take reasonable measures to keep the site and any information you share with us secure, including limiting access to authorized personnel.",
      "No method of transmission over the internet is completely secure, and we cannot guarantee absolute security of information sent to us electronically.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may ask us at any time to update, correct, or delete the personal information you have shared with us, or to stop receiving communications from us. Reach us at the email below and we will take care of it promptly.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this privacy policy from time to time as our services evolve. The current version will always be available on this page.",
    ],
  },
];

function PrivacyPage() {
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
        <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-pretty text-[15px] leading-7 text-muted-foreground sm:text-base">
          Real Estate Forever respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.
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
          <h2 className="font-display text-xl sm:text-2xl">Contact us</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Questions about this policy or your information? Reach us at{" "}
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
