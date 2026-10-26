import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Inbox, X } from "lucide-react";
import { isAdminRequest } from "@/lib/admin-auth";
import { getLogoCounts, getLogos, type LogoStatus } from "@/lib/db";
import { updateLogoStatus } from "./actions";
import DeleteLogoForm from "./DeleteLogoForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Logo moderation | Antifascist Logo Generator",
  robots: { index: false, follow: false },
};

const TABS: { status: LogoStatus; label: string }[] = [
  { status: "accepted", label: "Accepted" },
  { status: "waiting", label: "Waiting" },
  { status: "refused", label: "Refused" },
];

const STATUS_LABELS: Record<LogoStatus, string> = {
  accepted: "Accepted",
  waiting: "Waiting",
  refused: "Refused",
};

const STATUS_STYLES: Record<LogoStatus, string> = {
  accepted: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  waiting: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  refused: "border-red/40 bg-red/10 text-red-300",
};

const EMPTY_COPY: Record<LogoStatus, { title: string; body: string }> = {
  accepted: {
    title: "No accepted logos yet",
    body: "Logos you accept will appear here as the gallery.",
  },
  waiting: {
    title: "Nothing waiting for review",
    body: "New community submissions will appear here.",
  },
  refused: {
    title: "No refused logos",
    body: "Logos you turn down will stay here for reference.",
  },
};

function parseStatus(value: string | string[] | undefined): LogoStatus {
  return value === "waiting" || value === "refused" || value === "accepted"
    ? value
    : "accepted";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  if (!(await isAdminRequest())) notFound();

  const status = parseStatus((await searchParams).status);
  const logos = getLogos(status);
  const counts = getLogoCounts();
  const total = counts.accepted + counts.waiting + counts.refused;
  const empty =
    total === 0
      ? {
          title: "No logos yet",
          body: "Community submissions will appear here once someone shares a logo.",
        }
      : EMPTY_COPY[status];
  const otherTab: LogoStatus =
    TABS.map((tab) => tab.status).find(
      (tab) => tab !== status && counts[tab] > 0,
    ) ?? "waiting";

  return (
    <main className="w-full max-w-6xl py-4 sm:py-8">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Logo moderation
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#aaa]">
              Review community submissions and manage what appears in the public
              gallery.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-grey">
            <span>
              {total} {total === 1 ? "logo" : "logos"} total
            </span>
            <Link
              href="/"
              className="font-semibold text-[#ccc] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ← Generator
            </Link>
          </div>
        </header>

        <nav
          aria-label="Filter logos by status"
          className="flex flex-wrap gap-6 text-sm"
        >
          {TABS.map((tab) => {
            const active = tab.status === status;
            return (
              <Link
                key={tab.status}
                href={`/admin?status=${tab.status}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center border-b-2 pb-0.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  active
                    ? "border-red text-white"
                    : "border-transparent text-grey hover:text-white"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 font-normal text-[#888]">
                  {counts[tab.status]}
                </span>
              </Link>
            );
          })}
        </nav>

        {logos.length === 0 ? (
          <section className="rounded-xl border border-dashed border-half-darkgrey bg-darkgrey/60 px-6 py-16 text-center">
            <Inbox
              className="mx-auto mb-4 size-10 text-grey"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-white">{empty.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#aaa]">
              {empty.body}
            </p>
            {total === 0 ? (
              <Link
                href="/"
                className="mt-5 inline-flex min-h-11 items-center rounded-md bg-red px-4 text-sm font-semibold text-white transition-colors hover:bg-[#aa0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create a logo
              </Link>
            ) : (
              <Link
                href={`/admin?status=${otherTab}`}
                className="mt-5 inline-flex min-h-11 items-center rounded-md border border-half-darkgrey px-4 text-sm font-semibold text-white transition-colors hover:border-red-300 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View {otherTab} logos ({counts[otherTab]})
              </Link>
            )}
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {logos.map((logo) => (
              <li key={logo.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-half-darkgrey bg-darkgrey">
                  <div className="aspect-square bg-white p-5">
                    <img
                      src={`/api/admin/logo/${logo.id}`}
                      alt={logo.name ?? `Logo submission #${logo.id}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold text-white"
                          title={logo.name ?? undefined}
                        >
                          {logo.name ?? `Logo #${logo.id}`}
                        </p>
                        {logo.name && (
                          <p className="text-xs text-grey">#{logo.id}</p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[logo.status]}`}
                      >
                        {STATUS_LABELS[logo.status]}
                      </span>
                    </div>
                    <form
                      action={updateLogoStatus}
                      className="mt-auto flex flex-wrap gap-2"
                    >
                      <input type="hidden" name="id" value={logo.id} />
                      {logo.status !== "accepted" && (
                        <button
                          type="submit"
                          name="status"
                          value="accepted"
                          aria-label={`Accept logo #${logo.id}`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <Check className="size-4" aria-hidden="true" />
                          Accept
                        </button>
                      )}
                      {logo.status !== "refused" && (
                        <button
                          type="submit"
                          name="status"
                          value="refused"
                          aria-label={`Refuse logo #${logo.id}`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-red px-3 text-sm font-semibold text-white transition-colors hover:bg-[#aa0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <X className="size-4" aria-hidden="true" />
                          Refuse
                        </button>
                      )}
                      {logo.status !== "waiting" && (
                        <button
                          type="submit"
                          name="status"
                          value="waiting"
                          aria-label={`Move logo #${logo.id} back to waiting`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-half-darkgrey px-3 text-sm font-semibold text-[#ccc] transition-colors hover:border-grey hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <Clock className="size-4" aria-hidden="true" />
                          Waiting
                        </button>
                      )}
                    </form>
                    <DeleteLogoForm id={logo.id} />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
