"use client";

import { useState } from "react";
import styles from "./styles.module.css";

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const NAV_LINKS = ["Shop", "Compatibility", "Guides", "About"];

let gearKey = 0;

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles["nav-inner"]}>
          <a href="/" className={styles["nav-brand"]} aria-label="Robot Parlor home">
            <svg
              className={styles["nav-hex"]}
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
              <a key={link} href="#" className={styles["nav-link"]}>
                {link}
              </a>
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
            <span
              className={cx(styles["nav-menu-bar"], mobileNavOpen && styles["nav-menu-bar--hide"])}
              aria-hidden="true"
            />
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={cx(styles["mobile-nav"], mobileNavOpen && styles["mobile-nav--open"])}
          aria-label="Mobile navigation"
          aria-hidden={!mobileNavOpen}
        >
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className={styles["mobile-nav-link"]} onClick={() => setMobileNavOpen(false)}>
              {link}
            </a>
          ))}
        </nav>
      </header>
    </div>
  );
}
