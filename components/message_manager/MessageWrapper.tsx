"use client";

import { useCallback, useEffect } from "react";
import { useStore } from "zustand";
import { messageStore } from "@/stores/messageStore";

export default function MessageWrapper({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("[Wrapper] useEffect: calling hydrate()");
    messageStore.getState().hydrate();
  }, []);

  const hydrated = useStore(messageStore, (s) => s.hydrated);
  const dismissed = useStore(messageStore, (s) => s.dismissedMessage);
  const isDismissed = dismissed === message;

  console.log("[Wrapper] render:", {
    message,
    hydrated,
    dismissed,
    isDismissed,
  });

  const handleDismiss = useCallback(() => {
    messageStore.getState().dismiss(message);
  }, [message]);

  if (!hydrated || isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative -mt-8 -mx-8 mb-4 border-b border-black/30  bg-red text-white [@media(max-width:900px)]:-mt-4 [@media(max-width:900px)]:-mx-4"
    >
      <div className="relative mx-auto flex w-full max-w-275 items-center justify-center px-12 py-3 text-center">
        <div className="min-w-0 flex-1 text-sm font-semibold tracking-wide text-white">
          {children}
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleDismiss()}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-white/80 transition-colors hover:bg-black/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-3.5 w-3.5"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}
