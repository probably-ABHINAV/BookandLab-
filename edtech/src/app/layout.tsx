import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stackauth/config";
import JsonLd from "@/components/shared/JsonLd";

const SITE_URL = "https://new-bookandlab.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F5A623",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BookandLab — Improve Your Skills Faster",
    template: "%s | BookandLab",
  },
  description:
    "An interactive EdTech platform for Class 6–12 students to learn through structured 6-step chapters, track progress, build streaks, and get real mentor feedback.",
  keywords: [
    "edtech",
    "learning",
    "education",
    "skills",
    "mentoring",
    "online learning",
    "student platform",
    "mentor review",
    "Class 6 to 12",
    "BookandLab",
  ],
  authors: [{ name: "BookandLab" }],
  creator: "BookandLab",
  publisher: "BookandLab",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "BookandLab",
    title: "BookandLab — Improve Your Skills Faster",
    description:
      "Structured 6-step chapter learning with real mentor feedback. Track your skills, build streaks, and grow every week.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookandLab — Improve Your Skills Faster",
    description:
      "Structured 6-step chapter learning with real mentor feedback for Class 6–12 students.",
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
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd />
        <StackProvider app={stackServerApp}>
          <Providers>{children}</Providers>
        </StackProvider>
      </body>
    </html>
  );
}
