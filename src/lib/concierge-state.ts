import { useSyncExternalStore } from "react";

let isOpen = false;
const listeners = new Set<() => void>();

export const conciergeStore = {
  getIsOpen: () => isOpen,
  open: () => {
    isOpen = true;
    listeners.forEach((l) => l());
  },
  close: () => {
    isOpen = false;
    listeners.forEach((l) => l());
  },
  toggle: () => {
    isOpen = !isOpen;
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useConciergeOpen() {
  return useSyncExternalStore(conciergeStore.subscribe, conciergeStore.getIsOpen, () => false);
}
