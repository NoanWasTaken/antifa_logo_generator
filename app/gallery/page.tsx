import Link from "next/link";
import { ImageOff } from "lucide-react";
import Footer from "../footer";
import GalleryCard from "@/components/gallery/GalleryCard";
import {
  getAcceptedLogoCount,
  getAcceptedLogos,
  type GallerySort,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community logo gallery | Antifascist Logo Generator",
  description:
    "Browse accepted antifascist logos made by the community. Download any logo as PNG, SVG or JPEG.",
  alternates: {
    canonical: "https://antifalogogenerator.noandelatouche.dev/gallery",
  },
};

const PAGE_SIZE = 24;

const SORTS: { value: GallerySort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most downloaded" },
];

function parseSort(value: string | string[] | undefined): GallerySort {
  return value === "popular" ? "popular" : "newest";
}

function galleryHref(sort: GallerySort, page: number, search?: string): string {
  const params = new URLSearchParams();
  if (sort === "popular") params.set("sort", "popular");
  if (search) params.set("q", search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/gallery?${query}` : "/gallery";
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const sort = parseSort(params.sort);
  const rawSearch = Array.isArray(params.q) ? params.q[0] : params.q;
  const search = rawSearch?.trim().slice(0, 60) ?? "";
  const total = getAcceptedLogoCount(search || undefined);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number(params.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, pageCount)
      : 1;
  const logos = getAcceptedLogos(
    sort,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE,
    search || undefined,
  );

  return (
    <main className="w-full max-w-6xl py-4 sm:py-8">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Logo gallery
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#aaa]">
              Logos accepted from community submissions. Download any of them as
              PNG, SVG or JPEG.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-grey">
            <span>
              {total} {total === 1 ? "logo" : "logos"}
            </span>
            <Link
              href="/"
              className="font-semibold text-[#ccc] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create a logo →
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Sort logos" className="flex flex-wrap gap-6 text-sm">
            {SORTS.map((option) => {
              const active = option.value === sort;
              return (
                <Link
                  key={option.value}
                  href={galleryHref(option.value, 1, search || undefined)}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 pb-0.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active
                      ? "border-red text-white"
                      : "border-transparent text-grey hover:text-white"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </nav>

          <form
            action="/gallery"
            className="flex w-full items-center gap-2 sm:w-72"
          >
            {sort === "popular" && (
              <input type="hidden" name="sort" value="popular" />
            )}
            <label htmlFor="gallery-search" className="sr-only">
              Search logos by name
            </label>
            <input
              id="gallery-search"
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search by name"
              maxLength={60}
              className="flex-1"
            />
            <button
              type="submit"
              className="min-h-9 rounded-md bg-[#333] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Search
            </button>
          </form>
        </div>

        {total === 0 ? (
          <section className="rounded-xl border border-dashed border-half-darkgrey bg-darkgrey/60 px-6 py-16 text-center">
            <ImageOff
              className="mx-auto mb-4 size-10 text-grey"
              aria-hidden="true"
            />
            {search ? (
              <>
                <h2 className="text-lg font-bold text-white">
                  No logos named “{search}”
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#aaa]">
                  Try another word, or browse every logo in the gallery.
                </p>
                <Link
                  href={galleryHref(sort, 1)}
                  className="mt-5 inline-flex min-h-11 items-center font-semibold text-[#ccc] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Clear search
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">
                  No logos in the gallery yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#aaa]">
                  Accepted community submissions will appear here. Be the first
                  to share one.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex min-h-11 items-center rounded-md bg-red px-4 text-sm font-semibold text-white transition-colors hover:bg-[#aa0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Create a logo
                </Link>
              </>
            )}
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {logos.map((logo) => (
              <li key={logo.id}>
                <GalleryCard
                  id={logo.id}
                  downloads={logo.downloads}
                  name={logo.name}
                />
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav
            aria-label="Gallery pages"
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            {page > 1 ? (
              <Link
                href={galleryHref(sort, page - 1, search || undefined)}
                className="inline-flex min-h-11 items-center font-semibold text-[#ccc] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                ← Previous
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center text-[#555]">
                ← Previous
              </span>
            )}
            <span className="text-[#888]">
              Page {page} of {pageCount}
            </span>
            {page < pageCount ? (
              <Link
                href={galleryHref(sort, page + 1, search || undefined)}
                className="inline-flex min-h-11 items-center font-semibold text-[#ccc] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Next →
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center text-[#555]">
                Next →
              </span>
            )}
          </nav>
        )}

        <Footer />
      </div>
    </main>
  );
}
