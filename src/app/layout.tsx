import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Masters 2026 Sweepstake",
  description:
    "Live leaderboard for the Masters 2026 sweepstake. 120 participants, 8 picks each.",
  openGraph: {
    title: "The Masters 2026 Sweepstake",
    description: "Live leaderboard tracker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-augusta text-white">
        {children}
      </body>
    </html>
  );
}
