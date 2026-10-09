import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import aboutOffice from "@/assets/about-office.png";
import aboutOfficeSlide1 from "@/assets/about-office-slide-1.jpg";
import aboutOfficeSlide2 from "@/assets/about-office-slide-2.jpg";
import aboutOfficeSlide3 from "@/assets/about-office-slide-3.jpg";

const SLIDES = [
  {
    src: aboutOffice,
    alt: "UNIQQ Real Estate executive boardroom",
    title: "Executive Boardroom",
  },
  {
    src: aboutOfficeSlide1,
    alt: "UNIQQ Real Estate oceanview luxury lounge",
    title: "Oceanfront Lounge",
  },
  {
    src: aboutOfficeSlide2,
    alt: "UNIQQ Real Estate sunset ocean reception",
    title: "Sunset Reception",
  },
  {
    src: aboutOfficeSlide3,
    alt: "UNIQQ Real Estate panoramic coastal lobby",
    title: "Coastal Panorama Lobby",
  },
];

export function AboutImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      touchStartX.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      touchEndX.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  return (
    <div
      role="region"
      aria-label="About Us gallery slider"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="group relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-xl border border-primary/25 bg-black/60 shadow-2xl shadow-black/80 ring-1 ring-white/5 select-none focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {/* Slides */}
      <div className="relative size-full overflow-hidden">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              aria-hidden={!isActive}
              className={`absolute inset-0 size-full transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 scale-100 z-10 pointer-events-auto"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                loading={index === 0 ? "eager" : "lazy"}
                className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
              />
            </div>
          );
        })}
      </div>

      {/* Slide index counter badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-medium tracking-widest text-foreground/80 backdrop-blur-md border border-white/10 shadow-lg">
        <span className="text-primary font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
        <span className="text-muted-foreground/60">/</span>
        <span>{String(SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* Previous button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous slide"
        className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/55 text-foreground/90 backdrop-blur-md border border-white/15 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-black/85 hover:text-primary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <ChevronLeft className="size-5 sm:size-5" />
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next slide"
        className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/55 text-foreground/90 backdrop-blur-md border border-white/15 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-black/85 hover:text-primary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <ChevronRight className="size-5 sm:size-5" />
      </button>

      {/* Pagination indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-lg">
        {SLIDES.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? "w-6 sm:w-7 bg-primary shadow-[0_0_10px_rgba(190,149,67,0.85)]"
                  : "w-1.5 sm:w-2 bg-white/35 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
