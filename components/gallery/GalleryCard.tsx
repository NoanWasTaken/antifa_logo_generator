"use client";

import { useCallback, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import {
  rasterizeSvg,
  triggerDownload,
  type DownloadFormat,
} from "@/lib/download";

export default function GalleryCard({
  id,
  downloads,
  name,
}: {
  id: number;
  downloads: number;
  name: string | null;
}) {
  const [count, setCount] = useState(downloads);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [imageReady, setImageReady] = useState(false);
  
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setImageReady(true);
  }, []);

  const handleDownload = async (format: DownloadFormat) => {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/gallery/${id}?download=1`);
      if (response.status === 429) {
        setError("Too many downloads. Try again in a minute.");
        return;
      }
      if (!response.ok) throw new Error("Could not load the logo");
      const svg = await response.text();
      const blob =
        format === "svg"
          ? new Blob([svg], { type: "image/svg+xml" })
          : await rasterizeSvg(svg, format);
      triggerDownload(
        blob,
        `antifa_logo_${id}.${format === "jpeg" ? "jpg" : format}`,
      );
      setCount((current) => current + 1);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Download failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-half-darkgrey bg-darkgrey">
      <div className="relative aspect-square bg-white p-4">
        <img
          ref={imageRef}
          src={`/api/gallery/${id}`}
          alt={
            name
              ? `${name} - community antifascist logo`
              : `Community antifascist logo #${id}`
          }
          width={1024}
          height={1024}
          loading="lazy"
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
          className={`h-full w-full object-contain transition-opacity ${
            imageReady ? "opacity-100" : "opacity-0"
          }`}
        />
        {(pending || !imageReady) && (
          <div
            aria-hidden={pending ? undefined : true}
            className="absolute inset-0 flex items-center justify-center bg-white/80"
          >
            <Loader2
              className="size-7 animate-spin text-[#aaa]"
              aria-hidden="true"
            />
            {pending && <span className="sr-only">Preparing download…</span>}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span
            className="truncate font-semibold text-white"
            title={name ?? undefined}
          >
            {name ?? `Logo #${id}`}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[#aaa]">
            <Download className="size-4" aria-hidden="true" />
            {count} {count === 1 ? "download" : "downloads"}
          </span>
        </div>
        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="actions mt-auto">
          <div className="download-split">
            <button
              type="button"
              className="btn-primary"
              disabled={pending}
              onClick={() => handleDownload("png")}
            >
              {pending ? "Preparing…" : "Download PNG"}
            </button>
            <Menu.Root>
              <Menu.Trigger
                className="btn-primary split-trigger"
                aria-label={`Choose download format for logo #${id}`}
                disabled={pending}
              >
                <ChevronDown className="size-4" />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner
                  align="end"
                  sideOffset={4}
                  className="isolate z-50 outline-none"
                >
                  <Menu.Popup className="min-w-36 rounded-lg bg-[#222] p-1 text-sm text-foreground shadow-md ring-1 ring-white/10 outline-none">
                    {(["png", "svg", "jpeg"] as const).map((format) => (
                      <Menu.Item
                        key={format}
                        onClick={() => handleDownload(format)}
                        className="cursor-pointer rounded-md px-3 py-2 outline-none select-none data-highlighted:bg-[#333]"
                      >
                        {format.toUpperCase()}
                      </Menu.Item>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </div>
      </div>
    </article>
  );
}
