import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/lib/store";
import AppChrome from "@/components/AppChrome";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const SITE_URL = "https://usa-adventures.vercel.app";
const TITLE = "USA Adventures · Alperen & Justus";
const DESCRIPTION =
  "Sechs Monate quer durch die USA. Interaktive Karte, Trips, Pläne und Erinnerungen — komplett lokal, kein Login.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "USA Adventures",
    title: TITLE,
    description: DESCRIPTION,
    locale: "de_DE",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "USA Adventures — Karte, Trips, Pläne, Erinnerungen",
      },
    ],
    videos: [
      {
        url: `${SITE_URL}/promo.mp4`,
        width: 1920,
        height: 1080,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eaf3fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${geist.variable} ${fraunces.variable}`}>
        <AppProvider>
          <AppChrome>{children}</AppChrome>
        </AppProvider>
      </body>
    </html>
  );
}
