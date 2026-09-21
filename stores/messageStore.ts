import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageState {
  hydrated: boolean;
  dismissedMessage: string | null;
  dismiss: (message: string) => void;
  reset: () => void;
  hydrate: () => void;
}

export const messageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      dismissedMessage: null,
      dismiss: (message) => {
        console.log("[Store] dismiss:", message);
        set({ dismissedMessage: message });
      },
      reset: () => {
        console.log("[Store] reset");
        set({ dismissedMessage: null });
      },
      hydrate: () => {
        if (get().hydrated) {
          console.log("[Store] hydrate: already hydrated, skipping");
          return;
        }
        try {
          const raw = localStorage.getItem("message-dismissed");
          console.log("[Store] hydrate: localStorage raw:", raw);
          if (raw) {
            const parsed = JSON.parse(raw);
            console.log("[Store] hydrate: parsed:", parsed);
            set({
              hydrated: true,
              dismissedMessage: parsed.state?.dismissedMessage ?? null,
            });
          } else {
            console.log("[Store] hydrate: no localStorage entry");
            set({ hydrated: true });
          }
        } catch (e) {
          console.log("[Store] hydrate: error:", e);
          set({ hydrated: true });
        }
        console.log("[Store] hydrate: final state:", get());
      },
    }),
    {
      name: "message-dismissed",
      skipHydration: true,
    },
  ),
);
