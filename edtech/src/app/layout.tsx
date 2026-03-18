import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "BookandLab — Improve Your Skills Faster",
  description:
    "An interactive EdTech platform for students to learn through structured 6-step chapters, track progress, build streaks, and get mentor feedback.",
  keywords: ["edtech", "learning", "education", "skills", "mentoring"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
