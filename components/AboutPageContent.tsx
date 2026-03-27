"use client";

import Link from "next/link";
import FaqSection from "./Payment/FaqSection";

const TEAM_IMAGE_URL =
  "https://cdn.prod.website-files.com/6340255dae4cf9a2b6a9ffba/6340255dae4cf9fb78aa0163_Jens.avif";

export default function AboutPageContent() {
  return (
    <>
      {/* About Header Section */}
      <section className="section-about-header">
        <div className="page-padding" 
        >
          <div className="padding-section-medium is-about">
            <div className="container-large">
              <div className="about-header-component">
                <div className="text-align-center">
                  <div className="margin-bottom margin-small">
                    <div
                      data-w-id="3b8f0903-92c2-bff1-d797-6915a32b01f0"
                      data-is-ix2-target="1"
                      className="about-sc-animation"
                      data-animation-type="lottie"
                      data-loop="0"
                      data-direction="1"
                      data-autoplay="0"
                      data-renderer="svg"
                      data-default-duration="1.1666666666666667"
                      data-duration="0"
                    ></div>
                  </div>
                  <div className="margin-bottom margin-medium">
                    <h1 className="heading-style-h2">
                      Helping creators and brands to grow
                    </h1>
                  </div>
                  <p className="text-size-large"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Story Section – light gray #f8f8f6; dark text via CSS */}
      <section className="section-about-story section-about-story--orange">
        <div className="page-padding">
          <div className="padding-section-medium">
            <div className="container-large">
              <div className="about-story_component">
                <div className="about-story_title">
                  <div className="margin-bottom margin-medium">
                    <h2 className="heading-style-h3">
                      Supreme Coach is about sustaining the spark in every creator
                      and fuelling the growth of the new generation of companies
                    </h2>
                  </div>
                </div>
                <div className="about-story_rich-text">
                  <div className="text-size-regular w-richtext">
                    <p>
                      Our mission is to help creators and brands unlock
                      high-quality partnerships and transform the way companies
                      grow through creator collaborations.
                    </p>
                    <p>
                      B2B influencer marketing is rapidly becoming the next big
                      growth channel for leading companies. 71% of CMOs are
                      increasing their budget for B2B Influencers in 2024.
                    </p>
                    <p>But for you, the marketer, doing that work is a pain.</p>
                    <p>
                      Creator marketing should be your best and most exciting
                      growth channel.
                    </p>
                    <p>
                      With Supreme Coach we want to build the fastest and
                      easiest way for you to make that a reality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-about-team">
        <div className="page-padding">
          <div className="padding-section-medium">
            <div className="container-large">
              <div className="text-align-center">
                <div className="margin-bottom margin-large">
                  <h2 className="heading-style-h3">Meet the team</h2>
                </div>
              </div>
              <div className="team-collection_wrapper w-dyn-list">
                <div role="list" className="team-collection_list w-dyn-items">
                  {/* Team Member: Jen */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-1"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Jen"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Co-founder &amp; CEO
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Jen</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Jens */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-2"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Jens"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Co-founder &amp; COO
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Jens</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Lorenzo */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-3"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Lorenzo"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Co-founder and CTO
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Lorenzo</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Filip */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-4"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Filip"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">CGO</div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Filip</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Sarah */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-5"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Sarah"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Engineering
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Sarah</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Alex */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-6"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Alex"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Design
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Alex</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Sumit */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-7"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Sumit"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Engineering
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Sumit</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Leon */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-8"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Leon"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Engineering
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Leon</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Omar */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-9"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Omar"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Engineering
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Omar</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Team Member: Ludwig */}
                  <div
                    role="listitem"
                    className="team-collection_item w-dyn-item"
                  >
                    <div
                      data-w-id="team-member-10"
                      className="team-collection_card"
                    >
                      <div className="team-collection_image-wrap">
                        <img
                          src={TEAM_IMAGE_URL}
                          alt="Ludwig"
                          className="team-collection_profile-image"
                        />
                      </div>
                      <div className="pill-outer-wrapper">
                        <div className="pill_wrapper is-brand-peach">
                          <div className="text-style-label is-small">
                            Product Engineering
                          </div>
                        </div>
                      </div>
                      <div className="team-collection_name-wrapper">
                        <h3 className="heading-style-h5">Ludwig</h3>
                        <span className="team-collection_arrow" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="section-about-investors">
        <div className="page-padding">
          
        </div>
        <div
          className="padding-section-medium padding-top-0"
          style={{
            backgroundColor: "#f8f8f6",
            padding: "20px",
            paddingBottom: "20px",
          }}
          >
            <div className="container-large position-relative">
              <div className="margin-bottom margin-large" style={{display:"flex",justifyContent:"center",marginBottom:"0px"}}>
                <div className="investors_text-component">
                  <div className="investors_title-wrapper" style={{ textAlign: "center", padding: "1.5rem 0" }}>
                    <h2 className="heading-style-h3" style={{textAlign:"center"}}>
                      Proudly introducing the people backing Supreme Coach.
                    </h2>
                  </div>
                </div>
              </div>
              <div className="w-layout-grid investor-grid">
                <div className="team-collection_card no-hover is-investors">
                  <div className="team-collection_image-wrap margin-bottom margin-custom2">
                    <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6716a1ddc5465ea77693ee66_19MF_bCS_400x400.webp" alt="Sabina Wizander" />
                  </div>
                  <div className="margin-bottom margin-xsmall">
                    <h3 className="heading-style-h5">Sabina Wizander</h3>
                  </div>
                  <p className="text-size-small margin-0">
                    Sabina is partner at Creandum, a top tier VC firm that has
                    invested in companies such as Spotify, Klarna, Depop and
                    Epidemic Sound.
                  </p>
                </div>
                <div className="team-collection_card no-hover is-investors">
                  <div className="team-collection_image-wrap margin-bottom margin-custom2">
                    <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6716a1ddc5465ea77693ee66_19MF_bCS_400x400.webp" alt="Gina King" />
                  </div>
                  <div className="margin-bottom margin-xsmall">
                    <h3 className="heading-style-h5">Gina King</h3>
                  </div>
                  <p className="text-size-small margin-0">
                    Gina is partner at Supernode Global, an early-stage VC that
                    invests in companies whose technologies will fundamentally
                    change the media landscape.
                  </p>
                </div>
                <div className="team-collection_card no-hover is-investors">
                  <div className="team-collection_image-wrap margin-bottom margin-custom2">
                    <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6716a1ddc5465ea77693ee66_19MF_bCS_400x400.webp" alt="Ali Abdaal" />
                  </div>
                  <div className="margin-bottom margin-xsmall">
                    <h3 className="heading-style-h5">Ali Abdaal</h3>
                  </div>
                  <p className="text-size-small margin-0">
                    Ali is a creator, entrepreneur and one of the most
                    influential YouTubers creators of our time with 3 million
                    subscribers.
                  </p>
                </div>
                <div className="team-collection_card no-hover is-investors">
                  <div className="team-collection_image-wrap margin-bottom margin-custom2">
                    <img src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6716a1ddc5465ea77693ee66_19MF_bCS_400x400.webp" alt="Kieran Flanagan" />
                  </div>
                  <div className="margin-bottom margin-xsmall">
                    <h3 className="heading-style-h5">Kieran Flanagan</h3>
                  </div>
                  <p className="text-size-small margin-0">
                    Kieran is a CMO and SVP for brands like Hubspot and Zapier.
                    He is also a Sequoia Scount Investor, Marketing Podcast Host
                    and B2B Creator.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

    </>
  );
}
