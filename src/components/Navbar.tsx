"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./theme";

const LINKS = [
  { href: "/", label: "the hub" },
  { href: "/breakdown", label: "full breakdown" },
  { href: "https://docs.google.com/document/d/1gTNeGaZBt--tmwdDIgGFz6dZwJJ6t5ou_fchRfg7pEw/edit?tab=t.m8n6vnbgy2xg", label: "Essays" },
  { href: "https://docs.google.com/document/d/1Tljt0V-7F712RfxaCD7DdLM7Y1OFwJJ86CQMxXDGF4o/edit?tab=t.0#heading=h.30j0zll", label: "Activities" },
  { href: "https://www.customcollegeplan.com/signin", label: "CPE dashboard"}
];

export default function Navbar() {
  const pathname = usePathname();
  const { toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link href="/" className="nav__brand">
          cp<em>·</em>hub
        </Link>
        <nav className="nav__links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav__link${
                pathname === l.href ? " nav__link--active" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="theme-btn"
          onClick={toggle}
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          <svg
            className="icon-sun"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
          </svg>
          <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.4 14.3A8.5 8.5 0 0 1 9.7 3.6a8.5 8.5 0 1 0 10.7 10.7z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
