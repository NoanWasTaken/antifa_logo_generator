import Head from "next/head";
import Counter from "../components/counter/Counter";
import { Suspense } from "react";
import CounterSkeleton from "../components/counter/CounterSkeleton";
import Settings from "@/components/settings_pannel/Settings";

export default async function Home() {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Antifascist Logo Generator - Create Curstom Antifa SVG</title>
        <meta
          name="description"
          content="Use this Antifascist Logo Generator to create a custom antifa SVG logo online. Add your text, upload an image, adjust colors and layout, then download."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://antifalogogenerator.noandelatouche.dev/"
        />
        <link rel="apple-touch-icon" href="favicon.ico" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Antifascist Logo Generator - Create Custom SVGs"
        />
        <meta
          property="og:description"
          content="Create a custom antifascist logo online. Add your own text, upload a central image or SVG, adjust colors and layout, then download or copy the SVG code."
        />
        <meta
          property="og:image"
          content="https://antifalogogenerator.noandelatouche.dev/og-image.png"
        />
        <meta
          property="og:url"
          content="https://antifalogogenerator.noandelatouche.dev/"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Antifascist Logo Generator - Create Custom SVGs"
        />
        <meta
          name="twitter:description"
          content="Create a custom antifascist logo online. Add your own text, upload a central image or SVG, adjust colors and layout, then download or copy the SVG code."
        />
        <meta
          name="twitter:image"
          content="https://antifalogogenerator.noandelatouche.dev/og-image.png"
        />
        {/* <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Antifascist Logo Generator",
        "url": "https://antifalogogenerator.noandelatouche.dev/",
        "description": "Online tool to create custom antifascist logos. Add text on an arc, upload a central image, adjust layout, and download as SVG.",
        "applicationCategory": "Multimedia",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript"
      }
    </script> */}

        <link rel="stylesheet" href="style.css" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
      </Head>
      <main>
        <Suspense fallback={<CounterSkeleton />}>
          <Counter />
        </Suspense>
        <Settings />
      </main>
    </div>
  );
}
