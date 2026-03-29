"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

const CATEGORIES = [
  "All",
  "Movement",
  "Power",
  "Expression",
  "Accessories",
] as const;
type Category = (typeof CATEGORIES)[number];

interface Product {
  id: number;
  sku: string;
  name: string;
  subtitle: string;
  desc: string;
  price: number;
  category: Exclude<Category, "All">;
  badge?: string;
  featured?: boolean;
  colorSwatch: string;
  colorLabel: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    sku: "MOV-001",
    name: "PawKit Replacement Set",
    subtitle: "Four-paw silicone set",
    desc: "Fits Mutt-E Series 2–5 and Rover Classic. Medical-grade silicone, two hardness options. Installs without tools.",
    price: 34,
    category: "Movement",
    badge: "Best Seller",
    featured: true,
    colorSwatch: "oklch(52% 0.15 30)",
    colorLabel: "Rust",
  },
  {
    id: 2,
    sku: "EXP-007",
    name: "GlowEye Display Module",
    subtitle: "12-bit color OLED expressors",
    desc: "Drop-in for any 38mm socket. Ships with 14 pre-loaded expression sets. Pairs via Bluetooth in under 30 seconds.",
    price: 89,
    category: "Expression",
    badge: "New",
    featured: true,
    colorSwatch: "oklch(68% 0.14 52)",
    colorLabel: "Copper",
  },
  {
    id: 3,
    sku: "ACC-012",
    name: "SoftShell Cover: Cream",
    subtitle: "Washable velvet-texture outer shell",
    desc: "Universal fit with trim guides included. Machine washable. Available in 8 colorways. Adds no perceptible weight.",
    price: 49,
    category: "Accessories",
    colorSwatch: "oklch(90% 0.025 75)",
    colorLabel: "Cream",
  },
  {
    id: 4,
    sku: "PWR-003",
    name: "HumCell 12000 Battery Pack",
    subtitle: "Extended runtime lithium",
    desc: "12,000 mAh. Compatible with 90% of consumer bots. Pass-through charging lets your robot work while it charges.",
    price: 119,
    category: "Power",
    badge: "Top Rated",
    featured: true,
    colorSwatch: "oklch(68% 0.08 150)",
    colorLabel: "Sage",
  },
  {
    id: 5,
    sku: "EXP-014",
    name: "ChatterBox Voice Module",
    subtitle: "32 pre-loaded personality packs",
    desc: "USB-C programmable. 5W speaker with directional mesh grille. Compatible with all bots using the Vox-3 standard.",
    price: 79,
    category: "Expression",
    colorSwatch: "oklch(78% 0.12 58)",
    colorLabel: "Light Copper",
  },
  {
    id: 6,
    sku: "PWR-009",
    name: "NestDock Charging Station",
    subtitle: "Qi-compatible with auto-align tray",
    desc: "Works while your robot sleeps. Magnetic alignment. Status ring shows charge level at a glance. Includes cable.",
    price: 149,
    category: "Power",
    badge: "Premium",
    colorSwatch: "oklch(52% 0.13 42)",
    colorLabel: "Dark Copper",
  },
  {
    id: 7,
    sku: "MOV-004",
    name: "GlideTrack Wheel Pair",
    subtitle: "Dual 60mm omni-directional wheels",
    desc: "Precision-balanced for smooth hardwood and tile. Low-profile hub fits Rover Classic and Mutt-E Series 3+. Silent at full speed.",
    price: 58,
    category: "Movement",
    colorSwatch: "oklch(38% 0.02 55)",
    colorLabel: "Graphite",
  },
  {
    id: 8,
    sku: "MOV-011",
    name: "FlexJoint Shoulder Kit",
    subtitle: "6-axis articulation upgrade",
    desc: "Increases arm range by 40 degrees. Tool-free swap on any Mutt-E or Buddy-B chassis. Ships with alignment jig and two spare bushings.",
    price: 72,
    category: "Movement",
    badge: "New",
    colorSwatch: "oklch(68% 0.14 52)",
    colorLabel: "Copper",
  },
  {
    id: 9,
    sku: "MOV-017",
    name: "SoftStep Grip Pads",
    subtitle: "Anti-slip base inserts, 8-pack",
    desc: "Self-adhesive nitrile pads for stair-climbing bots. Cut to any shape. Replaces standard in under two minutes.",
    price: 18,
    category: "Movement",
    colorSwatch: "oklch(25% 0.02 55)",
    colorLabel: "Night",
  },
  {
    id: 10,
    sku: "EXP-021",
    name: "MoodRing Ear Lights",
    subtitle: "Reactive ambient LED rings",
    desc: "16M-color LED halos that pulse with voice activity. Pairs to any bot with BLE 5.0. Includes mounting collar and diffuser clip.",
    price: 44,
    category: "Expression",
    colorSwatch: "oklch(68% 0.08 150)",
    colorLabel: "Sage",
  },
  {
    id: 11,
    sku: "EXP-033",
    name: "TailWag Actuator",
    subtitle: "Expressive 3-speed tail motor",
    desc: "Replaces factory tail on Mutt-E Series 2-5. Three wag speeds, one happy robot. Runs 72 hours on a single charge cycle.",
    price: 37,
    category: "Expression",
    badge: "Fan Favorite",
    colorSwatch: "oklch(52% 0.15 30)",
    colorLabel: "Rust",
  },
  {
    id: 12,
    sku: "PWR-015",
    name: "SnapCell AA Adapter Tray",
    subtitle: "Emergency AA-to-bot-cell bridge",
    desc: "Dead battery, no dock nearby. This tray converts 4 AA cells into a compatible power source. Keeps your robot moving.",
    price: 22,
    category: "Power",
    colorSwatch: "oklch(78% 0.12 58)",
    colorLabel: "Light Copper",
  },
  {
    id: 13,
    sku: "PWR-022",
    name: "SolarBack Clip Panel",
    subtitle: "Adhesive photovoltaic trickle charger",
    desc: "Attaches to any flat shell surface. Extends runtime by up to 18% in indirect daylight. No wiring, snaps into charge port.",
    price: 64,
    category: "Power",
    badge: "Eco Pick",
    colorSwatch: "oklch(68% 0.08 150)",
    colorLabel: "Sage",
  },
  {
    id: 14,
    sku: "ACC-019",
    name: "SoftShell Cover: Midnight",
    subtitle: "Washable velvet-texture outer shell",
    desc: "Same universal fit as Cream but in deep midnight black. Machine washable, snag-resistant. Looks sharp under any light.",
    price: 49,
    category: "Accessories",
    colorSwatch: "oklch(19% 0.018 55)",
    colorLabel: "Midnight",
  },
  {
    id: 15,
    sku: "ACC-027",
    name: "CarryClip Shoulder Strap",
    subtitle: "Hands-free robot transport strap",
    desc: "Padded nylon strap with quick-release buckle. Rated to 8kg. Fits any bot with standard side lug ports.",
    price: 28,
    category: "Accessories",
    colorSwatch: "oklch(52% 0.13 42)",
    colorLabel: "Dark Copper",
  },
  {
    id: 16,
    sku: "ACC-034",
    name: "LensCap Protector Set",
    subtitle: "Scratch-resistant eye covers, 3-pack",
    desc: "Polycarbonate covers for 38mm GlowEye sockets. Snap on in seconds. Keep your bot's eyes safe during transit or storage.",
    price: 14,
    category: "Accessories",
    colorSwatch: "oklch(90% 0.025 75)",
    colorLabel: "Clear",
  },
];

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const NAV_LINKS = ["Shop", "Compatibility", "Guides", "About"];

const PAGE_SIZE = 4;

const EMPTY_QUIPS: Partial<Record<Category, string>> = {
  Movement: "Your robot stays put for now. Restock incoming.",
  Power: "No power parts. The irony is not lost on us.",
  Expression: "Nothing to express. A relatable feeling.",
  Accessories: "Apparently your robot travels light.",
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [page, setPage] = useState(1);
  const [gearKey, setGearKey] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
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
      scrollTimer.current = setTimeout(() => {
        scrollTimer.current = null;
      }, 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [fading, setFading] = useState(false);
  const [compatResult, setCompatResult] = useState<"idle" | "found" | "notfound">("idle");
  const [compatInput, setCompatInput] = useState("");

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function withFade(fn: () => void) {
    setFading(true);
    setTimeout(() => { fn(); setFading(false); }, 180);
  }

  function changeCategory(cat: Category) {
    withFade(() => { setActiveCategory(cat); setPage(1); });
  }

  function goToPage(n: number) {
    withFade(() => setPage(n));
  }

  return (
    <>
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
                <path
                  d="M14 2 L25.5 8.5 V21.5 L14 28 L2.5 21.5 V8.5 Z"
                  fill="var(--copper)"
                />
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1h2.5l1.5 8h7l1.5-5H4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="13.5" r="1" fill="currentColor" />
                <circle cx="11" cy="13.5" r="1" fill="currentColor" />
              </svg>
              <span className={styles["nav-cart-count"]} key={cartCount}>{cartCount}</span>
            </a>

            {/* Mobile hamburger */}
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

          {/* Mobile drawer */}
          <nav
            id="mobile-nav"
            className={cx(styles["mobile-nav"], mobileNavOpen && styles["mobile-nav--open"])}
            aria-label="Mobile navigation"
            aria-hidden={!mobileNavOpen}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className={styles["mobile-nav-link"]}
                onClick={() => setMobileNavOpen(false)}
              >
                {link}
              </a>
            ))}
          </nav>
        </header>

        {/* HERO */}
        <section className={styles.hero} aria-label="Robot Parlor parts store">
          <div className={styles["hero-inner"]}>
            {/* left col */}
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
                <a href="#compatibility" className={styles["hero-sub-link"]}>
                  Check compatibility →
                </a>
              </p>
              <div className={styles["hero-cta-row"]}>
                <a href="#catalog" className={styles["cta-primary"]}>
                  Shop All Parts
                </a>
              </div>

              <dl className={styles["hero-stats"]}>
                <div className={styles["hero-stat"]}>
                  <dt className={styles["hero-stat-label"]}>Compatible Models</dt>
                  <dd className={styles["hero-stat-num"]}>
                    <span className={styles["hero-stat-n"]}>400</span>+
                  </dd>
                </div>
                <div className={styles["hero-stat-div"]} aria-hidden="true" />
                <div className={styles["hero-stat"]}>
                  <dt className={styles["hero-stat-label"]}>Free Shipping</dt>
                  <dd className={styles["hero-stat-num"]}>
                    <span className={styles["hero-stat-n"]}>2</span>-day
                  </dd>
                </div>
                <div className={styles["hero-stat-div"]} aria-hidden="true" />
                <div className={styles["hero-stat"]}>
                  <dt className={styles["hero-stat-label"]}>Returns</dt>
                  <dd className={styles["hero-stat-num"]}>
                    <span className={styles["hero-stat-n"]}>60</span>-day
                  </dd>
                </div>
              </dl>
            </div>

            {/* right col: robot diagram */}
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

                {/* dots sit on the mid-ring (inset 12%, radius 38% of container).
                    GlowEye: ~40deg top-right, top~21% left~74%
                    HumCell: 180deg pure left, top~50% left~12%
                    PawKit:  ~225deg bottom-left, top~77% left~23% */}
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

          {/* mobile featured strip */}
          <div className={styles["hero-mobile-strip"]} aria-label="Featured parts">
            {PRODUCTS.filter((p) => p.featured).slice(0, 3).map((p) => (
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

        {/* CATALOG */}
        <section
          id="catalog"
          className={styles.catalog}
          aria-labelledby="catalog-heading"
        >
          <div className={styles["catalog-inner"]}>

            <aside className={styles["catalog-sidebar"]}>
              <p className={styles["sidebar-label"]}>Filter by</p>
              <nav className={styles["sidebar-nav"]} aria-label="Category filter">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => changeCategory(cat)}
                    className={cx(styles["sidebar-btn"], activeCategory === cat && styles["sidebar-btn--active"])}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat === "All" ? "*" : cat}
                  </button>
                ))}
              </nav>

              <div className={styles["sidebar-rule"]} aria-hidden="true" />

              <div className={styles["sidebar-callout"]}>
                <p className={styles["sidebar-callout-q"]}>Not sure what fits?</p>
                <p className={styles["sidebar-callout-body"]}>
                  Enter your robot's model number and we'll narrow it down.
                </p>
                <a href="#compatibility" className={styles["sidebar-callout-link"]}>
                  Check for compatibility →
                </a>
              </div>
            </aside>


            <div className={styles["catalog-main"]}>
              <div className={cx(styles["catalog-header"], fading && styles["product-list--fading"])}>
                <h2 id="catalog-heading" className={styles["catalog-heading"]}>
                  {activeCategory === "All"
                    ? "* Parts"
                    : `${activeCategory} Parts`}
                </h2>
                <p className={styles["catalog-count"]}>
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                  {totalPages > 1 ? `, pg ${page}/${totalPages}` : ""}
                </p>
              </div>

              {filtered.length > 0 ? (
                <ol className={cx(styles["product-list"], fading && styles["product-list--fading"])}>
                  {paginated.map((product) => (
                    <li key={product.id} className={styles["product-row"]}>
                      <article className={styles["product-row-inner"]}>
                        <div className={styles["product-sku-col"]}>
                          <span className={styles["product-sku"]}>{product.sku}</span>
                          <div
                            className={styles["product-swatch"]}
                            style={{ "--swatch": product.colorSwatch } as React.CSSProperties}
                            aria-label={`Color: ${product.colorLabel}`}
                            title={`Color: ${product.colorLabel}`}
                            role="img"
                          />
                        </div>

                        <div className={styles["product-info-col"]}>
                          <div className={styles["product-top-row"]}>
                            <h3 className={styles["product-name"]}>{product.name}</h3>
                            {product.badge && (
                              <span className={styles["product-badge"]}>
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <p className={styles["product-subtitle"]}>{product.subtitle}</p>
                          <p className={styles["product-desc"]}>{product.desc}</p>
                          <p className={styles["product-cat-tag"]}>
                            {product.category}
                          </p>
                        </div>

                        <div className={styles["product-action-col"]}>
                          <p className={styles["product-price"]}>${product.price}</p>
                          <button
                            type="button"
                            className={cx(styles["product-add"], addedIds.has(product.id) && styles["product-add--added"])}
                            aria-label={`Add ${product.name} to cart, $${product.price}`}
                            onClick={() => {
                              if (addedIds.has(product.id)) return;
                              setCartCount((c) => c + 1);
                              setAddedIds((prev) => new Set(prev).add(product.id));
                              setTimeout(() => {
                                setAddedIds((prev) => {
                                  const next = new Set(prev);
                                  next.delete(product.id);
                                  return next;
                                });
                              }, 1400);
                            }}
                          >
                            {addedIds.has(product.id) ? "Added ✓" : "Add to cart"}
                          </button>
                        </div>
                      </article>
                    </li>
                  ))}
                </ol>
              ) : null}

              {totalPages > 0 && (
                <nav className={styles["pagination"]} aria-label="Product pages">
                  <button
                    type="button"
                    className={styles["pagination-btn"]}
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={cx(styles["pagination-btn"], n === page && styles["pagination-btn--active"])}
                      onClick={() => goToPage(n)}
                      aria-label={`Page ${n}`}
                      aria-current={n === page ? "page" : undefined}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={styles["pagination-btn"]}
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    →
                  </button>
                </nav>
              )}

              {filtered.length === 0 && (
                <div className={styles["empty-state"]} aria-live="polite">
                  <p className={styles["empty-mark"]} aria-hidden="true">◌</p>
                  <p className={styles["empty-title"]}>
                    No {activeCategory.toLowerCase()} parts yet.
                  </p>
                  <p className={styles["empty-body"]}>
                    {EMPTY_QUIPS[activeCategory] ?? "We restock this category weekly."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BAND */}
        <section id="compatibility" className={styles.band} aria-label="Compatibility checker">
          <div className={styles["band-inner"]}>
            <div className={styles["band-text"]}>
              <h2 className={styles["band-heading"]}>
                Run a <em>compatibility</em> check.
              </h2>
              <p className={styles["band-body"]}>
                Type in a model number and BARBOT will tell you exactly what fits,
                what's compatible, and what to avoid.
              </p>
            </div>
            <div className={styles["band-right"]}>
              <form
                className={styles["band-input-group"]}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!compatInput.trim()) return;
                  setCompatResult(
                    compatInput.trim().toLowerCase().includes("mutt") || compatInput.trim().toLowerCase().includes("rover")
                      ? "found"
                      : "notfound"
                  );
                }}
              >
                <input
                  className={styles["band-input"]}
                  type="text"
                  placeholder="e.g. Mutt-E 3, Rover Classic…"
                  aria-label="Enter robot model number"
                  value={compatInput}
                  onChange={(e) => setCompatInput(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles["band-submit"]}
                >
                  Check
                </button>
              </form>
              {compatResult !== "idle" && (
                <div className={styles["band-result"]} aria-live="polite" key={compatInput + compatResult}>
                  {compatResult === "found" ? (
                    <>
                      <p className={styles["band-result-status"]} data-status="found">// Compatible</p>
                      <p className={styles["band-result-body"]}>Parts confirmed for your model. Scroll up - everything in stock right now is fair game.</p>
                    </>
                  ) : (
                    <>
                      <p className={styles["band-result-status"]} data-status="notfound">// Unknown model</p>
                      <p className={styles["band-result-body"]}>BARBOT doesn't recognize that one yet. Drop us a line at parts@robotparlor.com and a human will look it up within one business day.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles["footer-inner"]}>
            <div className={cx(styles["footer-col"], styles["footer-col--brand"])}>
              <a href="/" className={styles["footer-brand"]} aria-label="Robot Parlor">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M14 2 L25.5 8.5 V21.5 L14 28 L2.5 21.5 V8.5 Z"
                    fill="var(--copper)"
                  />
                  <circle cx="14" cy="15" r="4" fill="var(--night)" />
                  <circle cx="14" cy="15" r="1.5" fill="var(--copper-light)" />
                </svg>
                <span>ROBOT PARLOR</span>
              </a>
              <p className={styles["footer-tagline"]}>
                Parts for the robots that share your home.
              </p>
              <p className={styles["footer-copy"]}>
                © 2026 Robot Parlor, Inc. All rights reserved.
              </p>
            </div>

            <nav
              className={cx(styles["footer-col"], styles["footer-col--links"])}
              aria-label="Footer navigation"
            >
              <p className={styles["footer-col-label"]}>Store</p>
              {["Shop All", "Compatibility", "Guides", "New Arrivals"].map(
                (l) => (
                  <a key={l} href="#" className={styles["footer-link"]}>
                    {l}
                  </a>
                ),
              )}
            </nav>

            <nav
              className={cx(styles["footer-col"], styles["footer-col--links"])}
              aria-label="Company navigation"
            >
              <p className={styles["footer-col-label"]}>Company</p>
              {["About", "Contact", "Privacy", "Terms"].map((l) => (
                <a key={l} href="#" className={styles["footer-link"]}>
                  {l}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>

    </>
  );
}
