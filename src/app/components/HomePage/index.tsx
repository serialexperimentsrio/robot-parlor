"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const NAV_LINKS = ["Shop", "Compatibility", "Guides", "About"];

const FEATURED = [
  { id: 1, name: "PawKit Replacement Set", price: 34, colorSwatch: "oklch(52% 0.15 30)" },
  { id: 2, name: "GlowEye Display Module", price: 89, colorSwatch: "oklch(68% 0.14 52)" },
  { id: 4, name: "HumCell 12000 Battery Pack", price: 119, colorSwatch: "oklch(68% 0.08 150)" },
];

export default function HomePage() {
  const [gearKey, setGearKey] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log(
      "%c ROBOT PARLOR %c\nYou opened DevTools. BARBOT approves.\nWe're not hiring, but your robot might need new eyes.\n→ parts@robotparlor.com",
      "background:oklch(68% 0.14 52);color:oklch(13% 0.015 55);font-weight:700;padding:4px 8px;",
      "color:oklch(68% 0.14 52);font-size:11px;"
    );
  }, []);

  useEffect(() => {
    function onScroll() {
      if (scrollTimer.current) return;
      setGearKey((k) => k + 1);
      scrollTimer.current = setTimeout(() => { scrollTimer.current = null; }, 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* NAV */}
      <header className={styles.nav}>
        <div className={styles["nav-inner"]}>
          <a href="/" className={styles["nav-brand"]} aria-label="Robot Parlor home">
            <svg
              key={gearKey}
              className={cx(styles["nav-hex"], gearKey > 0 && styles["nav-hex--spinning"])}
              width="36"
              height="36"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
            >
              <path d="M14 2 L25.5 8.5 V21.5 L14 28 L2.5 21.5 V8.5 Z" fill="var(--copper)" />
              <circle cx="14" cy="15" r="4" fill="var(--night)" />
              <circle cx="14" cy="15" r="1.5" fill="var(--copper-light)" />
            </svg>
            <span className={styles["nav-wordmark"]}>ROBOT PARLOR</span>
          </a>

          <div className={styles["nav-sep"]} aria-hidden="true" />
          <nav className={styles["nav-links"]} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className={styles["nav-link"]}>{link}</a>
            ))}
          </nav>

          <a href="/" className={styles["nav-cart"]} aria-label="Cart">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1h2.5l1.5 8h7l1.5-5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="13.5" r="1" fill="currentColor" />
              <circle cx="11" cy="13.5" r="1" fill="currentColor" />
            </svg>
            <span className={styles["nav-cart-count"]}>0</span>
          </a>

          <button
            type="button"
            className={styles["nav-menu-btn"]}
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
          >
            <span className={styles["nav-menu-bar"]} aria-hidden="true" />
            <span className={styles["nav-menu-bar"]} aria-hidden="true" />
            <span className={cx(styles["nav-menu-bar"], mobileNavOpen && styles["nav-menu-bar--hide"])} aria-hidden="true" />
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={cx(styles["mobile-nav"], mobileNavOpen && styles["mobile-nav--open"])}
          aria-label="Mobile navigation"
          aria-hidden={!mobileNavOpen}
        >
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className={styles["mobile-nav-link"]} onClick={() => setMobileNavOpen(false)}>{link}</a>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section className={styles.hero} aria-label="Robot Parlor parts store">
        <div className={styles["hero-inner"]}>
          <div className={styles["hero-left"]}>
            <p className={styles["hero-eyebrow"]}>EST. 2026 / ROBOT CARE SPECIALISTS</p>
            <h1 className={styles["hero-title"]}>
              Old robot<span className={styles["hero-dot"]}>?</span>
              <br />
              Give it a
              <br />
              <em>break.</em>
            </h1>
            <p className={styles["hero-sub"]}>
              Find a compatible part for your robot. We'll ship it. And...
              that's it.
              <br />
              <a href="#compatibility" className={styles["hero-sub-link"]}>Check compatibility →</a>
            </p>
            <div className={styles["hero-cta-row"]}>
              <a href="#catalog" className={styles["cta-primary"]}>Shop All Parts</a>
            </div>

            <dl className={styles["hero-stats"]}>
              <div className={styles["hero-stat"]}>
                <dt className={styles["hero-stat-label"]}>Compatible Models</dt>
                <dd className={styles["hero-stat-num"]}><span className={styles["hero-stat-n"]}>400</span>+</dd>
              </div>
              <div className={styles["hero-stat-div"]} aria-hidden="true" />
              <div className={styles["hero-stat"]}>
                <dt className={styles["hero-stat-label"]}>Free Shipping</dt>
                <dd className={styles["hero-stat-num"]}><span className={styles["hero-stat-n"]}>2</span>-day</dd>
              </div>
              <div className={styles["hero-stat-div"]} aria-hidden="true" />
              <div className={styles["hero-stat"]}>
                <dt className={styles["hero-stat-label"]}>Returns</dt>
                <dd className={styles["hero-stat-num"]}><span className={styles["hero-stat-n"]}>60</span>-day</dd>
              </div>
            </dl>
          </div>

          <div className={styles["hero-right"]} aria-hidden="true">
            <div className={styles["hero-diagram"]}>
              <div className={cx(styles["diag-ring"], styles["diag-ring--outer"])} />
              <div className={cx(styles["diag-ring"], styles["diag-ring--mid"])} />
              <div className={cx(styles["diag-ring"], styles["diag-ring--inner"])} />
              <div className={styles["diag-bot"]}>
                <span className={styles["bot-face"]}>
                  <span className={styles["bot-eye"]} />
                  <span className={styles["bot-eye"]} />
                </span>
                <span className={styles["bot-label"]}>UNIT 07</span>
              </div>
              <div className={cx(styles["diag-tag"], styles["diag-tag--1"])}>
                <span className={styles["diag-dot"]} />
                <span className={styles["diag-line"]} />
                <span className={styles["diag-text"]}>GlowEye Module</span>
              </div>
              <div className={cx(styles["diag-tag"], styles["diag-tag--2"])}>
                <span className={styles["diag-text"]}>HumCell Pack</span>
                <span className={styles["diag-line"]} />
                <span className={styles["diag-dot"]} />
              </div>
              <div className={cx(styles["diag-tag"], styles["diag-tag--3"])}>
                <span className={styles["diag-text"]}>PawKit Set</span>
                <span className={styles["diag-line"]} />
                <span className={styles["diag-dot"]} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles["hero-mobile-strip"]} aria-label="Featured parts">
          {FEATURED.map((p) => (
            <div key={p.id} className={styles["hero-mobile-card"]}>
              <div
                className={styles["hero-mobile-swatch"]}
                style={{ "--swatch": p.colorSwatch } as React.CSSProperties}
                aria-hidden="true"
              />
              <div className={styles["hero-mobile-card-body"]}>
                <p className={styles["hero-mobile-card-name"]}>{p.name}</p>
                <p className={styles["hero-mobile-card-price"]}>${p.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles["hero-dash-rule"]} aria-hidden="true" />
      </section>
    </div>
  );
}
