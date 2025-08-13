import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { WaveformProvider } from "app/components/waveformcontext";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sam Merrick | Music Composer for Film, TV and Video Games",
    template: "%s | Sam Merrick",
  },
  description: "Sam Merrick",
  openGraph: {
    title: "Sam Merrick | Music Composer for Film, TV and Video Games",
    description: "Music Composer for Film, TV and Video Games",
    url: baseUrl,
    siteName: "samjmerrick.com",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-white bg-black",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-4xl mx-4 mt-8 lg:mx-auto">
        <WaveformProvider>
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </WaveformProvider>
      </body>
    </html>
  );
}
