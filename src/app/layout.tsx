import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "College Hub — the short list",
  description:
    "Ishaan's college application HQ — 18 schools, one map, zero spreadsheet tabs.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("ch-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${fraunces.variable} ${instrument.variable} ${mono.variable}`}
      >
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="site-footer">
            <span>
              college hub · app season ’26–’27 · data lives in{" "}
              <code>src/data/colleges.ts</code>
            </span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
