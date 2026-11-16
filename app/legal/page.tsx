import Link from "next/link";
import Footer from "../footer";

export const metadata = {
  title: "Legal Notice | Antifascist Logo Generator",
  description:
    "Publisher, hosting provider and content reporting information for the Antifascist Logo Generator.",
  alternates: {
    canonical: "https://antifalogogenerator.noandelatouche.dev/legal",
  },
};

export default function LegalNotice() {
  return (
    <main className="w-full max-w-3xl py-4 sm:py-8">
      <div className="panel cgu">
        <h1 className="text-2xl font-bold text-red">Legal Notice</h1>

        <h2>Publisher and director of publication</h2>
        <p>
          Noan Delatouche
          <br />
          Email:{" "}
          <a
            className="text-red hover:text-red-300"
            href="mailto:delatouchenoan@gmail.com"
          >
            delatouchenoan@gmail.com
          </a>
        </p>

        <h2>Hosting</h2>
        <p>
          The site is self-hosted by its publisher. Traffic is routed through
          Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United
          States.
        </p>

        <h2>Reporting illegal content</h2>
        <p>
          To report illegal content in the community gallery, follow the
          procedure in section 6.6 of the{" "}
          <Link className="text-red hover:text-red-300" href="/cgu">
            Terms of Service
          </Link>
          .
        </p>

        <p className="page-links">
          <Link className="text-red hover:text-red-300" href="/cgu">
            Terms of Service
          </Link>
          {" · "}
          <Link className="text-red hover:text-red-300" href="/privacy">
            Privacy Policy
          </Link>
        </p>

        <p className="back-link">
          <Link className="text-red hover:text-red-300" href="/">
            ← Back to the generator
          </Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}
