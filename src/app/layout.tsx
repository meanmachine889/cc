import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon on Chain",
  description:
    "A blockchain-powered platform revolutionizing how carbon credits are created, traded, and tracked. Built on Solana with compliance and KYC for transparent, secure carbon credit tokenization.",
  metadataBase: new URL("https://carbononchain.vercel.app"),
  keywords: [
    "carbon credits",
    "blockchain carbon trading",
    "Solana carbon credits",
    "on-chain carbon marketplace",
    "carbon tokenization",
    "climate tech blockchain",
    "web3 sustainability",
    "carbon offset platform",
    "real world assets on blockchain",
    "carbon tracking transparency",
  ],
  openGraph: {
    title: "Carbon on Chain",
    description:
      "Transforming how carbon credits are created, traded, and tracked — powered by Solana for transparency and efficiency.",
    url: "https://carbononchain.vercel.app",
    siteName: "Carbon on Chain",
    images: [
      {
        url: "https://res.cloudinary.com/dnfv0h10u/image/upload/v1760505444/pawel-czerwinski-kyo00lYIkLQ-unsplash_m0iynd.jpg",
        width: 1200,
        height: 630,
        alt: "Carbon on Chain Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbon on Chain",
    description:
      "Blockchain-powered platform transforming carbon credit creation, trading, and tracking with Solana and on-chain transparency.",
    images: [
      "https://res.cloudinary.com/dnfv0h10u/image/upload/v1760505444/pawel-czerwinski-kyo00lYIkLQ-unsplash_m0iynd.jpg",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased dark sora-font`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
