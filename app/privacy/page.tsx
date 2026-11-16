import Link from "next/link";
import Footer from "../footer";

export const metadata = {
  title: "Privacy Policy | Antifascist Logo Generator",
  description:
    "What data the Antifascist Logo Generator processes, why, how long it is kept, and your rights.",
  alternates: {
    canonical: "https://antifalogogenerator.noandelatouche.dev/privacy",
  },
};

export default function Privacy() {
  return (
    <main className="w-full max-w-3xl py-4 sm:py-8">
      <div className="panel cgu">
        <h1 className="text-2xl font-bold text-red">Privacy Policy</h1>
        <p className="meta">Last updated: November 16, 2026</p>

        <h2>1. Who is responsible</h2>
        <p>
          The data controller is Noan Delatouche, reachable at{" "}
          <a
            className="text-red hover:text-red-300"
            href="mailto:delatouchenoan@gmail.com"
          >
            delatouchenoan@gmail.com
          </a>
          .
        </p>

        <h2>2. What data we process</h2>
        <h3>When you visit the site</h3>
        <p>
          As on any website, our infrastructure (Cloudflare and our reverse
          proxy) processes technical data such as your IP address, browser type,
          requested page and time of the request in server logs, in order to
          deliver and secure the site.
        </p>

        <h3>When you use the generator</h3>
        <p>
          Your logo, and any image you upload, stay in your browser and are
          never sent to our servers.
        </p>

        <h3>When you submit a logo to the gallery</h3>
        <ul>
          <li>the SVG file you submit;</li>
          <li>your IP address and the date and time of the submission;</li>
          <li>
            the version of the Terms of Service you accepted, and when you
            accepted it.
          </li>
        </ul>

        <h3>When you report content</h3>
        <p>
          If you email us a report, we process your email address and the
          information you provide in it.
        </p>

        <h3>Ko-fi donation button</h3>
        <p>
          The footer displays a Ko-fi donation button whose image is served by
          storage.ko-fi.com. Loading the image sends your IP address and browser
          details to Ko-fi’s CDN. If you click the button, you leave our site and
          Ko-fi’s own terms and privacy policy apply. We do not receive your
          payment details.
        </p>

        <h2>3. Why we process it, and on what basis</h2>
        <ul>
          <li>Delivering and securing the site: legitimate interest.</li>
          <li>
            Moderating submissions, preventing abuse and handling reports:
            legitimate interest.
          </li>
          <li>
            Keeping proof that you accepted the Terms, and data that allows the
            author of a hosted content to be identified if a judicial authority
            requires it: legal obligation and legitimate interest.
          </li>
        </ul>

        <h2>4. How long we keep it</h2>
        <p>
          We keep this information for an indefinite duration, to the extent
          permitted by law. Published logos stay in the gallery until we remove
          them.
        </p>

        <h2>5. Who receives it</h2>
        <p>
          Cloudflare, Inc. routes the site’s traffic on our behalf. The site is
          hosted on our own server, which processes the data needed to run it.
          Ko-fi serves the donation button image. We do not sell your data and
          do not use it for advertising. We may disclose data to authorities
          when the law requires it.
        </p>
        <p>
          Cloudflare, Inc. is based in the United States. Transfers of data
          outside the European Union rely on the safeguards Cloudflare puts in
          place for such transfers (for example the EU–US Data Privacy
          Framework or standard contractual clauses).
        </p>

        <h2>6. Published logos are public</h2>
        <p>
          Once a logo is published in the gallery, anyone can view and download
          it, and use it under CC0. We do not publish your IP address or any
          information about who submitted it. Do not include personal data in a
          logo you submit.
        </p>

        <h2>7. Cookies</h2>
        <p>
          The application sets no advertising, analytics or tracking cookies.
          Cloudflare may set strictly necessary security cookies as part of
          routing and protecting the site. The Ko-fi button is a static image
          and sets no cookie. We do not use any analytics service.
        </p>

        <h2>8. Your rights</h2>
        <p>
          You can ask for access to your data, its correction or deletion, a
          restriction of its processing, or object to it, by emailing{" "}
          <a
            className="text-red hover:text-red-300"
            href="mailto:delatouchenoan@gmail.com"
          >
            delatouchenoan@gmail.com
          </a>
          . We answer within one month. Because gallery submissions are
          anonymous, please indicate the logo concerned and the approximate date
          and time of the submission so that we can find your data.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update this policy. The current version and its date are shown
          at the top of this page.
        </p>

        <p className="page-links">
          <Link className="text-red hover:text-red-300" href="/cgu">
            Terms of Service
          </Link>
          {" · "}
          <Link className="text-red hover:text-red-300" href="/legal">
            Legal Notice
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
