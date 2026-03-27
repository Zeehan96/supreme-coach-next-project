"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Users,
  FileText,
  BookOpen,
  Star,
  MessageCircle,
  Newspaper,
  FileCheck,
  BarChart2,
  Trello,
  List,
  Hash,
  PhoneCall,
  Inbox,
  Video,
  PenTool,
  CheckSquare,
  Calendar,
  Clock,
  Zap,
  Timer,
  X,
  Wallet,
} from "lucide-react";
import { ReactNode } from "react";

type MegaItem = {
  label: string;
  icon: ReactNode;
  color?: string;
};

type MegaColProps = {
  items: MegaItem[];
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="section_hero">
      <div
        data-animation="default"
        data-sticky-nav="true"
        className="nav-element w-nav"
        data-easing2="linear"
        fs-scrolldisable-element="smart-nav"
        data-easing="ease"
        data-collapse="medium"
        data-w-id="285ab8f6-7c53-c0c1-5132-bb8735736349"
        role="banner"
        data-duration="400"
      >
        <div className="container-large">
          <div className="nav_component">
            <a
              href="/"
              aria-label="mobile-nav-logo"
              className="navbar_logo-mob w-nav-brand"
            >
              <div className="sc-logo-svg w-embed">
                <LogoSVG />
              </div>
            </a>

            {/* Mobile menu toggle */}
            <button
              aria-label="Toggle navigation"
              className={`w-nav-button navbar_burger ${isMenuOpen ? "w--open" : ""}`}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <div className="navbar_burger-lines" />
            </button>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
              <div
                className="mobile-menu-overlay"
                onClick={() => setIsMenuOpen(false)}
              />
            )}

            <nav
              role="navigation"
              id="w-node-_285ab8f6-7c53-c0c1-5132-bb873573634e-35736349"
              className={`navbar_menu w-nav-menu ${isMenuOpen ? "w--nav-menu-open" : ""}`}
              style={isMenuOpen ? { display: "block" } : undefined}
              onClick={(e) => {
                const target = e.target as HTMLElement | null;
                const link = target?.closest("a") as HTMLAnchorElement | null;
                // Close mobile nav only when clicking a real navigation link
                if (link) {
                  const href = link.getAttribute("href");
                  if (href && href !== "#") {
                    setIsMenuOpen(false);
                  }
                }
                // Don't close if clicking dropdown toggle buttons
                if (target?.closest("button[type='button']")) {
                  e.stopPropagation();
                }
              }}
            >
              {/* Mobile menu header with logo and close button */}
              <div className="mobile-menu-header">
                <a
                  href="/"
                  aria-label="mobile-menu-logo"
                  className="mobile-menu-logo"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="sc-logo-svg w-embed">
                    <LogoSVG />
                  </div>
                </a>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="mobile-menu-close"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="navbar_links-block first">
                <a
                  href="/"
                  aria-label="nav-logo-link"
                  className="navbar_logo-desktop w-nav-brand"
                >
                  <div className="sc-logo-svg w-embed">
                    <LogoSVG />
                  </div>
                </a>

                <div className="nav-divider" />

                <div className="nav-links-wrapper">
                  <ForBrandsDropdown />
                  <ForCreatorsDropdown />
                  <ForProductsDropdown />
                </div>
              </div>

              <div className="navbar_links-block end">
                <div className="nav-links-wrapper">
                  <a href="/pricing" className="navbar-link">
                    Pricing
                  </a>
                  <a href="/about" className="navbar-link">
                    About
                  </a>
                  <a href="/blog" className="navbar-link">
                    Blog
                  </a>
                  <a href="/guides" className="navbar-link">
                    Guides
                  </a>
                </div>
                <div className="nav-divider" />
                {/* Contact Sales button removed per request */}
                <a
                  href="/get-access"
                  target="_blank"
                  className="button-dark is-small w-inline-block"
                >
                  <div>Request a demo</div>
                  <div className="icon-embed-xxsmall w-embed">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 180 32"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      role="img"
    >
      <text
        x="0"
        y="22"
        fontFamily="new-kansas, Georgia, serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
      >
        Supreme Coach
      </text>
    </svg>
  );
}

function ForBrandsDropdown() {
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const brandsWrapperRef = useRef<HTMLDivElement | null>(null);
  const [brandsAnchorRight, setBrandsAnchorRight] = useState(true);
  const [brandsTopPx, setBrandsTopPx] = useState<number | null>(null);
  const [brandsFixedLeft, setBrandsFixedLeft] = useState<number | null>(null);
  const [brandsFixedRight, setBrandsFixedRight] = useState<number | null>(null);
  const [brandsDropdownWidth, setBrandsDropdownWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!isBrandsOpen) return;
    const el = brandsWrapperRef.current;
    if (!el || typeof window === "undefined") return;

  const rect = el.getBoundingClientRect();
  // desired dropdown width: reduce the max and make it a bit less wide on smaller viewports
  const dropdownWidth = Math.min(960, Math.floor(window.innerWidth * 0.9));
    const safety = 8;

    // If the dropdown fits when anchored to the left edge of the wrapper, use left.
    const fitsLeft = rect.left + dropdownWidth <= window.innerWidth - safety;
    // If the dropdown fits when anchored to the right edge of the wrapper, use right.
    const fitsRight = rect.right - dropdownWidth >= safety;

    let chooseRight = true;
    if (fitsLeft && !fitsRight) {
      chooseRight = false;
      setBrandsAnchorRight(false);
    } else if (!fitsLeft && fitsRight) {
      chooseRight = true;
      setBrandsAnchorRight(true);
    } else if (fitsLeft && fitsRight) {
      // both fit — prefer left (consistent UX)
      chooseRight = false;
      setBrandsAnchorRight(false);
    } else {
      // neither fits fully — pick the side with more available space
      const spaceIfLeft = window.innerWidth - rect.left;
      const spaceIfRight = rect.right;
      chooseRight = spaceIfRight > spaceIfLeft;
      setBrandsAnchorRight(chooseRight);
    }

    // compute top in viewport px so the dropdown aligns with the bottom of the wrapper
    setBrandsTopPx(Math.max(0, Math.floor(rect.bottom - 6)));
    setBrandsDropdownWidth(dropdownWidth);

    if (chooseRight) {
      setBrandsFixedRight(20);
      setBrandsFixedLeft(null);
    } else {
      setBrandsFixedLeft(Math.max(8, Math.floor(rect.left)));
      setBrandsFixedRight(null);
    }

    const onResize = () => {
      const r = el.getBoundingClientRect();
  const newDropdownWidth = Math.min(960, Math.floor(window.innerWidth * 0.9));
      setBrandsTopPx(Math.max(0, Math.floor(r.bottom - 6)));
      setBrandsDropdownWidth(newDropdownWidth);
      const newFitsLeft = r.left + newDropdownWidth <= window.innerWidth - safety;
      const newFitsRight = r.right - newDropdownWidth >= safety;
      let newChooseRight = true;
      if (newFitsLeft && !newFitsRight) newChooseRight = false;
      else if (!newFitsLeft && newFitsRight) newChooseRight = true;
      else if (newFitsLeft && newFitsRight) newChooseRight = false;
      else {
        const spaceIfLeft = window.innerWidth - r.left;
        const spaceIfRight = r.right;
        newChooseRight = spaceIfRight > spaceIfLeft;
      }
      if (newChooseRight) {
        setBrandsFixedRight(20);
        setBrandsFixedLeft(null);
      } else {
        setBrandsFixedLeft(Math.max(8, Math.floor(r.left)));
        setBrandsFixedRight(null);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isBrandsOpen]);

  return (
    <div
      data-delay="0"
      data-hover="true"
      data-dropdown-trigger="hover"
      className="navbar_menu-dropdown w-dropdown"
      style={{ position: "relative" }}
      ref={brandsWrapperRef}
      onMouseEnter={() => setIsBrandsOpen(true)}
      onMouseLeave={() => setIsBrandsOpen(false)}
    >
      <button
        type="button"
        className="navdrop-toggle w-dropdown-toggle"
        aria-expanded={isBrandsOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsBrandsOpen((v) => !v);
        }}
      >
        <span className="navbar_menu-link">For Coach</span>
        <div
          className="dropdown-chevron w-embed"
          style={{
            transform: isBrandsOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <nav
        className="nav_drop-list creators w-dropdown-list"
        // Keep original display toggle but add a responsive width so the mega menu
        // doesn't force the page to scroll when it appears on hover.
        style={{
          display: isBrandsOpen ? "block" : "none",
          // use fixed positioning so we can guarantee a viewport margin
          position: "fixed",
          top: brandsTopPx != null ? `${brandsTopPx}px` : "100%",
          // if we computed a pixel width, use it; otherwise fallback to the fluid value
            width: brandsDropdownWidth != null ? `${brandsDropdownWidth}px` : "min(960px, 90vw)",
            minWidth: "560px",
          boxSizing: "border-box",
          // ensure overflow inside dropdown is clipped instead of creating page scroll
          overflow: "hidden",
          ...(brandsFixedRight != null
            ? { right: `${brandsFixedRight}px`, left: "auto" }
            : brandsFixedLeft != null
            ? { left: `${brandsFixedLeft}px`, right: "auto" }
            : { right: 20, left: "auto" }),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile close button */}
        <div className="dropdown-mobile-header">
          <button
            type="button"
            aria-label="Close dropdown"
            className="dropdown-mobile-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBrandsOpen(false);
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className="nav_mega-list-wrapper"
          style={{ display: "flex", gap: 24, alignItems: "stretch" }}
        >
          {/* constrain left column so right visual panel remains prominent */}
          <div className="nav_mega-left" style={{ flex: "1 1 auto", maxWidth: 520 }}>
            <div className="nav_mega-links">
              <a
                href="/creators?type=coach"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Features</div>
                  <div className="text-size-small">
                    Find the right creators on all platforms, book &amp;
                    collaborate, pay quickly &amp; safely - all in one place.
                  </div>
                </div>
              </a>

              <a
                href="/customers?type=coaches"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Users className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Coaches</div>
                  <div className="text-size-small">
                    Discover how forward-thinking Coaches use Supreme Coach to
                    reach their growth goals.
                  </div>
                </div>
              </a>

              <a
                href="/pricing?type=coach"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Pricing</div>
                  <div className="text-size-small">
                    Designed for every stage of your journey. Start today for free.
                  </div>
                </div>
              </a>
            </div>

            <div className="mega_nav-bottom">
              <div className="mega_nav-head-wrap">
                <div>RESOURCES</div>
              </div>
              <a
                href="/blog"
                aria-label="nav-link"
                className="nav_mega-link is-small w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Blog</div>
                </div>
              </a>
             
            </div>
          </div>

          <div
            className="nav_mega-img-wrapper"
            style={{ flex: "0 0 420px", minWidth: 420 }}
          >
            {/* <img src="" alt="" className="nav_mega-img" loading="lazy" /> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

function ForCreatorsDropdown() {
  const [isCreatorsOpen, setIsCreatorsOpen] = useState(false);
  const creatorsWrapperRef = useRef<HTMLDivElement | null>(null);
  const [creatorsAnchorRight, setCreatorsAnchorRight] = useState(true);
  const [creatorsTopPx, setCreatorsTopPx] = useState<number | null>(null);
  const [creatorsFixedLeft, setCreatorsFixedLeft] = useState<number | null>(null);
  const [creatorsFixedRight, setCreatorsFixedRight] = useState<number | null>(null);
  const [creatorsDropdownWidth, setCreatorsDropdownWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!isCreatorsOpen) return;
    const el = creatorsWrapperRef.current;
    if (!el || typeof window === "undefined") return;

  const rect = el.getBoundingClientRect();
  const dropdownWidth = Math.min(960, Math.floor(window.innerWidth * 0.9));
    const safety = 8;

    const fitsLeft = rect.left + dropdownWidth <= window.innerWidth - safety;
    const fitsRight = rect.right - dropdownWidth >= safety;

    let chooseRight = true;
    if (fitsLeft && !fitsRight) {
      chooseRight = false;
      setCreatorsAnchorRight(false);
    } else if (!fitsLeft && fitsRight) {
      chooseRight = true;
      setCreatorsAnchorRight(true);
    } else if (fitsLeft && fitsRight) {
      chooseRight = false;
      setCreatorsAnchorRight(false);
    } else {
      const spaceIfLeft = window.innerWidth - rect.left;
      const spaceIfRight = rect.right;
      chooseRight = spaceIfRight > spaceIfLeft;
      setCreatorsAnchorRight(chooseRight);
    }

    setCreatorsTopPx(Math.max(0, Math.floor(rect.bottom - 6)));
    setCreatorsDropdownWidth(dropdownWidth);

    if (chooseRight) {
      setCreatorsFixedRight(20);
      setCreatorsFixedLeft(null);
    } else {
      setCreatorsFixedLeft(Math.max(8, Math.floor(rect.left)));
      setCreatorsFixedRight(null);
    }

    const onResize = () => {
      const r = el.getBoundingClientRect();
      const newDropdownWidth = Math.min(960, Math.floor(window.innerWidth * 0.9));
      setCreatorsTopPx(Math.max(0, Math.floor(r.bottom - 6)));
      setCreatorsDropdownWidth(newDropdownWidth);
      const newFitsLeft = r.left + newDropdownWidth <= window.innerWidth - safety;
      const newFitsRight = r.right - newDropdownWidth >= safety;
      let newChooseRight = true;
      if (newFitsLeft && !newFitsRight) newChooseRight = false;
      else if (!newFitsLeft && newFitsRight) newChooseRight = true;
      else if (newFitsLeft && newFitsRight) newChooseRight = false;
      else {
        const spaceIfLeft = window.innerWidth - r.left;
        const spaceIfRight = r.right;
        newChooseRight = spaceIfRight > spaceIfLeft;
      }
      if (newChooseRight) {
        setCreatorsFixedRight(20);
        setCreatorsFixedLeft(null);
      } else {
        setCreatorsFixedLeft(Math.max(8, Math.floor(r.left)));
        setCreatorsFixedRight(null);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isCreatorsOpen]);

  return (
    <div
      data-delay="0"
      data-hover="true"
      data-dropdown-trigger="hover"
      data-w-id="285ab8f6-7c53-c0c1-5132-bb8735736386"
      className="navbar_menu-dropdown w-dropdown"
      style={{ position: "relative" }}
      ref={creatorsWrapperRef}
      onMouseEnter={() => setIsCreatorsOpen(true)}
      onMouseLeave={() => setIsCreatorsOpen(false)}
    >
      <button
        type="button"
        className="navdrop-toggle w-dropdown-toggle"
        aria-expanded={isCreatorsOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsCreatorsOpen((v) => !v);
        }}
      >
        <span className="navbar_menu-link">For Firms</span>
        <div
          className="dropdown-chevron w-embed"
          style={{
            transform: isCreatorsOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <nav
        className="nav_drop-list creators w-dropdown-list"
        // match the responsive sizing used for the "For Coach" dropdown
        style={{
          display: isCreatorsOpen ? "block" : "none",
          position: "fixed",
          top: creatorsTopPx != null ? `${creatorsTopPx}px` : "100%",
          // use the computed dropdown width (same logic as For Coach)
          width: creatorsDropdownWidth != null ? `${creatorsDropdownWidth}px` : "min(960px, 90vw)",
          minWidth: "560px",
          boxSizing: "border-box",
          overflow: "hidden",
          ...(creatorsFixedRight != null
            ? { right: `${creatorsFixedRight}px`, left: "auto" }
            : creatorsFixedLeft != null
            ? { left: `${creatorsFixedLeft}px`, right: "auto" }
            : { right: 20, left: "auto" }),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile close button */}
        <div className="dropdown-mobile-header">
          <button
            type="button"
            aria-label="Close dropdown"
            className="dropdown-mobile-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCreatorsOpen(false);
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className="nav_mega-list-wrapper"
          style={{ display: "flex", gap: 24, alignItems: "stretch" }}
        >
          {/* constrain left column so right visual panel remains prominent */}
          <div className="nav_mega-left" style={{ flex: "1 1 auto", maxWidth: 520 }}>
            <div className="nav_mega-links">
              <a
                href="/creators?type=firms"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Star className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Features</div>
                  <div className="text-size-small">
                    Manage sponsorships, invoicing, and payments - all in one
                    place built for creators.
                  </div>
                </div>
              </a>

              <a
                href="/customers?type=firms"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Firms</div>
                  <div className="text-size-small">
                    Discover how forward-thinking Firms use Supreme Coach to
                    reach their growth goals.
                  </div>
                </div>
              </a>

              <a
                href="/pricing?type=firms"
                aria-label="nav-link"
                className="nav_mega-link w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Pricing</div>
                  <div className="text-size-small">
                    Designed for every stage of your journey. Start today for free.
                  </div>
                </div>
              </a>
            </div>

            <div className="mega_nav-bottom">
              <div className="mega_nav-head-wrap">
                <div>RESOURCES</div>
              </div>
              <a
                href="/blog"
                aria-label="nav-link"
                className="nav_mega-link is-small w-inline-block"
              >
                <div className="nav-maga-icon w-embed">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="nav_m-link-texts">
                  <div className="nav-mega-head">Blog</div>
                </div>
              </a>
             
            </div>
          </div>

          <div
            className="nav_mega-img-wrapper purple"
            style={{ flex: "0 0 420px", minWidth: 420 }}
          >
          </div>
        </div>
      </nav>
    </div>
  );
}

function ForProductsDropdown() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <div
      data-delay="0"
      data-hover="true"
      data-dropdown-trigger="hover"
      className="navbar_menu-dropdown w-dropdown"
      onMouseEnter={() => setIsProductsOpen(true)}
      onMouseLeave={() => setIsProductsOpen(false)}
    >
     

      <nav
        className="nav_drop-list creators w-dropdown-list"
        style={{ display: isProductsOpen ? "block" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile close button */}
        <div className="dropdown-mobile-header">
          <button
            type="button"
            aria-label="Close dropdown"
            className="dropdown-mobile-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsProductsOpen(false);
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="nav_mega-list-wrapper flex gap-12">
          <MegaCol
            items={[
              { icon: <FileCheck />, label: "Tasks", color: "#22c55e" },
              { icon: <BarChart2 />, label: "Dashboards", color: "#ec4899" },
              { icon: <Trello />, label: "Board view", color: "#3b82f6" },
              { icon: <List />, label: "Gantt", color: "#ef4444" },
            ]}
          />

          <MegaCol
            items={[
              { icon: <Hash />, label: "Chat", color: "#a259ff" },
              { icon: <PhoneCall />, label: "SyncUp", color: "#14b8a6" },
              { icon: <Inbox />, label: "Inbox", color: "#f97316" },
              { icon: <Video />, label: "Clips", color: "#ef4444" },
            ]}
          />

          <MegaCol
            items={[
              { icon: <FileText />, label: "Docs", color: "#3b82f6" },
              { icon: <PenTool />, label: "Whiteboards", color: "#fbbf24" },
              { icon: <BookOpen />, label: "Wiki", color: "#a259ff" },
              { icon: <CheckSquare />, label: "Forms", color: "#a259ff" },
            ]}
          />

          <MegaCol
            items={[
              { icon: <Calendar />, label: "Calendar", color: "#ec4899" },
              { icon: <Clock />, label: "Scheduling", color: "#f97316" },
              { icon: <Zap />, label: "Automations", color: "#a259ff" },
              { icon: <Timer />, label: "Time tracking", color: "#14b8a6" },
            ]}
          />
        </div>
      </nav>
    </div>
  );
}

function MegaCol({ items }: MegaColProps) {
  return (
    <div className="nav_mega-col">
      <div className="nav_mega-links">
        {items.map((item, i) => (
          <div
            key={i}
            className="nav_mega-link w-inline-block text-left"
            style={{
              cursor: "pointer",
            }}
          >
            <span
              className="nav-maga-icon"
              style={{ color: item.color, marginTop: "-2px" }}
            >
              {item.icon}
            </span>

            <span className="nav-mega-head whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { MegaCol };
