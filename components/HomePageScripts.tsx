"use client";

import { useEffect } from "react";
import { invokeApi } from "../api";

declare global {
  interface Window {
    $: any;
    Webflow: any;
    gsap: any;
    ScrollTrigger: any;
    MotionPathPlugin: any;
    Swiper: any;
    Vimeo: any;
    SplitType: any;
    CountUp: any;
  }
}

export default function HomePageScripts() {
  useEffect(() => {
    // Debug API hit on homepage mount
    const hitCmsApi = async () => {
      try {
        await invokeApi({
          path: "/api/website/content",
          method: "GET",
          queryParams: { type: "blog" },
        });
      } catch (error) {
        console.log("Homepage CMS hit failed on /api/website/content, trying /api/content", error);
        await invokeApi({
          path: "/api/content",
          method: "GET",
          queryParams: { type: "blog" },
        });
      }
    };

    hitCmsApi();

    // Wait for all scripts to load
    const initScripts = () => {
      if (typeof window === "undefined") return;

      const $ = (window as any).$;
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      const MotionPathPlugin = (window as any).MotionPathPlugin;
      const Swiper = (window as any).Swiper;
      const Vimeo = (window as any).Vimeo;
      const SplitType = (window as any).SplitType;

      if (!gsap || !$ || !Swiper) {
        // Scripts not loaded yet, retry
        setTimeout(initScripts, 100);
        return;
      }

      // Popup form handler
      if ($) {
        $('[data-popup-form="form-el"]').on("submit", function () {
          $('[data-popup-form="button-text"]').text("Redirecting...");
        });
      }

      // Platforms slider with auto-scroll
      const initBasicSwiper = () => {
        if (!Swiper) return;
        
        const swiperElement = document.querySelector("#basic-swiper");
        if (!swiperElement) {
          setTimeout(initBasicSwiper, 100);
          return;
        }

        try {
          const mySwiper = new Swiper("#basic-swiper", {
            direction: "horizontal",
            slidesPerView: 4,
            loopAdditionalSlides: 15,
            spaceBetween: 24,
            grabCursor: true,
            allowTouchMove: true,
            centeredSlides: true,
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
            speed: 1000,
            breakpoints: {
              0: {
                slidesPerView: 1.1,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              480: {
                slidesPerView: 2.3,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              767: {
                slidesPerView: 2.2,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              992: {
                slidesPerView: 6,
                slidesPerGroup: 1,
                spaceBetween: 32,
              },
            },
            touchEventsTarget: "container",
            touchReleaseOnEdges: true,
          });

          // Force autoplay to start
          setTimeout(() => {
            if (mySwiper && mySwiper.autoplay) {
              mySwiper.autoplay.start();
            }
          }, 100);
        } catch (error) {
          console.error("Error initializing basic swiper:", error);
        }
      };

      initBasicSwiper();

      // Lottie loader
      if ($ && (window as any).Webflow) {
        window.onload = function () {
          if (
            (window as any).Webflow.require(
              "lottie"
            ).lottie.getRegisteredAnimations().length > 0
          ) {
            const loadLottie = setInterval(function () {
              if (
                (window as any).Webflow.require(
                  "lottie"
                ).lottie.getRegisteredAnimations()[0].isLoaded === true
              ) {
                $(".lottie-loader").fadeOut();
                $(".lottie_hero-wrapper").css("min-height", "0rem");
                clearInterval(loadLottie);
              }
            }, 20);
          } else {
            $(".lottie-loader").fadeOut();
            $(".lottie_hero-wrapper").css("min-height", "0rem");
          }
        };
      }

      // AI Search Bento animation
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const aiSearch = document.querySelector('[data-bento-fx="ai-search"]');
        if (aiSearch) {
          const button = document.querySelector('[data-bento-fx="s-button"]');
          const scanner = aiSearch.querySelector(".scanner");
          const scanLine = aiSearch.querySelector(".scan-line");

          if (scanner && scanLine) {
            let isAnimationComplete = false;
            let hasScrollTriggered = false;

            const playButtonPressAnimation = () => {
              if (!button) return gsap.timeline();
              return gsap
                .timeline()
                .to(button, {
                  delay: 0.02,
                  duration: 0.15,
                  scale: 0.98,
                  ease: "power2.out",
                })
                .to(button, { duration: 0.15, scale: 1, ease: "power2.in" });
            };

            const scannerTl = gsap.timeline({
              paused: true,
              onComplete: () => {
                isAnimationComplete = true;
                gsap.delayedCall(1, fadeOut);
              },
              onReverseComplete: () => {
                isAnimationComplete = false;
              },
            });

            scannerTl.fromTo(
              scanner,
              { clipPath: "inset(0px 0px 0px 101%)" },
              {
                clipPath: "inset(0px 0px 0px calc(-1% - 110px))",
                duration: 1.5,
                ease: "power2.inOut",
              }
            );

            scannerTl.fromTo(
              scanLine,
              { right: "-1%" },
              {
                right: "calc(100% + 110px)",
                duration: 1.5,
                ease: "power2.inOut",
              },
              0
            );

            const fadeOut = () => {
              gsap.to([scanner, scanLine], {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                  scannerTl.progress(0).pause();
                  gsap.set([scanner, scanLine], { opacity: 1 });
                  isAnimationComplete = false;
                },
              });
            };

            ScrollTrigger.create({
              trigger: aiSearch,
              start: "top 60%",
              onEnter: () => {
                if (!hasScrollTriggered && !isAnimationComplete) {
                  scannerTl.play();
                  hasScrollTriggered = true;
                }
              },
              once: true,
            });

            aiSearch.addEventListener("mouseenter", () => {
              const buttonAnimation = playButtonPressAnimation();
              buttonAnimation.eventCallback("onComplete", () => {
                if (!isAnimationComplete) {
                  scannerTl.play();
                }
              });
            });

            aiSearch.addEventListener("mouseleave", () => {
              fadeOut();
            });
          }
        }
      }

      // B2B Platforms Swipers
      if (Swiper) {
        const swiper = new Swiper("#b2b-platforms", {
          freeMode: true,
          slidesPerView: "auto",
          watchSlidesProgress: true,
          touchRatio: 0,
          simulateTouch: false,
        });

        const swiper2 = new Swiper("#b2b-map", {
          slidesPerView: 1,
          effect: "fade",
          touchRatio: 0,
          simulateTouch: false,
          fadeEffect: {
            crossFade: true,
          },
          thumbs: {
            swiper: swiper,
          },
        });

        const swiper3 = new Swiper("#b2b-creators", {
          slidesPerView: 1,
          centeredSlides: true,
          touchRatio: 0,
          simulateTouch: false,
          speed: 500,
          spaceBetween: 0,
          breakpoints: {
            992: {
              slidesPerView: 1,
              centeredSlides: true,
              touchRatio: 0,
              simulateTouch: false,
              speed: 500,
              spaceBetween: 0,
            },
            480: {
              slidesPerView: 1,
              touchRatio: 0,
              simulateTouch: false,
              speed: 500,
              spaceBetween: 0,
            },
            0: {
              slidesPerView: "auto",
              touchRatio: 1,
              spaceBetween: 20,
            },
          },
        });

        const platformSlides = document.querySelectorAll(
          "#b2b-platforms .swiper-slide"
        );
        platformSlides.forEach(function (slide: any, index: number) {
          slide.addEventListener("mouseenter", function () {
            swiper2.slideTo(index);
            swiper3.slideTo(index);
          });
        });

        swiper2.on("slideChange", function () {
          swiper3.slideTo(swiper2.activeIndex);
        });

        swiper3.on("slideChange", function () {
          swiper2.slideTo(swiper3.activeIndex);
        });
      }

      // B2B Platforms tabs
      const tabs = document.querySelectorAll(".swiper-slide.b2b-platforms");
      const activeIndicator = document.querySelector(".active-indicator");

      if (tabs && activeIndicator) {
        tabs.forEach((tab: any, index: number) => {
          tab.addEventListener("click", () => {
            (activeIndicator as HTMLElement).style.left = "0px";
            const tabRect = tab.getBoundingClientRect();
            const containerRect = (
              tab.parentElement as HTMLElement
            ).getBoundingClientRect();
            const offset = tabRect.left - containerRect.left;
            const width = tabRect.width;

            (
              activeIndicator as HTMLElement
            ).style.clipPath = `inset(0 calc(100% - (${
              offset + width
            }px)) 0 ${offset}px round 8px)`;

            tabs.forEach((t: any) => t.classList.remove("active"));
            tab.classList.add("active");
          });
        });

        if ($) {
          $(".swiper-slide.b2b-platforms").hover(function () {
            $(this).trigger("click");
          });
        }
      }

      // MediaKit Bento
      if (gsap && ScrollTrigger) {
        const tl = gsap.timeline({
          paused: true,
          defaults: {
            duration: 0.5,
            ease: "power2.out",
          },
        });

        gsap.set(
          '[data-mediakit-bento="profile"], [data-mediakit-bento="engagement"], [data-mediakit-bento="views"], [data-mediakit-bento="locations"], [data-mediakit-bento="sponsored"], [data-mediakit-bento="buttons"] div',
          { autoAlpha: 1, y: 0 }
        );
        gsap.set(".green-bar rect", { fill: "#3EBB85" });
        gsap.set('[data-mediakit-bento="buttons"] div', { scale: 1 });

        tl.from('[data-mediakit-bento="profile"]', { autoAlpha: 0, y: 20 })
          .from(
            '[data-mediakit-bento="engagement"]',
            { autoAlpha: 0, y: 20 },
            "-=0.4"
          )
          .add(() => {
            // CounterUp initialization would go here
            const perfPercent = document.getElementById("perf-percent");
            if (perfPercent && (window as any).CountUp) {
              // Initialize counter
            }
          })
          .from(".green-bar rect", { fill: "#fff", stagger: 0.2 }, "-=0.4")
          .from(
            '[data-mediakit-bento="views"]',
            { autoAlpha: 0, y: 20 },
            "-=0.4"
          )
          .from(
            '[data-mediakit-bento="sponsored"]',
            { autoAlpha: 0, y: 20 },
            "-=0.4"
          )
          .from(
            '[data-mediakit-bento="locations"]',
            { autoAlpha: 0, y: 20 },
            "-=0.4"
          )
          .from(".loc_graph-progress", { width: "0%", stagger: 0.15 }, "-=0.4")
          .from(
            '[data-mediakit-bento="buttons"] .perf-bento',
            { autoAlpha: 0, scale: 0.9, stagger: 0.2 },
            "-=0.4"
          );

        ScrollTrigger.create({
          trigger: '[data-mediakit-bento="trigger"]',
          start: "top 70%",
          onEnter: () => tl.play(),
          once: true,
        });

        const mediaKitTrigger = document.querySelector(
          '[data-mediakit-bento="trigger"]'
        );
        const elementsToFade = document.querySelectorAll(
          '[data-mediakit-bento="engagement"], [data-mediakit-bento="views"], [data-mediakit-bento="sponsored"], [data-mediakit-bento="locations"], [data-mediakit-bento="buttons"]'
        );
        const overlay = document.querySelector(
          '[data-mediakit-bento="overlay"]'
        );
        const profile = document.querySelector(
          '[data-mediakit-bento="profile"]'
        );

        if (mediaKitTrigger && elementsToFade && overlay && profile) {
          mediaKitTrigger.addEventListener("mouseenter", () => {
            gsap.to(elementsToFade, {
              opacity: 0,
              scale: 0.5,
              duration: 0.2,
              ease: "power2.out",
            });
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.out",
            });
            gsap.to(profile, {
              scale: 1.025,
              duration: 0.25,
              ease: "power2.out",
            });
          });

          mediaKitTrigger.addEventListener("mouseleave", () => {
            gsap.to(elementsToFade, {
              opacity: 1,
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            });
            gsap.to(overlay, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            });
            gsap.to(profile, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            });
          });
        }
      }

      // AI Rec Bento
      if (gsap && ScrollTrigger && SplitType) {
        const createBentoAnimation = () => {
          const aiTrigger = document.querySelector(
            '[data-airec-bento="trigger"]'
          );
          const input = document.querySelector('[data-airec-bento="input"]');
          const aiLine = document.querySelector('[data-airec-bento="ai-line"]');
          const aiSymbol = document.querySelector(
            '[data-airec-bento="ai-symbol"]'
          );
          const dashboard = document.querySelector(
            '[data-airec-bento="dashboard"]'
          );
          const changedText = document.querySelector(
            '[data-airec-bento="changedText"]'
          );
          const aiDashImg = document.querySelector(".ai-dash-img");

          if (
            !aiTrigger ||
            !input ||
            !aiLine ||
            !aiSymbol ||
            !dashboard ||
            !changedText
          )
            return;

          gsap.set(input, { y: 100 });
          gsap.set(aiLine, { scaleY: 0, transformOrigin: "top" });
          gsap.set(dashboard, { scaleY: 1, transformOrigin: "top" });
          gsap.set([aiSymbol, dashboard, changedText], { opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: aiTrigger,
              start: "top 65%",
              end: "top 20%",
              toggleActions: "play none none none",
            },
          });

          tl.to(input, {
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          })
            .to(
              changedText,
              {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
              },
              "-=0.4"
            )
            .to(aiLine, {
              scaleY: 1,
              duration: 0.6,
              ease: "power2.out",
            })
            .call(() => aiSymbol.classList.add("active"))
            .to(aiSymbol, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            })
            .to({}, { duration: 0.9 })
            .call(() => aiSymbol.classList.remove("active"))
            .to(dashboard, {
              scaleY: 1,
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            })
            .to(
              changedText,
              {
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
              },
              "-=0.1"
            );

          aiTrigger.addEventListener("mouseenter", () => {
            gsap.to(aiSymbol, {
              onStart: () => aiSymbol.classList.add("activeHover"),
              duration: 0.8,
              onComplete: () => {
                aiSymbol.classList.remove("activeHover");
                if (aiDashImg) {
                  gsap.to(aiDashImg, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              },
            });
          });

          aiTrigger.addEventListener("mouseleave", () => {
            if (aiDashImg) {
              gsap.to(aiDashImg, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });
        };

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", createBentoAnimation);
        } else {
          createBentoAnimation();
        }
      }

      // Bento Profiles Swiper
      if (Swiper && gsap && ScrollTrigger && SplitType) {
        let bentoSwiper = new Swiper("#bento-profiles", {
          slidesPerView: "auto",
          spaceBetween: 0,
          centeredSlides: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          grabCursor: false,
        });

        let dummyTopPosition = 0;
        let dummyBottomPosition = 0;
        let slideChangeCount = 0;

        const animateSlide = (slide: any) => {
          const timeline = gsap.timeline();

          gsap.set(bentoSwiper.slides, { clearProps: "all" });

          if (
            !slide ||
            typeof (slide as Element).querySelector !== "function"
          ) {
            return timeline;
          }

          const dummyTop = document.querySelector(
            '[data-evaluate-bento="dummy-top"]'
          );
          const dummyBottom = document.querySelector(
            '[data-evaluate-bento="dummy-bottom"]'
          );

          slideChangeCount++;
          if (slideChangeCount > 3) {
            dummyTopPosition = 0;
            dummyBottomPosition = 0;
            slideChangeCount = 1;
          } else {
            dummyTopPosition += 15;
            dummyBottomPosition -= 15;
          }

          if (dummyTop && dummyBottom) {
            timeline
              .to(
                dummyTop,
                { x: dummyTopPosition, duration: 0.3, ease: "power1.out" },
                0
              )
              .to(
                dummyBottom,
                { x: dummyBottomPosition, duration: 0.3, ease: "power1.out" },
                0
              );
          }

          const summaryText = slide.querySelector(".ai-summary-text");
          if (summaryText && SplitType) {
            const splitText = new SplitType(summaryText, { types: "words" });

            gsap.set(splitText.words, { opacity: 0, filter: "blur(3px)" });

            const circle = slide.querySelector(".inner-circle circle");
            const progressText = slide.querySelector(".progress-text");
            const endValue = parseInt(progressText?.textContent || "0");
            let circumference = 0;

            if (circle) {
              circumference =
                2 * Math.PI * (circle as SVGCircleElement).r.baseVal.value;

              gsap.set(circle, {
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
              });
            }
            if (progressText) {
              gsap.set(progressText, { textContent: "0" });
            }

            timeline
              .fromTo(
                slide.querySelector(".p_card-pic"),
                { filter: "blur(4px)", opacity: 0 },
                { filter: "blur(0px)", opacity: 1, duration: 0.5 }
              )
              .from(slide.querySelector(".p_card-name"), {
                y: 0,
                opacity: 0,
                duration: 0.2,
              })
              .from(slide.querySelector(".match-tag"), {
                opacity: 0,
                duration: 0.2,
              })
              .to(splitText.words, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "expo.out",
                stagger: 0.05,
              })
              .from(
                slide.querySelector(".p_card-rating"),
                { opacity: 0, scale: 0.9, duration: 0.2 },
                "-=0.4"
              );

            if (circle && progressText) {
              timeline
                .to(
                  circle,
                  {
                    strokeDashoffset:
                      circumference - circumference * (endValue / 100),
                    duration: 1.2,
                    ease: "power1.out",
                  },
                  "-=0.3"
                )
                .to(
                  progressText,
                  {
                    textContent: endValue,
                    duration: 1.2,
                    ease: "power1.out",
                    snap: { textContent: 1 },
                    onUpdate: function () {
                      (progressText as HTMLElement).textContent = Math.floor(
                        (this.targets()[0] as any).textContent
                      ).toString();
                    },
                  },
                  "<"
                );
            }
          }

          return timeline;
        };

        let hasAutoplayed = false;
        let autoplayInterval: any;

        ScrollTrigger.create({
          trigger: "#bento-profiles",
          start: "top 80%",
          onEnter: () => {
            if (!hasAutoplayed) {
              startAutoplay();
            }
          },
        });

        const startAutoplay = () => {
          hasAutoplayed = true;
          let currentSlide = 0;
          const totalSlides = bentoSwiper.slides.length;

          const playNextSlide = () => {
            if (currentSlide < totalSlides - 1) {
              bentoSwiper.slideNext();
              currentSlide++;
              autoplayInterval = gsap.delayedCall(4, playNextSlide);
            }
          };

          playNextSlide();
        };

        bentoSwiper.on("slideChangeTransitionStart", function () {
          const activeSlide = bentoSwiper.slides[bentoSwiper.activeIndex];
          if (activeSlide) {
            animateSlide(activeSlide).play();
          }
        });

        const initialSlide = bentoSwiper.slides[bentoSwiper.activeIndex];
        if (initialSlide) {
          animateSlide(initialSlide).play();
        }

        const swiperContainer = document.querySelector("#bento-profiles");
        let hoverTimeout: any;

        if (swiperContainer) {
          swiperContainer.addEventListener("mouseenter", () => {
            if (autoplayInterval) {
              autoplayInterval.kill();
            }

            hoverTimeout = setTimeout(() => {
              if (bentoSwiper.isEnd) {
                bentoSwiper.slideTo(0);
              } else {
                bentoSwiper.slideNext();
              }
            }, 500);
          });

          swiperContainer.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimeout);
          });
        }
      }

      // Globe Bento with MotionPath
      if (gsap && ScrollTrigger && MotionPathPlugin) {
        gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

        const customEase = gsap.parseEase("sine.inOut");

        const globeTl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.5,
          paused: true,
        });

        const paths = [
          "center-to-top",
          "center-to-tp-small",
          "random-bottom",
          "random-left",
          "random-straight-top",
          "bottom-right",
        ];

        paths.forEach((path, index) => {
          globeTl.set(`#light-${path}`, { opacity: 1 }, index * 1.5);

          const lightTween = globeTl.to(
            `#light-${path}`,
            {
              duration: 2,
              ease: customEase,
              motionPath: {
                path: `#${path}`,
                align: `#${path}`,
                autoRotate: true,
                alignOrigin: [0.5, 0.5],
                rotationalOffset: 90,
                smoothOrigin: true,
              },
              onUpdate: function () {
                const progress = this.progress();
                if (progress > 0.8) {
                  gsap.to(this.targets()[0], {
                    opacity: 1 - (progress - 0.8) / 0.2,
                    duration: 0.05,
                    overwrite: "auto",
                  });
                }
              },
            },
            index * 1.5
          );

          if (path === "center-to-top") {
            globeTl.to(
              '[data-globe-bento="top-right-card"]',
              {
                opacity: 1,
                duration: 0.2,
                ease: "power2.in",
              },
              `>-0.3`
            );

            globeTl.to(
              '[data-globe-bento="top-right-card"]',
              {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
              },
              `>+1.7`
            );
          }

          if (path === "center-to-tp-small") {
            globeTl.to(
              '[data-globe-bento="top-right-small"]',
              {
                opacity: 1,
                duration: 0.2,
                ease: "power2.in",
              },
              `>-0.3`
            );

            globeTl.to(
              '[data-globe-bento="top-right-small"]',
              {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
              },
              `>+1.7`
            );
          }
        });

        ScrollTrigger.create({
          trigger: '[data-globe-bento="trigger"]',
          start: "top center",
          end: "bottom center",
          onEnter: () => globeTl.play(),
          onLeave: () => globeTl.pause(),
          onEnterBack: () => globeTl.play(),
          onLeaveBack: () => globeTl.pause(),
        });
      }

      // Selected count updater
      if (gsap) {
        const selectedCountElement = document.getElementById("selected-no");

        if (selectedCountElement) {
          const updateSelectedCount = () => {
            const checkboxes = document.querySelectorAll(
              '.sc_checkbox-item input[type="checkbox"]'
            );
            const count = Array.from(checkboxes).filter(
              (cb: any) => (cb as HTMLInputElement).checked
            ).length;

            gsap.to(selectedCountElement, {
              duration: 0.5,
              innerText: count,
              snap: { innerText: 1 },
              ease: "power2.out",
            });
          };

          document
            .querySelectorAll('.sc_checkbox-item input[type="checkbox"]')
            .forEach((checkbox) => {
              checkbox.addEventListener("change", updateSelectedCount);
            });

          updateSelectedCount();
        }
      }

      // Measure Bento animation
      if (gsap && ScrollTrigger) {
        const measureTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-measure-bento="trigger"]',
            start: "top 65%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        });

        measureTimeline
          .from('[data-measure-bento="stat"]', {
            y: -10,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out",
          })
          .from(
            '[data-measure-bento="graph"]',
            {
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "<"
          );

        if (window.innerWidth > 992) {
          const triggerEl = document.querySelector(
            '[data-measure-bento="trigger"]'
          );
          const comingSoonElement = document.querySelector(
            '[data-measure-bento="coming-soon"]'
          );
          let hoverTimeout: any;

          if (triggerEl && comingSoonElement) {
            triggerEl.addEventListener("mouseenter", () => {
              hoverTimeout = setTimeout(() => {
                comingSoonElement.classList.add("active");
              }, 0);
            });

            triggerEl.addEventListener("mouseleave", () => {
              clearTimeout(hoverTimeout);
              comingSoonElement.classList.remove("active");
            });
          }
        }
      }

      // Hero Lottie Video Setup
      const vimeoIframe = document.querySelector(
        "#vimeo-vid"
      ) as HTMLIFrameElement;
      const playButton = document.querySelector(
        '[data-hero-video="play-button"]'
      );
      const closePlayBtn = document.querySelector("#video-close-play");
      const bgCloseBtn = document.querySelector("#bg-close-btn");

      if (vimeoIframe && Vimeo && playButton) {
        const vimeoPlayer = new Vimeo.Player(vimeoIframe);

        playButton.addEventListener("click", () => {
          vimeoPlayer.play().catch((error: any) => {
            if (error.name === "NotAllowedError") {
              vimeoPlayer.setVolume(0);
              vimeoPlayer.play();
            }
          });
        });

        if (closePlayBtn) {
          closePlayBtn.addEventListener("click", () => {
            vimeoPlayer.pause();
          });
        }

        if (bgCloseBtn) {
          bgCloseBtn.addEventListener("click", () => {
            vimeoPlayer.pause();
          });
        }
      }

      // Navbar dropdown hover
      if ($) {
        $(".navdrop-toggle").hover(function () {
          if ($(window).width() && $(window).width()! > 992) {
            $(this).click();
          }
        });
      }
    };

    // Start initialization
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initScripts);
    } else {
      // DOM already loaded, wait a bit for scripts
      setTimeout(initScripts, 100);
    }
  }, []);

  return null;
}
