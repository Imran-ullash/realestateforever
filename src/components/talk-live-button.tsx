import { conciergeStore, useConciergeOpen } from "@/lib/concierge-state";
import talkLiveLogo from "@/assets/talk-live-logo.png";

export function TalkLiveButton({
  className = "",
  compact = false,
  onClick,
}: {
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  const isOpen = useConciergeOpen();

  const handleClick = () => {
    conciergeStore.toggle();
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Talk To Us Live Concierge"
      aria-expanded={isOpen}
      className={`group relative flex items-center shrink-0 rounded-full border border-primary/40 bg-gradient-to-b from-[#1c1914] via-[#0d0d0f] to-[#14120e] text-foreground backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-primary/80 active:scale-95 ${
        compact
          ? "h-7.5 px-2.5 gap-1.5"
          : "h-7.5 lg:h-7.5 xl:h-8 2xl:h-8.5 px-2.5 lg:px-2.5 xl:px-3 2xl:px-3.5 gap-1.5 xl:gap-2"
      } ${className}`}
    >
      {/* Continuous Traveling Gold Border Beam (exact same orbiting beam as inventory cards, always running) */}
      <span className="talk-live-border-beam" aria-hidden="true" />

      {/* Logo icon */}
      <div className="relative flex size-4 xl:size-4.5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-primary/50 bg-black/90 shadow-inner">
        <img
          src={talkLiveLogo}
          alt="Talk To Us Live"
          className="size-3 xl:size-3.5 object-contain"
        />
      </div>

      {/* Text with metallic sheen */}
      <span className="font-sans text-[9.5px] lg:text-[9.5px] xl:text-[10px] 2xl:text-[11px] font-extrabold uppercase tracking-[0.11em] xl:tracking-[0.12em] text-foreground transition-colors group-hover:text-primary whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        TALK TO US LIVE
      </span>

      {/* Glowing live status dot */}
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-90" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
      </span>
    </button>
  );
}
