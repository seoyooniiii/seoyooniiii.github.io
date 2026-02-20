import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P, VT323, IBM_Plex_Mono } from "next/font/google";

const titlePixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
});

const uiPixel = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ui",
});

const mono = IBM_Plex_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "seoyooniiii",
  description: "Portfolio + journal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${titlePixel.variable} ${uiPixel.variable} ${mono.variable}`}>
      <body>
        <div className="crt">{children}</div>
      </body>
    </html>
  );
}
