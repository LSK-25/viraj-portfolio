import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./cinema.css";
import "./spatial.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const interTight = localFont({
  src: "./fonts/inter-tight-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://viraj-portfolio-mu.vercel.app/"),
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
