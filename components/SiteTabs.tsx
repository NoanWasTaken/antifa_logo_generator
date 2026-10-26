"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Generator" },
  { href: "/gallery", label: "Gallery" },
];

export default function SiteTabs() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Sections"
      className="mb-6 flex w-full max-w-[1100px] justify-center gap-8 text-sm"
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-0.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              active
                ? "border-red text-white"
                : "border-transparent text-grey hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
