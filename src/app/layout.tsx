import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = {
  title: "Viraj Patil — AI, Cybersecurity & Full-Stack Systems",
  description:
    "Portfolio of Viraj Patil — building projects across AI, cybersecurity, computer vision, and full-stack engineering.",
  openGraph: {
    title: "Viraj Patil — Portfolio",
    description:
      "AI, cybersecurity, computer vision, and full-stack engineering projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable}`}>
        {children}
        <div className="noise" aria-hidden="true" />
      </body>
    </html>
  );
}