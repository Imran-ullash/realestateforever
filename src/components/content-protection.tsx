import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

/**
 * ContentProtection provides comprehensive client-side security to safeguard
 * proprietary property photography, videos, and private listing figures:
 *
 * 1. Blocks right-click context menu (Save Image As, Inspect, Copy)
 * 2. Prevents image/media dragging onto desktop or tabs
 * 3. Disables text selection and copying outside interactive inputs/textareas
 * 4. Blocks inspection & saving hotkeys (F12, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+Shift+I/J/C)
 * 5. Clears clipboard on PrintScreen attempts
 * 6. Displays a luxury branded security toast when protection is triggered
 */
export function ContentProtection() {
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (message = "Private Portfolio · Content & Media Protected") => {
    setNotice(message);
  };

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInputField = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || target.isContentEditable;
    };

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showNotice("Protected Portfolio · Right-click is disabled");
    };

    // 2. Disable Dragging of Images, Videos, and Links
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Disable Copy/Cut outside of form inputs
    const handleCopy = (e: ClipboardEvent) => {
      if (!isInputField(e.target)) {
        e.preventDefault();
        showNotice("Protected Content · Copying is disabled");
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!isInputField(e.target)) {
        e.preventDefault();
        showNotice("Protected Content · Cutting is disabled");
      }
    };

    // 4. Disable Selectstart outside form inputs
    const handleSelectStart = (e: Event) => {
      if (!isInputField(e.target)) {
        e.preventDefault();
      }
    };

    // 5. Block Keyboard Shortcuts (DevTools, Source, Print, Save, Copy outside inputs)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = isInputField(e.target);
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // F12 or DevTools shortcuts (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === "F12" ||
        (isCtrlOrCmd && e.shiftKey && (key === "i" || key === "j" || key === "c"))
      ) {
        e.preventDefault();
        showNotice("Security Lock · Developer inspection disabled");
        return;
      }

      // View Source (Ctrl+U)
      if (isCtrlOrCmd && key === "u") {
        e.preventDefault();
        showNotice("Security Lock · Source view disabled");
        return;
      }

      // Save Page (Ctrl+S)
      if (isCtrlOrCmd && key === "s") {
        e.preventDefault();
        showNotice("Security Lock · Page saving disabled");
        return;
      }

      // Print (Ctrl+P)
      if (isCtrlOrCmd && key === "p") {
        e.preventDefault();
        showNotice("Security Lock · Printing disabled");
        return;
      }

      // Copy / Cut outside input
      if (isCtrlOrCmd && (key === "c" || key === "x") && !isInput) {
        e.preventDefault();
        showNotice("Protected Content · Copying is disabled");
        return;
      }

      // PrintScreen attempt
      if (e.key === "PrintScreen") {
        showNotice("Security Lock · Screenshots restricted");
        try {
          if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText("");
          }
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("copy", handleCopy, { capture: true });
    window.addEventListener("cut", handleCut, { capture: true });
    window.addEventListener("selectstart", handleSelectStart, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("copy", handleCopy, { capture: true });
      window.removeEventListener("cut", handleCut, { capture: true });
      window.removeEventListener("selectstart", handleSelectStart, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  if (!notice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none select-none"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-primary/60 bg-black/90 px-4 py-2 text-xs font-semibold tracking-wide text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(190,149,67,0.35)] backdrop-blur-xl">
        <ShieldAlert className="size-4 text-primary shrink-0 animate-pulse" />
        <span className="text-foreground/90 font-sans">{notice}</span>
      </div>
    </div>
  );
}
