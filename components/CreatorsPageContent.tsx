"use client";

import Link from "next/link";
import TraditionalMarketing from "./Home/TraditionalMarketing";
import SectionSingleReview from "./Home/SectionSingleReview";
import SectionBento2 from "./Home/SectionBento2";
import SectionBento3 from "./Home/SectionBento3";
import SectionModals from "./Home/SectionModals";
import SectionCta from "./Home/SectionCta";
import SectionCaseStudies from "./Home/SectionCaseStudies";
import FaqSection from "./Payment/FaqSection";

type CreatorsPageContentProps = {
  type?: "coach" | "firms";
};

export default function CreatorsPageContent({
  type = "coach",
}: CreatorsPageContentProps) {
  const isFirm = type === "firms";
  const audienceWord = isFirm ? "firms" : "coaches";
  const audienceWordCapitalized = isFirm ? "Firms" : "Coaches";

  const createInitialsAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#FCEDE3'/>
          <stop offset='100%' stop-color='#FF9147'/>
        </linearGradient>
      </defs>
      <rect width='96' height='96' rx='48' fill='url(#g)'/>
      <text x='50%' y='53%' dominant-baseline='middle' text-anchor='middle' fill='#7A2D08' font-size='30' font-family='Arial, sans-serif' font-weight='700'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const creatorSlides = [
    {
      gradient: "orange",
      name: "ByteByteGo",
      followers: "1M+",
      about: "System design newsletter trusted by top engineers.",
      cover:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/bytebytego?source=partner-discovery",
    },
    {
      gradient: "blue",
      name: "The Rundown AI",
      followers: "900K+",
      about: "Daily AI brief for founders, operators, and creators.",
       cover:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/the-rundown-ai",
    },
    {
      gradient: "green",
      name: "Lenny's Newsletter",
      followers: "1M+",
      about: "Product growth insights from top startup teams.",
      cover:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1541534401786-2077eed87a72?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/lennysnewsletter",
    },
    {
      gradient: "purple",
      name: "SaaStr",
      followers: "300K+",
      about: "B2B SaaS playbooks, GTM trends, and case studies.",
      cover:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1557862921-37829c790f19?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/saastr",
    },
    {
      gradient: "red",
      name: "The Hustle",
      followers: "1.5M+",
      about: "Business stories and market shifts in plain language.",
      cover:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/thehustle",
    },
    {
      gradient: "orange",
      name: "Marketing Examined",
      followers: "420K+",
      about: "Practical B2B marketing breakdowns and strategy insights.",
      cover:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/",
    },
    {
      gradient: "blue",
      name: "Demand Curve",
      followers: "380K+",
      about: "Growth, demand gen, and GTM playbooks for startups.",
      cover:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/",
    },
    {
      gradient: "green",
      name: "ProductLed",
      followers: "270K+",
      about: "PLG lessons from top SaaS teams and operators.",
      cover:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/",
    },
    {
      gradient: "purple",
      name: "Founder Story",
      followers: "510K+",
      about: "Interviews and insights from B2B founders building fast.",
      cover:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/",
    },
    {
      gradient: "red",
      name: "AI Revenue Weekly",
      followers: "640K+",
      about: "Revenue-focused AI workflows for operators and founders.",
      cover:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=340&fit=crop",
      image:
        "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=96&h=96&fit=crop&crop=faces",
      href: "https://www.passionfroot.me/",
    },
  ];

  return (
    <>
      {/* Pop-up Wrapper */}
      <div id="pop-up-wrapper" className="pop-up-wrapper">
        <div
          data-w-id="0fbe5cfd-a089-069d-8216-a23cf931abec"
          className="pop-up-back"
        ></div>
        <div className="pop-up-box">
          <a
            data-w-id="0fbe5cfd-a089-069d-8216-a23cf931abee"
            href="#"
            className="pop-up-exit-button w-inline-block"
          ></a>
          <div className="resources_mega-img-wrap popup"></div>
          <div className="sc-popup_texts">
            <div className="pop-up-text-box">
              <h2 className="pop-up-header">
                Supreme Coach Sponsorship Pricing Guide
              </h2>
              <p className="pop-up-paragraph">
                Learn how other creators are leveraging Supreme Coach to
                monetize their content with brand partnerships.
              </p>
            </div>
            <div className="form w-form">
              <form
                id="wf-form-Pricing-Guide-Access"
                name="wf-form-Pricing-Guide-Access"
                data-name="Pricing Guide Access"
                method="get"
                data-popup-form="form-el"
                className="pop-up-form"
              >
                <div className="form_item-wrap">
                  <div>Email address</div>
                  <input
                    className="form_input modal w-input"
                    maxLength={256}
                    name="email_address"
                    data-name="email_address"
                    placeholder="Enter your email"
                    type="email"
                    id="email_address-2"
                    required
                  />
                </div>
                <div className="radio_field-wrapper">
                  <div>What&apos;s your role?</div>
                  <div className="radio_buttons-wrapper">
                    <label className="modal_radio-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom modal_radio-el w-radio-input"></div>
                      <input
                        type="radio"
                        name="Role"
                        id="Creator"
                        data-name="Role"
                        required
                        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                        value="Creator"
                      />
                      <span className="radio_label w-form-label">Creator</span>
                    </label>
                    <label className="modal_radio-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom modal_radio-el w-radio-input"></div>
                      <input
                        type="radio"
                        name="Role"
                        id="Marketer"
                        data-name="Role"
                        required
                        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                        value="Marketer"
                      />
                      <span className="radio_label w-form-label">Marketer</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="button-dark">
                  <div data-popup-form="button-text">Request a demo</div>
                </button>
              </form>
              <div className="popup_form-success w-form-done">
                <div>Thank you! Check your email for confirmation.</div>
              </div>
              <div className="popup_form-error w-form-fail">
                <div>Oops! Something went wrong while submitting the form.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="section_hero creators">
        <div className="padding-global z-index-10">
          <div className="container-xlarge">
            <div className="creators_hero-component">
              <div className="hero_texts-wrapper creators">
                <h1 className="heading-style-h2 main-hero-heading">
                  Where {audienceWord} do <br />
                  brand deals
                </h1>
                <div className="max-width-small creators-hero-para">
                  <div className="text-size-medium color-neutral-800">
                    The all-in-one tool to help {audienceWordCapitalized} do
                    more sponsorship -
                    easier, and faster.
                  </div>
                </div>
                <div className="creators_hero-buttons">
                  <Link
                    href="/get-access"
                    target="_blank"
                    className="button-dark long w-inline-block"
                  >
                    <div>Start for Free</div>
                    <div className="icon-embed-xxsmall w-embed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 16 16"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                        role="img"
                      >
                        <path
                          className="arrow-line"
                          d="M2.349 7.23025C3.06607 7.21757 3.71403 7.1808 4.35755 7.29175C4.42539 7.30316 4.50401 7.26575 4.57565 7.2442C4.9288 7.13768 5.28321 7.1231 5.64269 7.21503C5.95526 7.29492 6.27417 7.22644 6.59054 7.2499C7.07873 7.28604 7.56438 7.15417 8.0494 7.17889C8.44439 7.19918 8.84381 7.19284 9.23627 7.25434C9.43535 7.28541 9.62365 7.29619 9.82717 7.24483C10.0484 7.18967 10.2678 7.32218 10.4973 7.32218C10.7497 7.32218 10.9982 7.38558 11.2404 7.45786C11.5117 7.53838 11.5802 7.78438 11.3824 7.98409C11.0806 8.28905 10.6863 8.42282 10.2779 8.48242C9.94002 8.53187 9.59512 8.56041 9.25466 8.57816C8.89454 8.59654 8.53188 8.72081 8.16669 8.60035C8.10392 8.57943 8.02594 8.57499 7.96254 8.59211C7.53775 8.70877 7.09585 8.63015 6.66789 8.71384C6.53602 8.73983 6.39146 8.73096 6.25705 8.71003C6.07065 8.68087 5.89186 8.68594 5.71433 8.74427C5.48736 8.81908 5.26165 8.72398 5.03404 8.72842C4.80389 8.73286 4.57565 8.7411 4.35755 8.79626C4.01455 8.88375 3.67345 8.83493 3.33933 8.79943C3.03754 8.76773 2.74653 8.79436 2.44918 8.80197C2.16831 8.80957 1.87476 8.83366 1.59833 8.78485C1.2845 8.72905 1.14818 8.44248 1.03343 8.18063C0.930717 7.94605 1.07527 7.77296 1.23314 7.60432C1.46582 7.35515 1.73401 7.22201 2.07955 7.24546C2.1924 7.25307 2.30716 7.23215 2.3509 7.22961L2.349 7.23025Z"
                          fill="currentColor"
                        />
                        <path
                          className="arrow-tip"
                          d="M11.1802 13.0869C10.782 13.0901 10.4764 12.7344 10.543 12.321C10.5867 12.0478 10.6869 11.7923 10.8644 11.5704C11.0007 11.3998 11.139 11.228 11.2512 11.0416C11.6424 10.3892 12.071 9.76533 12.5845 9.20233C12.6295 9.15288 12.6663 9.08884 12.6885 9.02544C12.821 8.64567 13.0866 8.35719 13.346 8.06555C13.5038 7.88803 13.5178 7.75615 13.3377 7.59892C13.0993 7.39033 12.9129 7.15194 12.7804 6.8641C12.6866 6.66121 12.4888 6.54329 12.3442 6.38161C12.1432 6.15654 12.0139 5.88138 11.8725 5.62207C11.6766 5.26258 11.3932 4.97601 11.1631 4.64759C10.931 4.31664 10.7364 3.9654 10.5956 3.58562C10.5639 3.50003 10.5417 3.40874 10.5328 3.31807C10.517 3.14689 10.621 3.04037 10.7548 2.95732C10.8809 2.8787 10.9944 2.91167 11.106 2.99473C11.3266 3.15893 11.5606 3.29905 11.7318 3.52983C11.9505 3.82401 12.284 4.01865 12.4736 4.34327C12.9732 4.62794 13.2134 5.14022 13.5545 5.56564C13.7549 5.81544 13.9996 6.03164 14.2348 6.25101C14.4244 6.4279 14.5791 6.62127 14.6476 6.87551C14.6875 7.02323 14.7763 7.14243 14.8587 7.2686C15.0553 7.56975 15.0426 7.87661 14.8498 8.17713C14.5652 8.62094 14.3293 9.09645 14.0066 9.51617C13.6718 9.95173 13.4499 10.4665 13.06 10.8647C12.8229 11.1069 12.6974 11.4182 12.5509 11.7181C12.3487 12.1321 12.1096 12.5252 11.7704 12.8447C11.5834 13.0203 11.4122 13.0856 11.1821 13.0876L11.1802 13.0869Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    target="_blank"
                    className="button-light is-outline w-inline-block"
                  >
                    <div>Contact Sales</div>
                  </Link>
                </div>
              </div>
              <div className="creators_hero-imgs">
                <div className="c-hero_left-side">
                  <div
                    data-creators-hero="left-top"
                    className="c-hero_card is-left-top"
                  >
                    <div className="c-hero_card-media"></div>
                  </div>
                  <div
                    data-creators-hero="left-bottom"
                    className="c-hero_card is-left-bottom"
                  >
                    <div className="c-hero_card-media"></div>
                  </div>
                </div>
                <div
                  data-creators-hero="center"
                  className="creators_center-pf"
                ></div>
                <div className="c-hero_right-side">
                  <div
                    data-creators-hero="right-top"
                    className="c-hero_card is-right-top"
                  >
                    <div className="c-hero_card-media"></div>
                  </div>
                  <div
                    data-creators-hero="right-bottom"
                    className="c-hero_card is-right-bottom"
                  >
                    <div className="c-hero_card-media"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Slider Section */}
      <div className="section_creators">
        <div className="padding-section-medium">
          <div className="padding-global">
            <div className="container-xlarge">
              <div className="b2b_creators-component">
                <div className="max-width-medium c_slide">
                  <h2 className="heading-style-h4">
                    Empowering the world&apos;s top B2B creators and media
                    companies
                  </h2>
                </div>
                <div className="b2b_cards-outer">
                  <div
                    id="creators-slider"
                    className="swiper-container basic-swiper-container"
                  >
                    <div className="swiper-wrapper basic-swiper-wrapper">
                      {creatorSlides.map((slide) => (
                        <div
                          key={slide.name}
                          data-bg-gradient={slide.gradient}
                          className="swiper-slide creators-slide"
                        >
                          <div className="creator-coach-card">
                            <div className="creator-coach-card-header">
                              <div className="creator-coach-card-top">
                                <img
                                  src={slide.image}
                                  loading="lazy"
                                  width={48}
                                  height={48}
                                  alt={`${slide.name} profile`}
                                  className="creator-coach-card-image"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.onerror = null;
                                    target.src = createInitialsAvatar(slide.name);
                                  }}
                                />
                                <div className="creator-coach-card-name-wrap">
                                  <div className="creator-coach-card-title">{slide.name}</div>
                                  <div className="creator-coach-card-followers">{slide.followers}</div>
                                </div>
                              </div>
                              <div
                                aria-hidden="true"
                                className="creator-coach-card-link w-inline-block"
                              >
                                <div className="open-tab-icon w-embed">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.7999 2.3999C8.35807 2.3999 7.9999 2.75807 7.9999 3.1999C7.9999 3.64173 8.35807 3.9999 8.7999 3.9999H10.8685L5.83422 9.03422C5.5218 9.34664 5.5218 9.85317 5.83422 10.1656C6.14664 10.478 6.65317 10.478 6.96559 10.1656L11.9999 5.13127V7.1999C11.9999 7.64173 12.3581 7.9999 12.7999 7.9999C13.2417 7.9999 13.5999 7.64173 13.5999 7.1999V3.1999C13.5999 2.75807 13.2417 2.3999 12.7999 2.3999H8.7999Z"
                                      fill="currentColor"
                                      fillOpacity="0.45"
                                    />
                                    <path
                                      d="M3.9999 3.9999C3.11625 3.9999 2.3999 4.71625 2.3999 5.5999V11.9999C2.3999 12.8836 3.11625 13.5999 3.9999 13.5999H10.3999C11.2836 13.5999 11.9999 12.8836 11.9999 11.9999V9.5999C11.9999 9.15807 11.6417 8.7999 11.1999 8.7999C10.7581 8.7999 10.3999 9.15807 10.3999 9.5999V11.9999H3.9999V5.5999L6.3999 5.5999C6.84173 5.5999 7.1999 5.24173 7.1999 4.7999C7.1999 4.35807 6.84173 3.9999 6.3999 3.9999H3.9999Z"
                                      fill="currentColor"
                                      fillOpacity="0.45"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="creator-coach-card-content">
                              <div className="creator-coach-card-about">About</div>
                              <div className="creator-coach-card-text">{slide.about}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     <TraditionalMarketing/>
     <SectionSingleReview />
        <SectionBento2 />
        <SectionBento3 />
        <SectionModals/>
        <SectionCta />
        <SectionCaseStudies />
        <FaqSection/>

      {/* Bento Section - Payments */}
    

    

  
    
    </>
  );
}

/* ==========================================================================
   Creator Card Component
   ========================================================================== */

interface CreatorCardProps {
  name: string;
  platform:
    | "instagram"
    | "youtube"
    | "linkedin"
    | "twitter"
    | "web"
    | "newsletter";
  followers: string;
  categories: string[];
}

function CreatorCard({
  name,
  platform,
  followers,
  categories,
}: CreatorCardProps) {
  return (
    <div className="creator-community_card">
      <div className="creator-card_platform-icon">
        <PlatformIcon platform={platform} />
      </div>
      <a
        href="#"
        target="_blank"
        className="creator-card_external-link w-inline-block"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.7999 2.3999C8.35807 2.3999 7.9999 2.75807 7.9999 3.1999C7.9999 3.64173 8.35807 3.9999 8.7999 3.9999H10.8685L5.83422 9.03422C5.5218 9.34664 5.5218 9.85317 5.83422 10.1656C6.14664 10.478 6.65317 10.478 6.96559 10.1656L11.9999 5.13127V7.1999C11.9999 7.64173 12.3581 7.9999 12.7999 7.9999C13.2417 7.9999 13.5999 7.64173 13.5999 7.1999V3.1999C13.5999 2.75807 13.2417 2.3999 12.7999 2.3999H8.7999Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
          <path
            d="M3.9999 3.9999C3.11625 3.9999 2.3999 4.71625 2.3999 5.5999V11.9999C2.3999 12.8836 3.11625 13.5999 3.9999 13.5999H10.3999C11.2836 13.5999 11.9999 12.8836 11.9999 11.9999V9.5999C11.9999 9.15807 11.6417 8.7999 11.1999 8.7999C10.7581 8.7999 10.3999 9.15807 10.3999 9.5999V11.9999H3.9999V5.5999L6.3999 5.5999C6.84173 5.5999 7.1999 5.24173 7.1999 4.7999C7.1999 4.35807 6.84173 3.9999 6.3999 3.9999H3.9999Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
        </svg>
      </a>
      <div className="creator-card_profile">
        <div className="creator-card_image"></div>
      </div>
      <div className="creator-card_name">{name}</div>
      <div className="creator-card_followers">{followers}</div>
      <div className="creator-card_categories">
        {categories.map((category, index) => (
          <span key={index} className="creator-card_category-tag">
            {category}
          </span>
        ))}
      </div>
      <div className="creator-card_placeholder-bars">
        <div className="creator-card_bar"></div>
        <div className="creator-card_bar"></div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Platform Icon Component
   ========================================================================== */

interface PlatformIconProps {
  platform:
    | "instagram"
    | "youtube"
    | "linkedin"
    | "twitter"
    | "web"
    | "newsletter";
}

function PlatformIcon({ platform }: PlatformIconProps) {
  switch (platform) {
    case "instagram":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0C5.827 0 5.555.01 4.702.048 3.85.088 3.27.222 2.76.42a4.92 4.92 0 0 0-1.771 1.153A4.92 4.92 0 0 0 .42 2.76C.222 3.27.088 3.85.048 4.7.01 5.555 0 5.827 0 8s.01 2.445.048 3.298c.04.85.174 1.43.372 1.938.205.526.478.972.9 1.394a4.92 4.92 0 0 0 1.771 1.153c.51.198 1.09.332 1.938.372C5.555 15.99 5.827 16 8 16s2.445-.01 3.298-.048c.85-.04 1.43-.174 1.938-.372a4.92 4.92 0 0 0 1.153-.9c.422-.422.695-.868.9-1.394.198-.508.332-1.088.372-1.938C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.298c-.04-.85-.174-1.43-.372-1.938a4.92 4.92 0 0 0-.9-1.394A4.92 4.92 0 0 0 13.24.42c-.508-.198-1.088-.332-1.938-.372C10.445.01 10.173 0 8 0zm0 1.44c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.233-.045v.001zm0 4.678a3.882 3.882 0 1 0 0 7.764 3.882 3.882 0 0 0 0-7.764zm0 6.4a2.518 2.518 0 1 1 0-5.036 2.518 2.518 0 0 1 0 5.036zm5.23-7.895a.907.907 0 1 1-1.814 0 .907.907 0 0 1 1.814 0z"
            fill="currentColor"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.32 4.06c-.434-.772-.905-.914-1.864-.968C12.498 3.03 10.089 3 8.002 3c-2.091 0-4.501.03-5.458.092-.958.055-1.43.196-1.864.967-.329.583-.49 1.35-.49 2.94s.161 2.357.49 2.94c.434.772.905.912 1.864.967.958.062 3.367.092 5.458.092 2.087 0 4.496-.03 5.454-.092.959-.055 1.43-.195 1.864-.967.329-.583.49-1.35.49-2.94s-.161-2.357-.49-2.94zM6 11V5l5.5 3L6 11z"
            fill="currentColor"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.82 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.64C15.472 16 16 15.484 16 14.847V1.153C16 .516 15.472 0 14.82 0zM4.744 13.636H2.37V6H4.744v7.636zM3.557 4.955c-.791 0-1.432-.64-1.432-1.432 0-.791.64-1.432 1.432-1.432.791 0 1.432.64 1.432 1.432 0 .792-.64 1.432-1.432 1.432zm10.08 8.681h-2.37V9.818c0-.885-.015-2.025-1.234-2.025-1.235 0-1.424.966-1.424 1.96v3.883H6.437V6h2.273v1.07h.032c.315-.6 1.09-1.233 2.243-1.233 2.404 0 2.845 1.58 2.845 3.637v4.162z"
            fill="currentColor"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.973 4a5.711 5.711 0 0 1-1.64.44 2.866 2.866 0 0 0 1.253-1.58 5.761 5.761 0 0 1-1.813.693 2.84 2.84 0 0 0-4.84 2.586 8.06 8.06 0 0 1-5.847-2.96 2.833 2.833 0 0 0 .88 3.787 2.82 2.82 0 0 1-1.287-.353v.034a2.84 2.84 0 0 0 2.28 2.787 2.844 2.844 0 0 1-1.28.048 2.84 2.84 0 0 0 2.653 1.973 5.694 5.694 0 0 1-3.526 1.214 5.75 5.75 0 0 1-.674-.04 8.032 8.032 0 0 0 4.353 1.273c5.22 0 8.074-4.327 8.074-8.074 0-.12-.003-.24-.009-.36a5.763 5.763 0 0 0 1.414-1.467z"
            fill="currentColor"
          />
        </svg>
      );
    case "web":
    case "newsletter":
    default:
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
            fill="currentColor"
          />
          <path d="M7 4h2v2H7V4zm0 4h2v4H7V8z" fill="currentColor" />
        </svg>
      );
  }
}
