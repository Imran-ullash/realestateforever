import brandLogo from "@/assets/real-estate-forever-logo.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={brandLogo}
      alt="Real Estate Forever"
      className={cn("h-auto w-52 object-contain sm:w-64", className)}
    />
  );
}