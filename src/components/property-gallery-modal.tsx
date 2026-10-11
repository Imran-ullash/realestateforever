import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Video, X } from "lucide-react";
import type { Listing } from "@/data/listings";

interface PropertyGalleryModalProps {
  listing: Listing | null;
  initialIndex?: number;
  onClose: () => void;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  label: string;
}

export function PropertyGalleryModal({ listing, initialIndex = 0, onClose }: PropertyGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, listing]);

  const mediaItems: MediaItem[] = [];
  if (listing) {
    const imgs = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
    imgs.forEach((url, i) => {
      mediaItems.push({ type: "image", url, label: `Photo ${i + 1}` });
    });
    if (listing.videos && listing.videos.length > 0) {
      listing.videos.forEach((url, i) => {
        mediaItems.push({ type: "video", url, label: `Video ${i + 1}` });
      });
    }
  }

  useEffect(() => {
    if (!listing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listing, mediaItems.length, onClose]);

  if (!listing) return null;
  const currentMedia = mediaItems[currentIndex] ?? mediaItems[0];
  if (!currentMedia) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${listing.city}, ${listing.state} media gallery`}
      className="fixed inset-0 z-[1000] flex flex-col justify-between bg-black/95 backdrop-blur-md animate-in fade-in-0 duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4 border-b border-primary/20 bg-black/60">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-foreground font-normal">
            {listing.city}, {listing.state} {listing.zip}
          </h2>
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
            {listing.beds && <span>{listing.beds} Beds</span>}
            {listing.baths && <span>· {listing.baths} Baths</span>}
            {listing.area && <span>· {listing.area} sq ft</span>}
            {listing.lister && <span className="text-primary font-semibold">· {listing.lister}</span>}
            <span className="text-primary/70 font-medium">
              ({currentMedia.type === "video" ? "🎥 Video Walkthrough" : "📷 Photo"})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono tracking-widest text-primary/80">
            {currentIndex + 1} / {mediaItems.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="flex size-10 items-center justify-center rounded-full border border-primary/30 text-foreground transition-colors hover:border-primary hover:bg-primary/20 hover:text-primary"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Stage with Nav Buttons */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-3 sm:px-12 sm:py-6 overflow-hidden">
        {mediaItems.length > 1 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))}
            aria-label="Previous media"
            className="absolute left-3 sm:left-6 z-20 flex size-12 items-center justify-center rounded-full border border-primary/40 bg-black/70 text-foreground shadow-2xl backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        <div className="relative max-h-[72vh] max-w-5xl overflow-hidden rounded-xl border border-primary/30 shadow-2xl shadow-black bg-black flex items-center justify-center">
          {currentMedia.type === "video" ? (
            <video
              key={currentMedia.url}
              src={currentMedia.url}
              controls
              playsInline
              autoPlay
              className="max-h-[72vh] w-auto max-w-full rounded-lg"
            />
          ) : (
            <img
              src={currentMedia.url}
              alt={`${listing.city}, ${listing.state} - ${currentMedia.label}`}
              className="max-h-[72vh] w-auto object-contain transition-opacity duration-300"
            />
          )}
        </div>

        {mediaItems.length > 1 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))}
            aria-label="Next media"
            className="absolute right-3 sm:right-6 z-20 flex size-12 items-center justify-center rounded-full border border-primary/40 bg-black/70 text-foreground shadow-2xl backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-primary/20 bg-black/60 overflow-x-auto">
          {mediaItems.map((item, idx) => (
            <button
              key={`${item.url}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`View ${item.label}`}
              className={`relative size-14 sm:size-18 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                currentIndex === idx
                  ? "border-primary shadow-lg shadow-primary/40 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex size-full flex-col items-center justify-center bg-black/90 p-1 text-primary">
                  <Play className="size-5 fill-primary text-primary" />
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">Video</span>
                </div>
              ) : (
                <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="size-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
