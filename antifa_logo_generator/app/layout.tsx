import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antifascist Logo Generator - Create Custom Antifa SVG",
  description:
    "Use this Antifascist Logo Generator to create a custom antifa SVG logo online. Add your text, upload an image, adjust colors and layout, then download.",
  robots: "index, follow",
  alternates: {
    canonical: "https://antifalogogenerator.noandelatouche.dev/",
  },
  openGraph: {
    type: "website",
    title: "Antifascist Logo Generator - Create Custom SVGs",
    description:
      "Create a custom antifascist logo online. Add your own text, upload a central image or SVG, adjust colors and layout, then download or copy the SVG code.",
    url: "https://antifalogogenerator.noandelatouche.dev/",
    images: [
      "https://antifalogogenerator.noandelatouche.dev/og-image.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antifascist Logo Generator - Create Custom SVGs",
    description:
      "Create a custom antifascist logo online. Add your own text, upload a central image or SVG, adjust colors and layout, then download or copy the SVG code.",
    images: [
      "https://antifalogogenerator.noandelatouche.dev/og-image.png",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
