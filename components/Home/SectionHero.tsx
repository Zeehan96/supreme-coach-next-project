import Link from "next/link";
import React, { useState } from "react";
import { Check } from "lucide-react";

const HERO_TABS = [
  "Projects",
  "Chat",
  "Brain MAX",
  "AI Agents",
  "Sprints",
  "Time Tracking",
  "Calendar",
  "Docs",
  "Whiteboards",
  "Automations",
  "Dashboards",
  "Scheduling",
];

const AGENTS_IMAGE_SRCSET =
  "https://images.ctfassets.net/w8fc6tgspyjz/3X25GGlGLZJ6Wl3uuxELGh/02d76253d1aae55f30b331aeb77ec3a8/Agents___latest_.png?fm=avif&q=50&w=500 500w, https://images.ctfassets.net/w8fc6tgspyjz/3X25GGlGLZJ6Wl3uuxELGh/02d76253d1aae55f30b331aeb77ec3a8/Agents___latest_.png?fm=avif&q=50&w=600 600w, https://images.ctfassets.net/w8fc6tgspyjz/3X25GGlGLZJ6Wl3uuxELGh/02d76253d1aae55f30b331aeb77ec3a8/Agents___latest_.png?fm=avif&q=50&w=800 800w, https://images.ctfassets.net/w8fc6tgspyjz/3X25GGlGLZJ6Wl3uuxELGh/02d76253d1aae55f30b331aeb77ec3a8/Agents___latest_.png?fm=avif&q=50 900w";
const BRAIN_IMAGE_SRCSET =
  "https://images.ctfassets.net/w8fc6tgspyjz/4bSZUL0ZlP0oRffUef55PM/b4c611d04c70a7df681c3890bb3ae2b6/brain-02.png?fm=avif&q=50&w=500 500w, https://images.ctfassets.net/w8fc6tgspyjz/4bSZUL0ZlP0oRffUef55PM/b4c611d04c70a7df681c3890bb3ae2b6/brain-02.png?fm=avif&q=50&w=600 600w, https://images.ctfassets.net/w8fc6tgspyjz/4bSZUL0ZlP0oRffUef55PM/b4c611d04c70a7df681c3890bb3ae2b6/brain-02.png?fm=avif&q=50&w=800 800w, https://images.ctfassets.net/w8fc6tgspyjz/4bSZUL0ZlP0oRffUef55PM/b4c611d04c70a7df681c3890bb3ae2b6/brain-02.png?fm=avif&q=50 900w";

const TAB_IMAGES: Record<string, string> = {
  "Brain MAX": BRAIN_IMAGE_SRCSET,
};
const DEFAULT_HERO_IMAGE_SRCSET = AGENTS_IMAGE_SRCSET;

const SectionHero = () => {
  const [selectedTabs, setSelectedTabs] = useState<Set<string>>(
    () => new Set(["Projects"])
  );
  const [activeTabForImage, setActiveTabForImage] = useState("Projects");

  const toggleTab = (tab: string) => {
    setSelectedTabs((prev) => {
      const next = new Set(prev);
      if (next.has(tab)) next.delete(tab);
      else next.add(tab);
      return next;
    });
    setActiveTabForImage(tab);
  };

  const heroImageSrcset =
    TAB_IMAGES[activeTabForImage] ?? DEFAULT_HERO_IMAGE_SRCSET;
  const heroImageSrc =
    heroImageSrcset.split(" ")[0] ?? DEFAULT_HERO_IMAGE_SRCSET.split(" ")[0];

  return (
    <div className="section_hero creators">
      <div
        className="padding-global hero new-hero"
        style={{
          display: "block",
          position: "relative",
          paddingTop: 0,
          paddingBottom: 0
        }}
      >

        <div className="container-xxlarge">
          <div
            className="hero_component hero_component--two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
              paddingTop: 0,
              paddingBottom: "3rem",
            }}
          >
            {/* Left: Content + Tabs */}
            <div
              className="hero_texts-middle hero_texts-middle--left"
              style={{
                textAlign: "left",
                alignItems: "flex-start",
                marginLeft: 0,
                marginRight: 0,
              }}
            >
              <div
                className="hero_texts-heading-side"
                style={{ alignItems: "flex-start", maxWidth: "100%" }}
              >

                <h1 className="heading-style-h2-v2">
                  Maximize human
                  productivity                </h1>
              </div>
              <div
                className="buttons_hero-outer"
                style={{ alignItems: "flex-start", maxWidth: "100%" }}
              >
                <div className="text-size-medium-v2 text-weight-medium">
                  Replace all your software. Every app, AI agent, and human in one place.

                  <br />

                </div>
                <div className="HomeHero4o_ctaSection__VbhyI">
                  <Link
                    href="/"
                    target="_blank"
                    className="HomeHero4o_ctaButton__wrapper"
                  >
                    <span className="HomeHero4o_rainbowGradient__D2ZLR" aria-hidden />
                    <span className="HomeHero4o_rainbowHighlight__dEYxe" />
                    <span className="HomeHero4o_ctaButton__inner">
                      Get started. It&apos;s FREE!
                    </span>
                  </Link>
                  <div
                    className="HomeHero4o_ctaText__secondary"
                    style={{
                      color: "var(--neutral--500, #6b7280)",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.125rem",
                    }}
                  >
                    <span>Free forever.</span>
                    <span>No credit card.</span>
                  </div>
                </div>
                {/* Workspace builder tabs - 4 per row with rounded corners */}
                <div style={{ marginTop: "1.5rem", width: "100%" }}>
                  <div
                    className="HomeHero4o_workspaceBuilderFeatures__title"
                    style={{
                      color: "var(--neutral--600, #4b5563)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    GET 400% MORE DONE • CUSTOMIZE YOUR WORKSPACE
                  </div>
                  <div
                    className="HomeHero4o_workspaceBuilderFeatures__xgXJ9"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      width: "100%"
                    }}
                  >
                    {HERO_TABS.map((tab) => {
                      const isSelected = selectedTabs.has(tab);
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => toggleTab(tab)}
                          className={`HomeHero4o_workspaceBuilderFeature__um7iP ${isSelected ? "HomeHero4o_selected__BdTPJ" : ""}`}
                          style={{
                            position: "relative",
                            padding: "4.33px 12.33px",
                            border: isSelected ? "1px solid #000000" : "1px solid #d9d9d9",
                            borderRadius: "54px",
                            color: isSelected ? "#000000" : "#646464",
                            fontWeight: 600,
                            fontSize: "14px",
                            fontFamily: "Inter, sans-serif",
                            lineHeight: "20px",
                            letterSpacing: "-0.15px",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "border-color 0.3s ease, background-color 0.3s ease",
                            backgroundColor: isSelected ? "#f5f5f5" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            outline: "none"
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#fafafa";
                              e.currentTarget.style.borderColor = "#b3b3b3";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.borderColor = "#d9d9d9";
                            }
                          }}
                        >
                          {isSelected && (
                            <span
                              style={{
                                position: "absolute",
                                top: "-4px",
                                right: "-4px",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#000000",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
                              }}
                            >
                              <Check
                                size={10}
                                strokeWidth={3}
                                color="#ffffff"
                                style={{ display: "block" }}
                              />
                            </span>
                          )}
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image - Bara kiya gaya hai taake cut ho jaye with white mask */}
            <div
              className="hero_image-side HomeHero4o_heroImageWrapper__8DM2b"
              style={{
                overflow: "hidden",
                height: "600px",
                position: "relative"
              }}
            >
              {/* White gradient overlay - bottom to top */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(255,255,255,0.5) 0%, transparent 20%)",
                  zIndex: 2,
                  pointerEvents: "none"
                }}
              />
              {/* White fade on right edge */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "45%",
                background: "linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, transparent 100%)",
                zIndex: 3,
                pointerEvents: "none"
              }} />

              <picture>
                <img
                  src="/images/trainer-clipboard-gym.jpg"
                  alt="Workspace"
                  style={{
                    width: "120%",
                    height: "120%",
                    objectFit: "cover",
                    objectPosition: "center right",
                    display: "block",
                    maxWidth: "none",
                    position: "absolute",
                    top: "-10%",
                    right: "-10%"
                  }}
                />
              </picture>
            </div>
            <div
              className="hero_logos-outer"
              style={{ gridColumn: "1 / -1" }}
            >
              <div>
                Powering thousands of marketing teams at the fastest growing
                companies in tech
              </div>
              <div className="hero_logos-outer-wrap">
                <div className="w-embed">
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        '\n\n\n.marquee-track {\n  position: relative;\n  white-space: nowrap;\n  will-change: transform;\n  animation: marquee-horizontal 60s linear infinite;\n  /* manipulate the speed of the marquee by changing "s" line above*/\n}\n\n\n\n@keyframes marquee-horizontal {\n  0% { transform: translateX(0%); }\n  100% { transform: translateX(-50%); }\n}\n\n@media only screen and (min-width: 992px) {\n  .marquee-track:hover {\n    animation-play-state: paused;\n  }\n}\n\n',
                    }}
                  />
                </div>
                <div className="hero_logos-wrapper marquee-track">
                  <div className="hero_logos-track">
                    {/* TAVUS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/691eec5afa92c45dcee063bd_Tavus.png" alt="TAVUS" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Rippling */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/67ab9dcd0f694616a4ad44bf_Ripplinglogo.avif" alt="Rippling" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Pika */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/691eec3da0554e7583437e50_Pika.png" alt="Pika" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Framer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/68b1b720e278d278fe3721f5_framer.avif" alt="Framer" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Image 80 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcdbe5ac9f5bee12bbe_image%2080.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Replit */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/68b1b6e9b75902ba3cf186b8_replit.avif" alt="Replit" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Frame-1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcd1c59cbfc2851afc5_Frame-1.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Image 75 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcdd593d7389f1e48a8_image%2075.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                  </div>
                  <div className="hero_logos-track">
                    {/* TAVUS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/691eec5afa92c45dcee063bd_Tavus.png" alt="TAVUS" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Rippling */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/67ab9dcd0f694616a4ad44bf_Ripplinglogo.avif" alt="Rippling" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Pika */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/691eec3da0554e7583437e50_Pika.png" alt="Pika" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Framer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/68b1b720e278d278fe3721f5_framer.avif" alt="Framer" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Image 80 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcdbe5ac9f5bee12bbe_image%2080.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Replit */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/68b1b6e9b75902ba3cf186b8_replit.avif" alt="Replit" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Frame-1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcd1c59cbfc2851afc5_Frame-1.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                    {/* Image 75 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
                      <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f4efcdd593d7389f1e48a8_image%2075.avif" alt="Logo" width="120" height="48" style={{ objectFit: 'contain' }} />
                    </div>
                  </div>
                </div>
                <div className="hero_logos-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SectionHero;