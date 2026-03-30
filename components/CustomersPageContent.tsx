"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SectionModals from "./Home/SectionModals";
import FaqSection from "./Payment/FaqSection";

function GoldStandardCardsGrid() {
  const cards = (
    <>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="Graham Stephan" className="gold-standard_card-image" />
            <div className="gold-standard_card-title">Graham Stephan</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              As a 30 year old real estate agent and investor who started working in real estate shortly after turning 18, with over $120,000,000 in residential real estate sales since 2008.
            </div>
          </div>
        </div>
      </div>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="Marina Mogilko" className="gold-standard_card-image" />
            <div className="gold-standard_card-title">Marina Mogilko</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              International Influencer Linguamarina Inc. creating content on business, education, languages and lifestyle | Co-founder at Linguatrip. Fluent.express
            </div>
          </div>
        </div>
      </div>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <div className="gold-standard_card-image" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: '700' }}>A</div>
            <div className="gold-standard_card-title">AlphaSignal</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              The most read newsletter by AI professionals with over 200,000+ AI researchers, engineers, and data scientists.
            </div>
          </div>
        </div>
      </div>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" alt="Houck's Newsletter" className="gold-standard_card-image" />
            <div className="gold-standard_card-title">Houck's Newsletter</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              Where founders come for advice. Weekly posts to help founders build, grow, and raise capital for their startup.
            </div>
          </div>
        </div>
      </div>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <div className="gold-standard_card-image" style={{ background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.875rem', fontWeight: '700', textAlign: 'center', padding: '0.25rem' }}>SH</div>
            <div className="gold-standard_card-title">Superhuman</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              The Superhuman newsletter is one of the biggest and fastest-growing AI newsletters in the world. We help 600,000+ readers leverage AI and AI products to boost their productivity and accelerate their careers. Superhuman
            </div>
          </div>
        </div>
      </div>
      <div className="gold-standard_card">
        <div className="gold-standard_card-header">
          <div className="gold-standard_card-top">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces" alt="Ali Abdaal" className="gold-standard_card-image" />
            <div className="gold-standard_card-title">Ali Abdaal</div>
          </div>
          <div className="gold-standard_card-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4H12M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="gold-standard_card-content">
          <div className="gold-standard_card-text-box">
            <div className="gold-standard_card-about">About</div>
            <div className="gold-standard_card-text">
              YouTuber + Podcaster + ex-Doctor + Author
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <div className="gold-standard_cards-slider">
      <div className="gold-standard_cards-track">
        <div className="gold-standard_cards-grid">{cards}</div>
        <div className="gold-standard_cards-grid" aria-hidden="true">{cards}</div>
      </div>
    </div>
  );
}

export default function CustomersPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isFirm = type === "firms";
  const sectionWord = isFirm ? "firm" : "coach";
  const sectionWordCap = isFirm ? "Firm" : "Coach";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::selection {
          background-color: rgba(255, 153, 102, 1);
        }
        .section_gold-standard {
          padding: 4rem 0;
          overflow-x: hidden;
          width: 100%;
        }
        .section_gold-standard.bg-gray {
          background-color: #f3f4f6;
        }
        .section_gold-standard.bg-white {
          background-color: #ffffff;
        }
        .section_gold-standard .container-xlarge {
          overflow-x: hidden;
          width: 100%;
        }
        .gold-standard_cards-slider {
          overflow: hidden;
          width: 100%;
          margin: 0 -1rem;
        }
        .gold-standard_cards-track {
          display: flex;
          flex-wrap: nowrap;
          width: max-content;
          gap: 1rem;
          padding: 0 1rem;
          animation: gold-standard-slide 45s linear infinite;
          will-change: transform;
        }
        .gold-standard_cards-track:hover {
          animation-play-state: paused;
        }
        @keyframes gold-standard-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gold-standard_cards-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          flex-shrink: 0;
          width: max-content;
        }
        @media (max-width: 1400px) {
          .gold-standard_cards-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 0.75rem;
          }
        }
        @media (max-width: 1200px) {
          .gold-standard_cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .gold-standard_cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .gold-standard_cards-grid {
            grid-template-columns: 1fr;
          }
        }
        .gold-standard_card {
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
          background-image: linear-gradient(#fcede3, #ff9147);
          border-radius: 0.75rem;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          width: 12rem;
          min-width: auto;
          padding: 0.75rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
          display: flex;
          position: relative;
        }
        .gold-standard_card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        .gold-standard_card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .gold-standard_card-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .gold-standard_card-image {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
        .gold-standard_card-title {
          font-size: 0.9375rem;
          font-weight: 600;
          line-height: 1.3;
          color: #191a1a;
        }
        .gold-standard_card-link {
          z-index: 40;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          display: flex;
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          color: #191a1a;
          opacity: 0.6;
          cursor: pointer;
        }
        .gold-standard_card-link:hover {
          opacity: 1;
        }
        .gold-standard_card-content {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }
        .gold-standard_card-text-box {
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
          background-color: #fff9;
          border-radius: 0.5rem;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
          height: 100%;
          padding: 0.75rem 0.5rem;
          display: flex;
        }
        .gold-standard_card-about {
          color: #802a00;
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .gold-standard_card-text {
          color: #802a00bf;
          font-family: Nunito Sans, sans-serif;
          font-size: 0.625rem;
          line-height: 140%;
          margin: 0;
        }
      `,
        }}
      />

      {/* Hero Section */}
      <div className="section_hero creators">
        <div className="padding-global hero">
          <div className="container-xxlarge">
            <div className="hero_component v2-centered">
              <div className="hero_texts-middle">
                <div className="hero_texts-heading-side">
                  <h1 className="heading-style-h2-v2" style={{ fontWeight: '700', fontSize: '3.5rem', lineHeight: '1.1' }}>
                    The {sectionWord} behind the biggest brands in tech.
                  </h1>
                </div>
                <div className="buttons_hero-outer">
                  <div className="text-size-medium-v2 text-weight-medium">
                    Discover how our customers are outgrowing their competitors with creators.
                  </div>
                </div>
              </div>
            </div>

            {/* Logos Slider Section */}
            <div className="section_logos" style={{ marginTop: '4rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="text-size-regular" style={{ fontSize: '1.125rem', color: '#666' }}>
                  Powering thousands of marketing teams at the fastest growing companies in tech
                </div>
              </div>
              <div className="hero_logos-outer-wrap">
                <div className="w-embed">
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
.marquee-track {
  position: relative;
  white-space: nowrap;
  will-change: transform;
  animation: marquee-horizontal 60s linear infinite;
}

@keyframes marquee-horizontal {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@media only screen and (min-width: 992px) {
  .marquee-track:hover {
    animation-play-state: paused;
  }
}
`,
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

      {/* Coach / Firm sections: ACC, PCC, MCC - same cards, alternating section bg */}
      <div className="section_gold-standard bg-gray">
        <div className="padding-global">
          <div className="container-xlarge">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="heading-style-h3" style={{ fontSize: '2.5rem', fontWeight: '600' }}>
                ACC {sectionWord}
              </h2>
            </div>
            <GoldStandardCardsGrid />
          </div>
        </div>
      </div>

      <div className="section_gold-standard bg-white">
        <div className="padding-global">
          <div className="container-xlarge">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="heading-style-h3" style={{ fontSize: '2.5rem', fontWeight: '600' }}>
                PCC {sectionWord}
              </h2>
            </div>
            <GoldStandardCardsGrid />
          </div>
        </div>
      </div>

      <div className="section_gold-standard bg-gray">
        <div className="padding-global">
          <div className="container-xlarge">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="heading-style-h3" style={{ fontSize: '2.5rem', fontWeight: '600' }}>
                MCC {sectionWordCap}
              </h2>
            </div>
            <GoldStandardCardsGrid />
          </div>
        </div>
      </div>

      {/* Modals Section */}
      <SectionModals />

      {/* FAQs Section */}
      <FaqSection />
    </>
  );
}

