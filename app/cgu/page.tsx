import Link from "next/link";
import Footer from "../footer";
import { CC0_URL } from "@/lib/cc0";
import { TERMS_VERSION } from "@/lib/terms";

export const metadata = {
  title: "Terms of Service | Antifascist Logo Generator",
  description:
    "Rules for using the Antifascist Logo Generator and submitting logos to the community gallery.",
  alternates: {
    canonical: "https://antifalogogenerator.noandelatouche.dev/cgu",
  },
};

export default function CGU() {
  return (
    <main className="w-full max-w-3xl py-4 sm:py-8">
      <div className="panel cgu">
        <h1 className="text-2xl font-bold text-red">Terms of Service</h1>
        <p className="meta">
          Last updated: November 16, 2026 (version {TERMS_VERSION})
        </p>

        <h2>1. Service</h2>
        <p>
          The Antifascist Logo Generator is a free online tool that lets you
          create antifascist logos in SVG format. The tool is provided free of
          charge, with no guarantee of availability or uptime.
        </p>

        <h2>2. Copyright and public-domain dedication</h2>

        <h3>2.1 Tool assets and output</h3>
        <p>
          To the extent permitted by law, the publisher dedicates to the public
          domain, under the{" "}
          <a
            className="text-red hover:text-red-300"
            href={CC0_URL}
            target="_blank"
            rel="noopener"
          >
            CC0 1.0 Universal Public Domain Dedication
          </a>
          , every right the publisher may hold in the
          tool’s own assets (shapes, icons and templates) and in the output the
          tool generates from them. You can copy, modify, share, print and sell
          logos made with the tool, with no attribution and no permission
          required.
        </p>

        <h3>2.2 Your own logos</h3>
        <p>
          A public-domain dedication can only cover rights held by the person
          making it. The publisher cannot waive any copyright you may hold in a
          logo you create. The publisher claims no ownership over logos you
          create and waives any rights the publisher may hold in them. You are
          welcome, but not required, to release your own logos under CC0 as
          well.
        </p>

        <h3>2.3 No guarantee of uniqueness or originality</h3>
        <p>
          Logos are built from shared templates and may resemble other logos.
          The publisher does not guarantee that a logo is unique, original or
          free of third-party rights. You are responsible for checking that your
          use is lawful, particularly regarding trademarks and any image you
          upload.
        </p>

        <h3>2.4 Third-party rights</h3>
        <p>
          CC0 does not override third-party rights, trademarks, personality
          rights or applicable law. Nothing in these Terms transfers rights the
          publisher does not hold.
        </p>

        <h2>3. Prohibited use</h2>
        <p>
          These rules govern the use of the service, including submissions to
          the gallery. They are not conditions of the CC0 dedication in section
          2, which is unconditional. You may not use the service to:
        </p>
        <ul>
          <li>
            submit or promote fascist, racist, xenophobic, antisemitic or
            otherwise discriminatory content, or content that glorifies crimes
            or violence;
          </li>
          <li>
            harm the antifascist cause or its organizations, or impersonate any
            antifascist group, organization or individual;
          </li>
          <li>
            infringe the rights of third parties (copyright, trademarks, image
            rights, privacy);
          </li>
          <li>defame, harass or threaten anyone;</li>
          <li>publish unlawful content or otherwise violate applicable law.</li>
        </ul>
        <p>
          As a request, and not as a condition of the CC0 license, we ask you
          not to use logos made with this tool to promote fascism, racism,
          xenophobia, antisemitism or any other form of discrimination.
        </p>
        <p>
          CC0 does not override third-party rights, trademarks or applicable
          law.
        </p>

        <h2>4. Uploaded images and data</h2>
        <p>
          Images you upload into the tool stay on your device and are not
          transmitted to any server, unless you choose to submit a logo to the
          community gallery (see section 6). You are solely responsible for the
          content you import.
        </p>
        <p>
          Submitting a logo to the gallery sends the SVG file to our servers,
          along with your IP address, the date and time of the submission, the
          version of these Terms you accepted, and when you accepted it. See the{" "}
          <Link className="text-red hover:text-red-300" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>

        <h2>5. Liability</h2>
        <p>
          The tool is provided “as is”, without warranty of any kind. To the
          extent permitted by law, the publisher cannot be held liable for
          misuse of the tool, for logos created by users, or for content
          submitted to the gallery, and gives no guarantee that a logo is
          unique, original or free of third-party rights. The publisher’s
          liability for gallery content may only be engaged under the
          conditions the law provides for hosting providers.
        </p>

        <h2>6. Community gallery</h2>

        <h3>6.1 Voluntary submission</h3>
        <p>
          You may submit a logo you created for publication in the community
          gallery. No account is required.
        </p>

        <h3>6.2 Moderation</h3>
        <p>
          Every submitted logo is reviewed before publication. We may refuse,
          not publish or remove any logo at any time, without any obligation to
          give reasons before publication. Publication is not guaranteed and
          does not constitute an endorsement of the content or a guarantee
          regarding third-party rights.
        </p>

        <h3>6.3 License</h3>
        <p>
          By submitting a logo, you dedicate it to the public domain under the{" "}
          <a
            className="text-red hover:text-red-300"
            href={CC0_URL}
            target="_blank"
            rel="noopener"
          >
            CC0 1.0 Universal Public Domain Dedication
          </a>
          . If and to the extent that this dedication is not legally
          effective (for example because moral rights cannot be waived under
          French law), you grant everyone an irrevocable, worldwide,
          royalty-free, non-exclusive license, without conditions, to use,
          reproduce, modify, distribute and sell the logo, including for
          commercial purposes. You authorize us to host, display and distribute
          the logo through the gallery. You keep your moral rights to the extent
          the law requires.
        </p>

        <h3>6.4 Your warranties</h3>
        <p>You represent and warrant that:</p>
        <ul>
          <li>
            you are the author of the logo or hold all necessary rights to it,
            including the right to release it under CC0;
          </li>
          <li>
            it does not reproduce any work, trademark or logo belonging to a
            third party without permission;
          </li>
          <li>
            it contains no personal data and no image of an identifiable person;
          </li>
          <li>it complies with section 3.</li>
        </ul>
        <p>
          You are responsible for any third-party claim arising from your
          submission.
        </p>

        <h3>6.5 No warranty for downloaders</h3>
        <p>
          Gallery logos are provided by users. We do not guarantee that they are
          free of third-party rights. You use them at your own risk.
        </p>

        <h3>6.6 Reporting and removal</h3>
        <p>
          To report illegal content or content that infringes your rights, email{" "}
          <a
            className="text-red hover:text-red-300"
            href="mailto:delatouchenoan@gmail.com"
          >
            delatouchenoan@gmail.com
          </a>{" "}
          with the following information:
        </p>
        <ul>
          <li>a link to, or a description of, the logo concerned;</li>
          <li>the reasons why you consider it illegal or infringing;</li>
          <li>your name and email address.</li>
        </ul>
        <p>
          Content that is manifestly illegal or the subject of a well-founded
          report is removed promptly. If your content is removed, we will tell
          you the reason where we are able to contact you.
        </p>

        <h2>7. Changes to these Terms</h2>
        <p>
          We may update these Terms at any time. The current version and its
          date are shown at the top of this page. Continued use of the site
          after an update means you accept the new version.
        </p>

        <h2>8. Governing law</h2>
        <p>
          These Terms are governed by French law. Any dispute falls under the
          jurisdiction of the French courts.
        </p>

        <h2>9. Contact</h2>
        <p>
          To report content, see section 6.6. For bugs or general questions,
          open an issue on the{" "}
          <Link
            className="text-red hover:text-red-300"
            href="https://github.com/noanwastaken/antifa_logo_generator/issues"
          >
            GitHub repository
          </Link>{" "}
          or write to{" "}
          <a
            className="text-red hover:text-red-300"
            href="mailto:delatouchenoan@gmail.com"
          >
            delatouchenoan@gmail.com
          </a>
          .
        </p>

        <h2>10. Donations</h2>
        <p>
          The site accepts voluntary donations through Ko-fi. Donations are
          gifts: they give no right, priority, influence over moderation or any
          other counterpart, and they are not refundable. Payments are handled
          by Ko-fi and its payment providers under their own terms and privacy
          policies; we do not receive your payment details. Donating is never
          required to use the tool or the gallery, and does not affect the CC0
          status of any logo.
        </p>

        <p className="page-links">
          <Link className="text-red hover:text-red-300" href="/privacy">
            Privacy Policy
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
