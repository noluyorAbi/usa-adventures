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

export const metadata: Metadata = {
  title: "USA Adventures · Alperen & Justus",
  description:
    "Sechs Monate USA. Unsere interaktive Karte, Trips, Pläne und Erinnerungen — komplett lokal, kein Login.",
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
