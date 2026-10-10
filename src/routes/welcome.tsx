import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, KeyRound, LockKeyhole, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import mainVideo from "@/assets/ure2.mp4.asset.json";
import mainVideoWebm from "@/assets/ure2.webm.asset.json";
import mainVideoPoster from "@/assets/ure2-poster.jpg.asset.json";
import ogImageAsset from "@/assets/og-image.png.asset.json";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlockSite } from "@/lib/gate.functions";
import { setVisitToken } from "@/lib/visit-token";

export const Route = createFileRoute("/welcome")({
  head: () => {
    const ogImage = `https://realestateforever.com${ogImageAsset.url}`;
    return {
      meta: [
        { title: "RealEstateForever.com - Private access" },
        { name: "description", content: "Access only to exclusive private real estate investors." },
        { property: "og:title", content: "Access Only To Exclusive Private Real Estate Investors" },
        { property: "og:description", content: "Private access to Real Estate Forever." },
        { property: "og:image", content: ogImage },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Access Only To Exclusive Private Real Estate Investors" },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
  component: Welcome,
});

function Welcome() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundPlayCountRef = useRef(0);
  const manualOverrideRef = useRef(false);

  useEffect(() => {
    setPassword("");
    setError(false);

    const video = videoRef.current;
    if (!video) return;

    const syncVolumeState = () => {
      setMuted(video.muted);
    };
    video.addEventListener("volumechange", syncVolumeState);

    const handleEnded = () => {
      if (!video.muted && !manualOverrideRef.current) {
        soundPlayCountRef.current += 1;
        if (soundPlayCountRef.current >= 2) {
          video.muted = true;
          setMuted(true);
        }
      }
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    };

    let lastTime = 0;
    const handleTimeUpdate = () => {
      // In case video seeks to start or loops internally
      if (video.currentTime < lastTime - 1 && lastTime > 1) {
        if (!video.muted && !manualOverrideRef.current) {
          soundPlayCountRef.current += 1;
          if (soundPlayCountRef.current >= 2) {
            video.muted = true;
            setMuted(true);
          }
        }
      }
      lastTime = video.currentTime;
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Attempt unmuted playback initially
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setMuted(video.muted);
        })
        .catch(() => {
          // If browser blocks unmuted autoplay, play muted first
          video.muted = true;
          setMuted(true);
          void video.play().catch(() => undefined);

          // Turn sound on upon first interaction if user hasn't manually overridden
          const enableSound = (e?: Event) => {
            if (e && (e.target as HTMLElement)?.closest?.("button")) return;
            if (video && !manualOverrideRef.current) {
              video.muted = false;
              setMuted(false);
              soundPlayCountRef.current = 0;
              void video.play().catch(() => undefined);
            }
            cleanupInteraction();
          };
          const cleanupInteraction = () => {
            window.removeEventListener("click", enableSound);
            window.removeEventListener("keydown", enableSound);
            window.removeEventListener("touchstart", enableSound);
            window.removeEventListener("pointerdown", enableSound);
          };
          window.addEventListener("click", enableSound);
          window.addEventListener("keydown", enableSound);
          window.addEventListener("touchstart", enableSound);
          window.addEventListener("pointerdown", enableSound);
        });
    }

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("volumechange", syncVolumeState);
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    manualOverrideRef.current = true;
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) {
      void video.play().catch(() => undefined);
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    setSubmitting(true);
    const enteredPassword = password.trim();

    try {
      const result = await unlock({ data: { password: enteredPassword } });
      if (result.ok) {
        setPassword("");
        setVisitToken(result.token);
        await router.navigate({ to: "/" });
        return;
      }
      setError(true);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-x-hidden overflow-y-auto bg-background text-foreground sm:overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 bg-background" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-background/25" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-transparent to-background/60" />

      <header className="order-1 flex h-20 shrink-0 items-center justify-between gap-4 px-5 pt-3 sm:order-none sm:h-24 sm:px-10 sm:pt-4 lg:px-14">
        <BrandLogo className="w-48 sm:w-56 md:w-64 lg:w-72" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSound}
          aria-label={muted ? "Play introduction film with sound" : "Mute introduction film"}
          className="rounded-full border-foreground/30 bg-background/30 text-foreground backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </header>

      {/* Mobile Heading */}
      <div className="order-2 px-5 pt-7 pb-1 text-center sm:hidden">
        <h1 className="mx-auto max-w-sm text-balance font-display text-2xl leading-tight tracking-[-0.01em]">
          BUY MORE REAL ESTATE.<br className="block" /> THEY DO NOT MAKE MORE IT.
        </h1>
      </div>

      {/* Video: In-flow below heading on mobile, full-screen background on desktop */}
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        onVolumeChange={() => {
          if (videoRef.current) setMuted(videoRef.current.muted);
        }}
        playsInline
        preload="auto"
        poster={mainVideoPoster.url}
        aria-label="Real Estate Forever introduction film"
        onClick={toggleSound}
        className="order-3 relative my-3 mx-auto w-[calc(100%-2.5rem)] max-w-md aspect-video cursor-pointer rounded-xl border border-primary/35 object-cover shadow-2xl shadow-black/80 sm:order-none sm:my-0 sm:mx-auto sm:w-full sm:h-full sm:size-full sm:max-w-none sm:cursor-default sm:aspect-auto sm:rounded-none sm:border-0 sm:shadow-none sm:absolute sm:inset-0 sm:-z-20 sm:object-contain sm:object-center sm:pointer-events-none"
      >
        <source src={mainVideoWebm.url} type="video/webm" />
        <source src={mainVideo.url} type="video/mp4" />
      </video>

      {/* Section with Login Box */}
      <section className="order-4 flex flex-1 items-center justify-center px-5 py-4 sm:order-none sm:py-12">
        <div className="reveal-up flex w-full max-w-4xl flex-col items-center text-center sm:translate-y-[4vh] lg:translate-y-[5vh]">
          {/* Desktop Heading */}
          <h1 className="hidden max-w-3xl text-balance font-display text-2xl sm:block sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-[1.15] md:leading-[1.1] tracking-[-0.01em]">
            BUY MORE REAL ESTATE.<br className="block" /> THEY DO NOT MAKE MORE IT.
          </h1>

          <div className="access-gold-frame mt-1 w-full max-w-[420px] rounded-lg border-2 border-primary bg-background/65 p-6 backdrop-blur-md sm:mt-10 sm:p-8">
            <div className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full border border-primary/45 bg-background/40 text-primary">
              <LockKeyhole className="size-4" />
            </div>
            <p className="text-[12px] font-medium uppercase text-primary sm:text-[13px]">
              EXCLUSIVE & PRIVATE ACCESS ONLY
            </p>
            <form onSubmit={onSubmit} className="mt-6" noValidate autoComplete="off">
              <label htmlFor="access-code" className="mb-3 block text-left text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/80">
                ENTER PASSWORD
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <KeyRound
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/70"
                  />
                  <Input
                    id="access-code"
                    name="access_code"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    autoFocus
                    aria-invalid={error}
                    aria-describedby={error ? "password-error" : undefined}
                    className={`h-14 min-w-0 rounded-full border bg-background/50 pl-11 pr-4 text-[13px] tracking-[0.25em] text-foreground transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 ${error ? "border-destructive/60" : "border-foreground/25 hover:border-foreground/45"}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Enter site"
                  className="access-arrow-btn group relative size-14 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary/55 text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/80 active:scale-90 disabled:opacity-70"
                >
                  <span
                    aria-hidden
                    className="access-arrow-ring absolute -inset-1.5 rounded-full border border-primary/40 transition-[border-color,inset] duration-300 group-hover:-inset-2 group-hover:border-primary/90"
                  />
                  <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute -left-1/2 inset-y-0 w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
                  </span>
                  <ArrowRight className="relative mx-auto size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
              <p
                id="password-error"
                aria-live="polite"
                className={`mt-3 min-h-5 text-left text-[12px] ${error ? "text-destructive" : "text-transparent"}`}
              >
                {error ? "Authentication failed. Please try again." : ""}
              </p>
            </form>
          </div>
          <p className="mt-6 max-w-3xl text-balance font-display text-2xl font-light italic leading-snug tracking-[0.08em] text-foreground/95 sm:mt-8 sm:text-[28px] lg:text-3xl">
            Changing Lives Through{" "}
            <span className="text-primary">Real Estate</span>
          </p>
          <div aria-hidden className="mt-4 flex items-center justify-center gap-4 opacity-45">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary" />
            <span className="size-1.5 rotate-45 border border-primary bg-transparent" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>
      </section>

      <footer className="order-5 flex shrink-0 flex-col items-center justify-between gap-3 px-5 py-5 sm:order-none sm:flex-row sm:px-10 sm:py-6 lg:px-14">
        <a
          href="mailto:Info@RealEstateForever.com"
          className="group inline-flex flex-wrap items-center justify-center sm:justify-start gap-2.5 transition-colors"
        >
          <span className="font-display text-lg sm:text-xl md:text-[22px] font-normal tracking-[0.04em] text-foreground transition-colors group-hover:text-primary">
            Info@RealEstateForever.com
          </span>
          <span className="text-primary/60 font-light text-sm sm:text-base">|</span>
          <span className="text-[11px] sm:text-[12px] md:text-[13px] font-medium uppercase tracking-[0.22em] text-foreground/70 transition-colors group-hover:text-foreground/90">
            CORPORATE USE ONLY
          </span>
        </a>
        <span className="text-center sm:text-right text-[11px] sm:text-[12px] md:text-[13px] font-medium uppercase tracking-[0.22em] text-foreground/70">
          CONFIDENTIAL INVENTORY | SUBJECT TO CHANGE | © 2026
        </span>
      </footer>
    </main>
  );
}
