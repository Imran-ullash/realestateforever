import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole, Mail, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import mainVideo from "@/assets/ure2.mp4.asset.json";
import mainVideoWebm from "@/assets/ure2.webm.asset.json";
import mainVideoPoster from "@/assets/ure2-poster.jpg.asset.json";
import ogImageAsset from "@/assets/og-image.png.asset.json";
import { BrandLogo } from "@/components/brand-logo";
import { TalkLiveButton } from "@/components/talk-live-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlockSite } from "@/lib/gate.functions";
import { sendFormEmail } from "@/lib/mail.functions";
import { clearVisitToken, setVisitToken } from "@/lib/visit-token";

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
  const [waitingForGesture, setWaitingForGesture] = useState(false);
  const [activeTab, setActiveTab] = useState<"password" | "leadership">("password");
  const [leadershipSending, setLeadershipSending] = useState(false);
  const [leadershipSent, setLeadershipSent] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundPlayCountRef = useRef(0);
  const lastCycleTimeRef = useRef(0);

  useEffect(() => {
    clearVisitToken();
    setPassword("");
    setError(false);

    const video = videoRef.current;
    if (!video) return;

    let cleanupInteractionListeners: (() => void) | null = null;

    const onCycleComplete = () => {
      const now = Date.now();
      // Video duration is ~59.3s; debounce by 25s so ended + timeupdate cannot double count
      if (now - lastCycleTimeRef.current < 25000) return;
      lastCycleTimeRef.current = now;

      soundPlayCountRef.current += 1;
      if (soundPlayCountRef.current >= 2) {
        // Completed 2 full soundtrack plays: mute audio and loop video silently
        video.muted = true;
        setMuted(true);
      }
    };

    const handleEnded = () => {
      if (!video.muted) {
        onCycleComplete();
      }
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    };

    let lastTime = 0;
    const handleTimeUpdate = () => {
      // In case video loops internally without triggering ended, or seeks from >50s back to <2s
      if (lastTime > 50 && video.currentTime < 2) {
        if (!video.muted) {
          onCycleComplete();
        }
      }
      lastTime = video.currentTime;
    };

    const handleVolumeChange = () => {
      setMuted(video.muted);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("volumechange", handleVolumeChange);

    const startUnmutedPlayback = () => {
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      soundPlayCountRef.current = 0;
      lastCycleTimeRef.current = Date.now();
      setMuted(false);
      setWaitingForGesture(false);
      void video.play().catch(() => {
        video.muted = true;
        setMuted(true);
      });
    };

    const handleUserGesture = () => {
      if (cleanupInteractionListeners) {
        cleanupInteractionListeners();
        cleanupInteractionListeners = null;
      }
      startUnmutedPlayback();
    };

    const setupUserGestureListeners = () => {
      window.addEventListener("pointerdown", handleUserGesture, true);
      window.addEventListener("touchstart", handleUserGesture, true);
      window.addEventListener("click", handleUserGesture, true);
      window.addEventListener("keydown", handleUserGesture, true);

      cleanupInteractionListeners = () => {
        window.removeEventListener("pointerdown", handleUserGesture, true);
        window.removeEventListener("touchstart", handleUserGesture, true);
        window.removeEventListener("click", handleUserGesture, true);
        window.removeEventListener("keydown", handleUserGesture, true);
      };
    };

    // Attempt unmuted playback initially
    video.muted = false;
    video.volume = 1;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Browser allowed unmuted autoplay!
          setMuted(false);
          setWaitingForGesture(false);
          lastCycleTimeRef.current = Date.now();
          soundPlayCountRef.current = 0;
        })
        .catch(() => {
          // Browser blocked unmuted autoplay due to policy (Chrome/Safari default).
          // Play muted so background visual runs, and prompt/listen for first interaction.
          video.muted = true;
          setMuted(true);
          setWaitingForGesture(true);
          void video.play().catch(() => undefined);
          setupUserGestureListeners();
        });
    }

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("volumechange", handleVolumeChange);
      if (cleanupInteractionListeners) {
        cleanupInteractionListeners();
      }
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      // Unmute and start 2 full cycles from the start
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      soundPlayCountRef.current = 0;
      lastCycleTimeRef.current = Date.now();
      setMuted(false);
      setWaitingForGesture(false);
      void video.play().catch(() => {
        video.muted = true;
        setMuted(true);
      });
    } else {
      // Mute audio
      video.muted = true;
      setMuted(true);
      setWaitingForGesture(false);
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

  async function onLeadershipSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const get = (k: string) => String(formData.get(k) ?? "");

    setLeadershipSending(true);
    setLeadershipSent(null);
    try {
      const res = await sendFormEmail({
        data: {
          form: "enquiry",
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          subject: get("phone") || "Access Request",
          message: get("message"),
        },
      });
      if (!res.ok) throw new Error(res.error);
      form.reset();
      setLeadershipSent(true);
    } catch (err) {
      console.error("[welcome] Leadership inquiry failed:", err);
      setLeadershipSent(false);
    } finally {
      setLeadershipSending(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-x-hidden overflow-y-auto bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 bg-background" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-background/25" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-transparent to-background/60" />

      <header className="order-1 flex h-20 shrink-0 items-center justify-between gap-4 px-5 pt-3 sm:order-none sm:h-24 sm:px-10 sm:pt-4 lg:px-14">
        <BrandLogo className="w-48 sm:w-56 md:w-64 lg:w-72" />
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <TalkLiveButton />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleSound}
            aria-label={muted ? "Play introduction film with sound" : "Mute introduction film"}
            className={`rounded-full backdrop-blur-sm transition-all ${
              !muted
                ? "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/30 hover:bg-primary hover:text-primary-foreground"
                : "border-foreground/30 bg-background/30 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        </div>
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
        playsInline
        preload="auto"
        poster={mainVideoPoster.url}
        aria-label="Real Estate Forever introduction film"
        onClick={toggleSound}
        className="order-3 relative my-3 mx-auto w-[calc(100%-2.5rem)] max-w-md aspect-video cursor-pointer rounded-xl border border-primary/35 object-cover shadow-2xl shadow-black/80 sm:order-none sm:my-0 sm:mx-auto sm:w-full sm:h-full sm:size-full sm:max-w-none sm:cursor-default sm:aspect-auto sm:rounded-none sm:border-0 sm:shadow-none sm:absolute sm:inset-0 sm:-z-20 sm:object-contain sm:object-center sm:pointer-events-none"
      >
        <source src={mainVideo.url} type="video/mp4" />
        <source src={mainVideoWebm.url} type="video/webm" />
      </video>

      {/* Section with Login / Leadership Switcher Box */}
      <section className="order-4 flex flex-1 items-center justify-center px-4 py-4 sm:order-none sm:py-8 md:py-10">
        <div className="reveal-up flex w-full max-w-4xl flex-col items-center text-center">
          {/* Desktop Heading */}
          <h1 className="hidden max-w-3xl text-balance font-display text-2xl sm:block sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-[1.15] md:leading-[1.1] tracking-[-0.01em]">
            BUY MORE REAL ESTATE.<br className="block" /> THEY DO NOT MAKE MORE IT.
          </h1>

          <div
            className={`access-gold-frame mt-2 w-full transition-all duration-300 ${
              activeTab === "leadership" ? "max-w-[560px]" : "max-w-[440px]"
            } rounded-lg border-2 border-primary bg-background/80 p-5 sm:p-7 backdrop-blur-md sm:mt-6`}
          >
            {/* Top Luxury Switcher Tabs */}
            <div className="mx-auto mb-5 flex w-full max-w-[380px] items-center rounded-full border border-primary/35 bg-black/80 p-1 shadow-inner backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("password");
                  setLeadershipSent(null);
                }}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                  activeTab === "password"
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(190,149,67,0.55)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <LockKeyhole className="size-3 sm:size-3.5" />
                <span>Private Access</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("leadership");
                  setError(false);
                }}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                  activeTab === "leadership"
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(190,149,67,0.55)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Mail className="size-3 sm:size-3.5" />
                <span>Message Leadership</span>
              </button>
            </div>

            {/* TAB 1: ENTER PASSWORD */}
            {activeTab === "password" && (
              <div>
                <div className="mx-auto mb-3 sm:mb-4 flex size-9 sm:size-10 items-center justify-center rounded-full border border-primary/45 bg-background/40 text-primary">
                  <LockKeyhole className="size-3.5 sm:size-4" />
                </div>
                <p className="text-[11px] sm:text-[13px] font-medium uppercase text-primary tracking-wider">
                  EXCLUSIVE & PRIVATE ACCESS ONLY
                </p>
                <form onSubmit={onSubmit} className="mt-4 sm:mt-5" noValidate autoComplete="off">
                  <label htmlFor="access-code" className="mb-2 block text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/80">
                    ENTER PASSWORD
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 min-w-0">
                      <KeyRound
                        aria-hidden
                        className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 size-4 -translate-y-1/2 text-primary/70"
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
                        className={`h-12 sm:h-14 w-full min-w-0 rounded-full border bg-background/50 pl-10 sm:pl-11 pr-3 sm:pr-4 text-base sm:text-[13px] tracking-[0.2em] sm:tracking-[0.25em] text-foreground transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 ${error ? "border-destructive/60" : "border-foreground/25 hover:border-foreground/45"}`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-label="Enter site"
                      className="access-arrow-btn group relative size-12 sm:size-14 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary/55 text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-primary/80 active:scale-90 disabled:opacity-70"
                    >
                      <span
                        aria-hidden
                        className="access-arrow-ring absolute -inset-1 sm:-inset-1.5 rounded-full border border-primary/40 transition-[border-color,inset] duration-300 group-hover:-inset-1.5 sm:group-hover:-inset-2 group-hover:border-primary/90"
                      />
                      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute -left-1/2 inset-y-0 w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
                      </span>
                      <ArrowRight className="relative mx-auto size-4.5 sm:size-5 transition-transform duration-300 group-hover:translate-x-1 sm:group-hover:translate-x-1.5" />
                    </button>
                  </div>
                  <p
                    id="password-error"
                    aria-live="polite"
                    className={`mt-2 min-h-5 text-left text-[12px] ${error ? "text-destructive" : "text-transparent"}`}
                  >
                    {error ? "Authentication failed. Please try again." : ""}
                  </p>
                </form>

                <div className="mt-2 pt-3 border-t border-primary/15 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("leadership")}
                    className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    Need an invitation code? <span className="text-primary font-semibold">Message Leadership →</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MESSAGE LEADERSHIP FORM */}
            {activeTab === "leadership" && (
              <div>
                <div className="mx-auto mb-2 flex size-9 sm:size-10 items-center justify-center rounded-full border border-primary/45 bg-background/40 text-primary">
                  <Mail className="size-3.5 sm:size-4" />
                </div>
                <p className="text-[11px] sm:text-[13px] font-medium uppercase text-primary tracking-wider">
                  DIRECT ACCESS TO LEADERSHIP
                </p>
                <p className="mt-1 text-[11px] sm:text-[12px] text-muted-foreground">
                  Submit your criteria below for invitation & private access.
                </p>

                <form onSubmit={onLeadershipSubmit} className="mt-4 text-left" noValidate>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <label className="enquiry-field group relative block">
                      <span className="mb-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-focus-within:text-primary">
                        <span>FULL NAME</span>
                        <span className="text-primary font-bold text-sm leading-none" aria-label="required">*</span>
                      </span>
                      <input
                        name="name"
                        type="text"
                        required
                        className="peer w-full border-b border-primary/45 bg-transparent py-2 text-[14px] sm:text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                      />
                    </label>

                    <label className="enquiry-field group relative block">
                      <span className="mb-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-focus-within:text-primary">
                        <span>EMAIL</span>
                        <span className="text-primary font-bold text-sm leading-none" aria-label="required">*</span>
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        className="peer w-full border-b border-primary/45 bg-transparent py-2 text-[14px] sm:text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                      />
                    </label>

                    <label className="enquiry-field group relative block sm:col-span-2">
                      <span className="mb-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-focus-within:text-primary">
                        <span>CELL PHONE</span>
                        <span className="text-primary font-bold text-sm leading-none" aria-label="required">*</span>
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="(555) 000-0000"
                        className="peer w-full border-b border-primary/45 bg-transparent py-2 text-[14px] sm:text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent placeholder:text-muted-foreground/35"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                      />
                    </label>

                    <label className="enquiry-field group relative block sm:col-span-2">
                      <span className="mb-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-focus-within:text-primary">
                        <span>DIRECT MESSAGE TO LEADERSHIP</span>
                        <span className="text-primary font-bold text-sm leading-none" aria-label="required">*</span>
                      </span>
                      <textarea
                        name="message"
                        required
                        rows={3}
                        className="peer w-full resize-none border-b border-primary/45 bg-transparent py-2 text-[14px] sm:text-base text-foreground outline-none transition-colors duration-300 focus:border-transparent"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-transform duration-500 ease-out peer-focus:scale-x-100"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={leadershipSending}
                    className="leadership-submit-btn group mt-5 relative flex h-13 sm:h-14 w-full items-center justify-between rounded-lg px-6 text-[#0d0d0f] transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="leadership-btn-shimmer" aria-hidden="true" />
                    <span className="font-sans text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#0d0d0f] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                      {leadershipSending ? "SENDING..." : "SUBMIT TO LEADERSHIP"}
                    </span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-[#f3d078] border border-[#f3d078]/60 shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-black group-hover:text-white group-hover:border-white">
                      <ArrowRight className="size-4 stroke-[2.75] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>

                  {leadershipSent === true && (
                    <div className="mt-3 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-[12px] text-emerald-400">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                      <span>Your message has been sent directly to leadership. We will follow up shortly.</span>
                    </div>
                  )}

                  {leadershipSent === false && (
                    <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-[12px] text-destructive">
                      Transmission failed. Please try again or email Info@RealEstateForever.com directly.
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-primary/15 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab("password")}
                      className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      Already have an access code? <span className="text-primary font-semibold">Enter Password →</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
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

      {waitingForGesture && (
        <button
          type="button"
          onClick={toggleSound}
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full border border-primary/60 bg-background/90 px-5 py-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-primary shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground active:scale-95 animate-pulse"
          aria-label="Click anywhere to enable soundtrack"
        >
          <Volume2 className="size-4 animate-bounce" />
          <span>Click anywhere for sound</span>
        </button>
      )}
    </main>
  );
}
