import React, { useState, useEffect, useRef } from "react";

const SectionModals = () => {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const isOpeningRef = useRef(false);

  useEffect(() => {
    // Add click handlers to all modal items that have images
    const handleModalClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent immediate closing
      if (isOpeningRef.current) return;

      const target = e.currentTarget as HTMLElement;
      const modalItem = target.closest('.modal-item') as HTMLElement;

      if (!modalItem) return;

      const hasImage = modalItem.querySelector('.modal-inside-img');
      const hasPopup = modalItem.querySelector('.popup-wrapper');

      // Only proceed if card has image or popup
      if (!hasImage && !hasPopup) return;

      const modalId = modalItem.getAttribute('data-modal-id') ||
        Array.from(document.querySelectorAll('.modal-item')).indexOf(modalItem).toString();

      isOpeningRef.current = true;
      setOpenModalId((prev) => {
        // Toggle: if same modal is open, close it; otherwise open the clicked one
        return prev === modalId ? null : modalId;
      });

      // Reset opening flag after a short delay
      setTimeout(() => {
        isOpeningRef.current = false;
      }, 500);
    };

    const handleCloseClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenModalId(null);
    };

    const handlePopupClick = (e: Event) => {
      // Stop propagation so clicking inside popup doesn't close it
      e.stopPropagation();
    };

    const handlePopupWrapperClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const popupInner = (e.currentTarget as HTMLElement).querySelector('.popup-inner');

      // Only close if clicking directly on the wrapper background (not on inner content)
      if (target === e.currentTarget || (popupInner && !popupInner.contains(target) && !target.closest('.popup-content-wrapper'))) {
        e.stopPropagation();
        setOpenModalId(null);
      }
    };

    const modalItems = document.querySelectorAll('.modal-item');

    modalItems.forEach((item, index) => {
      const hasImage = item.querySelector('.modal-inside-img');
      const hasPopup = item.querySelector('.popup-wrapper');
      const modalToggle = item.querySelector('.modal-toggle');

      // Make clickable if it has an image OR has a popup wrapper (like Intercom card)
      if ((hasImage || hasPopup) && modalToggle) {
        const modalId = `modal-${index}`;
        item.setAttribute('data-modal-id', modalId);
        modalToggle.setAttribute('style', 'cursor: pointer;');
        modalToggle.addEventListener('click', handleModalClick);
      }
    });

    // Add close handlers to all close buttons
    const closeButtons = document.querySelectorAll('.popup-close');
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', handleCloseClick);
    });

    // Prevent popup from closing when clicking inside it
    const popupWrappers = document.querySelectorAll('.popup-wrapper');
    popupWrappers.forEach((wrapper) => {
      wrapper.addEventListener('click', handlePopupWrapperClick);
      const popupInner = wrapper.querySelector('.popup-inner');
      if (popupInner) {
        popupInner.addEventListener('click', handlePopupClick);
      }
    });

    return () => {
      // Cleanup
      modalItems.forEach((item) => {
        const modalToggle = item.querySelector('.modal-toggle');
        if (modalToggle) {
          modalToggle.removeEventListener('click', handleModalClick);
        }
      });
      closeButtons.forEach((btn) => {
        btn.removeEventListener('click', handleCloseClick);
      });
      popupWrappers.forEach((wrapper) => {
        wrapper.removeEventListener('click', handlePopupWrapperClick);
        const popupInner = wrapper.querySelector('.popup-inner');
        if (popupInner) {
          popupInner.removeEventListener('click', handlePopupClick);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Update popup visibility based on state and match background colors
    const modalItems = document.querySelectorAll('.modal-item');

    modalItems.forEach((item, index) => {
      const modalId = `modal-${index}`;
      const popupWrapper = item.querySelector('.popup-wrapper') as HTMLElement;
      const popupInner = item.querySelector('.popup-inner') as HTMLElement;
      const popupContentWrapper = item.querySelector('.popup-content-wrapper') as HTMLElement;
      const modalToggle = item.querySelector('.modal-toggle') as HTMLElement;

      if (popupWrapper && popupInner && popupContentWrapper) {
        if (openModalId === modalId) {
          // Detect card background color and apply matching gradient to popup
          if (modalToggle) {
            const computedStyle = window.getComputedStyle(modalToggle);
            const bgColor = computedStyle.backgroundColor;
            const bgImage = computedStyle.backgroundImage;

            // Check for gradient classes or background colors
            let gradientClass = '';

            // Check if card has data-bg-gradient attribute
            const cardBgGradient = item.getAttribute('data-bg-gradient') ||
              modalToggle.getAttribute('data-bg-gradient');

            if (cardBgGradient) {
              // Map data-bg-gradient to popup gradient classes
              const gradientMap: { [key: string]: string } = {
                'orange': 'orange-gradient',
                'orange-solid': 'orange-gradient',
                'yellow': 'yellow-gradient',
                'yellow-solid': 'yellow-gradient',
                'green': 'green-gradient',
                'green-solid': 'green-gradient',
                'purple': 'purple-bg',
                'purple-solid': 'purple-bg',
                'pink': 'purple-bg', // pink uses purple-bg
                'pink-solid': 'purple-bg',
                'blue': 'blue-gradient',
                'blue-solid': 'blue-gradient',
                'cyan': 'cyan-gradient',
                'cyan-solid': 'cyan-gradient',
                'red': 'red-gradient',
                'red-solid': 'red-gradient',
              };

              gradientClass = gradientMap[cardBgGradient] || '';
            } else {
              // Try to detect from existing popup class or image
              const existingGradient = popupContentWrapper.className.match(/(orange|yellow|green|purple|pink|blue|cyan|red|obsidian)-gradient|purple-bg/);
              if (existingGradient) {
                gradientClass = existingGradient[0];
              }
            }

            // Remove all gradient classes and add the correct one
            if (gradientClass) {
              popupContentWrapper.className = popupContentWrapper.className
                .replace(/\s*(orange|yellow|green|purple|pink|blue|cyan|red|obsidian)-gradient|purple-bg/g, '')
                .trim() + ' ' + gradientClass;
            }
          }

          // Specific styling for Intercom
          const modalContentBlock = item.querySelector('.modal_content-block') as HTMLElement;
          if (item.classList.contains('intercom') && modalContentBlock) {
            modalContentBlock.style.backgroundColor = '#ffd43b'; // Yellow
          }

          // Specific styling for Gamma (modal-0)
          if (modalId === 'modal-0') {
            // Remove top padding, add bottom padding to prevent sticking
            popupInner.style.paddingBottom = '2rem';
            popupInner.style.paddingLeft = '0';
            popupInner.style.paddingRight = '0';
            // Remove side margins, keep minimal bottom margin
            popupContentWrapper.style.margin = 'auto';
            popupContentWrapper.style.padding = '0';
            popupContentWrapper.style.width = '96%';
            popupContentWrapper.style.maxWidth = '90rem';
            popupContentWrapper.style.maxWidth = '90rem';
            popupContentWrapper.style.transform = 'none';

            // Ensure proper centering
            popupWrapper.style.display = 'flex';
            popupWrapper.style.alignItems = 'center';
            popupWrapper.style.justifyContent = 'center';
          } else {
            // Reset Gamma styles for other modals
            popupInner.style.paddingBottom = '';
            popupInner.style.paddingTop = '';
            popupContentWrapper.style.margin = '';
            popupContentWrapper.style.padding = '';
            popupContentWrapper.style.width = '';
            popupContentWrapper.style.maxWidth = '';
            popupContentWrapper.style.transform = '';

            // Reset wrapper alignment
            popupWrapper.style.alignItems = '';
            popupWrapper.style.justifyContent = '';
          }

          // specific check for Guidde or modal-3
          const modalName = item.querySelector('.modal-inside-name')?.textContent?.trim();

          // Replit (modal-1): layout uses .replit-popup-compact in CSS — no extra inline sizing
          if (modalId === 'modal-1' || modalName === 'Replit') {
            popupInner.style.paddingTop = '0.75rem';
            popupInner.style.paddingBottom = '0.75rem';
            popupContentWrapper.style.maxHeight = 'min(92vh, 100%)';
            popupContentWrapper.style.overflowY = 'auto';
            popupContentWrapper.style.height = 'auto';
          }

          // Guidde: layout/CSS via .guidde-popup-compact
          if (modalName === 'Guidde') {
            popupInner.style.paddingTop = '0.75rem';
            popupInner.style.paddingBottom = '0.75rem';
            popupContentWrapper.style.maxHeight = 'min(92vh, 100%)';
            popupContentWrapper.style.overflowY = 'auto';
            popupContentWrapper.style.height = 'auto';
          }

          // Nebius: layout/CSS via .nebius-popup-compact
          if (modalName === 'Nebius') {
            popupInner.style.paddingTop = '0.75rem';
            popupInner.style.paddingBottom = '0.75rem';
            popupContentWrapper.style.maxHeight = 'min(92vh, 100%)';
            popupContentWrapper.style.overflowY = 'auto';
            popupContentWrapper.style.height = 'auto';
          }

          if (modalId !== 'modal-0' && modalId !== 'modal-1' && modalName !== 'Replit' && modalName !== 'Guidde' && modalName !== 'Nebius') {
            // Reset for others
            popupContentWrapper.style.maxHeight = '';
            popupContentWrapper.style.overflowY = '';
            popupContentWrapper.style.height = '';

            const modalImage = item.querySelector('.modal_img-item') as HTMLElement;
            if (modalImage) {
              modalImage.style.height = '';
              modalImage.style.objectFit = '';
              modalImage.style.position = '';
            }
          }

          popupWrapper.style.display = 'flex';
          setTimeout(() => {
            popupInner.style.opacity = '1';
          }, 10);
        } else {
          // Reset Intercom styling when closing
          if (item.classList.contains('intercom')) {
            const modalContentBlock = item.querySelector('.modal_content-block') as HTMLElement;
            if (modalContentBlock) {
              modalContentBlock.style.backgroundColor = '';
            }
          }
          // Reset Gamma styles when closing
          if (modalId === 'modal-0') {
            popupInner.style.paddingBottom = '';
            popupInner.style.paddingTop = '';
            popupContentWrapper.style.margin = '';
            popupContentWrapper.style.padding = '';
            popupContentWrapper.style.width = '';
            popupContentWrapper.style.maxWidth = '';
          }

          // Reset Replit, Guidde, and Nebius image styles when closing
          const modalName = item.querySelector('.modal-inside-name')?.textContent?.trim();
          if (modalId === 'modal-1' || modalName === 'Replit' || modalName === 'Guidde' || modalName === 'Nebius') {
            popupInner.style.paddingTop = '';
            popupInner.style.paddingBottom = '';
            popupContentWrapper.style.maxHeight = '';
            popupContentWrapper.style.overflowY = '';
            popupContentWrapper.style.height = '';
            popupContentWrapper.style.paddingBottom = '';
            popupContentWrapper.style.marginBottom = '';

            const modalImage = item.querySelector('.modal_img-item') as HTMLElement;
            if (modalImage) {
              modalImage.style.objectFit = '';
              modalImage.style.position = '';
              modalImage.style.height = '';
              modalImage.style.maxHeight = '';
              modalImage.style.width = '';
              modalImage.style.inset = '';
              modalImage.style.transform = '';
              modalImage.style.marginBottom = '';
              modalImage.style.paddingBottom = '';
            }

            // Reset image wrap styles
            const modalImgWrap = item.querySelector('.modal_img-wrap') as HTMLElement;
            if (modalImgWrap) {
              modalImgWrap.style.paddingBottom = '';
              modalImgWrap.style.marginBottom = '';
              modalImgWrap.style.maxHeight = '';
              modalImgWrap.style.height = '';
              modalImgWrap.style.alignSelf = '';
            }

            // Reset content block styles (for Nebius)
            if (modalName === 'Nebius') {
              const popupContent = item.querySelector('.popup-content') as HTMLElement;
              if (popupContent) {
                popupContent.style.paddingBottom = '';
                popupContent.style.marginBottom = '';
              }
              const modalContentBlock = item.querySelector('.modal_content-block') as HTMLElement;
              if (modalContentBlock) {
                modalContentBlock.style.paddingBottom = '';
                modalContentBlock.style.marginBottom = '';
              }
              const testimonialInnerText = item.querySelector('.testimonial_inner-text') as HTMLElement;
              if (testimonialInnerText) {
                testimonialInnerText.style.marginBottom = '';
                testimonialInnerText.style.paddingBottom = '';
              }
              const testimonialModalDetails = item.querySelector('.testimonial_modal-details') as HTMLElement;
              if (testimonialModalDetails) {
                testimonialModalDetails.style.marginTop = '';
                testimonialModalDetails.style.paddingTop = '';
                testimonialModalDetails.style.marginBottom = '';
                testimonialModalDetails.style.paddingBottom = '';
              }
            }

            // Reset character icon styles (for Guidde)
            if (modalName === 'Guidde') {
              const characterIcon = item.querySelector('.pf_character-modal') as HTMLElement;
              if (characterIcon) {
                characterIcon.style.width = '';
                characterIcon.style.height = '';
              }
            }
          }

          popupInner.style.opacity = '0';
          setTimeout(() => {
            popupWrapper.style.display = 'none';
          }, 300);
        }
      }
    });
  }, [openModalId]);

  return (
    <div className="section_modals">
      <div className="padding-section-xmedium">
        <div className="padding-global">
          <div className="container-xlarge">
            <div className="modals_outer-component">
              <div className="max-width-medium">
                <h2 className="heading-style-h3-v2">
                  Powering the people building category-defining brands
                </h2>
              </div>
              <div className="modals_grid-wrapper">
                <div
                  id="w-node-eb0ba1c9-2947-1882-02b1-ea91be5ae479-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Gamma</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{
                    display: "none", paddingTop: "25px"
                  }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper orange-gradient"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                          width: "95vw",
                          maxWidth: "90rem",
                          margin: "1rem",
                          padding: "1rem",
                        }}
                      >
                        <a
                          aria-label="modal-close-button"
                          href="#"
                          className="popup-close w-inline-block"
                        >
                          <div className="icon-embed-xsmall w-embed">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              height="100%"
                              viewBox="0 0 24 24"
                              fill="none"
                              preserveAspectRatio="xMidYMid meet"
                              aria-hidden="true"
                              role="img"
                            >
                              <rect
                                width={24}
                                height={24}
                                rx={12}
                                fill="url(#paint0_linear_1019_42266)"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.21731 8.21995C8.51553 7.92173 8.99903 7.92173 9.29725 8.21995L11.9971 10.9198L14.697 8.21995C14.9952 7.92173 15.4787 7.92173 15.7769 8.21995C16.0751 8.51817 16.0751 9.00167 15.7769 9.29989L13.0771 11.9998L15.7769 14.6996C16.0751 14.9978 16.0751 15.4813 15.7769 15.7796C15.4787 16.0778 14.9952 16.0778 14.697 15.7796L11.9971 13.0797L9.29725 15.7796C8.99903 16.0778 8.51553 16.0778 8.21731 15.7796C7.91909 15.4813 7.91909 14.9978 8.21731 14.6996L10.9172 11.9998L8.21731 9.29989C7.91909 9.00167 7.91909 8.51817 8.21731 8.21995Z"
                                fill="url(#paint1_linear_1019_42266)"
                                stroke="url(#paint2_linear_1019_42266)"
                                strokeWidth="0.954545"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_1019_42266"
                                  x1={12}
                                  y1={0}
                                  x2={12}
                                  y2={24}
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#3B3D3D" />
                                  <stop offset={1} stopColor="#191A1A" />
                                </linearGradient>
                                <linearGradient
                                  id="paint1_linear_1019_42266"
                                  x1="8.21731"
                                  y1="8.21995"
                                  x2="15.7769"
                                  y2="15.7796"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#FBFBF8" />
                                  <stop offset={1} stopColor="#F7F5EE" />
                                </linearGradient>
                                <linearGradient
                                  id="paint2_linear_1019_42266"
                                  x1="8.21731"
                                  y1="8.21995"
                                  x2="15.7769"
                                  y2="15.7796"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#FBFBF8" />
                                  <stop offset={1} stopColor="#F7F5EE" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </a>
                        <div className="popup-content">
                          <div
                            className="modal_img-wrap"
                          // style={{ backgroundColor: '#ff9147' }}
                          >
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              sizes="(max-width: 479px) 100vw, (max-width: 991px) 460px, (max-width: 1279px) 32vw, 24vw"
                              alt="modal-img"
                              className="modal_img-item"
                            />
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width="120.5"
                              alt="character"
                              className="pf_character-modal"
                            />
                          </div>
                          <div
                            className="modal_content-block"
                            style={{ backgroundColor: '#ff9147' }}
                          >
                            <div className="modal-testimonial">
                              "Supreme Coach has been a game-changer for us at
                              Gamma. Their platform has streamlined our entire
                              creator marketing process, allowing us to
                              collaborate with over 30 creators seamlessly,
                              cutting down campaign management time by more than
                              half. Since integrating Passionfroot, we've seen a
                              significant boost in user engagement and signups,
                              all while maintaining the same ad spend. It's rare
                              to find a tool that makes such an immediate
                              Supreme Coach has been instrumental in
                              scaling our growth effortlessly."
                            </div>
                            <div className="testimonial_modal-details">
                              <div className="inside_modal-name-wrap">
                                <div className="modal-testimonial">
                                  Grant Lee
                                </div>
                                <div>Founder &amp; CEO of Gamma</div>
                              </div>
                              <div className="testimonial_author-stats">
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 64 64"
                                      fill="none"
                                      preserveAspectRatio="xMidYMid meet"
                                      aria-hidden="true"
                                      role="img"
                                    >
                                      <path
                                        d="M31.6056 49.2828C31.6676 49.5956 31.5407 49.7874 31.2987 50.0117C30.5875 50.6698 29.7524 50.5518 28.9113 50.5193C28.6516 50.5104 28.389 50.6167 28.1322 50.6078C27.4535 50.5872 26.7777 50.5075 26.0989 50.5045C25.6267 50.5016 25.1546 50.5872 24.8211 50.6226C24.6352 50.9856 24.5614 51.3545 24.3578 51.4577C24.1896 51.5404 23.8266 51.3545 23.6171 51.1981C23.3131 50.9708 23.0239 50.6934 22.8144 50.3777C22.537 49.9586 22.3422 49.4864 22.1179 49.0349C21.7107 48.2145 21.2916 47.403 21.1441 46.4793C21.1057 46.2461 20.8962 46.0455 20.7958 45.8182C20.2794 44.6526 19.7541 43.4898 19.2642 42.3124C18.9337 41.5215 18.6681 40.7011 18.3405 39.9072C18.1251 39.3878 17.8477 38.895 17.6057 38.3874C17.3903 37.93 17.1749 37.4726 16.983 37.0034C16.7322 36.3866 16.4666 35.7698 16.2836 35.1324C16.1922 34.8048 16.2659 34.43 16.2659 33.9992C16.0889 34.0316 15.7938 34.0966 15.4957 34.1349C15.3954 34.1497 15.2891 34.1025 15.1858 34.0789C14.8494 34.0021 14.5159 33.9224 14.1795 33.8457C13.7103 33.7395 13.5893 33.3381 13.5952 32.9722C13.5982 32.7597 13.8461 32.4882 14.0526 32.3554C14.3625 32.1607 14.2622 32.0338 14.1825 31.7416C14.0379 31.2045 13.7014 30.6497 14.0615 30.0418C14.1294 29.9267 13.9641 29.6877 13.9316 29.4988C13.8815 29.2184 13.8579 28.9322 14.1589 28.8997C14.1146 28.6607 14.0674 28.4482 14.0379 28.2328C13.9966 27.9318 13.9434 27.6308 13.9375 27.3268C13.9228 26.4474 13.9021 25.565 13.9316 24.6856C13.9611 23.7796 14.0467 22.8766 14.1087 21.9529C13.8697 21.888 13.7162 21.8584 13.5746 21.8053C13.2558 21.6873 12.9991 21.5073 13.0493 21.1148C13.0994 20.7282 13.368 20.5541 13.7192 20.4773C13.9641 20.4242 14.209 20.3682 14.4569 20.3298C14.7609 20.2796 15.0648 20.2295 15.3688 20.2058C16.1479 20.1409 17.0096 19.8576 17.6913 20.0937C18.5707 20.3947 19.3587 20.0376 20.1879 20.1468C21.026 20.256 21.9084 20.0347 22.7524 20.1291C23.7646 20.2413 24.7562 20.5334 25.7595 20.7429C25.8894 20.7695 26.034 20.7931 26.1609 20.7695C26.7216 20.6544 27.2764 20.5157 27.8342 20.3977C27.9817 20.3682 28.1411 20.3977 28.2916 20.3741C28.4804 20.3445 28.6634 20.2944 28.8464 20.2413C29.0736 20.1734 29.292 20.0848 29.5192 20.017C29.8792 19.9078 30.2422 19.8015 30.6052 19.7071C30.8974 19.6304 31.1925 19.5655 31.4905 19.5123C32.0335 19.415 32.5795 19.353 33.1166 19.232C33.3025 19.1907 33.4471 18.9782 33.633 18.9133C34.6423 18.5562 35.6545 18.2198 36.6697 17.8804C37.0031 17.7712 37.3602 17.721 37.676 17.5764C38.2397 17.3197 38.7826 17.0128 39.3315 16.7236C39.4437 16.6645 39.5529 16.5436 39.6591 16.5495C40.2818 16.5819 40.6182 16.1156 41.052 15.8087C41.297 15.6346 41.5685 15.493 41.8164 15.3218C42.442 14.8821 43.0735 14.4453 43.6814 13.985C43.9087 13.8109 44.0916 13.5718 44.2835 13.3564C44.8678 12.6954 45.5996 12.4357 46.4613 12.5537C46.5794 12.5685 46.7299 12.6599 46.783 12.7603C47.0191 13.2059 47.2758 13.6515 47.4234 14.1266C47.5532 14.5545 47.5237 15.0267 47.6093 15.4723C47.7893 16.399 47.7392 17.3079 47.571 18.2345C47.4559 18.8661 47.4677 19.5212 47.4234 20.1586C48.2999 20.2472 48.9698 20.619 49.678 20.8462C50.5338 21.1236 51.006 21.767 51.6641 22.2185C52.1304 22.5372 52.1481 23.1067 52.3458 23.5642C52.6143 24.1898 52.8062 24.8567 52.9508 25.5266C53.2046 26.6923 53.3403 27.8698 52.9685 29.0502C52.8032 29.5755 52.7353 30.1333 52.5642 30.6586C52.4904 30.8858 52.2897 31.0865 52.1068 31.2547C51.7379 31.5911 51.3749 31.96 50.944 32.1961C50.3951 32.4971 49.7961 32.7774 49.1881 32.8837C48.6451 32.9781 48.0579 32.8276 47.4204 32.7774C47.3939 33.1581 47.3467 33.5388 47.3496 33.9195C47.3526 34.5097 47.388 35.0999 47.4145 35.6931C47.4382 36.2922 47.4942 36.8942 47.4824 37.4932C47.4736 37.9949 47.4116 38.4996 47.3349 38.9983C47.2847 39.3347 47.2965 39.5767 47.6034 39.8305C48.052 40.2023 48.4445 40.6479 48.8104 41.1024C48.9314 41.25 48.896 41.5244 48.9314 41.7398C48.7101 41.731 48.4622 41.7812 48.2704 41.6985C47.8631 41.5274 47.4854 41.2883 47.0722 41.0611C46.9807 41.4241 46.9247 41.7841 46.7889 42.1087C46.7122 42.2946 46.5174 42.4835 46.3345 42.5484C46.2518 42.578 45.9833 42.336 45.9361 42.1766C45.7649 41.61 45.6675 41.0227 45.5082 40.4532C45.455 40.2614 45.337 40.0341 45.1776 39.9338C44.4281 39.4587 43.6726 38.9924 42.8876 38.5822C41.9462 38.0894 40.9694 37.6674 40.0221 37.1922C39.5352 36.9473 39.0807 36.6433 38.6056 36.3807C38.2042 36.1623 37.7468 36.0177 37.3838 35.7492C36.7553 35.2829 35.9673 35.3773 35.2974 35.0468C34.6364 34.7222 33.9163 34.5097 33.2081 34.3002C32.6415 34.132 32.0483 34.0434 31.4699 33.9106C31.3194 33.8752 31.1748 33.8162 31.0272 33.766C30.7734 33.6805 30.5285 33.5713 30.2688 33.5152C29.3746 33.3204 28.4745 33.1522 27.5804 32.9633C27.0138 32.8453 26.9105 32.6889 26.7511 33.3853C26.6714 33.7277 26.5918 34.1025 26.1697 34.1821C25.8599 34.2412 25.6031 33.9726 25.3671 33.3352C22.7229 33.9549 20.0138 34.1408 17.2339 33.8752C17.7297 34.6219 18.2107 35.2622 18.5973 35.9587C18.9544 36.602 19.2141 37.3014 19.5121 37.9772C19.5416 38.048 19.518 38.172 19.5623 38.1986C20.182 38.5792 20.1791 39.3259 20.5538 39.8512C20.6748 40.0223 20.6955 40.2643 20.787 40.462C21.2798 41.5421 21.7903 42.6134 22.2714 43.6994C22.472 44.1509 22.596 44.6378 22.779 45.0982C23.0652 45.83 23.378 46.5501 23.6702 47.279C23.8443 47.7099 24.0037 48.1466 24.1896 48.6306C24.9067 48.5303 25.6504 48.3916 26.3999 48.3355C27.0108 48.2912 27.6276 48.3473 28.2414 48.3591C28.3034 48.3591 28.3712 48.3857 28.4303 48.3709C29.6727 48.0611 30.6052 48.8106 31.6174 49.2917L31.6056 49.2828ZM27.0197 31.5291C27.4387 31.5291 27.8312 31.5114 28.2207 31.5321C28.8316 31.5675 29.4454 31.7091 30.0475 31.6619C30.8029 31.6029 31.4256 31.9747 32.1103 32.1311C32.184 32.1488 32.2283 32.2875 32.2785 32.3584C32.5234 32.3318 32.7743 32.2374 32.9897 32.2935C33.9842 32.5531 34.9787 32.8217 35.9496 33.1552C37.1802 33.5772 38.399 34.0375 39.5971 34.5422C40.2493 34.8166 40.8514 35.215 41.474 35.5662C42.2944 36.0266 43.1178 36.481 43.9264 36.9621C44.4281 37.2601 44.9032 37.5965 45.4462 37.9536C45.2248 37.446 45.5524 36.9443 45.2691 36.4604C45.1835 36.3128 45.3104 35.9971 45.4078 35.7905C45.5436 35.5042 45.6144 35.2357 45.3931 34.9819C45.098 34.6396 45.4196 34.3061 45.3783 33.9667C45.3311 33.589 45.2986 33.2053 45.3075 32.8276C45.3252 32.022 45.4019 31.2193 45.4049 30.4136C45.4078 29.5755 45.3488 28.7374 45.3163 27.8993C45.2839 27.0494 45.2455 26.1965 45.2189 25.3466C45.2042 24.9364 45.1835 24.5262 45.2071 24.119C45.2455 23.4402 45.3399 22.7615 45.3665 22.0827C45.399 21.2594 45.3694 20.4331 45.4049 19.6068C45.4432 18.6949 45.5141 17.786 45.5996 16.88C45.6498 16.3606 45.7619 15.8471 45.8475 15.3307C45.8829 15.1241 45.9243 14.9205 45.9626 14.705C45.6144 14.947 45.3016 15.1388 45.0153 15.3661C44.1477 16.0537 43.3214 16.7973 42.4213 17.4377C41.5773 18.0368 40.5976 18.4234 39.7004 18.9516C39.0276 19.3471 38.2485 19.5684 37.5048 19.8399C36.8615 20.073 36.2034 20.2649 35.5512 20.4714C35.079 20.6219 34.6128 20.7872 34.1347 20.9082C33.6773 21.0233 33.2022 21.0587 32.7447 21.1738C32.0512 21.3479 31.3754 21.6135 30.676 21.7463C29.9206 21.8909 29.1444 21.9293 28.3742 22.006C28.0909 22.0355 27.8017 22.0149 27.5243 22.065C27.4121 22.0857 27.241 22.2244 27.2321 22.3188C27.1849 22.9267 27.1584 23.5347 27.1613 24.1455C27.1672 25.1076 27.2262 26.0696 27.2203 27.0287C27.2174 27.796 27.0374 28.5456 27.1466 29.3394C27.241 30.027 27.0728 30.7589 27.0197 31.5291ZM15.9974 22.2096C15.9974 22.9208 16.0092 23.5524 15.9915 24.1839C15.9797 24.5882 15.7938 25.0368 15.9148 25.3879C16.2069 26.2408 15.8026 27.07 15.959 27.9141C16.0948 28.6518 16.1538 29.4102 16.1833 30.1628C16.201 30.5936 16.0771 31.0274 16.0417 31.4612C16.0298 31.5911 16.1036 31.7298 16.1302 31.8655C16.1804 32.1282 16.3072 32.0367 16.4637 31.957C16.5522 31.9128 16.6761 31.901 16.7765 31.9187C17.4405 32.0397 18.0867 32.0662 18.7655 31.9246C19.3646 31.8006 20.002 31.8301 20.6217 31.8449C21.206 31.8596 21.8051 32.0485 22.3688 31.9688C23.1921 31.8508 23.9387 32.137 24.7208 32.2226C25.0956 32.2639 25.1752 32.199 25.131 31.8065C25.0631 31.2163 24.827 30.6349 25.0129 30.0211C25.0483 29.9001 25.01 29.7437 24.9746 29.6109C24.8388 29.1388 24.8595 28.6902 25.1398 28.2977C25.0749 28.156 24.9687 28.0291 24.9716 27.9082C24.9923 27.07 25.0336 26.2349 25.0778 25.3968C25.1162 24.6708 25.1693 23.9478 25.1988 23.2218C25.2077 23.0389 25.1221 22.8441 25.1487 22.667C25.2018 22.31 25.3021 21.9617 25.3877 21.5899C25.2372 21.5751 25.1693 21.5486 25.1133 21.5633C24.0361 21.8939 22.9855 22.3749 21.811 22.0916C21.7579 22.0798 21.693 22.127 21.631 22.1358C21.3064 22.186 20.9818 22.2627 20.6571 22.2686C20.0699 22.2775 19.4826 22.2303 18.8953 22.2332C18.3051 22.2362 17.7149 22.2686 17.1276 22.2923C16.9034 22.3011 16.6791 22.3247 16.325 22.3483C16.5669 22.1388 16.6909 22.0355 16.8119 21.9293C16.7853 21.885 16.7558 21.8407 16.7293 21.7965C16.4784 21.9411 16.2246 22.0798 15.9974 22.2096ZM51.0208 27.8875C50.9204 27.2707 50.7935 26.6598 50.7286 26.0401C50.6578 25.3584 50.4955 24.7092 50.2063 24.0924C50.0528 23.7648 49.9377 23.3723 49.681 23.1481C49.2295 22.7526 48.7012 22.428 48.1641 22.1565C48.0313 22.0886 47.5975 21.8319 47.5119 22.2362C47.3968 22.7674 47.3673 23.3281 47.3791 23.8711C47.3968 24.6325 47.509 25.3938 47.5414 26.1582C47.5592 26.5359 47.4677 26.9195 47.4736 27.3002C47.4854 27.979 47.568 28.6548 47.5562 29.3306C47.5444 29.9975 47.4411 30.6615 47.4057 31.3285C47.3939 31.5291 47.4765 31.8065 47.7569 31.6944C48.3855 31.4435 49.0553 31.2753 49.5806 30.7914C49.9761 30.4284 50.3361 30.1244 50.5043 29.5312C50.6578 28.9971 50.8703 28.4807 51.0208 27.8875Z"
                                        fill="url(#paint0_linear_1019_42595)"
                                      />
                                      <path
                                        d="M31.6191 49.2976C31.507 49.0645 31.4243 48.8077 31.2768 48.6011C30.8607 48.0198 30.7515 47.3145 30.4416 46.6918C30.2823 46.3701 29.9842 46.1134 29.6832 45.7474C28.9867 45.954 28.2283 46.2639 27.4433 46.3731C27.1158 46.4173 26.6583 46.1045 26.3898 45.8301C26.1272 45.5556 26.1773 45.0953 26.4872 44.8385C26.6672 44.688 26.9889 44.6851 27.2515 44.6585C27.8653 44.5936 28.4821 44.5552 29.0664 44.508C28.8953 43.9443 28.7536 43.481 28.6149 43.0147C28.4172 42.3478 28.0808 42.1973 27.4522 42.4806C26.8148 42.7698 26.1567 42.6518 25.5104 42.5308C25.1444 42.4629 24.7431 42.4127 24.5837 41.9848C24.5424 41.8727 24.5365 41.7487 24.5129 41.61C24.5896 41.4979 24.7726 41.3503 24.7697 41.2028C24.7667 40.8103 25.0264 40.7277 25.2979 40.6893C26.0327 40.586 26.7705 40.5152 27.4699 40.4355C27.2309 39.6446 26.9889 38.839 26.7528 38.051C26.2481 38.2192 25.8409 38.417 25.41 38.4848C24.7342 38.5911 23.9876 38.8124 23.4535 38.1691C23.3236 38.0156 23.4063 37.6585 23.4387 37.4018C23.4889 37.0211 23.725 36.7998 24.1204 36.7644C24.9172 36.6935 25.714 36.6227 26.5344 36.546C26.5344 36.2981 26.5019 35.9912 26.5462 35.699C26.5787 35.4866 26.7144 35.2888 26.8029 35.0852C27.0361 35.1885 27.3578 35.2298 27.4876 35.4098C27.8535 35.9145 28.1929 36.4486 28.4437 37.0182C28.8953 38.0422 29.2878 39.0928 29.6773 40.1404C29.9222 40.7955 30.0875 41.4802 30.3501 42.1265C30.5272 42.5573 30.84 42.9262 31.0436 43.3482C31.3948 44.0742 31.6545 44.8503 32.0559 45.5468C32.4484 46.2255 32.6638 46.9544 32.9028 47.6804C32.9618 47.8545 32.9117 48.064 32.9117 48.3296C33.2097 48.4329 33.1566 48.7103 32.9973 49.0113C32.7936 49.3979 32.4129 49.572 31.9968 49.454C31.8611 49.4156 31.7342 49.3448 31.6043 49.2887C31.6043 49.2828 31.6191 49.2976 31.6191 49.2976Z"
                                        fill="url(#paint1_linear_1019_42595)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_1019_42595"
                                          x1="33.1203"
                                          y1="12.5261"
                                          x2="33.1203"
                                          y2="51.4781"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_1019_42595"
                                          x1="28.2545"
                                          y1="35.0852"
                                          x2="28.2545"
                                          y2="49.4905"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      collabs
                                    </div>
                                    <div>30</div>
                                  </div>
                                </div>
                                <div className="stat-divider w-embed">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 1 68"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                    role="img"
                                  >
                                    <rect
                                      width={1}
                                      height={68}
                                      fill="url(#paint0_linear_1019_42594)"
                                    />
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_1019_42594"
                                        x1="0.5"
                                        y1={0}
                                        x2="0.5"
                                        y2={68}
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#802A00" />
                                        <stop offset={1} stopColor="#802A00" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M36.3929 9.45282C36.4505 9.28018 36.5147 9.09426 36.5789 8.90613C36.6231 8.77334 36.6386 8.61176 36.7227 8.51216C36.8378 8.37715 37.0481 8.17353 37.1455 8.20673C37.3159 8.26427 37.504 8.46126 37.5527 8.63611C37.6811 9.09648 37.7586 9.57234 37.8117 10.0482C37.8471 10.3669 37.805 10.6923 37.805 11.0154C37.805 11.4581 37.8294 11.903 37.8095 12.3434C37.7873 12.8303 37.6767 13.3173 37.6988 13.802C37.7209 14.3221 37.5704 14.8466 37.6213 15.3314C37.6922 15.9865 37.5262 16.5996 37.5239 17.2326C37.5217 17.9918 37.504 18.7531 37.4753 19.5123C37.4642 19.8155 37.3801 20.1143 37.3712 20.4175C37.3602 20.7894 37.4044 21.1612 37.4022 21.5331C37.3956 22.3298 37.3093 23.1311 37.3757 23.9212C37.4443 24.7357 37.2097 25.5281 37.2716 26.3226C37.3115 26.8339 37.2517 27.343 37.3048 27.8388C37.3978 28.7086 37.3513 29.574 37.3823 30.4394C37.4066 31.1255 37.4421 31.8117 37.462 32.5C37.4708 32.8165 37.4775 33.2636 37.6302 33.4539C37.8714 33.7527 37.774 33.9519 37.732 34.233C37.6767 34.5938 37.4177 34.6845 37.161 34.6801C36.4992 34.6712 35.8396 34.6026 35.1801 34.5606C34.536 34.5185 33.8897 34.4853 33.2456 34.4344C32.8539 34.4034 32.4643 34.337 32.0726 34.306C31.6897 34.2751 31.3068 34.2795 30.9239 34.2463C30.5941 34.2175 30.2997 34.0737 30.3395 33.6465C30.3683 33.3366 30.2532 33.0179 30.2333 32.6992C30.2134 32.4137 30.2245 32.1215 30.2422 31.836C30.2776 31.2982 30.3595 30.7603 30.3639 30.2247C30.3705 29.2841 30.3395 28.3434 30.313 27.4027C30.2997 26.9291 30.2532 26.4577 30.2422 25.984C30.2377 25.8556 30.3108 25.7251 30.3351 25.5945C30.3484 25.517 30.3351 25.4351 30.3263 25.3576C30.2931 25.0832 30.2399 24.8087 30.2222 24.5343C30.1957 24.1116 30.1913 23.6866 30.1758 23.2616C30.1735 23.2152 30.1492 23.1532 30.1713 23.1222C30.51 22.6618 30.0894 22.1882 30.1979 21.7168C30.2754 21.3825 30.2731 21.0262 30.2864 20.6787C30.2975 20.3799 30.2731 20.0789 30.2798 19.7779C30.282 19.6584 30.344 19.5389 30.3395 19.4216C30.3196 18.8727 30.2731 18.3238 30.2643 17.7749C30.2599 17.5026 30.3263 17.2282 30.3395 16.9537C30.3573 16.5509 30.3462 16.1459 30.3617 15.7408C30.375 15.3978 30.4126 15.0569 30.4281 14.7139C30.4546 14.1495 30.4901 13.5851 30.4945 13.0207C30.4989 12.4386 30.4569 11.8565 30.4679 11.2744C30.4701 11.146 30.5764 10.9911 30.6804 10.8959C30.9039 10.6878 30.8198 10.5064 30.6317 10.3868C30.3816 10.2275 30.3573 9.99287 30.4082 9.77375C30.4768 9.48159 30.822 9.33773 31.1297 9.35101C31.3577 9.35986 31.5901 9.27354 31.8225 9.26469C32.5529 9.24034 33.2943 9.15845 34.0136 9.24034C34.7153 9.32002 35.4235 9.1496 36.1096 9.35322C36.1849 9.37535 36.2624 9.40634 36.3929 9.45282ZM36.4261 10.6679C35.9636 10.6679 35.5408 10.6679 35.1181 10.6679C34.8768 10.6679 34.6378 10.6657 34.3965 10.6746C34.1309 10.6856 33.8653 10.7277 33.5998 10.7233C33.073 10.7144 32.5462 10.6945 32.0217 10.6546C31.683 10.6281 31.6941 10.8029 31.745 11.0398C31.7915 11.2522 31.8402 11.4669 31.8623 11.6838C31.9044 12.1265 31.9486 12.5714 31.9575 13.0162C31.9641 13.4124 31.9176 13.8086 31.9021 14.2048C31.8778 14.7847 31.8535 15.3646 31.8402 15.9467C31.8247 16.5686 31.8291 17.1883 31.8114 17.8103C31.8003 18.1799 31.7516 18.5473 31.7428 18.9147C31.7317 19.3529 31.7494 19.7934 31.7428 20.2338C31.7406 20.4397 31.6941 20.6433 31.6919 20.8469C31.6919 21.3936 31.7052 21.9403 31.7118 22.487C31.714 22.5711 31.7184 22.653 31.7184 22.7371C31.7162 23.3635 31.7384 23.992 31.7007 24.6184C31.6875 24.8419 31.4794 25.0611 31.7539 25.258C31.7671 25.2669 31.7649 25.3023 31.7671 25.3267C31.7826 25.8136 31.8136 26.3005 31.8114 26.7874C31.8092 27.8808 31.8092 28.9742 31.7804 30.0654C31.7583 30.8644 31.6786 31.6611 31.6543 32.4602C31.6498 32.604 31.7693 32.8652 31.8601 32.8785C32.3293 32.9471 32.8096 32.9626 33.2855 32.9825C33.7193 33.0002 34.1531 32.9803 34.5869 33.0135C35.0229 33.0467 35.4545 33.1286 35.8883 33.1706C35.9392 33.175 36.0521 33.071 36.0521 33.0179C36.0521 32.6793 36.0145 32.3406 36.0145 32.002C36.0145 31.5815 36.0853 31.1543 36.0388 30.7404C35.9591 30.0366 35.8086 29.3416 35.9923 28.6333C36.0034 28.5957 35.9724 28.547 35.9702 28.5028C35.9282 27.8166 35.8573 27.1283 35.8573 26.4422C35.8573 25.7693 35.9503 25.0965 35.9613 24.4214C35.9702 23.8238 35.8994 23.2262 35.906 22.6286C35.9104 22.2369 36.0123 21.8473 36.0277 21.4534C36.0565 20.7363 36.0344 20.0191 36.0742 19.302C36.1185 18.4986 36.041 17.6952 36.207 16.8851C36.3155 16.3561 36.176 15.7895 36.2447 15.2229C36.3531 14.3398 36.2889 13.4368 36.3177 12.5426C36.3354 11.9229 36.3863 11.3031 36.4261 10.6679Z"
                                        fill="url(#paint0_linear_2037_86526)"
                                      />
                                      <path
                                        d="M16.7636 16.7721C16.83 17.3011 16.9208 17.8057 16.9473 18.3126C16.9694 18.7729 16.9075 19.2377 16.9075 19.7003C16.9075 20.2868 16.9517 20.8734 16.9451 21.4621C16.9407 21.9889 16.8787 22.5156 16.8698 23.0446C16.8654 23.2903 16.9451 23.5382 16.9517 23.7861C16.9805 24.7666 17.0137 25.7471 17.0093 26.7298C17.0049 27.3074 16.9141 27.8851 16.8964 28.465C16.8853 28.8346 16.9517 29.2043 16.9672 29.5761C16.9761 29.7952 16.9495 30.0165 16.954 30.2357C16.965 30.7447 17.0049 31.2538 16.9938 31.7628C16.9872 32.086 16.9296 32.4135 16.8588 32.7301C16.7813 33.0842 16.6485 33.425 16.5688 33.7792C16.4958 34.1001 16.29 34.1709 16.0266 34.089C15.8451 34.0315 15.7056 33.9739 15.5662 34.1576C15.5264 34.2085 15.4179 34.224 15.3404 34.224C14.5968 34.2262 13.8531 34.2351 13.1094 34.213C12.5627 34.1953 12.0205 34.1089 11.4738 34.0979C10.9006 34.0868 10.3273 34.1488 9.75406 34.1444C9.54601 34.1421 9.33796 34.0448 9.08122 33.9784C8.98162 34.182 8.81783 34.1444 8.58986 33.9407C8.10736 33.5069 7.9303 33.0598 8.57215 32.6415C8.68061 32.5707 8.67618 32.2896 8.67618 32.1059C8.68061 31.5371 8.61642 30.9749 8.71381 30.395C8.80676 29.835 8.69831 29.2419 8.68503 28.662C8.67839 28.3809 8.68725 28.102 8.68946 27.8209C8.6961 27.002 8.68946 26.1831 8.71602 25.3642C8.7293 24.9923 8.83996 24.6249 8.85767 24.2531C8.87538 23.899 8.8289 23.5404 8.80677 23.1863C8.78906 22.8764 8.71602 22.5599 8.76029 22.2589C8.85988 21.5573 8.74701 20.8645 8.73151 20.1673C8.72266 19.78 8.58322 19.3838 8.63191 19.0098C8.75586 18.0757 8.63413 17.1528 8.61199 16.2232C8.60093 15.7164 8.67839 15.6212 9.17196 15.4353C9.36231 15.3644 9.5283 15.225 9.71643 15.1431C9.91563 15.0546 10.1303 14.9505 10.3273 15.163C10.345 15.1829 10.3959 15.1829 10.4269 15.1741C11.0931 14.986 11.7704 15.132 12.4432 15.1077C12.9833 15.0878 13.5278 15.2228 14.0722 15.256C14.63 15.2892 15.1922 15.2604 15.7499 15.2936C16.1262 15.3157 16.5069 15.3711 16.8721 15.4618C17.0425 15.5039 17.2063 15.6477 17.328 15.785C17.6069 16.0993 17.5272 16.5176 17.0602 16.7123C16.9805 16.7389 16.8853 16.7455 16.7636 16.7721ZM15.7743 16.9115C15.5242 16.8761 15.2895 16.8363 15.0549 16.8097C14.6521 16.7632 14.2493 16.6968 13.8443 16.6858C13.4436 16.6747 13.0408 16.7278 12.6402 16.7389C11.8611 16.7632 11.0798 16.7743 10.3007 16.8053C10.2277 16.8075 10.0971 16.9204 10.0971 16.9802C10.1015 17.3763 10.1348 17.7703 10.1591 18.1665C10.179 18.5051 10.2056 18.8438 10.2189 19.1824C10.2388 19.7114 10.2432 20.2426 10.2675 20.7715C10.2875 21.2253 10.3406 21.6768 10.3517 22.1305C10.3583 22.385 10.2432 22.6551 10.2985 22.8919C10.4092 23.3567 10.3782 23.8082 10.345 24.2708C10.3295 24.4921 10.3406 24.7134 10.3384 24.937C10.3317 25.5058 10.3384 26.0724 10.3096 26.639C10.2919 26.9644 10.2255 27.2897 10.1635 27.6129C10.1414 27.7302 10.0197 27.8431 10.0307 27.9493C10.0573 28.226 10.1591 28.496 10.1768 28.7727C10.1989 29.1224 10.1724 29.4743 10.1547 29.8262C10.148 29.9789 10.0883 30.1316 10.0971 30.2821C10.1148 30.5433 10.1901 30.8 10.2011 31.059C10.2211 31.5614 10.2078 32.0638 10.2277 32.5663C10.2299 32.6305 10.3362 32.7411 10.3959 32.7455C10.6637 32.7588 10.9315 32.7455 11.1994 32.7278C11.4384 32.7123 11.6752 32.6548 11.912 32.6526C12.5185 32.6526 13.1249 32.6747 13.7314 32.6836C13.9062 32.6858 14.0855 32.6614 14.2581 32.6836C14.6875 32.7389 15.1147 32.8142 15.5507 32.8828C15.6038 32.4379 15.657 32.0041 15.7123 31.5459C15.6968 31.5083 15.6724 31.4176 15.6304 31.3357C15.4423 30.9727 15.6171 30.5765 15.5219 30.1958C15.4467 29.897 15.4976 29.565 15.502 29.2463C15.5042 29.0869 15.5374 28.9276 15.5419 28.766C15.5551 28.029 15.5618 27.2942 15.5751 26.5571C15.5773 26.3867 15.6525 26.1986 15.6016 26.0503C15.3427 25.3044 15.6658 24.543 15.4821 23.775C15.3427 23.1929 15.4887 22.5444 15.4976 21.9247C15.5064 21.3404 15.491 20.7583 15.5042 20.174C15.5197 19.3572 15.5352 18.5427 15.5861 17.7282C15.5972 17.4361 15.7123 17.155 15.7743 16.9115Z"
                                        fill="url(#paint1_linear_2037_86526)"
                                      />
                                      <path
                                        d="M26.3099 20.0683C26.5091 19.8669 26.6619 19.5814 26.8566 19.5482C27.1953 19.4929 27.2307 19.8912 27.2727 20.1037C27.3856 20.6814 27.4011 21.2768 27.4874 21.8589C27.6069 22.6579 27.3148 23.4414 27.4808 24.2559C27.6025 24.8579 27.4985 25.5064 27.514 26.1328C27.5273 26.7104 27.5782 27.2881 27.587 27.868C27.5892 28.0871 27.4941 28.3085 27.4918 28.5276C27.483 29.2779 27.5273 30.0304 27.4896 30.7785C27.452 31.52 27.5892 32.2769 27.3104 33.0029C27.2794 33.087 27.3347 33.2486 27.4033 33.3172C27.7176 33.6248 27.711 34.0299 27.3104 34.1848C26.7504 34.4017 26.1816 34.5876 25.5464 34.5234C24.8071 34.4504 24.0612 34.4615 23.3175 34.4349C22.9059 34.4194 22.4942 34.3751 22.0825 34.384C21.4827 34.3973 20.8829 34.4305 20.2853 34.4836C19.8205 34.5256 19.805 34.4194 19.774 33.928C19.7541 33.616 19.825 33.3172 19.794 33.0051C19.7364 32.4385 19.7608 31.8608 19.7497 31.2898C19.7386 30.5948 19.7209 29.8976 19.7231 29.2026C19.7231 28.9105 19.7696 28.6183 19.7829 28.3239C19.8095 27.6777 19.836 27.0314 19.8493 26.3851C19.8648 25.7078 19.8936 25.0283 19.8626 24.3533C19.8272 23.5344 19.7231 22.7176 19.6767 21.8987C19.6678 21.746 19.774 21.58 19.8493 21.4295C19.929 21.2679 20.0131 21.1418 19.774 21.0245C19.5926 20.9337 19.4155 20.3228 19.4775 20.1369C19.5771 19.8359 19.9245 19.6367 20.2831 19.65C20.728 19.6655 21.1861 19.5925 21.6133 19.6832C22.4566 19.8647 23.3021 19.6411 24.1431 19.7916C24.8757 19.92 25.6172 19.982 26.3099 20.0683ZM21.0002 21.2746C21.0865 21.6176 21.1706 21.912 21.2304 22.2108C21.3521 22.8128 21.3499 23.4215 21.3477 24.0323C21.3477 24.7716 21.3411 25.5108 21.3455 26.2501C21.3477 26.5179 21.4141 26.7879 21.3898 27.0513C21.3521 27.4563 21.2636 27.8592 21.195 28.262C21.1551 28.4899 21.0046 28.7688 21.0865 28.9348C21.2946 29.3664 21.1507 29.8047 21.1906 30.2318C21.2658 31.0485 21.1972 31.8785 21.1596 32.7019C21.1463 32.9985 21.2105 33.0582 21.4982 32.9763C21.6863 32.9232 21.9032 32.9498 22.1047 32.9675C22.4588 32.9985 22.8107 33.0826 23.1648 33.0848C23.7425 33.0892 24.3224 33.0383 24.9023 33.025C25.4003 33.014 25.8983 33.0228 26.2989 33.0228C26.2214 32.3854 26.113 31.6904 26.0576 30.9932C26.0222 30.555 26.0709 30.1101 26.0643 29.6696C26.051 28.8374 26.02 28.003 26.0067 27.1708C26.0001 26.7724 26.0333 26.3718 26.02 25.9712C26.0023 25.4267 25.9315 24.8823 25.9359 24.3378C25.9403 23.8663 26.0333 23.3949 26.0554 22.9235C26.0775 22.4321 26.0598 21.9408 26.0598 21.4605C25.885 21.4494 25.7345 21.4406 25.5862 21.4273C24.9244 21.3631 24.2648 21.2524 23.6031 21.248C22.886 21.2436 22.1733 21.5003 21.4473 21.2613C21.3123 21.2148 21.1441 21.2679 21.0002 21.2746Z"
                                        fill="url(#paint2_linear_2037_86526)"
                                      />
                                      <path
                                        d="M23.7685 37.6348C23.7685 37.6348 23.7796 37.5595 23.7951 37.471C23.7486 37.4843 23.7287 37.4865 23.711 37.4953C23.5516 37.5706 23.3923 37.71 23.2329 37.7122C22.6242 37.7145 22.0156 37.679 21.4069 37.6392C20.9598 37.6104 20.515 37.5308 20.0679 37.5175C19.5654 37.502 19.063 37.5285 18.5606 37.5485C18.0051 37.5706 17.4451 37.6613 16.894 37.6259C16.3384 37.5905 15.7918 37.4068 15.2362 37.3426C14.7382 37.2829 14.2336 37.2984 13.7312 37.2784C13.6205 37.274 13.5098 37.2629 13.3992 37.2563C13.3306 37.2519 13.2509 37.2209 13.1911 37.243C12.6024 37.471 11.9915 37.1456 11.3851 37.3316C11.0929 37.4223 10.741 37.2917 10.4156 37.2939C9.87116 37.2984 9.3289 37.336 8.78443 37.3448C8.60515 37.3471 8.42808 37.3028 8.24881 37.2829C7.48964 37.1965 6.72826 37.1213 5.97131 37.0128C5.83187 36.9929 5.71236 36.8402 5.58398 36.7495C5.69244 36.6211 5.77654 36.4285 5.91377 36.3776C6.79909 36.0412 7.68884 35.707 8.67598 35.9062C8.88845 35.9482 9.1297 35.8154 9.3621 35.7999C9.83354 35.7712 10.3072 35.7623 10.7808 35.7557C11.3696 35.7468 11.9605 35.7335 12.5493 35.7468C12.8104 35.7513 13.0716 35.8177 13.335 35.8486C13.6382 35.8841 13.9282 36.0102 14.2513 35.8331C14.3929 35.7557 14.6342 35.8663 14.8312 35.8863C15.4841 35.9571 16.137 36.0235 16.79 36.0921C16.8254 36.0965 16.8652 36.1076 16.8962 36.0987C17.3588 35.9372 17.8236 36.0833 18.2862 36.0833C18.7222 36.0833 19.156 36.0102 19.592 35.9903C19.8443 35.9792 20.0966 36.0191 20.349 36.0169C20.7806 36.0124 21.2631 35.8663 21.6349 36.0102C22.1285 36.2006 22.622 36.1784 23.1067 36.2205C23.7884 36.278 24.4812 36.2116 25.1695 36.205C25.32 36.2028 25.4706 36.2227 25.6211 36.2338C26.3913 36.2935 27.1615 36.3931 27.9318 36.3998C28.764 36.4086 29.5984 36.3024 30.4328 36.3024C31.1875 36.3024 31.9445 36.3754 32.6992 36.4175C32.7789 36.4219 32.863 36.433 32.9405 36.4197C33.1574 36.3843 33.3721 36.3002 33.5868 36.3002C34.0604 36.3024 34.5363 36.3887 35.0033 36.3555C35.5854 36.3156 36.1542 36.3488 36.7296 36.4175C37.4556 36.5038 38.1926 36.6521 38.912 36.599C39.5228 36.5547 40.043 36.8402 40.6251 36.8491C40.8486 36.8513 41.1009 37.0261 41.2846 37.1877C41.5281 37.4002 41.4152 37.7056 41.2138 37.9601C40.7623 38.5245 40.1935 38.2457 39.6667 38.239C39.2418 38.2346 38.819 38.1571 38.3918 38.1217C38.0621 38.0952 37.7101 38.1461 37.4069 38.0465C37.0417 37.9292 36.6942 38.011 36.3401 37.9845C35.9306 37.9535 35.5256 37.8694 35.1161 37.8251C34.9435 37.8052 34.7642 37.8185 34.5894 37.834C34.4013 37.8517 34.2153 37.9114 34.0272 37.9159C33.7948 37.9203 33.5624 37.8716 33.33 37.876C32.8209 37.8827 32.3119 37.9225 31.805 37.9203C31.4177 37.9181 31.0326 37.8716 30.6453 37.8495C30.5324 37.8428 30.4107 37.8185 30.3044 37.8473C29.8263 37.9756 29.3527 37.9181 28.868 37.876C28.3434 37.8318 27.81 37.9004 27.2788 37.8893C26.8185 37.8782 26.3514 37.7499 25.9044 37.8118C25.4883 37.8694 25.0899 37.5994 24.6826 37.8096C24.6184 37.8428 24.5144 37.8185 24.4325 37.8008C24.2267 37.7521 24.0186 37.6968 23.7685 37.6348Z"
                                        fill="url(#paint3_linear_2037_86526)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86526"
                                          x1="33.994"
                                          y1="8.20312"
                                          x2="33.994"
                                          y2="34.6803"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86526"
                                          x1="12.8226"
                                          y1="15.0381"
                                          x2="12.8226"
                                          y2="34.2276"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint2_linear_2037_86526"
                                          x1="23.5455"
                                          y1="19.543"
                                          x2="23.5455"
                                          y2="34.5363"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint3_linear_2037_86526"
                                          x1="23.5034"
                                          y1="35.7412"
                                          x2="23.5034"
                                          y2="38.3137"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#802A00" />
                                          <stop
                                            offset={1}
                                            stopColor="#802A00"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      New users in 3 months
                                    </div>
                                    <div>3 Million</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_21c9f382-a8c7-1cc6-8045-5dcb158724db-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={429}
                      sizes="(max-width: 479px) 100vw, (max-width: 991px) 429px, (max-width: 1279px) 32vw, 24vw"
                      alt="a logo of notion"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
                <div
                  id="w-node-d6f6d714-a96d-b815-27c8-6a8e2f0d07a8-41695672"
                  className="modal-item intercom"
                >
                  <a href="#" className="modal-toggle intercom w-inline-block">
                    <div className="icon-embed-custom-3 w-embed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 33 32"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                        role="img"
                      >
                        <path
                          d="M5.5 27C4.33333 27 3.58333 26.3623 3.58333 25.3261C3.58333 24.6087 4.33333 23.971 5.33333 23.2536C6.66667 22.1377 8.41667 20.4638 8.41667 18.1522C8.41667 16.7971 7.33333 16.6377 6.16667 16.2391C3.16667 15.442 1.5 13.4493 1.5 10.8188C1.5 7.71015 4.25 5 7.91667 5C12.0833 5 15.1667 8.26812 15.1667 13.7681C15.1667 21.4203 8.5 27 5.5 27ZM21.9167 27C20.6667 27 20 26.3623 20 25.3261C20 24.6087 20.6667 23.971 21.6667 23.2536C23 22.1377 24.75 20.4638 24.75 18.1522C24.75 16.7971 23.6667 16.6377 22.5 16.2391C19.5 15.442 17.8333 13.4493 17.8333 10.8188C17.8333 7.71015 20.5833 5 24.25 5C28.4167 5 31.5 8.26812 31.5 13.7681C31.5 21.4203 24.8333 27 21.9167 27Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="long-testimonial-text">
                      Partnering with creators through Supreme Coach has been a
                      game-changer for Intercom’s Startup program. By
                      collaborating with top newsletters, we’ve reached
                      thousands of founders
                    </div>
                    <div className="long_testimonial-botom">
                      <div className="long_author-wrapper">
                        <div>John Roche</div>
                        <div className="author-position-text">
                          Startups and VC Partnerships at Intercom
                        </div>
                      </div>
                      <div className="open-icon w-embed">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            width={24}
                            height={24}
                            rx={12}
                            fill="url(#paint0_linear_950_42983)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.4984 6.3999C12.9403 6.3999 13.2984 6.75807 13.2984 7.1999V11.1999H17.2984C17.7403 11.1999 18.0984 11.5581 18.0984 11.9999C18.0984 12.4417 17.7403 12.7999 17.2984 12.7999H13.2984V16.7999C13.2984 17.2417 12.9403 17.5999 12.4984 17.5999C12.0566 17.5999 11.6984 17.2417 11.6984 16.7999V12.7999H7.69844C7.25661 12.7999 6.89844 12.4417 6.89844 11.9999C6.89844 11.5581 7.25661 11.1999 7.69844 11.1999L11.6984 11.1999V7.1999C11.6984 6.75807 12.0566 6.3999 12.4984 6.3999Z"
                            fill="url(#paint1_linear_950_42983)"
                            stroke="url(#paint2_linear_950_42983)"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42983"
                              x1="12.5"
                              y1={0}
                              x2="12.5"
                              y2={24}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42983"
                              x1="12.4984"
                              y1="6.3999"
                              x2="12.4984"
                              y2="17.5999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42983"
                              x1="12.4984"
                              y1="6.3999"
                              x2="12.4984"
                              y2="17.5999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper yellow-gradient"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content">
                          <div
                            className="modal_img-wrap"
                            style={{ backgroundColor: '#ee5968' }}
                          >
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              alt="modal-img"
                              className="modal_img-item"
                            />
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={124}
                              alt="pf character"
                              className="pf_character-modal"
                            />
                          </div>
                          <div className="modal_content-block">
                            <div className="modal-testimonial">
                              “Partnering with creators through Supreme Coach has
                              been a game-changer for Intercom’s Startup
                              program. By collaborating with top newsletters,
                              we’ve reached thousands of founders”
                            </div>
                            <div className="testimonial_modal-details">
                              <div className="inside_modal-name-wrap">
                                <div className="modal-testimonial">
                                  John Roche
                                </div>
                                <div>
                                  Startups and VC Partnerships at Intercom
                                </div>
                              </div>
                              <div className="testimonial_author-stats">
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 64 64"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M31.6056 49.2828C31.6676 49.5956 31.5407 49.7874 31.2987 50.0117C30.5875 50.6698 29.7524 50.5518 28.9113 50.5193C28.6516 50.5104 28.389 50.6167 28.1322 50.6078C27.4535 50.5872 26.7777 50.5075 26.0989 50.5045C25.6267 50.5016 25.1546 50.5872 24.8211 50.6226C24.6352 50.9856 24.5614 51.3545 24.3578 51.4577C24.1896 51.5404 23.8266 51.3545 23.6171 51.1981C23.3131 50.9708 23.0239 50.6934 22.8144 50.3777C22.537 49.9586 22.3422 49.4864 22.1179 49.0349C21.7107 48.2145 21.2916 47.403 21.1441 46.4793C21.1057 46.2461 20.8962 46.0455 20.7958 45.8182C20.2794 44.6526 19.7541 43.4898 19.2642 42.3124C18.9337 41.5215 18.6681 40.7011 18.3405 39.9072C18.1251 39.3878 17.8477 38.895 17.6057 38.3874C17.3903 37.93 17.1749 37.4726 16.983 37.0034C16.7322 36.3866 16.4666 35.7698 16.2836 35.1324C16.1922 34.8048 16.2659 34.43 16.2659 33.9992C16.0889 34.0316 15.7938 34.0966 15.4957 34.1349C15.3954 34.1497 15.2891 34.1025 15.1858 34.0789C14.8494 34.0021 14.5159 33.9224 14.1795 33.8457C13.7103 33.7395 13.5893 33.3381 13.5952 32.9722C13.5982 32.7597 13.8461 32.4882 14.0526 32.3554C14.3625 32.1607 14.2622 32.0338 14.1825 31.7416C14.0379 31.2045 13.7014 30.6497 14.0615 30.0418C14.1294 29.9267 13.9641 29.6877 13.9316 29.4988C13.8815 29.2184 13.8579 28.9322 14.1589 28.8997C14.1146 28.6607 14.0674 28.4482 14.0379 28.2328C13.9966 27.9318 13.9434 27.6308 13.9375 27.3268C13.9228 26.4474 13.9021 25.565 13.9316 24.6856C13.9611 23.7796 14.0467 22.8766 14.1087 21.9529C13.8697 21.888 13.7162 21.8584 13.5746 21.8053C13.2558 21.6873 12.9991 21.5073 13.0493 21.1148C13.0994 20.7282 13.368 20.5541 13.7192 20.4773C13.9641 20.4242 14.209 20.3682 14.4569 20.3298C14.7609 20.2796 15.0648 20.2295 15.3688 20.2058C16.1479 20.1409 17.0096 19.8576 17.6913 20.0937C18.5707 20.3947 19.3587 20.0376 20.1879 20.1468C21.026 20.256 21.9084 20.0347 22.7524 20.1291C23.7646 20.2413 24.7562 20.5334 25.7595 20.7429C25.8894 20.7695 26.034 20.7931 26.1609 20.7695C26.7216 20.6544 27.2764 20.5157 27.8342 20.3977C27.9817 20.3682 28.1411 20.3977 28.2916 20.3741C28.4804 20.3445 28.6634 20.2944 28.8464 20.2413C29.0736 20.1734 29.292 20.0848 29.5192 20.017C29.8792 19.9078 30.2422 19.8015 30.6052 19.7071C30.8974 19.6304 31.1925 19.5655 31.4905 19.5123C32.0335 19.415 32.5795 19.353 33.1166 19.232C33.3025 19.1907 33.4471 18.9782 33.633 18.9133C34.6423 18.5562 35.6545 18.2198 36.6697 17.8804C37.0031 17.7712 37.3602 17.721 37.676 17.5764C38.2397 17.3197 38.7826 17.0128 39.3315 16.7236C39.4437 16.6645 39.5529 16.5436 39.6591 16.5495C40.2818 16.5819 40.6182 16.1156 41.052 15.8087C41.297 15.6346 41.5685 15.493 41.8164 15.3218C42.442 14.8821 43.0735 14.4453 43.6814 13.985C43.9087 13.8109 44.0916 13.5718 44.2835 13.3564C44.8678 12.6954 45.5996 12.4357 46.4613 12.5537C46.5794 12.5685 46.7299 12.6599 46.783 12.7603C47.0191 13.2059 47.2758 13.6515 47.4234 14.1266C47.5532 14.5545 47.5237 15.0267 47.6093 15.4723C47.7893 16.399 47.7392 17.3079 47.571 18.2345C47.4559 18.8661 47.4677 19.5212 47.4234 20.1586C48.2999 20.2472 48.9698 20.619 49.678 20.8462C50.5338 21.1236 51.006 21.767 51.6641 22.2185C52.1304 22.5372 52.1481 23.1067 52.3458 23.5642C52.6143 24.1898 52.8062 24.8567 52.9508 25.5266C53.2046 26.6923 53.3403 27.8698 52.9685 29.0502C52.8032 29.5755 52.7353 30.1333 52.5642 30.6586C52.4904 30.8858 52.2897 31.0865 52.1068 31.2547C51.7379 31.5911 51.3749 31.96 50.944 32.1961C50.3951 32.4971 49.7961 32.7774 49.1881 32.8837C48.6451 32.9781 48.0579 32.8276 47.4204 32.7774C47.3939 33.1581 47.3467 33.5388 47.3496 33.9195C47.3526 34.5097 47.388 35.0999 47.4145 35.6931C47.4382 36.2922 47.4942 36.8942 47.4824 37.4932C47.4736 37.9949 47.4116 38.4996 47.3349 38.9983C47.2847 39.3347 47.2965 39.5767 47.6034 39.8305C48.052 40.2023 48.4445 40.6479 48.8104 41.1024C48.9314 41.25 48.896 41.5244 48.9314 41.7398C48.7101 41.731 48.4622 41.7812 48.2704 41.6985C47.8631 41.5274 47.4854 41.2883 47.0722 41.0611C46.9807 41.4241 46.9247 41.7841 46.7889 42.1087C46.7122 42.2946 46.5174 42.4835 46.3345 42.5484C46.2518 42.578 45.9833 42.336 45.9361 42.1766C45.7649 41.61 45.6675 41.0227 45.5082 40.4532C45.455 40.2614 45.337 40.0341 45.1776 39.9338C44.4281 39.4587 43.6726 38.9924 42.8876 38.5822C41.9462 38.0894 40.9694 37.6674 40.0221 37.1922C39.5352 36.9473 39.0807 36.6433 38.6056 36.3807C38.2042 36.1623 37.7468 36.0177 37.3838 35.7492C36.7553 35.2829 35.9673 35.3773 35.2974 35.0468C34.6364 34.7222 33.9163 34.5097 33.2081 34.3002C32.6415 34.132 32.0483 34.0434 31.4699 33.9106C31.3194 33.8752 31.1748 33.8162 31.0272 33.766C30.7734 33.6805 30.5285 33.5713 30.2688 33.5152C29.3746 33.3204 28.4745 33.1522 27.5804 32.9633C27.0138 32.8453 26.9105 32.6889 26.7511 33.3853C26.6714 33.7277 26.5918 34.1025 26.1697 34.1821C25.8599 34.2412 25.6031 33.9726 25.3671 33.3352C22.7229 33.9549 20.0138 34.1408 17.2339 33.8752C17.7297 34.6219 18.2107 35.2622 18.5973 35.9587C18.9544 36.602 19.2141 37.3014 19.5121 37.9772C19.5416 38.048 19.518 38.172 19.5623 38.1986C20.182 38.5792 20.1791 39.3259 20.5538 39.8512C20.6748 40.0223 20.6955 40.2643 20.787 40.462C21.2798 41.5421 21.7903 42.6134 22.2714 43.6994C22.472 44.1509 22.596 44.6378 22.779 45.0982C23.0652 45.83 23.378 46.5501 23.6702 47.279C23.8443 47.7099 24.0037 48.1466 24.1896 48.6306C24.9067 48.5303 25.6504 48.3916 26.3999 48.3355C27.0108 48.2912 27.6276 48.3473 28.2414 48.3591C28.3034 48.3591 28.3712 48.3857 28.4303 48.3709C29.6727 48.0611 30.6052 48.8106 31.6174 49.2917L31.6056 49.2828ZM27.0197 31.5291C27.4387 31.5291 27.8312 31.5114 28.2207 31.5321C28.8316 31.5675 29.4454 31.7091 30.0475 31.6619C30.8029 31.6029 31.4256 31.9747 32.1103 32.1311C32.184 32.1488 32.2283 32.2875 32.2785 32.3584C32.5234 32.3318 32.7743 32.2374 32.9897 32.2935C33.9842 32.5531 34.9787 32.8217 35.9496 33.1552C37.1802 33.5772 38.399 34.0375 39.5971 34.5422C40.2493 34.8166 40.8514 35.215 41.474 35.5662C42.2944 36.0266 43.1178 36.481 43.9264 36.9621C44.4281 37.2601 44.9032 37.5965 45.4462 37.9536C45.2248 37.446 45.5524 36.9443 45.2691 36.4604C45.1835 36.3128 45.3104 35.9971 45.4078 35.7905C45.5436 35.5042 45.6144 35.2357 45.3931 34.9819C45.098 34.6396 45.4196 34.3061 45.3783 33.9667C45.3311 33.589 45.2986 33.2053 45.3075 32.8276C45.3252 32.022 45.4019 31.2193 45.4049 30.4136C45.4078 29.5755 45.3488 28.7374 45.3163 27.8993C45.2839 27.0494 45.2455 26.1965 45.2189 25.3466C45.2042 24.9364 45.1835 24.5262 45.2071 24.119C45.2455 23.4402 45.3399 22.7615 45.3665 22.0827C45.399 21.2594 45.3694 20.4331 45.4049 19.6068C45.4432 18.6949 45.5141 17.786 45.5996 16.88C45.6498 16.3606 45.7619 15.8471 45.8475 15.3307C45.8829 15.1241 45.9243 14.9205 45.9626 14.705C45.6144 14.947 45.3016 15.1388 45.0153 15.3661C44.1477 16.0537 43.3214 16.7973 42.4213 17.4377C41.5773 18.0368 40.5976 18.4234 39.7004 18.9516C39.0276 19.3471 38.2485 19.5684 37.5048 19.8399C36.8615 20.073 36.2034 20.2649 35.5512 20.4714C35.079 20.6219 34.6128 20.7872 34.1347 20.9082C33.6773 21.0233 33.2022 21.0587 32.7447 21.1738C32.0512 21.3479 31.3754 21.6135 30.676 21.7463C29.9206 21.8909 29.1444 21.9293 28.3742 22.006C28.0909 22.0355 27.8017 22.0149 27.5243 22.065C27.4121 22.0857 27.241 22.2244 27.2321 22.3188C27.1849 22.9267 27.1584 23.5347 27.1613 24.1455C27.1672 25.1076 27.2262 26.0696 27.2203 27.0287C27.2174 27.796 27.0374 28.5456 27.1466 29.3394C27.241 30.027 27.0728 30.7589 27.0197 31.5291ZM15.9974 22.2096C15.9974 22.9208 16.0092 23.5524 15.9915 24.1839C15.9797 24.5882 15.7938 25.0368 15.9148 25.3879C16.2069 26.2408 15.8026 27.07 15.959 27.9141C16.0948 28.6518 16.1538 29.4102 16.1833 30.1628C16.201 30.5936 16.0771 31.0274 16.0417 31.4612C16.0298 31.5911 16.1036 31.7298 16.1302 31.8655C16.1804 32.1282 16.3072 32.0367 16.4637 31.957C16.5522 31.9128 16.6761 31.901 16.7765 31.9187C17.4405 32.0397 18.0867 32.0662 18.7655 31.9246C19.3646 31.8006 20.002 31.8301 20.6217 31.8449C21.206 31.8596 21.8051 32.0485 22.3688 31.9688C23.1921 31.8508 23.9387 32.137 24.7208 32.2226C25.0956 32.2639 25.1752 32.199 25.131 31.8065C25.0631 31.2163 24.827 30.6349 25.0129 30.0211C25.0483 29.9001 25.01 29.7437 24.9746 29.6109C24.8388 29.1388 24.8595 28.6902 25.1398 28.2977C25.0749 28.156 24.9687 28.0291 24.9716 27.9082C24.9923 27.07 25.0336 26.2349 25.0778 25.3968C25.1162 24.6708 25.1693 23.9478 25.1988 23.2218C25.2077 23.0389 25.1221 22.8441 25.1487 22.667C25.2018 22.31 25.3021 21.9617 25.3877 21.5899C25.2372 21.5751 25.1693 21.5486 25.1133 21.5633C24.0361 21.8939 22.9855 22.3749 21.811 22.0916C21.7579 22.0798 21.693 22.127 21.631 22.1358C21.3064 22.186 20.9818 22.2627 20.6571 22.2686C20.0699 22.2775 19.4826 22.2303 18.8953 22.2332C18.3051 22.2362 17.7149 22.2686 17.1276 22.2923C16.9034 22.3011 16.6791 22.3247 16.325 22.3483C16.5669 22.1388 16.6909 22.0355 16.8119 21.9293C16.7853 21.885 16.7558 21.8407 16.7293 21.7965C16.4784 21.9411 16.2246 22.0798 15.9974 22.2096ZM51.0208 27.8875C50.9204 27.2707 50.7935 26.6598 50.7286 26.0401C50.6578 25.3584 50.4955 24.7092 50.2063 24.0924C50.0528 23.7648 49.9377 23.3723 49.681 23.1481C49.2295 22.7526 48.7012 22.428 48.1641 22.1565C48.0313 22.0886 47.5975 21.8319 47.5119 22.2362C47.3968 22.7674 47.3673 23.3281 47.3791 23.8711C47.3968 24.6325 47.509 25.3938 47.5414 26.1582C47.5592 26.5359 47.4677 26.9195 47.4736 27.3002C47.4854 27.979 47.568 28.6548 47.5562 29.3306C47.5444 29.9975 47.4411 30.6615 47.4057 31.3285C47.3939 31.5291 47.4765 31.8065 47.7569 31.6944C48.3855 31.4435 49.0553 31.2753 49.5806 30.7914C49.9761 30.4284 50.3361 30.1244 50.5043 29.5312C50.6578 28.9971 50.8703 28.4807 51.0208 27.8875Z"
                                        fill="url(#paint0_linear_1019_42733)"
                                      />
                                      <path
                                        d="M31.6191 49.2976C31.507 49.0645 31.4243 48.8077 31.2768 48.6011C30.8607 48.0198 30.7515 47.3145 30.4416 46.6918C30.2823 46.3701 29.9842 46.1134 29.6832 45.7474C28.9867 45.954 28.2283 46.2639 27.4433 46.3731C27.1158 46.4173 26.6583 46.1045 26.3898 45.8301C26.1272 45.5556 26.1773 45.0953 26.4872 44.8385C26.6672 44.688 26.9889 44.6851 27.2515 44.6585C27.8653 44.5936 28.4821 44.5552 29.0664 44.508C28.8953 43.9443 28.7536 43.481 28.6149 43.0147C28.4172 42.3478 28.0808 42.1973 27.4522 42.4806C26.8148 42.7698 26.1567 42.6518 25.5104 42.5308C25.1444 42.4629 24.7431 42.4127 24.5837 41.9848C24.5424 41.8727 24.5365 41.7487 24.5129 41.61C24.5896 41.4979 24.7726 41.3503 24.7697 41.2028C24.7667 40.8103 25.0264 40.7277 25.2979 40.6893C26.0327 40.586 26.7705 40.5152 27.4699 40.4355C27.2309 39.6446 26.9889 38.839 26.7528 38.051C26.2481 38.2192 25.8409 38.417 25.41 38.4848C24.7342 38.5911 23.9876 38.8124 23.4535 38.1691C23.3236 38.0156 23.4063 37.6585 23.4387 37.4018C23.4889 37.0211 23.725 36.7998 24.1204 36.7644C24.9172 36.6935 25.714 36.6227 26.5344 36.546C26.5344 36.2981 26.5019 35.9912 26.5462 35.699C26.5787 35.4866 26.7144 35.2888 26.8029 35.0852C27.0361 35.1885 27.3578 35.2298 27.4876 35.4098C27.8535 35.9145 28.1929 36.4486 28.4437 37.0182C28.8953 38.0422 29.2878 39.0928 29.6773 40.1404C29.9222 40.7955 30.0875 41.4802 30.3501 42.1265C30.5272 42.5573 30.84 42.9262 31.0436 43.3482C31.3948 44.0742 31.6545 44.8503 32.0559 45.5468C32.4484 46.2255 32.6638 46.9544 32.9028 47.6804C32.9618 47.8545 32.9117 48.064 32.9117 48.3296C33.2097 48.4329 33.1566 48.7103 32.9973 49.0113C32.7936 49.3979 32.4129 49.572 31.9968 49.454C31.8611 49.4156 31.7342 49.3448 31.6043 49.2887C31.6043 49.2828 31.6191 49.2976 31.6191 49.2976Z"
                                        fill="url(#paint1_linear_1019_42733)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_1019_42733"
                                          x1="33.1203"
                                          y1="12.5261"
                                          x2="33.1203"
                                          y2="51.4781"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5E5920" />
                                          <stop
                                            offset={1}
                                            stopColor="#5E5920"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_1019_42733"
                                          x1="28.2545"
                                          y1="35.0852"
                                          x2="28.2545"
                                          y2="49.4905"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5E5920" />
                                          <stop
                                            offset={1}
                                            stopColor="#5E5920"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      time to booking
                                    </div>
                                    <div>&lt;24 hours</div>
                                  </div>
                                </div>
                                <div className="stat-divider w-embed">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 1 68"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                    role="img"
                                  >
                                    <rect
                                      width={1}
                                      height={68}
                                      stroke="currentColor"
                                      fill="none"
                                    />
                                  </svg>
                                </div>
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M36.8515 31.3759C36.6611 31.5884 36.4354 31.8385 36.2096 32.0886C36.1963 32.1019 36.1742 32.1107 36.1698 32.1262C35.9927 32.8367 35.2933 33.1687 34.9635 33.7752C34.8374 34.0053 34.5408 34.1426 34.3283 34.3285C33.9742 34.6383 33.6267 34.9571 33.2703 35.2647C33.153 35.3665 33.0158 35.4462 32.8874 35.5392C32.4116 35.8778 31.9512 36.2363 31.4576 36.5462C31.1566 36.7343 30.8113 36.8583 30.4771 36.9911C29.9902 37.1859 29.5011 37.374 29.0053 37.5488C28.4497 37.7436 27.8942 37.9406 27.3276 38.0933C27.0133 38.1774 26.6769 38.1796 26.3493 38.2106C25.6698 38.277 24.9903 38.3633 24.3109 38.3899C23.8306 38.4098 23.3459 38.3412 22.8634 38.3169C22.7106 38.308 22.5557 38.3014 22.403 38.3102C21.7213 38.3478 21.1237 37.9981 20.4752 37.8963C19.6452 37.7657 18.8794 37.4537 18.1158 37.1327C17.7351 36.9734 17.381 36.7432 17.0335 36.5152C16.4935 36.1611 15.949 35.8048 15.4444 35.4041C14.88 34.9548 14.3687 34.4414 13.8109 33.9832C13.5719 33.7862 13.4125 33.5516 13.2443 33.2993C13.0429 32.9983 12.7485 32.7637 12.5117 32.4848C12.2992 32.2347 12.1089 31.9691 11.9163 31.7035C11.8765 31.6482 11.8743 31.5641 11.8499 31.4954C11.8035 31.3626 11.7924 31.19 11.7016 31.1081C11.3719 30.816 11.3519 30.3888 11.1904 30.028C11.0487 29.7071 11 29.3375 10.8274 29.0365C10.502 28.4676 10.4268 27.8413 10.3183 27.2193C10.2254 26.6948 10.1413 26.1702 10.0837 25.6412C10.0395 25.2495 10.0417 24.8533 10.0306 24.4571C10.0195 24.1229 9.99076 23.7865 10.0217 23.4567C10.0682 22.9631 10.1501 22.4696 10.232 21.9804C10.3006 21.5732 10.3692 21.1659 10.4799 20.7698C10.6038 20.3315 10.7787 19.9066 10.9226 19.4728C11.0067 19.2204 11.0532 18.9548 11.1461 18.7047C11.228 18.479 11.3519 18.2709 11.456 18.0518C11.6109 17.7287 11.7592 17.4011 11.923 17.0824C11.9938 16.9429 12.0978 16.819 12.1908 16.6884C12.6069 16.0997 13.0097 15.5021 13.4479 14.9288C13.6715 14.6367 13.9482 14.3777 14.2226 14.1298C14.7162 13.6827 15.2097 13.2268 15.7409 12.8262C16.0242 12.6137 16.416 12.6868 16.6993 12.8461C16.8299 12.9192 17.0888 13.001 17.0955 13.2932C17.0977 13.4393 17.2084 13.5588 16.9959 13.6385C16.956 13.654 16.9118 13.7801 16.9339 13.8089C17.1265 14.0612 16.8985 14.1697 16.7635 14.2848C16.3872 14.6035 15.9866 14.8956 15.617 15.221C15.482 15.3405 15.4333 15.584 15.285 15.6614C14.6387 16.0067 14.4196 16.6951 13.9836 17.2041C13.6516 17.5914 13.4834 18.0695 13.3063 18.552C13.0518 19.247 12.6777 19.8977 12.3966 20.5816C12.2616 20.907 12.2085 21.2677 12.1377 21.6175C12.0403 22.0955 11.8787 22.5802 11.892 23.0583C11.9075 23.6072 11.6928 24.1495 11.8743 24.7028C11.9186 24.84 11.8632 25.0171 11.8367 25.172C11.7481 25.6811 11.8743 26.1592 12.0093 26.6417C12.1487 27.1441 12.2284 27.6664 12.3789 28.1644C12.5449 28.7089 12.7485 29.2423 12.9654 29.7691C13.1956 30.3268 13.417 30.8912 13.8862 31.3184C14.0168 31.4379 14.0743 31.6371 14.1584 31.8053C14.4262 32.3343 14.9773 32.5114 15.4134 32.8367C15.6281 32.9961 15.8029 33.2085 15.9999 33.3923C16.0862 33.4741 16.1725 33.5693 16.2788 33.6158C16.6528 33.7752 16.9051 34.0784 17.2084 34.3263C17.5005 34.5653 17.8746 34.7003 18.2021 34.9017C18.3394 34.9858 18.4367 35.1319 18.5695 35.2271C18.9082 35.4683 19.2667 35.652 19.6895 35.7229C19.944 35.7649 20.172 35.9553 20.4265 36.0283C20.6301 36.0858 20.8581 36.0615 21.0728 36.0881C21.168 36.0991 21.272 36.1323 21.3472 36.1877C21.5819 36.3603 21.8187 36.1589 22.0533 36.2076C22.1905 36.2364 22.3388 36.2186 22.4716 36.2607C23.2507 36.5064 24.0431 36.4776 24.8421 36.409C25.2272 36.3758 25.6322 36.4333 25.9974 36.3337C26.4533 36.2098 26.9536 36.3625 27.3542 36.1677C27.9031 35.8999 28.5139 35.8999 29.0562 35.652C29.5719 35.4152 30.1119 35.2182 30.5944 34.9239C31.212 34.5498 31.825 34.1581 32.3363 33.6291C32.6528 33.3015 33.0733 33.0625 33.35 32.7106C33.8901 32.0244 34.5518 31.4335 34.9657 30.65C35.0565 30.4773 35.1561 30.3113 35.2667 30.1498C35.3176 30.0767 35.4017 30.028 35.4947 29.9483C35.5345 29.82 35.5722 29.6385 35.643 29.4725C35.7979 29.1095 35.9883 28.762 36.1299 28.3946C36.2339 28.1201 36.2362 27.7992 36.3712 27.5469C36.5991 27.122 36.6213 26.6572 36.701 26.2123C36.8028 25.6435 36.7939 25.0547 36.8382 24.477C36.8692 24.0764 36.909 23.6758 36.94 23.273C36.9466 23.1978 36.9311 23.1203 36.9201 23.0428C36.8847 22.806 36.8537 22.567 36.8094 22.3301C36.7319 21.934 36.6501 21.5378 36.5615 21.1416C36.4752 20.7587 36.3977 20.3714 36.2849 19.9951C36.203 19.7251 36.0724 19.4705 35.9639 19.2116C35.8997 19.0567 35.809 18.9084 35.7714 18.749C35.6275 18.1071 35.2158 17.6224 34.8329 17.1222C34.3814 16.5313 33.9299 15.9381 33.4496 15.3737C33.1951 15.0749 32.883 14.8204 32.5798 14.5636C32.2411 14.2759 31.8892 14.0037 31.5351 13.7359C31.3248 13.5765 31.1146 13.4039 30.8755 13.2976C30.3399 13.0608 29.8795 12.6823 29.3262 12.4831C29.1447 12.4167 28.9522 12.3835 28.7685 12.326C28.3457 12.191 27.934 12.0228 27.5047 11.9165C27.0222 11.797 26.5308 11.7129 26.0372 11.6443C25.661 11.5912 25.2759 11.5469 24.8996 11.5602C24.1759 11.5867 23.4521 11.6354 22.7328 11.7151C22.2392 11.7682 21.7501 11.8723 21.2676 11.9874C21.0662 12.036 20.8891 12.1799 20.6943 12.2662C20.515 12.3481 20.3247 12.4057 20.1454 12.4853C20.0989 12.5053 20.0724 12.5739 20.0215 12.6403C19.8997 12.5982 19.4438 12.7686 19.3265 12.9059C19.2778 12.9634 19.1915 12.9922 19.1162 13.0188C18.8307 13.1206 18.5452 13.2157 18.2575 13.3109C18.2243 13.322 18.1756 13.3375 18.1512 13.322C17.8768 13.1493 17.5802 12.9856 17.4894 12.6469C17.412 12.3503 17.4828 12.0825 17.7218 11.859C18.1424 11.4628 18.5895 11.1264 19.1207 10.8785C20.0392 10.4513 20.9998 10.1813 21.9847 9.97103C22.5424 9.85151 23.1002 9.75412 23.6712 9.7342C23.8239 9.72756 23.9767 9.64788 24.1294 9.6501C24.5366 9.65895 24.9439 9.69215 25.3511 9.7165C25.3976 9.71871 25.4551 9.72535 25.4906 9.70322C25.7982 9.50181 26.0727 9.68772 26.3648 9.75855C26.6348 9.82495 26.9204 9.82938 27.1882 9.90242C27.6618 10.0308 28.1266 10.1924 28.598 10.3318C28.7508 10.3761 28.9234 10.3694 29.0695 10.4292C29.5188 10.6173 29.9592 10.8254 30.3997 11.0312C30.7671 11.2038 31.1411 11.3676 31.4908 11.569C31.8937 11.7992 32.2743 12.0692 32.6661 12.3193C32.8277 12.4212 32.9892 12.5252 33.1597 12.6093C33.609 12.8328 33.9056 13.229 34.2486 13.5677C34.6027 13.9174 34.9303 14.2958 35.2512 14.6809C35.57 15.0638 35.8643 15.4689 36.1698 15.8651C36.2782 16.0045 36.3911 16.1417 36.4907 16.2856C36.7342 16.6419 37.0529 16.9761 37.1901 17.3701C37.4114 18.0075 37.8497 18.5498 37.9161 19.2559C37.9537 19.6498 38.1573 20.0239 38.2525 20.4156C38.3543 20.8362 38.4096 21.2678 38.5026 21.6927C38.5424 21.8742 38.6332 22.0424 38.6929 22.2217C38.8102 22.5736 38.7505 22.9432 38.7726 23.304C38.7859 23.5076 38.8014 23.7135 38.8102 23.9171C38.8147 24.0344 38.8169 24.1517 38.808 24.269C38.7793 24.6187 38.7527 24.9662 38.7106 25.3159C38.6752 25.6125 38.6133 25.9046 38.5823 26.199C38.5247 26.7479 38.5203 27.3079 38.4185 27.8479C38.3521 28.202 38.144 28.5274 38.0289 28.8771C37.9426 29.1383 37.936 29.4304 37.832 29.6827C37.7191 29.9572 37.5354 30.2029 37.3782 30.4552C37.2344 30.6854 37.1591 30.9797 36.8315 31.0484C36.8183 31.0461 36.8404 31.2121 36.8515 31.3759Z"
                                        fill="url(#paint0_linear_2037_86557)"
                                      />
                                      <path
                                        d="M23.214 22.43C23.2029 22.1976 23.1941 22.0471 23.1852 21.8966C23.1631 21.4296 23.1255 20.9603 23.1211 20.4933C23.1144 19.8116 23.1255 19.1299 23.1365 18.4505C23.1432 18.0764 23.1543 17.7024 23.1919 17.3327C23.2251 16.9919 23.2561 16.64 23.3645 16.319C23.5172 15.8675 23.8891 15.6993 24.3229 15.7923C24.4623 15.821 24.5774 15.9649 24.708 16.049C24.8474 16.1398 24.9891 16.2172 24.8873 16.4275C24.8718 16.4607 24.9537 16.5337 24.967 16.5913C25.0688 17.0583 25.1684 17.5275 25.0267 18.0078C25.0068 18.0742 25.0156 18.1561 25.0356 18.2247C25.144 18.6098 25.1706 18.9905 25.0865 19.3867C25.0533 19.5438 25.1197 19.7187 25.1152 19.8847C25.1042 20.438 25.071 20.9891 25.0665 21.5402C25.0643 21.9364 25.0953 22.3326 25.1086 22.7288C25.1108 22.804 25.1329 22.8903 25.1042 22.9523C24.9492 23.2998 24.9869 23.665 24.9847 24.0302C24.9824 24.2847 24.9979 24.4087 25.3432 24.3666C25.7305 24.3201 26.1356 24.4375 26.5362 24.4596C27.0364 24.4884 27.5366 24.5061 28.0368 24.5016C28.5923 24.4972 29.1479 24.4374 29.7012 24.4485C30.2368 24.4596 30.7725 24.526 31.3081 24.5813C31.5006 24.6012 31.6954 24.6499 31.8791 24.7141C32.2177 24.8336 32.4037 25.1457 32.3793 25.522C32.355 25.9226 32.2155 26.1793 31.9632 26.2147C31.6534 26.2568 31.3391 26.2767 31.027 26.2878C30.6574 26.3011 30.2877 26.3055 29.9181 26.2988C29.3028 26.2878 28.6875 26.2413 28.0744 26.2546C27.6251 26.2634 27.1758 26.352 26.7243 26.3874C26.2684 26.4228 25.8124 26.4405 25.3565 26.4626C24.8585 26.487 24.3517 26.456 23.8625 26.5401C23.1321 26.664 22.519 26.0067 22.7669 25.3847C22.7935 25.3161 22.8289 25.2475 22.8776 25.1922C23.1011 24.9377 23.1697 24.661 23.0569 24.329C23.0104 24.194 23.0369 24.0302 23.0392 23.8819C23.0502 23.4791 23.0547 23.0763 23.0856 22.6757C23.0923 22.5716 23.1919 22.472 23.214 22.43Z"
                                        fill="url(#paint1_linear_2037_86557)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86557"
                                          x1="24.411"
                                          y1="9.6123"
                                          x2="24.411"
                                          y2="38.3935"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5E5920" />
                                          <stop
                                            offset={1}
                                            stopColor="#5E5920"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86557"
                                          x1="27.5462"
                                          y1="15.7676"
                                          x2="27.5462"
                                          y2="26.5553"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5E5920" />
                                          <stop
                                            offset={1}
                                            stopColor="#5E5920"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      saved per Campaign
                                    </div>
                                    <div>14 hours</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-fc6c1c7e-2676-ab72-5db3-78e37ba945c7-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="a logo of hubspot"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
                <div
                  id="w-node-_10ed2e33-3708-2b0b-53fb-b81833a9e331-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Munch</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper cyan-gradient"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              sizes="(max-width: 479px) 100vw, (max-width: 991px) 460px, (max-width: 1279px) 32vw, 24vw"
                              alt="modal-img"
                              className="modal_img-item"
                            />
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={124}
                              alt="pf character"
                              className="pf_character-modal"
                            />
                          </div>
                          <div
                            className="modal_content-block"
                            style={{ backgroundColor: '#51b1fb' }}
                          >
                            <div className="modal-testimonial">
                              "Supreme Coach has completely transformed the way
                              we approach creator marketing at Munch. We went
                              from struggling to get responses to locking in a
                              month's worth of collaborations in under a week.
                              The platform's streamlined communication and
                              vetted creators have saved us both time and
                              budget, allowing us to focus on scaling. With
                              Passionfroot, we've built stronger relationships
                              with creators, and our brand visibility has
                              skyrocketed."
                            </div>
                            <div className="testimonial_modal-details">
                              <div className="inside_modal-name-wrap">
                                <div className="modal-testimonial">
                                  Jonathan Maimon
                                </div>
                                <div>Former VP of Marketing, Munch</div>
                              </div>
                              <div className="testimonial_author-stats">
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M23.7032 36.962C23.7497 37.1966 23.6546 37.3405 23.4731 37.5087C22.9397 38.0023 22.3133 37.9138 21.6825 37.8894C21.4877 37.8828 21.2907 37.9625 21.0982 37.9558C20.5891 37.9403 20.0823 37.8806 19.5732 37.8783C19.2191 37.8761 18.865 37.9403 18.6149 37.9669C18.4754 38.2391 18.4201 38.5158 18.2674 38.5932C18.1412 38.6552 17.869 38.5158 17.7118 38.3985C17.4839 38.2281 17.2669 38.02 17.1098 37.7832C16.9018 37.4689 16.7557 37.1148 16.5875 36.7761C16.282 36.1608 15.9677 35.5522 15.8571 34.8594C15.8283 34.6845 15.6712 34.534 15.5959 34.3636C15.2086 33.4894 14.8146 32.6173 14.4472 31.7342C14.1993 31.141 14.0001 30.5257 13.7544 29.9304C13.5929 29.5408 13.3848 29.1712 13.2033 28.7905C13.0417 28.4474 12.8802 28.1044 12.7363 27.7525C12.5482 27.2899 12.349 26.8273 12.2118 26.3492C12.1431 26.1036 12.1985 25.8225 12.1985 25.4993C12.0657 25.5237 11.8443 25.5724 11.6208 25.6011C11.5455 25.6122 11.4659 25.5768 11.3884 25.5591C11.1361 25.5015 10.886 25.4418 10.6337 25.3842C10.2817 25.3045 10.191 25.0035 10.1954 24.7291C10.1976 24.5697 10.3836 24.3661 10.5385 24.2665C10.7709 24.1204 10.6956 24.0253 10.6359 23.8061C10.5274 23.4033 10.2751 22.9872 10.5451 22.5313C10.596 22.445 10.4721 22.2657 10.4477 22.124C10.4101 21.9138 10.3924 21.6991 10.6182 21.6747C10.585 21.4954 10.5496 21.3361 10.5274 21.1745C10.4964 20.9488 10.4566 20.723 10.4522 20.495C10.4411 19.8355 10.4256 19.1737 10.4477 18.5141C10.4699 17.8346 10.5341 17.1574 10.5805 16.4646C10.4013 16.4159 10.2862 16.3938 10.1799 16.3539C9.9409 16.2654 9.74834 16.1304 9.78597 15.836C9.82359 15.5461 10.025 15.4155 10.2884 15.3579C10.4721 15.3181 10.6558 15.2761 10.8417 15.2473C11.0697 15.2097 11.2977 15.172 11.5256 15.1543C12.1099 15.1056 12.7562 14.8931 13.2675 15.0702C13.9271 15.296 14.518 15.0282 15.14 15.1101C15.7685 15.1919 16.4303 15.0259 17.0633 15.0968C17.8225 15.1809 18.5662 15.4 19.3187 15.5571C19.4161 15.5771 19.5245 15.5948 19.6197 15.5771C20.0402 15.4907 20.4563 15.3867 20.8746 15.2982C20.9853 15.2761 21.1048 15.2982 21.2177 15.2805C21.3594 15.2583 21.4966 15.2207 21.6338 15.1809C21.8042 15.13 21.968 15.0636 22.1384 15.0127C22.4085 14.9308 22.6807 14.8511 22.9529 14.7803C23.1721 14.7227 23.3934 14.674 23.6169 14.6342C24.0242 14.5612 24.4336 14.5147 24.8365 14.4239C24.9759 14.3929 25.0844 14.2336 25.2238 14.1849C25.9807 13.9171 26.7399 13.6648 27.5013 13.4102C27.7514 13.3283 28.0192 13.2907 28.256 13.1823C28.6788 12.9897 29.086 12.7595 29.4977 12.5426C29.5818 12.4984 29.6637 12.4076 29.7434 12.412C30.2104 12.4364 30.4627 12.0867 30.788 11.8565C30.9717 11.7259 31.1754 11.6197 31.3613 11.4913C31.8305 11.1615 32.3042 10.8339 32.7601 10.4887C32.9305 10.3581 33.0678 10.1788 33.2116 10.0172C33.6499 9.52145 34.1988 9.32668 34.845 9.41521C34.9336 9.42628 35.0464 9.49489 35.0863 9.57015C35.2634 9.90436 35.4559 10.2386 35.5666 10.5949C35.664 10.9158 35.6418 11.27 35.706 11.6042C35.841 12.2992 35.8034 12.9809 35.6772 13.6758C35.5909 14.1495 35.5998 14.6408 35.5666 15.1189C36.2239 15.1853 36.7264 15.4642 37.2575 15.6346C37.8994 15.8427 38.2535 16.3252 38.7471 16.6638C39.0968 16.9028 39.1101 17.33 39.2584 17.6731C39.4598 18.1423 39.6036 18.6425 39.7121 19.1449C39.9024 20.0192 40.0043 20.9023 39.7254 21.7876C39.6014 22.1816 39.5505 22.5999 39.4222 22.9939C39.3668 23.1643 39.2163 23.3148 39.0791 23.4409C38.8024 23.6933 38.5302 23.9699 38.2071 24.147C37.7954 24.3727 37.3461 24.583 36.8901 24.6627C36.4829 24.7335 36.0424 24.6206 35.5644 24.583C35.5444 24.8685 35.509 25.154 35.5112 25.4396C35.5135 25.8822 35.54 26.3249 35.5599 26.7698C35.5776 27.2191 35.6197 27.6706 35.6108 28.1199C35.6042 28.4961 35.5577 28.8746 35.5002 29.2487C35.4626 29.501 35.4714 29.6825 35.7016 29.8728C36.038 30.1517 36.3324 30.4859 36.6068 30.8267C36.6976 30.9374 36.671 31.1433 36.6976 31.3048C36.5316 31.2982 36.3457 31.3358 36.2018 31.2738C35.8964 31.1455 35.6131 30.9662 35.3032 30.7958C35.2346 31.068 35.1925 31.338 35.0907 31.5815C35.0332 31.7209 34.8871 31.8626 34.7499 31.9113C34.6879 31.9334 34.4865 31.7519 34.4511 31.6324C34.3227 31.2074 34.2497 30.767 34.1301 30.3398C34.0903 30.196 34.0018 30.0255 33.8822 29.9503C33.3201 29.5939 32.7535 29.2442 32.1647 28.9366C31.4587 28.567 30.7261 28.2505 30.0156 27.8941C29.6504 27.7104 29.3096 27.4824 28.9532 27.2855C28.6522 27.1217 28.3091 27.0132 28.0369 26.8118C27.5655 26.4621 26.9745 26.5329 26.4721 26.285C25.9763 26.0416 25.4363 25.8822 24.9051 25.7251C24.4801 25.5989 24.0352 25.5325 23.6014 25.4329C23.4886 25.4064 23.3801 25.3621 23.2694 25.3245C23.0791 25.2603 22.8954 25.1784 22.7006 25.1363C22.03 24.9903 21.3549 24.8641 20.6843 24.7224C20.2593 24.6339 20.1819 24.5166 20.0624 25.0389C20.0026 25.2957 19.9428 25.5768 19.6263 25.6365C19.3939 25.6808 19.2014 25.4794 19.0243 25.0013C17.0412 25.4661 15.0094 25.6056 12.9244 25.4064C13.2963 25.9663 13.657 26.4466 13.947 26.969C14.2148 27.4515 14.4096 27.976 14.6331 28.4829C14.6552 28.536 14.6375 28.6289 14.6707 28.6489C15.1355 28.9344 15.1333 29.4943 15.4144 29.8883C15.5052 30.0167 15.5206 30.1982 15.5893 30.3465C15.9589 31.1565 16.3418 31.96 16.7026 32.7745C16.8531 33.1131 16.946 33.4783 17.0832 33.8236C17.2979 34.3725 17.5325 34.9125 17.7517 35.4592C17.8822 35.7823 18.0018 36.1099 18.1412 36.4729C18.679 36.3976 19.2368 36.2936 19.799 36.2516C20.2571 36.2184 20.7197 36.2604 21.1801 36.2693C21.2266 36.2693 21.2775 36.2892 21.3217 36.2781C22.2535 36.0457 22.9529 36.6079 23.7121 36.9687L23.7032 36.962ZM20.2638 23.6468C20.5781 23.6468 20.8724 23.6335 21.1646 23.649C21.6227 23.6756 22.0831 23.7818 22.5346 23.7464C23.1012 23.7021 23.5682 23.981 24.0817 24.0983C24.1371 24.1116 24.1703 24.2156 24.2079 24.2687C24.3916 24.2488 24.5797 24.178 24.7413 24.22C25.4872 24.4148 26.2331 24.6162 26.9612 24.8663C27.8842 25.1828 28.7983 25.5281 29.6969 25.9066C30.186 26.1124 30.6375 26.4112 31.1045 26.6746C31.7198 27.0199 32.3374 27.3607 32.9438 27.7215C33.3201 27.945 33.6764 28.1973 34.0837 28.4652C33.9177 28.0845 34.1633 27.7082 33.9509 27.3452C33.8867 27.2346 33.9818 26.9977 34.0549 26.8428C34.1567 26.6281 34.2098 26.4267 34.0438 26.2364C33.8225 25.9796 34.0637 25.7295 34.0328 25.475C33.9973 25.1917 33.973 24.9039 33.9796 24.6206C33.9929 24.0164 34.0505 23.4144 34.0527 22.8102C34.0549 22.1816 34.0106 21.553 33.9863 20.9244C33.9619 20.287 33.9332 19.6473 33.9132 19.0099C33.9022 18.7023 33.8867 18.3946 33.9044 18.0892C33.9332 17.5801 34.004 17.071 34.0239 16.562C34.0482 15.9445 34.0261 15.3247 34.0527 14.705C34.0814 14.0211 34.1346 13.3394 34.1988 12.6599C34.2364 12.2704 34.3205 11.8853 34.3847 11.4979C34.4112 11.343 34.4422 11.1903 34.471 11.0287C34.2098 11.2102 33.9752 11.3541 33.7605 11.5245C33.1098 12.0402 32.4901 12.5979 31.815 13.0782C31.182 13.5275 30.4472 13.8175 29.7743 14.2137C29.2697 14.5102 28.6854 14.6762 28.1276 14.8799C27.6451 15.0547 27.1516 15.1986 26.6624 15.3535C26.3083 15.4664 25.9586 15.5903 25.6001 15.6811C25.257 15.7674 24.9006 15.794 24.5576 15.8803C24.0375 16.0109 23.5306 16.2101 23.0061 16.3097C22.4394 16.4181 21.8573 16.4469 21.2797 16.5044C21.0672 16.5266 20.8503 16.5111 20.6422 16.5487C20.5581 16.5642 20.4298 16.6682 20.4231 16.739C20.3877 17.195 20.3678 17.6509 20.37 18.1091C20.3744 18.8306 20.4187 19.5522 20.4143 20.2715C20.4121 20.8469 20.277 21.4091 20.3589 22.0045C20.4298 22.5202 20.3036 23.0691 20.2638 23.6468ZM11.9971 16.6572C11.9971 17.1906 12.0059 17.6642 11.9926 18.1379C11.9838 18.4411 11.8443 18.7775 11.9351 19.0409C12.1542 19.6805 11.851 20.3025 11.9683 20.9355C12.0701 21.4888 12.1144 22.0576 12.1365 22.622C12.1498 22.9452 12.0568 23.2705 12.0303 23.5959C12.0214 23.6933 12.0767 23.7973 12.0967 23.8991C12.1343 24.0961 12.2295 24.0275 12.3468 23.9677C12.4132 23.9345 12.5061 23.9257 12.5814 23.9389C13.0794 24.0297 13.5641 24.0496 14.0731 23.9434C14.5224 23.8504 15.0005 23.8725 15.4653 23.8836C15.9036 23.8947 16.3529 24.0363 16.7756 23.9766C17.3931 23.888 17.9531 24.1027 18.5396 24.1669C18.8207 24.1979 18.8804 24.1492 18.8472 23.8548C18.7963 23.4122 18.6193 22.9761 18.7587 22.5158C18.7853 22.425 18.7565 22.3077 18.7299 22.2081C18.6281 21.854 18.6436 21.5176 18.8539 21.2232C18.8052 21.117 18.7255 21.0218 18.7277 20.9311C18.7432 20.3025 18.7742 19.6761 18.8074 19.0475C18.8362 18.5031 18.876 17.9608 18.8982 17.4163C18.9048 17.2791 18.8406 17.133 18.8605 17.0002C18.9004 16.7324 18.9756 16.4712 19.0398 16.1924C18.9269 16.1813 18.876 16.1614 18.834 16.1724C18.0261 16.4203 17.2382 16.7811 16.3573 16.5686C16.3174 16.5598 16.2687 16.5952 16.2223 16.6018C15.9788 16.6395 15.7353 16.697 15.4919 16.7014C15.0514 16.7081 14.611 16.6726 14.1705 16.6749C13.7279 16.6771 13.2852 16.7014 12.8448 16.7191C12.6765 16.7258 12.5083 16.7435 12.2427 16.7612C12.4242 16.604 12.5172 16.5266 12.6079 16.4469C12.588 16.4137 12.5659 16.3805 12.546 16.3473C12.3578 16.4557 12.1675 16.5598 11.9971 16.6572ZM38.2646 20.9156C38.1893 20.453 38.0942 19.9948 38.0455 19.53C37.9924 19.0188 37.8706 18.5318 37.6537 18.0692C37.5386 17.8236 37.4523 17.5292 37.2598 17.361C36.9211 17.0644 36.5249 16.8209 36.1221 16.6173C36.0225 16.5664 35.6972 16.3739 35.633 16.6771C35.5467 17.0755 35.5245 17.496 35.5334 17.9032C35.5467 18.4743 35.6308 19.0453 35.6551 19.6186C35.6684 19.9019 35.5998 20.1896 35.6042 20.4751C35.6131 20.9842 35.675 21.491 35.6662 21.9979C35.6573 22.4981 35.5799 22.9961 35.5533 23.4963C35.5444 23.6468 35.6064 23.8548 35.8167 23.7707C36.2881 23.5826 36.7905 23.4564 37.1845 23.0935C37.4811 22.8212 37.7511 22.5932 37.8773 22.1484C37.9924 21.7478 38.1517 21.3604 38.2646 20.9156Z"
                                        fill="url(#paint0_linear_2037_86671)"
                                      />
                                      <path
                                        d="M23.7124 36.9737C23.6283 36.7989 23.5663 36.6063 23.4556 36.4514C23.1436 36.0154 23.0617 35.4864 22.8293 35.0194C22.7097 34.7781 22.4862 34.5856 22.2604 34.3111C21.7381 34.4661 21.1693 34.6985 20.5805 34.7804C20.3349 34.8136 19.9918 34.5789 19.7904 34.3731C19.5934 34.1673 19.631 33.822 19.8634 33.6294C19.9984 33.5166 20.2397 33.5143 20.4367 33.4944C20.897 33.4457 21.3596 33.417 21.7979 33.3815C21.6695 32.9588 21.5633 32.6113 21.4592 32.2616C21.3109 31.7614 21.0586 31.6485 20.5872 31.861C20.1091 32.0779 19.6155 31.9894 19.1308 31.8986C18.8564 31.8477 18.5554 31.8101 18.4358 31.4892C18.4049 31.4051 18.4004 31.3121 18.3827 31.2081C18.4403 31.124 18.5775 31.0133 18.5753 30.9026C18.5731 30.6083 18.7678 30.5463 18.9715 30.5175C19.5226 30.4401 20.0759 30.3869 20.6005 30.3272C20.4212 29.734 20.2397 29.1298 20.0626 28.5388C19.6842 28.665 19.3787 28.8133 19.0556 28.8642C18.5487 28.9439 17.9888 29.1099 17.5882 28.6274C17.4908 28.5123 17.5527 28.2445 17.5771 28.0519C17.6147 27.7664 17.7918 27.6004 18.0884 27.5738C18.686 27.5207 19.2835 27.4676 19.8988 27.41C19.8988 27.2241 19.8745 26.9939 19.9077 26.7748C19.932 26.6155 20.0339 26.4672 20.1003 26.3145C20.2751 26.3919 20.5164 26.4229 20.6137 26.5579C20.8882 26.9364 21.1427 27.337 21.3309 27.7642C21.6695 28.5322 21.9639 29.3201 22.256 30.1058C22.4397 30.5972 22.5637 31.1107 22.7607 31.5954C22.8935 31.9185 23.1281 32.1952 23.2808 32.5117C23.5442 33.0562 23.7389 33.6383 24.0399 34.1606C24.3343 34.6697 24.4959 35.2164 24.6752 35.7609C24.7194 35.8914 24.6818 36.0486 24.6818 36.2478C24.9053 36.3252 24.8655 36.5333 24.746 36.7591C24.5933 37.049 24.3078 37.1796 23.9957 37.091C23.8939 37.0623 23.7987 37.0092 23.7013 36.9671C23.7013 36.9627 23.7124 36.9737 23.7124 36.9737Z"
                                        fill="url(#paint1_linear_2037_86671)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86671"
                                          x1="24.8393"
                                          y1="9.39453"
                                          x2="24.8393"
                                          y2="38.6085"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86671"
                                          x1="21.1889"
                                          y1="26.3145"
                                          x2="21.1889"
                                          y2="37.1184"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      collabs
                                    </div>
                                    <div>33</div>
                                  </div>
                                </div>
                                <div className="stat-divider w-embed">
                                  <svg
                                    width={1}
                                    height="100%"
                                    viewBox="0 0 1 68"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      width={1}
                                      height={68}
                                      fill="url(#paint0_linear_2037_86678)"
                                    />
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_2037_86678"
                                        x1="0.5"
                                        y1={0}
                                        x2="0.5"
                                        y2={68}
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#12566A" />
                                        <stop offset={1} stopColor="#12566A" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M36.3929 9.45282C36.4505 9.28018 36.5147 9.09426 36.5789 8.90613C36.6231 8.77334 36.6386 8.61176 36.7227 8.51216C36.8378 8.37715 37.0481 8.17353 37.1455 8.20673C37.3159 8.26427 37.504 8.46126 37.5527 8.63611C37.6811 9.09648 37.7586 9.57234 37.8117 10.0482C37.8471 10.3669 37.805 10.6923 37.805 11.0154C37.805 11.4581 37.8294 11.903 37.8095 12.3434C37.7873 12.8303 37.6767 13.3173 37.6988 13.802C37.7209 14.3221 37.5704 14.8466 37.6213 15.3314C37.6922 15.9865 37.5262 16.5996 37.5239 17.2326C37.5217 17.9918 37.504 18.7531 37.4753 19.5123C37.4642 19.8155 37.3801 20.1143 37.3712 20.4175C37.3602 20.7894 37.4044 21.1612 37.4022 21.5331C37.3956 22.3298 37.3093 23.1311 37.3757 23.9212C37.4443 24.7357 37.2097 25.5281 37.2716 26.3226C37.3115 26.8339 37.2517 27.343 37.3048 27.8388C37.3978 28.7086 37.3513 29.574 37.3823 30.4394C37.4066 31.1255 37.4421 31.8116 37.462 32.5C37.4708 32.8165 37.4775 33.2636 37.6302 33.4539C37.8714 33.7527 37.774 33.9519 37.732 34.233C37.6767 34.5938 37.4177 34.6845 37.161 34.6801C36.4992 34.6712 35.8396 34.6026 35.1801 34.5606C34.536 34.5185 33.8897 34.4853 33.2456 34.4344C32.8539 34.4034 32.4643 34.337 32.0726 34.306C31.6897 34.2751 31.3068 34.2795 30.9239 34.2463C30.5941 34.2175 30.2997 34.0737 30.3395 33.6465C30.3683 33.3366 30.2532 33.0179 30.2333 32.6992C30.2134 32.4137 30.2245 32.1215 30.2422 31.836C30.2776 31.2982 30.3595 30.7603 30.3639 30.2247C30.3705 29.2841 30.3395 28.3434 30.313 27.4027C30.2997 26.9291 30.2532 26.4577 30.2422 25.984C30.2377 25.8556 30.3108 25.7251 30.3351 25.5945C30.3484 25.517 30.3351 25.4351 30.3263 25.3576C30.2931 25.0832 30.2399 24.8087 30.2222 24.5343C30.1957 24.1116 30.1913 23.6866 30.1758 23.2616C30.1735 23.2152 30.1492 23.1532 30.1713 23.1222C30.51 22.6618 30.0894 22.1882 30.1979 21.7168C30.2754 21.3825 30.2731 21.0262 30.2864 20.6787C30.2975 20.3799 30.2731 20.0789 30.2798 19.7779C30.282 19.6584 30.344 19.5389 30.3395 19.4216C30.3196 18.8727 30.2731 18.3238 30.2643 17.7749C30.2599 17.5026 30.3263 17.2282 30.3395 16.9537C30.3573 16.5509 30.3462 16.1459 30.3617 15.7408C30.375 15.3978 30.4126 15.0569 30.4281 14.7139C30.4546 14.1495 30.4901 13.5851 30.4945 13.0207C30.4989 12.4386 30.4569 11.8565 30.4679 11.2744C30.4701 11.146 30.5764 10.9911 30.6804 10.8959C30.9039 10.6878 30.8198 10.5064 30.6317 10.3868C30.3816 10.2275 30.3573 9.99287 30.4082 9.77375C30.4768 9.48159 30.822 9.33773 31.1297 9.35101C31.3577 9.35986 31.5901 9.27354 31.8225 9.26469C32.5529 9.24034 33.2943 9.15845 34.0136 9.24034C34.7153 9.32002 35.4235 9.1496 36.1096 9.35322C36.1849 9.37535 36.2624 9.40634 36.3929 9.45282ZM36.4261 10.6679C35.9636 10.6679 35.5408 10.6679 35.1181 10.6679C34.8768 10.6679 34.6378 10.6657 34.3965 10.6746C34.1309 10.6856 33.8653 10.7277 33.5997 10.7233C33.073 10.7144 32.5462 10.6945 32.0217 10.6546C31.683 10.6281 31.6941 10.8029 31.745 11.0398C31.7915 11.2522 31.8402 11.4669 31.8623 11.6838C31.9044 12.1265 31.9486 12.5714 31.9575 13.0162C31.9641 13.4124 31.9176 13.8086 31.9021 14.2048C31.8778 14.7847 31.8535 15.3646 31.8402 15.9467C31.8247 16.5686 31.8291 17.1883 31.8114 17.8103C31.8003 18.1799 31.7516 18.5473 31.7428 18.9147C31.7317 19.3529 31.7494 19.7934 31.7428 20.2338C31.7406 20.4397 31.6941 20.6433 31.6919 20.8469C31.6919 21.3936 31.7052 21.9403 31.7118 22.487C31.714 22.5711 31.7184 22.653 31.7184 22.7371C31.7162 23.3635 31.7384 23.992 31.7007 24.6184C31.6875 24.8419 31.4794 25.0611 31.7539 25.258C31.7671 25.2669 31.7649 25.3023 31.7671 25.3267C31.7826 25.8136 31.8136 26.3005 31.8114 26.7874C31.8092 27.8808 31.8092 28.9742 31.7804 30.0654C31.7583 30.8644 31.6786 31.6611 31.6543 32.4602C31.6498 32.604 31.7693 32.8652 31.8601 32.8785C32.3293 32.9471 32.8096 32.9626 33.2855 32.9825C33.7193 33.0002 34.1531 32.9803 34.5869 33.0135C35.0229 33.0467 35.4545 33.1286 35.8883 33.1706C35.9392 33.175 36.0521 33.071 36.0521 33.0179C36.0521 32.6793 36.0145 32.3406 36.0145 32.002C36.0145 31.5815 36.0853 31.1543 36.0388 30.7404C35.9591 30.0366 35.8086 29.3416 35.9923 28.6333C36.0034 28.5957 35.9724 28.547 35.9702 28.5028C35.9282 27.8166 35.8573 27.1283 35.8573 26.4422C35.8573 25.7693 35.9503 25.0965 35.9613 24.4214C35.9702 23.8238 35.8994 23.2262 35.906 22.6286C35.9104 22.2369 36.0123 21.8473 36.0277 21.4534C36.0565 20.7363 36.0344 20.0191 36.0742 19.302C36.1185 18.4986 36.041 17.6952 36.207 16.8851C36.3155 16.3561 36.176 15.7895 36.2447 15.2229C36.3531 14.3398 36.2889 13.4368 36.3177 12.5426C36.3354 11.9229 36.3863 11.3031 36.4261 10.6679Z"
                                        fill="url(#paint0_linear_2037_86680)"
                                      />
                                      <path
                                        d="M16.7636 16.7721C16.83 17.3011 16.9208 17.8057 16.9473 18.3126C16.9694 18.7729 16.9075 19.2377 16.9075 19.7003C16.9075 20.2868 16.9517 20.8734 16.9451 21.4621C16.9407 21.9889 16.8787 22.5156 16.8698 23.0446C16.8654 23.2903 16.9451 23.5382 16.9517 23.7861C16.9805 24.7666 17.0137 25.7471 17.0093 26.7298C17.0049 27.3074 16.9141 27.8851 16.8964 28.465C16.8853 28.8346 16.9517 29.2043 16.9672 29.5761C16.9761 29.7952 16.9495 30.0165 16.954 30.2357C16.965 30.7447 17.0049 31.2538 16.9938 31.7628C16.9871 32.086 16.9296 32.4135 16.8588 32.7301C16.7813 33.0842 16.6485 33.425 16.5688 33.7792C16.4958 34.1001 16.29 34.1709 16.0266 34.089C15.8451 34.0315 15.7056 33.9739 15.5662 34.1576C15.5264 34.2085 15.4179 34.224 15.3404 34.224C14.5968 34.2262 13.8531 34.2351 13.1094 34.213C12.5627 34.1953 12.0205 34.1089 11.4738 34.0979C10.9006 34.0868 10.3273 34.1488 9.75406 34.1444C9.54601 34.1421 9.33796 34.0448 9.08121 33.9784C8.98162 34.182 8.81783 34.1444 8.58986 33.9407C8.10736 33.5069 7.9303 33.0598 8.57215 32.6415C8.68061 32.5707 8.67618 32.2896 8.67618 32.1059C8.68061 31.5371 8.61642 30.9749 8.71381 30.395C8.80676 29.835 8.69831 29.2419 8.68503 28.662C8.67839 28.3809 8.68725 28.102 8.68946 27.8209C8.6961 27.002 8.68946 26.1831 8.71602 25.3642C8.7293 24.9923 8.83996 24.6249 8.85767 24.2531C8.87538 23.899 8.8289 23.5404 8.80677 23.1863C8.78906 22.8764 8.71602 22.5599 8.76029 22.2589C8.85988 21.5573 8.74701 20.8645 8.73151 20.1673C8.72266 19.78 8.58322 19.3838 8.63191 19.0098C8.75586 18.0757 8.63413 17.1528 8.61199 16.2232C8.60093 15.7164 8.67839 15.6212 9.17196 15.4353C9.3623 15.3644 9.5283 15.225 9.71643 15.1431C9.91563 15.0546 10.1303 14.9505 10.3273 15.163C10.345 15.1829 10.3959 15.1829 10.4269 15.1741C11.0931 14.986 11.7704 15.132 12.4432 15.1077C12.9833 15.0878 13.5278 15.2228 14.0722 15.256C14.63 15.2892 15.1922 15.2604 15.7499 15.2936C16.1262 15.3157 16.5069 15.3711 16.8721 15.4618C17.0425 15.5039 17.2063 15.6477 17.328 15.785C17.6069 16.0993 17.5272 16.5176 17.0602 16.7123C16.9805 16.7389 16.8853 16.7455 16.7636 16.7721ZM15.7743 16.9115C15.5242 16.8761 15.2895 16.8363 15.0549 16.8097C14.6521 16.7632 14.2493 16.6968 13.8443 16.6858C13.4436 16.6747 13.0408 16.7278 12.6402 16.7389C11.8611 16.7632 11.0798 16.7743 10.3007 16.8053C10.2277 16.8075 10.0971 16.9204 10.0971 16.9802C10.1015 17.3763 10.1347 17.7703 10.1591 18.1665C10.179 18.5051 10.2056 18.8438 10.2189 19.1824C10.2388 19.7114 10.2432 20.2426 10.2675 20.7715C10.2875 21.2253 10.3406 21.6768 10.3517 22.1305C10.3583 22.385 10.2432 22.6551 10.2985 22.8919C10.4092 23.3567 10.3782 23.8082 10.345 24.2708C10.3295 24.4921 10.3406 24.7134 10.3384 24.937C10.3317 25.5058 10.3384 26.0724 10.3096 26.639C10.2919 26.9644 10.2255 27.2897 10.1635 27.6129C10.1414 27.7302 10.0197 27.8431 10.0307 27.9493C10.0573 28.226 10.1591 28.496 10.1768 28.7727C10.1989 29.1224 10.1724 29.4743 10.1547 29.8262C10.148 29.9789 10.0883 30.1316 10.0971 30.2821C10.1148 30.5433 10.1901 30.8 10.2011 31.059C10.2211 31.5614 10.2078 32.0638 10.2277 32.5663C10.2299 32.6305 10.3362 32.7411 10.3959 32.7455C10.6637 32.7588 10.9315 32.7455 11.1994 32.7278C11.4384 32.7123 11.6752 32.6548 11.912 32.6526C12.5185 32.6526 13.1249 32.6747 13.7314 32.6836C13.9062 32.6858 14.0855 32.6614 14.2581 32.6836C14.6875 32.7389 15.1147 32.8142 15.5507 32.8828C15.6038 32.4379 15.657 32.0041 15.7123 31.5459C15.6968 31.5083 15.6724 31.4176 15.6304 31.3357C15.4423 30.9727 15.6171 30.5765 15.5219 30.1958C15.4467 29.897 15.4976 29.565 15.502 29.2463C15.5042 29.0869 15.5374 28.9276 15.5419 28.766C15.5551 28.029 15.5618 27.2942 15.5751 26.5571C15.5773 26.3867 15.6525 26.1986 15.6016 26.0503C15.3427 25.3044 15.6658 24.543 15.4821 23.775C15.3427 23.1929 15.4887 22.5444 15.4976 21.9247C15.5064 21.3404 15.491 20.7583 15.5042 20.174C15.5197 19.3572 15.5352 18.5427 15.5861 17.7282C15.5972 17.4361 15.7123 17.155 15.7743 16.9115Z"
                                        fill="url(#paint1_linear_2037_86680)"
                                      />
                                      <path
                                        d="M26.3099 20.0683C26.5091 19.8669 26.6619 19.5814 26.8566 19.5482C27.1953 19.4929 27.2307 19.8912 27.2727 20.1037C27.3856 20.6814 27.4011 21.2768 27.4874 21.8589C27.6069 22.6579 27.3148 23.4414 27.4808 24.2559C27.6025 24.8579 27.4985 25.5064 27.514 26.1328C27.5273 26.7104 27.5782 27.2881 27.587 27.868C27.5892 28.0871 27.4941 28.3085 27.4918 28.5276C27.483 29.2779 27.5273 30.0304 27.4896 30.7785C27.452 31.52 27.5892 32.2769 27.3104 33.0029C27.2794 33.087 27.3347 33.2486 27.4033 33.3172C27.7176 33.6248 27.711 34.0299 27.3104 34.1848C26.7504 34.4017 26.1816 34.5876 25.5464 34.5234C24.8071 34.4504 24.0612 34.4615 23.3175 34.4349C22.9059 34.4194 22.4942 34.3751 22.0825 34.384C21.4827 34.3973 20.8829 34.4305 20.2853 34.4836C19.8205 34.5256 19.805 34.4194 19.774 33.928C19.7541 33.616 19.825 33.3172 19.794 33.0051C19.7364 32.4385 19.7608 31.8608 19.7497 31.2898C19.7386 30.5948 19.7209 29.8976 19.7231 29.2026C19.7231 28.9105 19.7696 28.6183 19.7829 28.3239C19.8095 27.6777 19.836 27.0314 19.8493 26.3851C19.8648 25.7078 19.8936 25.0283 19.8626 24.3533C19.8272 23.5344 19.7231 22.7176 19.6767 21.8987C19.6678 21.746 19.774 21.58 19.8493 21.4295C19.929 21.2679 20.0131 21.1418 19.774 21.0245C19.5926 20.9337 19.4155 20.3228 19.4775 20.1369C19.5771 19.8359 19.9245 19.6367 20.2831 19.65C20.728 19.6655 21.1861 19.5925 21.6133 19.6832C22.4566 19.8647 23.3021 19.6411 24.1431 19.7916C24.8757 19.92 25.6172 19.982 26.3099 20.0683ZM21.0002 21.2746C21.0865 21.6176 21.1706 21.912 21.2304 22.2108C21.3521 22.8128 21.3499 23.4215 21.3477 24.0323C21.3477 24.7716 21.3411 25.5108 21.3455 26.2501C21.3477 26.5179 21.4141 26.7879 21.3898 27.0513C21.3521 27.4563 21.2636 27.8592 21.195 28.262C21.1551 28.4899 21.0046 28.7688 21.0865 28.9348C21.2946 29.3664 21.1507 29.8047 21.1906 30.2318C21.2658 31.0485 21.1972 31.8785 21.1596 32.7019C21.1463 32.9985 21.2105 33.0582 21.4982 32.9763C21.6863 32.9232 21.9032 32.9498 22.1047 32.9675C22.4588 32.9985 22.8107 33.0826 23.1648 33.0848C23.7425 33.0892 24.3224 33.0383 24.9023 33.025C25.4003 33.0139 25.8983 33.0228 26.2989 33.0228C26.2214 32.3854 26.113 31.6904 26.0576 30.9932C26.0222 30.555 26.0709 30.1101 26.0643 29.6696C26.051 28.8374 26.02 28.003 26.0067 27.1708C26.0001 26.7724 26.0333 26.3718 26.02 25.9712C26.0023 25.4267 25.9315 24.8823 25.9359 24.3378C25.9403 23.8663 26.0333 23.3949 26.0554 22.9235C26.0775 22.4321 26.0598 21.9408 26.0598 21.4605C25.885 21.4494 25.7345 21.4406 25.5862 21.4273C24.9244 21.3631 24.2648 21.2524 23.6031 21.248C22.886 21.2436 22.1733 21.5003 21.4473 21.2613C21.3123 21.2148 21.1441 21.2679 21.0002 21.2746Z"
                                        fill="url(#paint2_linear_2037_86680)"
                                      />
                                      <path
                                        d="M23.7685 37.6348C23.7685 37.6348 23.7796 37.5595 23.7951 37.471C23.7486 37.4843 23.7287 37.4865 23.711 37.4953C23.5516 37.5706 23.3923 37.71 23.2329 37.7122C22.6242 37.7145 22.0156 37.679 21.4069 37.6392C20.9598 37.6104 20.515 37.5308 20.0679 37.5175C19.5654 37.502 19.063 37.5285 18.5606 37.5485C18.0051 37.5706 17.4451 37.6613 16.894 37.6259C16.3384 37.5905 15.7918 37.4068 15.2362 37.3426C14.7382 37.2829 14.2336 37.2984 13.7312 37.2784C13.6205 37.274 13.5098 37.2629 13.3992 37.2563C13.3306 37.2519 13.2509 37.2209 13.1911 37.243C12.6024 37.471 11.9915 37.1456 11.3851 37.3316C11.0929 37.4223 10.741 37.2917 10.4156 37.2939C9.87116 37.2984 9.3289 37.336 8.78443 37.3448C8.60515 37.3471 8.42808 37.3028 8.24881 37.2829C7.48964 37.1965 6.72826 37.1213 5.97131 37.0128C5.83187 36.9929 5.71236 36.8402 5.58398 36.7495C5.69244 36.6211 5.77654 36.4285 5.91377 36.3776C6.79909 36.0412 7.68884 35.707 8.67597 35.9062C8.88845 35.9482 9.1297 35.8154 9.3621 35.7999C9.83353 35.7712 10.3072 35.7623 10.7808 35.7557C11.3696 35.7468 11.9605 35.7335 12.5493 35.7468C12.8104 35.7513 13.0716 35.8177 13.335 35.8486C13.6382 35.8841 13.9282 36.0102 14.2513 35.8331C14.3929 35.7557 14.6342 35.8663 14.8312 35.8863C15.4841 35.9571 16.137 36.0235 16.79 36.0921C16.8254 36.0965 16.8652 36.1076 16.8962 36.0987C17.3588 35.9372 17.8236 36.0833 18.2862 36.0833C18.7222 36.0833 19.156 36.0102 19.592 35.9903C19.8443 35.9792 20.0966 36.0191 20.349 36.0169C20.7806 36.0124 21.2631 35.8663 21.6349 36.0102C22.1285 36.2006 22.622 36.1784 23.1067 36.2205C23.7884 36.278 24.4812 36.2116 25.1695 36.205C25.32 36.2028 25.4706 36.2227 25.6211 36.2338C26.3913 36.2935 27.1615 36.3931 27.9317 36.3998C28.764 36.4086 29.5984 36.3024 30.4328 36.3024C31.1875 36.3024 31.9445 36.3754 32.6992 36.4175C32.7789 36.4219 32.863 36.433 32.9405 36.4197C33.1574 36.3843 33.3721 36.3002 33.5867 36.3002C34.0604 36.3024 34.5363 36.3887 35.0033 36.3555C35.5854 36.3156 36.1542 36.3488 36.7296 36.4175C37.4556 36.5038 38.1926 36.6521 38.912 36.599C39.5228 36.5547 40.043 36.8402 40.6251 36.8491C40.8486 36.8513 41.1009 37.0261 41.2846 37.1877C41.5281 37.4002 41.4152 37.7056 41.2138 37.9601C40.7623 38.5245 40.1935 38.2457 39.6667 38.239C39.2418 38.2346 38.819 38.1571 38.3918 38.1217C38.0621 38.0952 37.7101 38.1461 37.4069 38.0465C37.0417 37.9292 36.6942 38.011 36.3401 37.9845C35.9306 37.9535 35.5256 37.8694 35.1161 37.8251C34.9435 37.8052 34.7642 37.8185 34.5894 37.834C34.4012 37.8517 34.2153 37.9114 34.0272 37.9159C33.7948 37.9203 33.5624 37.8716 33.33 37.876C32.8209 37.8827 32.3119 37.9225 31.805 37.9203C31.4177 37.9181 31.0326 37.8716 30.6453 37.8495C30.5324 37.8428 30.4107 37.8185 30.3044 37.8473C29.8263 37.9756 29.3527 37.9181 28.868 37.876C28.3434 37.8318 27.81 37.9004 27.2788 37.8893C26.8185 37.8782 26.3514 37.7499 25.9044 37.8118C25.4883 37.8694 25.0899 37.5994 24.6826 37.8096C24.6184 37.8428 24.5144 37.8185 24.4325 37.8008C24.2267 37.7521 24.0186 37.6968 23.7685 37.6348Z"
                                        fill="url(#paint3_linear_2037_86680)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86680"
                                          x1="33.994"
                                          y1="8.20312"
                                          x2="33.994"
                                          y2="34.6803"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86680"
                                          x1="12.8226"
                                          y1="15.0381"
                                          x2="12.8226"
                                          y2="34.2276"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint2_linear_2037_86680"
                                          x1="23.5455"
                                          y1="19.543"
                                          x2="23.5455"
                                          y2="34.5363"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint3_linear_2037_86680"
                                          x1="23.5034"
                                          y1="35.7412"
                                          x2="23.5034"
                                          y2="38.3137"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#12566A" />
                                          <stop
                                            offset={1}
                                            stopColor="#12566A"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      Saved per campaign
                                    </div>
                                    <div>78 hours</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_7a920bb0-233e-3b21-1434-3b93863f2789-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Freshbooks</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper green-gradient"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              alt="modal-img"
                              className="modal_img-item"
                            />
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={124}
                              alt="pf character"
                              className="pf_character-modal"
                            />
                          </div>
                          <div
                            className="modal_content-block"
                            style={{ backgroundColor: '#58df8c' }}
                          >
                            <div className="modal-testimonial">
                              "Passionfroot has streamlined our multi-platform
                              creator campaigns across YouTube, newsletters,
                              podcasts and LinkedIn. With just a few clicks,
                              we've connected with creators that perfectly align
                              with our audience of small business owners and
                              freelancers, driving significant engagement and
                              customer growth. It's become a core part of our
                              demand generation strategy."
                            </div>
                            <div className="testimonial_modal-details">
                              <div className="inside_modal-name-wrap">
                                <div className="modal-testimonial">
                                  Nolan Mikowski
                                </div>
                                <div>
                                  Senior Demand Generation Manager at FreshBooks
                                </div>
                              </div>
                              <div className="testimonial_author-stats">
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M36.3929 9.45282C36.4505 9.28018 36.5147 9.09426 36.5789 8.90613C36.6231 8.77334 36.6386 8.61176 36.7227 8.51216C36.8378 8.37715 37.0481 8.17353 37.1455 8.20673C37.3159 8.26427 37.504 8.46126 37.5527 8.63611C37.6811 9.09648 37.7586 9.57234 37.8117 10.0482C37.8471 10.3669 37.805 10.6923 37.805 11.0154C37.805 11.4581 37.8294 11.903 37.8095 12.3434C37.7873 12.8303 37.6767 13.3173 37.6988 13.802C37.7209 14.3221 37.5704 14.8466 37.6213 15.3314C37.6922 15.9865 37.5262 16.5996 37.5239 17.2326C37.5217 17.9918 37.504 18.7531 37.4753 19.5123C37.4642 19.8155 37.3801 20.1143 37.3712 20.4175C37.3602 20.7894 37.4044 21.1612 37.4022 21.5331C37.3956 22.3298 37.3093 23.1311 37.3757 23.9212C37.4443 24.7357 37.2097 25.5281 37.2716 26.3226C37.3115 26.8339 37.2517 27.343 37.3048 27.8388C37.3978 28.7086 37.3513 29.574 37.3823 30.4394C37.4066 31.1255 37.4421 31.8116 37.462 32.5C37.4708 32.8165 37.4775 33.2636 37.6302 33.4539C37.8714 33.7527 37.774 33.9519 37.732 34.233C37.6767 34.5938 37.4177 34.6845 37.161 34.6801C36.4992 34.6712 35.8396 34.6026 35.1801 34.5606C34.536 34.5185 33.8897 34.4853 33.2456 34.4344C32.8539 34.4034 32.4643 34.337 32.0726 34.306C31.6897 34.2751 31.3068 34.2795 30.9239 34.2463C30.5941 34.2175 30.2997 34.0737 30.3395 33.6465C30.3683 33.3366 30.2532 33.0179 30.2333 32.6992C30.2134 32.4137 30.2245 32.1215 30.2422 31.836C30.2776 31.2982 30.3595 30.7603 30.3639 30.2247C30.3705 29.2841 30.3395 28.3434 30.313 27.4027C30.2997 26.9291 30.2532 26.4577 30.2422 25.984C30.2377 25.8556 30.3108 25.7251 30.3351 25.5945C30.3484 25.517 30.3351 25.4351 30.3263 25.3576C30.2931 25.0832 30.2399 24.8087 30.2222 24.5343C30.1957 24.1116 30.1913 23.6866 30.1758 23.2616C30.1735 23.2152 30.1492 23.1532 30.1713 23.1222C30.51 22.6618 30.0894 22.1882 30.1979 21.7168C30.2754 21.3825 30.2731 21.0262 30.2864 20.6787C30.2975 20.3799 30.2731 20.0789 30.2798 19.7779C30.282 19.6584 30.344 19.5389 30.3395 19.4216C30.3196 18.8727 30.2731 18.3238 30.2643 17.7749C30.2599 17.5026 30.3263 17.2282 30.3395 16.9537C30.3573 16.5509 30.3462 16.1459 30.3617 15.7408C30.375 15.3978 30.4126 15.0569 30.4281 14.7139C30.4546 14.1495 30.4901 13.5851 30.4945 13.0207C30.4989 12.4386 30.4569 11.8565 30.4679 11.2744C30.4701 11.146 30.5764 10.9911 30.6804 10.8959C30.9039 10.6878 30.8198 10.5064 30.6317 10.3868C30.3816 10.2275 30.3573 9.99287 30.4082 9.77375C30.4768 9.48159 30.822 9.33773 31.1297 9.35101C31.3577 9.35986 31.5901 9.27354 31.8225 9.26469C32.5529 9.24034 33.2943 9.15845 34.0136 9.24034C34.7153 9.32002 35.4235 9.1496 36.1096 9.35322C36.1849 9.37535 36.2624 9.40634 36.3929 9.45282ZM36.4261 10.6679C35.9636 10.6679 35.5408 10.6679 35.1181 10.6679C34.8768 10.6679 34.6378 10.6657 34.3965 10.6746C34.1309 10.6856 33.8653 10.7277 33.5998 10.7233C33.073 10.7144 32.5462 10.6945 32.0217 10.6546C31.683 10.6281 31.6941 10.8029 31.745 11.0398C31.7915 11.2522 31.8402 11.4669 31.8623 11.6838C31.9044 12.1265 31.9486 12.5714 31.9575 13.0162C31.9641 13.4124 31.9176 13.8086 31.9021 14.2048C31.8778 14.7847 31.8535 15.3646 31.8402 15.9467C31.8247 16.5686 31.8291 17.1883 31.8114 17.8103C31.8003 18.1799 31.7516 18.5473 31.7428 18.9147C31.7317 19.3529 31.7494 19.7934 31.7428 20.2338C31.7406 20.4397 31.6941 20.6433 31.6919 20.8469C31.6919 21.3936 31.7052 21.9403 31.7118 22.487C31.714 22.5711 31.7184 22.653 31.7184 22.7371C31.7162 23.3635 31.7384 23.992 31.7007 24.6184C31.6875 24.8419 31.4794 25.0611 31.7539 25.258C31.7671 25.2669 31.7649 25.3023 31.7671 25.3267C31.7826 25.8136 31.8136 26.3005 31.8114 26.7874C31.8092 27.8808 31.8092 28.9742 31.7804 30.0653C31.7583 30.8644 31.6786 31.6611 31.6543 32.4601C31.6498 32.604 31.7693 32.8652 31.8601 32.8785C32.3293 32.9471 32.8096 32.9626 33.2855 32.9825C33.7193 33.0002 34.1531 32.9803 34.5869 33.0135C35.0229 33.0467 35.4545 33.1286 35.8883 33.1706C35.9392 33.175 36.0521 33.071 36.0521 33.0179C36.0521 32.6793 36.0145 32.3406 36.0145 32.002C36.0145 31.5815 36.0853 31.1543 36.0388 30.7404C35.9591 30.0366 35.8086 29.3416 35.9923 28.6333C36.0034 28.5957 35.9724 28.547 35.9702 28.5028C35.9282 27.8166 35.8573 27.1283 35.8573 26.4422C35.8573 25.7693 35.9503 25.0965 35.9613 24.4214C35.9702 23.8238 35.8994 23.2262 35.906 22.6286C35.9104 22.2369 36.0123 21.8473 36.0277 21.4534C36.0565 20.7363 36.0344 20.0191 36.0742 19.302C36.1185 18.4986 36.041 17.6952 36.207 16.8851C36.3155 16.3561 36.176 15.7895 36.2447 15.2229C36.3531 14.3398 36.2889 13.4368 36.3177 12.5426C36.3354 11.9229 36.3863 11.3031 36.4261 10.6679Z"
                                        fill="url(#paint0_linear_2037_86716)"
                                      />
                                      <path
                                        d="M16.7636 16.7721C16.83 17.3011 16.9208 17.8057 16.9473 18.3126C16.9694 18.7729 16.9075 19.2377 16.9075 19.7003C16.9075 20.2868 16.9517 20.8734 16.9451 21.4621C16.9407 21.9889 16.8787 22.5156 16.8698 23.0446C16.8654 23.2903 16.9451 23.5382 16.9517 23.7861C16.9805 24.7666 17.0137 25.7471 17.0093 26.7298C17.0049 27.3074 16.9141 27.8851 16.8964 28.465C16.8853 28.8346 16.9517 29.2043 16.9672 29.5761C16.9761 29.7952 16.9495 30.0165 16.9539 30.2357C16.965 30.7447 17.0049 31.2538 16.9938 31.7628C16.9872 32.086 16.9296 32.4135 16.8588 32.7301C16.7813 33.0842 16.6485 33.425 16.5688 33.7792C16.4958 34.1001 16.29 34.1709 16.0266 34.089C15.8451 34.0315 15.7056 33.9739 15.5662 34.1576C15.5264 34.2085 15.4179 34.224 15.3404 34.224C14.5968 34.2262 13.8531 34.2351 13.1094 34.213C12.5627 34.1953 12.0205 34.1089 11.4738 34.0979C10.9006 34.0868 10.3273 34.1488 9.75406 34.1444C9.54601 34.1421 9.33796 34.0448 9.08121 33.9784C8.98162 34.182 8.81783 34.1444 8.58986 33.9407C8.10736 33.5069 7.9303 33.0598 8.57215 32.6415C8.68061 32.5707 8.67618 32.2896 8.67618 32.1059C8.68061 31.5371 8.61642 30.9749 8.71381 30.395C8.80676 29.835 8.69831 29.2419 8.68503 28.662C8.67839 28.3809 8.68725 28.102 8.68946 27.8209C8.6961 27.002 8.68946 26.1831 8.71602 25.3642C8.7293 24.9923 8.83996 24.6249 8.85767 24.2531C8.87538 23.899 8.8289 23.5404 8.80677 23.1863C8.78906 22.8764 8.71602 22.5599 8.76029 22.2589C8.85988 21.5573 8.74701 20.8645 8.73151 20.1673C8.72266 19.78 8.58322 19.3838 8.63191 19.0098C8.75586 18.0757 8.63413 17.1528 8.61199 16.2232C8.60093 15.7164 8.67839 15.6212 9.17196 15.4353C9.3623 15.3644 9.5283 15.225 9.71643 15.1431C9.91563 15.0546 10.1303 14.9505 10.3273 15.163C10.345 15.1829 10.3959 15.1829 10.4269 15.1741C11.0931 14.986 11.7704 15.132 12.4432 15.1077C12.9833 15.0878 13.5278 15.2228 14.0722 15.256C14.63 15.2892 15.1922 15.2604 15.7499 15.2936C16.1262 15.3157 16.5069 15.3711 16.8721 15.4618C17.0425 15.5039 17.2063 15.6477 17.328 15.785C17.6069 16.0993 17.5272 16.5176 17.0602 16.7123C16.9805 16.7389 16.8853 16.7455 16.7636 16.7721ZM15.7743 16.9115C15.5242 16.8761 15.2895 16.8363 15.0549 16.8097C14.6521 16.7632 14.2493 16.6968 13.8443 16.6858C13.4436 16.6747 13.0408 16.7278 12.6402 16.7389C11.8611 16.7632 11.0798 16.7743 10.3007 16.8053C10.2277 16.8075 10.0971 16.9204 10.0971 16.9802C10.1015 17.3763 10.1347 17.7703 10.1591 18.1665C10.179 18.5051 10.2056 18.8438 10.2189 19.1824C10.2388 19.7114 10.2432 20.2426 10.2675 20.7715C10.2875 21.2253 10.3406 21.6768 10.3517 22.1305C10.3583 22.385 10.2432 22.6551 10.2985 22.8919C10.4092 23.3567 10.3782 23.8082 10.345 24.2708C10.3295 24.4921 10.3406 24.7134 10.3384 24.937C10.3317 25.5058 10.3384 26.0724 10.3096 26.639C10.2919 26.9644 10.2255 27.2897 10.1635 27.6129C10.1414 27.7302 10.0197 27.8431 10.0307 27.9493C10.0573 28.226 10.1591 28.496 10.1768 28.7727C10.1989 29.1224 10.1724 29.4743 10.1547 29.8262C10.148 29.9789 10.0883 30.1316 10.0971 30.2821C10.1148 30.5433 10.1901 30.8 10.2011 31.059C10.2211 31.5614 10.2078 32.0638 10.2277 32.5663C10.2299 32.6304 10.3362 32.7411 10.3959 32.7455C10.6637 32.7588 10.9315 32.7455 11.1994 32.7278C11.4384 32.7123 11.6752 32.6548 11.912 32.6526C12.5185 32.6526 13.1249 32.6747 13.7314 32.6836C13.9062 32.6858 14.0855 32.6614 14.2581 32.6836C14.6875 32.7389 15.1147 32.8142 15.5507 32.8828C15.6038 32.4379 15.657 32.0041 15.7123 31.5459C15.6968 31.5083 15.6724 31.4176 15.6304 31.3357C15.4423 30.9727 15.6171 30.5765 15.5219 30.1958C15.4467 29.897 15.4976 29.565 15.502 29.2463C15.5042 29.0869 15.5374 28.9276 15.5419 28.766C15.5551 28.029 15.5618 27.2942 15.5751 26.5571C15.5773 26.3867 15.6525 26.1986 15.6016 26.0503C15.3427 25.3044 15.6658 24.543 15.4821 23.775C15.3427 23.1929 15.4887 22.5444 15.4976 21.9247C15.5064 21.3404 15.491 20.7583 15.5042 20.174C15.5197 19.3572 15.5352 18.5427 15.5861 17.7282C15.5972 17.4361 15.7123 17.155 15.7743 16.9115Z"
                                        fill="url(#paint1_linear_2037_86716)"
                                      />
                                      <path
                                        d="M26.3099 20.0683C26.5091 19.8669 26.6619 19.5814 26.8566 19.5482C27.1953 19.4929 27.2307 19.8912 27.2727 20.1037C27.3856 20.6814 27.4011 21.2768 27.4874 21.8589C27.6069 22.6579 27.3148 23.4414 27.4808 24.2559C27.6025 24.8579 27.4985 25.5064 27.514 26.1328C27.5273 26.7104 27.5782 27.2881 27.587 27.868C27.5892 28.0871 27.4941 28.3085 27.4918 28.5276C27.483 29.2779 27.5273 30.0304 27.4896 30.7785C27.452 31.52 27.5892 32.2769 27.3104 33.0029C27.2794 33.087 27.3347 33.2486 27.4033 33.3172C27.7176 33.6248 27.711 34.0299 27.3104 34.1848C26.7504 34.4017 26.1816 34.5876 25.5464 34.5234C24.8071 34.4504 24.0612 34.4614 23.3175 34.4349C22.9059 34.4194 22.4942 34.3751 22.0825 34.384C21.4827 34.3973 20.8829 34.4305 20.2853 34.4836C19.8205 34.5256 19.805 34.4194 19.774 33.928C19.7541 33.616 19.825 33.3172 19.794 33.0051C19.7364 32.4385 19.7608 31.8608 19.7497 31.2898C19.7386 30.5948 19.7209 29.8976 19.7231 29.2026C19.7231 28.9105 19.7696 28.6183 19.7829 28.3239C19.8095 27.6777 19.836 27.0314 19.8493 26.3851C19.8648 25.7078 19.8936 25.0283 19.8626 24.3533C19.8272 23.5344 19.7231 22.7176 19.6767 21.8987C19.6678 21.746 19.774 21.58 19.8493 21.4295C19.929 21.2679 20.0131 21.1418 19.774 21.0245C19.5926 20.9337 19.4155 20.3228 19.4775 20.1369C19.5771 19.8359 19.9245 19.6367 20.2831 19.65C20.728 19.6655 21.1861 19.5925 21.6133 19.6832C22.4566 19.8647 23.3021 19.6411 24.1431 19.7916C24.8757 19.92 25.6172 19.982 26.3099 20.0683ZM21.0002 21.2746C21.0865 21.6176 21.1706 21.912 21.2304 22.2108C21.3521 22.8128 21.3499 23.4215 21.3477 24.0323C21.3477 24.7716 21.3411 25.5108 21.3455 26.2501C21.3477 26.5179 21.4141 26.7879 21.3898 27.0513C21.3521 27.4563 21.2636 27.8592 21.195 28.262C21.1551 28.4899 21.0046 28.7688 21.0865 28.9348C21.2946 29.3664 21.1507 29.8047 21.1906 30.2318C21.2658 31.0485 21.1972 31.8785 21.1596 32.7019C21.1463 32.9985 21.2105 33.0582 21.4982 32.9763C21.6863 32.9232 21.9032 32.9498 22.1047 32.9675C22.4588 32.9985 22.8107 33.0826 23.1648 33.0848C23.7425 33.0892 24.3224 33.0383 24.9023 33.025C25.4003 33.0139 25.8983 33.0228 26.2989 33.0228C26.2214 32.3854 26.113 31.6904 26.0576 30.9932C26.0222 30.555 26.0709 30.1101 26.0643 29.6696C26.051 28.8374 26.02 28.003 26.0067 27.1708C26.0001 26.7724 26.0333 26.3718 26.02 25.9712C26.0023 25.4267 25.9315 24.8823 25.9359 24.3378C25.9403 23.8663 26.0333 23.3949 26.0554 22.9235C26.0775 22.4321 26.0598 21.9408 26.0598 21.4605C25.885 21.4494 25.7345 21.4406 25.5862 21.4273C24.9244 21.3631 24.2648 21.2524 23.6031 21.248C22.886 21.2436 22.1733 21.5003 21.4473 21.2613C21.3123 21.2148 21.1441 21.2679 21.0002 21.2746Z"
                                        fill="url(#paint2_linear_2037_86716)"
                                      />
                                      <path
                                        d="M23.7685 37.6348C23.7685 37.6348 23.7796 37.5595 23.7951 37.471C23.7486 37.4843 23.7287 37.4865 23.711 37.4953C23.5516 37.5706 23.3923 37.71 23.2329 37.7122C22.6242 37.7145 22.0156 37.679 21.4069 37.6392C20.9598 37.6104 20.515 37.5308 20.0679 37.5175C19.5654 37.502 19.063 37.5285 18.5606 37.5485C18.0051 37.5706 17.4451 37.6613 16.894 37.6259C16.3384 37.5905 15.7918 37.4068 15.2362 37.3426C14.7382 37.2829 14.2336 37.2984 13.7312 37.2784C13.6205 37.274 13.5098 37.2629 13.3992 37.2563C13.3306 37.2519 13.2509 37.2209 13.1911 37.243C12.6024 37.471 11.9915 37.1456 11.3851 37.3316C11.0929 37.4223 10.741 37.2917 10.4156 37.2939C9.87116 37.2984 9.3289 37.336 8.78443 37.3448C8.60515 37.3471 8.42808 37.3028 8.24881 37.2829C7.48964 37.1965 6.72826 37.1213 5.97131 37.0128C5.83187 36.9929 5.71236 36.8402 5.58398 36.7495C5.69244 36.6211 5.77654 36.4285 5.91377 36.3776C6.79909 36.0412 7.68884 35.707 8.67598 35.9062C8.88845 35.9482 9.1297 35.8154 9.3621 35.7999C9.83353 35.7712 10.3072 35.7623 10.7808 35.7557C11.3696 35.7468 11.9605 35.7335 12.5493 35.7468C12.8104 35.7513 13.0716 35.8177 13.335 35.8486C13.6382 35.8841 13.9282 36.0102 14.2513 35.8331C14.3929 35.7557 14.6342 35.8663 14.8312 35.8863C15.4841 35.9571 16.137 36.0235 16.79 36.0921C16.8254 36.0965 16.8652 36.1076 16.8962 36.0987C17.3588 35.9372 17.8236 36.0833 18.2862 36.0833C18.7222 36.0833 19.156 36.0102 19.592 35.9903C19.8443 35.9792 20.0966 36.0191 20.349 36.0169C20.7806 36.0124 21.2631 35.8663 21.6349 36.0102C22.1285 36.2006 22.622 36.1784 23.1067 36.2205C23.7884 36.278 24.4812 36.2116 25.1695 36.205C25.32 36.2028 25.4706 36.2227 25.6211 36.2338C26.3913 36.2935 27.1615 36.3931 27.9317 36.3998C28.764 36.4086 29.5984 36.3024 30.4328 36.3024C31.1875 36.3024 31.9445 36.3754 32.6992 36.4175C32.7789 36.4219 32.863 36.433 32.9405 36.4197C33.1574 36.3843 33.3721 36.3002 33.5868 36.3002C34.0604 36.3024 34.5363 36.3887 35.0033 36.3555C35.5854 36.3156 36.1542 36.3488 36.7296 36.4175C37.4556 36.5038 38.1926 36.6521 38.912 36.599C39.5228 36.5547 40.043 36.8402 40.6251 36.8491C40.8486 36.8513 41.1009 37.0261 41.2846 37.1877C41.5281 37.4002 41.4152 37.7056 41.2138 37.9601C40.7623 38.5245 40.1935 38.2457 39.6667 38.239C39.2417 38.2346 38.819 38.1571 38.3918 38.1217C38.0621 38.0952 37.7101 38.1461 37.4069 38.0465C37.0417 37.9292 36.6942 38.011 36.3401 37.9845C35.9306 37.9535 35.5256 37.8694 35.1161 37.8251C34.9435 37.8052 34.7642 37.8185 34.5894 37.834C34.4012 37.8517 34.2153 37.9114 34.0272 37.9159C33.7948 37.9203 33.5624 37.8716 33.33 37.876C32.8209 37.8827 32.3119 37.9225 31.805 37.9203C31.4177 37.9181 31.0326 37.8716 30.6453 37.8495C30.5324 37.8428 30.4107 37.8185 30.3044 37.8473C29.8263 37.9756 29.3527 37.9181 28.868 37.876C28.3434 37.8318 27.81 37.9004 27.2788 37.8893C26.8185 37.8782 26.3514 37.7499 25.9044 37.8118C25.4883 37.8694 25.0899 37.5994 24.6826 37.8096C24.6184 37.8428 24.5144 37.8185 24.4325 37.8008C24.2267 37.7521 24.0186 37.6968 23.7685 37.6348Z"
                                        fill="url(#paint3_linear_2037_86716)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86716"
                                          x1="33.994"
                                          y1="8.20312"
                                          x2="33.994"
                                          y2="34.6803"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#244738" />
                                          <stop
                                            offset={1}
                                            stopColor="#244738"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86716"
                                          x1="12.8226"
                                          y1="15.0381"
                                          x2="12.8226"
                                          y2="34.2276"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#244738" />
                                          <stop
                                            offset={1}
                                            stopColor="#244738"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint2_linear_2037_86716"
                                          x1="23.5455"
                                          y1="19.543"
                                          x2="23.5455"
                                          y2="34.5363"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#244738" />
                                          <stop
                                            offset={1}
                                            stopColor="#244738"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint3_linear_2037_86716"
                                          x1="23.5034"
                                          y1="35.7412"
                                          x2="23.5034"
                                          y2="38.3137"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#244738" />
                                          <stop
                                            offset={1}
                                            stopColor="#244738"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      campaign launch time reduction
                                    </div>
                                    <div>70%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_45ad8f81-e034-a69f-60fb-dc551bb13151-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="a logo of intercom"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
                <div
                  id="w-node-_643ed164-4779-5411-134d-3f52c55fbbbd-41695672"
                  className="modal-item attio"
                >
                  <a href="#" className="modal-toggle attio w-inline-block">
                    <div className="icon-embed-custom-3 w-embed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 33 32"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                        role="img"
                      >
                        <path
                          d="M5.5 27C4.33333 27 3.58333 26.3623 3.58333 25.3261C3.58333 24.6087 4.33333 23.971 5.33333 23.2536C6.66667 22.1377 8.41667 20.4638 8.41667 18.1522C8.41667 16.7971 7.33333 16.6377 6.16667 16.2391C3.16667 15.442 1.5 13.4493 1.5 10.8188C1.5 7.71015 4.25 5 7.91667 5C12.0833 5 15.1667 8.26812 15.1667 13.7681C15.1667 21.4203 8.5 27 5.5 27ZM21.9167 27C20.6667 27 20 26.3623 20 25.3261C20 24.6087 20.6667 23.971 21.6667 23.2536C23 22.1377 24.75 20.4638 24.75 18.1522C24.75 16.7971 23.6667 16.6377 22.5 16.2391C19.5 15.442 17.8333 13.4493 17.8333 10.8188C17.8333 7.71015 20.5833 5 24.25 5C28.4167 5 31.5 8.26812 31.5 13.7681C31.5 21.4203 24.8333 27 21.9167 27Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="long-testimonial-text " >
                      Supreme Coach really helped us level up our creator program
                      into a strong growth channel. Instead of scouring the
                      internet, their AI search enabled us to find and book the
                      best creators in PLG.
                    </div>
                    <div className="long_testimonial-botom">
                      <div className="long_author-wrapper">
                        <div>Alex Vale</div>
                        <div className="author-position-text">
                          Head of Growth at Attio
                        </div>
                      </div>
                      <div className="open-icon w-embed">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            width={24}
                            height={24}
                            rx={12}
                            fill="url(#paint0_linear_950_42983)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.4984 6.3999C12.9403 6.3999 13.2984 6.75807 13.2984 7.1999V11.1999H17.2984C17.7403 11.1999 18.0984 11.5581 18.0984 11.9999C18.0984 12.4417 17.7403 12.7999 17.2984 12.7999H13.2984V16.7999C13.2984 17.2417 12.9403 17.5999 12.4984 17.5999C12.0566 17.5999 11.6984 17.2417 11.6984 16.7999V12.7999H7.69844C7.25661 12.7999 6.89844 12.4417 6.89844 11.9999C6.89844 11.5581 7.25661 11.1999 7.69844 11.1999L11.6984 11.1999V7.1999C11.6984 6.75807 12.0566 6.3999 12.4984 6.3999Z"
                            fill="url(#paint1_linear_950_42983)"
                            stroke="url(#paint2_linear_950_42983)"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42983"
                              x1="12.5"
                              y1={0}
                              x2="12.5"
                              y2={24}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42983"
                              x1="12.4984"
                              y1="6.3999"
                              x2="12.4984"
                              y2="17.5999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42983"
                              x1="12.4984"
                              y1="6.3999"
                              x2="12.4984"
                              y2="17.5999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper purple-bg"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a
                          aria-label="modal-close-button"
                          href="#"
                          className="popup-close w-inline-block"
                        >
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              sizes="(max-width: 479px) 100vw, (max-width: 991px) 460px, (max-width: 1279px) 32vw, 24vw"
                              alt="modal-img"
                              className="modal_img-item"
                            />
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={128}
                              alt="pf character"
                              className="pf_character-modal"
                            />
                          </div>
                          <div className="modal_content-block">
                            <div className="modal-testimonial">
                              Supreme Coach really helped us level up our
                              creator program into a strong growth channel.
                              Instead of scouring the internet, their AI search
                              enabled us to find and book the best creators in
                              PLG.”
                            </div>
                            <div className="testimonial_modal-details">
                              <div className="inside_modal-name-wrap">
                                <div className="modal-testimonial">
                                  Alex Vale
                                </div>
                                <div>Head of Growth at Attio</div>
                              </div>
                              <div className="testimonial_author-stats">
                                <div className="author_stat-item hide">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M23.7032 36.962C23.7497 37.1966 23.6546 37.3405 23.4731 37.5087C22.9397 38.0023 22.3133 37.9138 21.6825 37.8894C21.4877 37.8828 21.2907 37.9625 21.0982 37.9558C20.5891 37.9403 20.0823 37.8806 19.5732 37.8783C19.2191 37.8761 18.865 37.9403 18.6149 37.9669C18.4754 38.2391 18.4201 38.5158 18.2674 38.5932C18.1412 38.6552 17.869 38.5158 17.7118 38.3985C17.4839 38.2281 17.2669 38.02 17.1098 37.7832C16.9018 37.4689 16.7557 37.1148 16.5875 36.7761C16.282 36.1608 15.9677 35.5522 15.8571 34.8594C15.8283 34.6845 15.6712 34.534 15.5959 34.3636C15.2086 33.4894 14.8146 32.6173 14.4472 31.7342C14.1993 31.141 14.0001 30.5257 13.7544 29.9304C13.5929 29.5408 13.3848 29.1712 13.2033 28.7905C13.0417 28.4474 12.8802 28.1044 12.7363 27.7525C12.5482 27.2899 12.349 26.8273 12.2118 26.3492C12.1431 26.1036 12.1985 25.8225 12.1985 25.4993C12.0657 25.5237 11.8443 25.5724 11.6208 25.6011C11.5455 25.6122 11.4659 25.5768 11.3884 25.5591C11.1361 25.5015 10.886 25.4418 10.6337 25.3842C10.2817 25.3045 10.191 25.0035 10.1954 24.7291C10.1976 24.5697 10.3836 24.3661 10.5385 24.2665C10.7709 24.1204 10.6956 24.0253 10.6359 23.8061C10.5274 23.4033 10.2751 22.9872 10.5451 22.5313C10.596 22.445 10.4721 22.2657 10.4477 22.124C10.4101 21.9138 10.3924 21.6991 10.6182 21.6747C10.585 21.4954 10.5496 21.3361 10.5274 21.1745C10.4964 20.9488 10.4566 20.723 10.4522 20.495C10.4411 19.8355 10.4256 19.1737 10.4477 18.5141C10.4699 17.8346 10.5341 17.1574 10.5805 16.4646C10.4013 16.4159 10.2862 16.3938 10.1799 16.3539C9.9409 16.2654 9.74834 16.1304 9.78597 15.836C9.82359 15.5461 10.025 15.4155 10.2884 15.3579C10.4721 15.3181 10.6558 15.2761 10.8417 15.2473C11.0697 15.2097 11.2977 15.172 11.5256 15.1543C12.1099 15.1056 12.7562 14.8931 13.2675 15.0702C13.9271 15.296 14.518 15.0282 15.14 15.1101C15.7685 15.1919 16.4303 15.0259 17.0633 15.0968C17.8225 15.1809 18.5662 15.4 19.3187 15.5571C19.4161 15.5771 19.5245 15.5948 19.6197 15.5771C20.0402 15.4907 20.4563 15.3867 20.8746 15.2982C20.9853 15.2761 21.1048 15.2982 21.2177 15.2805C21.3594 15.2583 21.4966 15.2207 21.6338 15.1809C21.8042 15.13 21.968 15.0636 22.1384 15.0127C22.4085 14.9308 22.6807 14.8511 22.9529 14.7803C23.1721 14.7227 23.3934 14.674 23.6169 14.6342C24.0242 14.5612 24.4336 14.5147 24.8365 14.4239C24.9759 14.3929 25.0844 14.2336 25.2238 14.1849C25.9807 13.9171 26.7399 13.6648 27.5013 13.4102C27.7514 13.3283 28.0192 13.2907 28.256 13.1823C28.6788 12.9897 29.086 12.7595 29.4977 12.5426C29.5818 12.4984 29.6637 12.4076 29.7434 12.412C30.2104 12.4364 30.4627 12.0867 30.788 11.8565C30.9717 11.7259 31.1754 11.6197 31.3613 11.4913C31.8305 11.1615 32.3042 10.8339 32.7601 10.4887C32.9305 10.3581 33.0678 10.1788 33.2116 10.0172C33.6499 9.52145 34.1988 9.32668 34.845 9.41521C34.9336 9.42628 35.0464 9.49489 35.0863 9.57015C35.2634 9.90436 35.4559 10.2386 35.5666 10.5949C35.664 10.9158 35.6418 11.27 35.706 11.6042C35.841 12.2992 35.8034 12.9809 35.6772 13.6758C35.5909 14.1495 35.5998 14.6408 35.5666 15.1189C36.2239 15.1853 36.7264 15.4642 37.2575 15.6346C37.8994 15.8427 38.2535 16.3252 38.7471 16.6638C39.0968 16.9028 39.1101 17.33 39.2584 17.6731C39.4598 18.1423 39.6036 18.6425 39.7121 19.1449C39.9024 20.0192 40.0043 20.9023 39.7254 21.7876C39.6014 22.1816 39.5505 22.5999 39.4222 22.9939C39.3668 23.1643 39.2163 23.3148 39.0791 23.4409C38.8024 23.6933 38.5302 23.9699 38.2071 24.147C37.7954 24.3727 37.3461 24.583 36.8901 24.6627C36.4829 24.7335 36.0424 24.6206 35.5644 24.583C35.5444 24.8685 35.509 25.154 35.5112 25.4396C35.5135 25.8822 35.54 26.3249 35.5599 26.7698C35.5776 27.2191 35.6197 27.6706 35.6108 28.1199C35.6042 28.4961 35.5577 28.8746 35.5002 29.2487C35.4626 29.501 35.4714 29.6825 35.7016 29.8728C36.038 30.1517 36.3324 30.4859 36.6068 30.8267C36.6976 30.9374 36.671 31.1433 36.6976 31.3048C36.5316 31.2982 36.3457 31.3358 36.2018 31.2738C35.8964 31.1455 35.6131 30.9662 35.3032 30.7958C35.2346 31.068 35.1925 31.338 35.0907 31.5815C35.0332 31.7209 34.8871 31.8626 34.7499 31.9113C34.6879 31.9334 34.4865 31.7519 34.4511 31.6324C34.3227 31.2074 34.2497 30.767 34.1301 30.3398C34.0903 30.196 34.0018 30.0255 33.8822 29.9503C33.3201 29.5939 32.7535 29.2442 32.1647 28.9366C31.4587 28.567 30.7261 28.2505 30.0156 27.8941C29.6504 27.7104 29.3096 27.4824 28.9532 27.2855C28.6522 27.1217 28.3091 27.0132 28.0369 26.8118C27.5655 26.4621 26.9745 26.5329 26.4721 26.285C25.9763 26.0416 25.4363 25.8822 24.9051 25.7251C24.4801 25.5989 24.0352 25.5325 23.6014 25.4329C23.4886 25.4064 23.3801 25.3621 23.2694 25.3245C23.0791 25.2603 22.8954 25.1784 22.7006 25.1363C22.03 24.9903 21.3549 24.8641 20.6843 24.7224C20.2593 24.6339 20.1819 24.5166 20.0624 25.0389C20.0026 25.2957 19.9428 25.5768 19.6263 25.6365C19.3939 25.6808 19.2014 25.4794 19.0243 25.0013C17.0412 25.4661 15.0094 25.6056 12.9244 25.4064C13.2963 25.9663 13.657 26.4466 13.947 26.969C14.2148 27.4515 14.4096 27.976 14.6331 28.4829C14.6552 28.536 14.6375 28.6289 14.6707 28.6489C15.1355 28.9344 15.1333 29.4943 15.4144 29.8883C15.5052 30.0167 15.5206 30.1982 15.5893 30.3465C15.9589 31.1565 16.3418 31.96 16.7026 32.7745C16.8531 33.1131 16.946 33.4783 17.0832 33.8236C17.2979 34.3725 17.5325 34.9125 17.7517 35.4592C17.8822 35.7823 18.0018 36.1099 18.1412 36.4729C18.679 36.3976 19.2368 36.2936 19.799 36.2516C20.2571 36.2184 20.7197 36.2604 21.1801 36.2693C21.2266 36.2693 21.2775 36.2892 21.3217 36.2781C22.2535 36.0457 22.9529 36.6079 23.7121 36.9687L23.7032 36.962ZM20.2638 23.6468C20.5781 23.6468 20.8724 23.6335 21.1646 23.649C21.6227 23.6756 22.0831 23.7818 22.5346 23.7464C23.1012 23.7021 23.5682 23.981 24.0817 24.0983C24.1371 24.1116 24.1703 24.2156 24.2079 24.2687C24.3916 24.2488 24.5797 24.178 24.7413 24.22C25.4872 24.4148 26.2331 24.6162 26.9612 24.8663C27.8842 25.1828 28.7983 25.5281 29.6969 25.9066C30.186 26.1124 30.6375 26.4112 31.1045 26.6746C31.7198 27.0199 32.3374 27.3607 32.9438 27.7215C33.3201 27.945 33.6764 28.1973 34.0837 28.4652C33.9177 28.0845 34.1633 27.7082 33.9509 27.3452C33.8867 27.2346 33.9818 26.9977 34.0549 26.8428C34.1567 26.6281 34.2098 26.4267 34.0438 26.2364C33.8225 25.9796 34.0637 25.7295 34.0328 25.475C33.9973 25.1917 33.973 24.9039 33.9796 24.6206C33.9929 24.0164 34.0505 23.4144 34.0527 22.8102C34.0549 22.1816 34.0106 21.553 33.9863 20.9244C33.9619 20.287 33.9332 19.6473 33.9132 19.0099C33.9022 18.7023 33.8867 18.3946 33.9044 18.0892C33.9332 17.5801 34.004 17.071 34.0239 16.562C34.0482 15.9445 34.0261 15.3247 34.0527 14.705C34.0814 14.0211 34.1346 13.3394 34.1988 12.6599C34.2364 12.2704 34.3205 11.8853 34.3847 11.4979C34.4112 11.343 34.4422 11.1903 34.471 11.0287C34.2098 11.2102 33.9752 11.3541 33.7605 11.5245C33.1098 12.0402 32.4901 12.5979 31.815 13.0782C31.182 13.5275 30.4472 13.8175 29.7743 14.2137C29.2697 14.5102 28.6854 14.6762 28.1276 14.8799C27.6451 15.0547 27.1516 15.1986 26.6624 15.3535C26.3083 15.4664 25.9586 15.5903 25.6001 15.6811C25.257 15.7674 24.9006 15.794 24.5576 15.8803C24.0375 16.0109 23.5306 16.2101 23.0061 16.3097C22.4394 16.4181 21.8573 16.4469 21.2797 16.5044C21.0672 16.5266 20.8503 16.5111 20.6422 16.5487C20.5581 16.5642 20.4298 16.6682 20.4231 16.739C20.3877 17.195 20.3678 17.6509 20.37 18.1091C20.3744 18.8306 20.4187 19.5522 20.4143 20.2715C20.4121 20.8469 20.277 21.4091 20.3589 22.0045C20.4298 22.5202 20.3036 23.0691 20.2638 23.6468ZM11.9971 16.6572C11.9971 17.1906 12.0059 17.6642 11.9926 18.1379C11.9838 18.4411 11.8443 18.7775 11.9351 19.0409C12.1542 19.6805 11.851 20.3025 11.9683 20.9355C12.0701 21.4888 12.1144 22.0576 12.1365 22.622C12.1498 22.9452 12.0568 23.2705 12.0303 23.5959C12.0214 23.6933 12.0767 23.7973 12.0967 23.8991C12.1343 24.0961 12.2295 24.0275 12.3468 23.9677C12.4132 23.9345 12.5061 23.9257 12.5814 23.9389C13.0794 24.0297 13.5641 24.0496 14.0731 23.9434C14.5224 23.8504 15.0005 23.8725 15.4653 23.8836C15.9036 23.8947 16.3529 24.0363 16.7756 23.9766C17.3931 23.888 17.9531 24.1027 18.5396 24.1669C18.8207 24.1979 18.8804 24.1492 18.8472 23.8548C18.7963 23.4122 18.6193 22.9761 18.7587 22.5158C18.7853 22.425 18.7565 22.3077 18.7299 22.2081C18.6281 21.854 18.6436 21.5176 18.8539 21.2232C18.8052 21.117 18.7255 21.0218 18.7277 20.9311C18.7432 20.3025 18.7742 19.6761 18.8074 19.0475C18.8362 18.5031 18.876 17.9608 18.8982 17.4163C18.9048 17.2791 18.8406 17.133 18.8605 17.0002C18.9004 16.7324 18.9756 16.4712 19.0398 16.1924C18.9269 16.1813 18.876 16.1614 18.834 16.1724C18.0261 16.4203 17.2382 16.7811 16.3573 16.5686C16.3174 16.5598 16.2687 16.5952 16.2223 16.6018C15.9788 16.6395 15.7353 16.697 15.4919 16.7014C15.0514 16.7081 14.611 16.6726 14.1705 16.6749C13.7279 16.6771 13.2852 16.7014 12.8448 16.7191C12.6765 16.7258 12.5083 16.7435 12.2427 16.7612C12.4242 16.604 12.5172 16.5266 12.6079 16.4469C12.588 16.4137 12.5659 16.3805 12.546 16.3473C12.3578 16.4557 12.1675 16.5598 11.9971 16.6572ZM38.2646 20.9156C38.1893 20.453 38.0942 19.9948 38.0455 19.53C37.9924 19.0188 37.8706 18.5318 37.6537 18.0692C37.5386 17.8236 37.4523 17.5292 37.2598 17.361C36.9211 17.0644 36.5249 16.8209 36.1221 16.6173C36.0225 16.5664 35.6972 16.3739 35.633 16.6771C35.5467 17.0755 35.5245 17.496 35.5334 17.9032C35.5467 18.4743 35.6308 19.0453 35.6551 19.6186C35.6684 19.9019 35.5998 20.1896 35.6042 20.4751C35.6131 20.9842 35.675 21.491 35.6662 21.9979C35.6573 22.4981 35.5799 22.9961 35.5533 23.4963C35.5444 23.6468 35.6064 23.8548 35.8167 23.7707C36.2881 23.5826 36.7905 23.4564 37.1845 23.0935C37.4811 22.8212 37.7511 22.5932 37.8773 22.1484C37.9924 21.7478 38.1517 21.3604 38.2646 20.9156Z"
                                        fill="url(#paint0_linear_2037_86634)"
                                      />
                                      <path
                                        d="M23.7124 36.9737C23.6283 36.7989 23.5663 36.6063 23.4556 36.4514C23.1436 36.0154 23.0617 35.4864 22.8293 35.0194C22.7097 34.7781 22.4862 34.5856 22.2604 34.3111C21.7381 34.4661 21.1693 34.6985 20.5805 34.7804C20.3349 34.8136 19.9918 34.5789 19.7904 34.3731C19.5934 34.1673 19.631 33.822 19.8634 33.6294C19.9984 33.5166 20.2397 33.5143 20.4367 33.4944C20.897 33.4457 21.3596 33.417 21.7979 33.3815C21.6695 32.9588 21.5633 32.6113 21.4592 32.2616C21.3109 31.7614 21.0586 31.6485 20.5872 31.861C20.1091 32.0779 19.6155 31.9894 19.1308 31.8986C18.8564 31.8477 18.5554 31.8101 18.4358 31.4892C18.4049 31.4051 18.4004 31.3121 18.3827 31.2081C18.4403 31.124 18.5775 31.0133 18.5753 30.9026C18.5731 30.6083 18.7678 30.5463 18.9715 30.5175C19.5226 30.4401 20.0759 30.3869 20.6005 30.3272C20.4212 29.734 20.2397 29.1298 20.0626 28.5388C19.6842 28.665 19.3787 28.8133 19.0556 28.8642C18.5487 28.9439 17.9888 29.1099 17.5882 28.6274C17.4908 28.5123 17.5527 28.2445 17.5771 28.0519C17.6147 27.7664 17.7918 27.6004 18.0884 27.5738C18.686 27.5207 19.2835 27.4676 19.8988 27.41C19.8988 27.2241 19.8745 26.9939 19.9077 26.7748C19.932 26.6155 20.0339 26.4672 20.1003 26.3145C20.2751 26.3919 20.5164 26.4229 20.6137 26.5579C20.8882 26.9364 21.1427 27.337 21.3309 27.7642C21.6695 28.5322 21.9639 29.3201 22.256 30.1058C22.4397 30.5972 22.5637 31.1107 22.7607 31.5954C22.8935 31.9185 23.1281 32.1952 23.2808 32.5117C23.5442 33.0562 23.7389 33.6383 24.0399 34.1606C24.3343 34.6697 24.4959 35.2164 24.6752 35.7609C24.7194 35.8914 24.6818 36.0486 24.6818 36.2478C24.9053 36.3252 24.8655 36.5333 24.746 36.7591C24.5933 37.049 24.3078 37.1796 23.9957 37.091C23.8939 37.0623 23.7987 37.0092 23.7013 36.9671C23.7013 36.9627 23.7124 36.9737 23.7124 36.9737Z"
                                        fill="url(#paint1_linear_2037_86634)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86634"
                                          x1="24.8393"
                                          y1="9.39453"
                                          x2="24.8393"
                                          y2="38.6085"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86634"
                                          x1="21.1889"
                                          y1="26.3145"
                                          x2="21.1889"
                                          y2="37.1184"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      collabs
                                    </div>
                                    <div>32</div>
                                  </div>
                                </div>
                                <div className="stat-divider w-embed">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 1 68"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                    role="img"
                                  >
                                    <rect
                                      width={1}
                                      height={68}
                                      fill="url(#paint0_linear_1019_42594)"
                                    />
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_1019_42594"
                                        x1="0.5"
                                        y1={0}
                                        x2="0.5"
                                        y2={68}
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#802A00" />
                                        <stop offset={1} stopColor="#802A00" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                                <div className="author_stat-item">
                                  <div className="stat-icon w-embed">
                                    <svg
                                      width="100%"
                                      height="100%"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M36.3929 9.45282C36.4505 9.28018 36.5147 9.09426 36.5789 8.90613C36.6231 8.77334 36.6386 8.61176 36.7227 8.51216C36.8378 8.37715 37.0481 8.17353 37.1455 8.20673C37.3159 8.26427 37.504 8.46126 37.5527 8.63611C37.6811 9.09648 37.7586 9.57234 37.8117 10.0482C37.8471 10.3669 37.805 10.6923 37.805 11.0154C37.805 11.4581 37.8294 11.903 37.8095 12.3434C37.7873 12.8303 37.6767 13.3173 37.6988 13.802C37.7209 14.3221 37.5704 14.8466 37.6213 15.3314C37.6922 15.9865 37.5262 16.5996 37.5239 17.2326C37.5217 17.9918 37.504 18.7531 37.4753 19.5123C37.4642 19.8155 37.3801 20.1143 37.3712 20.4175C37.3602 20.7894 37.4044 21.1612 37.4022 21.5331C37.3956 22.3298 37.3093 23.1311 37.3757 23.9212C37.4443 24.7357 37.2097 25.5281 37.2716 26.3226C37.3115 26.8339 37.2517 27.343 37.3048 27.8388C37.3978 28.7086 37.3513 29.574 37.3823 30.4394C37.4066 31.1255 37.4421 31.8116 37.462 32.5C37.4708 32.8165 37.4775 33.2636 37.6302 33.4539C37.8714 33.7527 37.774 33.9519 37.732 34.233C37.6767 34.5938 37.4177 34.6845 37.161 34.6801C36.4992 34.6712 35.8396 34.6026 35.1801 34.5606C34.536 34.5185 33.8897 34.4853 33.2456 34.4344C32.8539 34.4034 32.4643 34.337 32.0726 34.306C31.6897 34.2751 31.3068 34.2795 30.9239 34.2463C30.5941 34.2175 30.2997 34.0737 30.3395 33.6465C30.3683 33.3366 30.2532 33.0179 30.2333 32.6992C30.2134 32.4137 30.2245 32.1215 30.2422 31.836C30.2776 31.2982 30.3595 30.7603 30.3639 30.2247C30.3705 29.2841 30.3395 28.3434 30.313 27.4027C30.2997 26.9291 30.2532 26.4577 30.2422 25.984C30.2377 25.8556 30.3108 25.7251 30.3351 25.5945C30.3484 25.517 30.3351 25.4351 30.3263 25.3576C30.2931 25.0832 30.2399 24.8087 30.2222 24.5343C30.1957 24.1116 30.1913 23.6866 30.1758 23.2616C30.1735 23.2152 30.1492 23.1532 30.1713 23.1222C30.51 22.6618 30.0894 22.1882 30.1979 21.7168C30.2754 21.3825 30.2731 21.0262 30.2864 20.6787C30.2975 20.3799 30.2731 20.0789 30.2798 19.7779C30.282 19.6584 30.344 19.5389 30.3395 19.4216C30.3196 18.8727 30.2731 18.3238 30.2643 17.7749C30.2599 17.5026 30.3263 17.2282 30.3395 16.9537C30.3573 16.5509 30.3462 16.1459 30.3617 15.7408C30.375 15.3978 30.4126 15.0569 30.4281 14.7139C30.4546 14.1495 30.4901 13.5851 30.4945 13.0207C30.4989 12.4386 30.4569 11.8565 30.4679 11.2744C30.4701 11.146 30.5764 10.9911 30.6804 10.8959C30.9039 10.6878 30.8198 10.5064 30.6317 10.3868C30.3816 10.2275 30.3573 9.99287 30.4082 9.77375C30.4768 9.48159 30.822 9.33773 31.1297 9.35101C31.3577 9.35986 31.5901 9.27354 31.8225 9.26469C32.5529 9.24034 33.2943 9.15845 34.0136 9.24034C34.7153 9.32002 35.4235 9.1496 36.1096 9.35322C36.1849 9.37535 36.2624 9.40634 36.3929 9.45282ZM36.4261 10.6679C35.9636 10.6679 35.5408 10.6679 35.1181 10.6679C34.8768 10.6679 34.6378 10.6657 34.3965 10.6746C34.1309 10.6856 33.8653 10.7277 33.5998 10.7233C33.073 10.7144 32.5462 10.6945 32.0217 10.6546C31.683 10.6281 31.6941 10.8029 31.745 11.0398C31.7915 11.2522 31.8402 11.4669 31.8623 11.6838C31.9044 12.1265 31.9486 12.5714 31.9575 13.0162C31.9641 13.4124 31.9176 13.8086 31.9021 14.2048C31.8778 14.7847 31.8535 15.3646 31.8402 15.9467C31.8247 16.5686 31.8291 17.1883 31.8114 17.8103C31.8003 18.1799 31.7516 18.5473 31.7428 18.9147C31.7317 19.3529 31.7494 19.7934 31.7428 20.2338C31.7406 20.4397 31.6941 20.6433 31.6919 20.8469C31.6919 21.3936 31.7052 21.9403 31.7118 22.487C31.714 22.5711 31.7184 22.653 31.7184 22.7371C31.7162 23.3635 31.7384 23.992 31.7007 24.6184C31.6875 24.8419 31.4794 25.0611 31.7539 25.258C31.7671 25.2669 31.7649 25.3023 31.7671 25.3267C31.7826 25.8136 31.8136 26.3005 31.8114 26.7874C31.8092 27.8808 31.8092 28.9742 31.7804 30.0653C31.7583 30.8644 31.6786 31.6611 31.6543 32.4601C31.6498 32.604 31.7693 32.8652 31.8601 32.8785C32.3293 32.9471 32.8096 32.9626 33.2855 32.9825C33.7193 33.0002 34.1531 32.9803 34.5869 33.0135C35.0229 33.0467 35.4545 33.1286 35.8883 33.1706C35.9392 33.175 36.0521 33.071 36.0521 33.0179C36.0521 32.6793 36.0145 32.3406 36.0145 32.002C36.0145 31.5815 36.0853 31.1543 36.0388 30.7404C35.9591 30.0366 35.8086 29.3416 35.9923 28.6333C36.0034 28.5957 35.9724 28.547 35.9702 28.5028C35.9282 27.8166 35.8573 27.1283 35.8573 26.4422C35.8573 25.7693 35.9503 25.0965 35.9613 24.4214C35.9702 23.8238 35.8994 23.2262 35.906 22.6286C35.9104 22.2369 36.0123 21.8473 36.0277 21.4534C36.0565 20.7363 36.0344 20.0191 36.0742 19.302C36.1185 18.4986 36.041 17.6952 36.207 16.8851C36.3155 16.3561 36.176 15.7895 36.2447 15.2229C36.3531 14.3398 36.2889 13.4368 36.3177 12.5426C36.3354 11.9229 36.3863 11.3031 36.4261 10.6679Z"
                                        fill="url(#paint0_linear_2037_86643)"
                                      />
                                      <path
                                        d="M16.7636 16.7721C16.83 17.3011 16.9208 17.8057 16.9473 18.3126C16.9694 18.7729 16.9075 19.2377 16.9075 19.7003C16.9075 20.2868 16.9517 20.8734 16.9451 21.4621C16.9407 21.9889 16.8787 22.5156 16.8698 23.0446C16.8654 23.2903 16.9451 23.5382 16.9517 23.7861C16.9805 24.7666 17.0137 25.7471 17.0093 26.7298C17.0049 27.3074 16.9141 27.8851 16.8964 28.465C16.8853 28.8346 16.9517 29.2043 16.9672 29.5761C16.9761 29.7952 16.9495 30.0165 16.9539 30.2357C16.965 30.7447 17.0049 31.2538 16.9938 31.7628C16.9872 32.086 16.9296 32.4135 16.8588 32.7301C16.7813 33.0842 16.6485 33.425 16.5688 33.7792C16.4958 34.1001 16.29 34.1709 16.0266 34.089C15.8451 34.0315 15.7056 33.9739 15.5662 34.1576C15.5264 34.2085 15.4179 34.224 15.3404 34.224C14.5968 34.2262 13.8531 34.2351 13.1094 34.213C12.5627 34.1953 12.0205 34.1089 11.4738 34.0979C10.9006 34.0868 10.3273 34.1488 9.75406 34.1444C9.54601 34.1421 9.33796 34.0448 9.08121 33.9784C8.98162 34.182 8.81783 34.1444 8.58986 33.9407C8.10736 33.5069 7.9303 33.0598 8.57215 32.6415C8.68061 32.5707 8.67618 32.2896 8.67618 32.1059C8.68061 31.5371 8.61642 30.9749 8.71381 30.395C8.80676 29.835 8.69831 29.2419 8.68503 28.662C8.67839 28.3809 8.68725 28.102 8.68946 27.8209C8.6961 27.002 8.68946 26.1831 8.71602 25.3642C8.7293 24.9923 8.83996 24.6249 8.85767 24.2531C8.87538 23.899 8.8289 23.5404 8.80677 23.1863C8.78906 22.8764 8.71602 22.5599 8.76029 22.2589C8.85988 21.5573 8.74701 20.8645 8.73151 20.1673C8.72266 19.78 8.58322 19.3838 8.63191 19.0098C8.75586 18.0757 8.63413 17.1528 8.61199 16.2232C8.60093 15.7164 8.67839 15.6212 9.17196 15.4353C9.3623 15.3644 9.5283 15.225 9.71643 15.1431C9.91563 15.0546 10.1303 14.9505 10.3273 15.163C10.345 15.1829 10.3959 15.1829 10.4269 15.1741C11.0931 14.986 11.7704 15.132 12.4432 15.1077C12.9833 15.0878 13.5278 15.2228 14.0722 15.256C14.63 15.2892 15.1922 15.2604 15.7499 15.2936C16.1262 15.3157 16.5069 15.3711 16.8721 15.4618C17.0425 15.5039 17.2063 15.6477 17.328 15.785C17.6069 16.0993 17.5272 16.5176 17.0602 16.7123C16.9805 16.7389 16.8853 16.7455 16.7636 16.7721ZM15.7743 16.9115C15.5242 16.8761 15.2895 16.8363 15.0549 16.8097C14.6521 16.7632 14.2493 16.6968 13.8443 16.6858C13.4436 16.6747 13.0408 16.7278 12.6402 16.7389C11.8611 16.7632 11.0798 16.7743 10.3007 16.8053C10.2277 16.8075 10.0971 16.9204 10.0971 16.9802C10.1015 17.3763 10.1347 17.7703 10.1591 18.1665C10.179 18.5051 10.2056 18.8438 10.2189 19.1824C10.2388 19.7114 10.2432 20.2426 10.2675 20.7715C10.2875 21.2253 10.3406 21.6768 10.3517 22.1305C10.3583 22.385 10.2432 22.6551 10.2985 22.8919C10.4092 23.3567 10.3782 23.8082 10.345 24.2708C10.3295 24.4921 10.3406 24.7134 10.3384 24.937C10.3317 25.5058 10.3384 26.0724 10.3096 26.639C10.2919 26.9644 10.2255 27.2897 10.1635 27.6129C10.1414 27.7302 10.0197 27.8431 10.0307 27.9493C10.0573 28.226 10.1591 28.496 10.1768 28.7727C10.1989 29.1224 10.1724 29.4743 10.1547 29.8262C10.148 29.9789 10.0883 30.1316 10.0971 30.2821C10.1148 30.5433 10.1901 30.8 10.2011 31.059C10.2211 31.5614 10.2078 32.0638 10.2277 32.5663C10.2299 32.6304 10.3362 32.7411 10.3959 32.7455C10.6637 32.7588 10.9315 32.7455 11.1994 32.7278C11.4384 32.7123 11.6752 32.6548 11.912 32.6526C12.5185 32.6526 13.1249 32.6747 13.7314 32.6836C13.9062 32.6858 14.0855 32.6614 14.2581 32.6836C14.6875 32.7389 15.1147 32.8142 15.5507 32.8828C15.6038 32.4379 15.657 32.0041 15.7123 31.5459C15.6968 31.5083 15.6724 31.4176 15.6304 31.3357C15.4423 30.9727 15.6171 30.5765 15.5219 30.1958C15.4467 29.897 15.4976 29.565 15.502 29.2463C15.5042 29.0869 15.5374 28.9276 15.5419 28.766C15.5551 28.029 15.5618 27.2942 15.5751 26.5571C15.5773 26.3867 15.6525 26.1986 15.6016 26.0503C15.3427 25.3044 15.6658 24.543 15.4821 23.775C15.3427 23.1929 15.4887 22.5444 15.4976 21.9247C15.5064 21.3404 15.491 20.7583 15.5042 20.174C15.5197 19.3572 15.5352 18.5427 15.5861 17.7282C15.5972 17.4361 15.7123 17.155 15.7743 16.9115Z"
                                        fill="url(#paint1_linear_2037_86643)"
                                      />
                                      <path
                                        d="M26.3099 20.0683C26.5091 19.8669 26.6619 19.5814 26.8566 19.5482C27.1953 19.4929 27.2307 19.8912 27.2727 20.1037C27.3856 20.6814 27.4011 21.2768 27.4874 21.8589C27.6069 22.6579 27.3148 23.4414 27.4808 24.2559C27.6025 24.8579 27.4985 25.5064 27.514 26.1328C27.5273 26.7104 27.5782 27.2881 27.587 27.868C27.5892 28.0871 27.4941 28.3085 27.4918 28.5276C27.483 29.2779 27.5273 30.0304 27.4896 30.7785C27.452 31.52 27.5892 32.2769 27.3104 33.0029C27.2794 33.087 27.3347 33.2486 27.4033 33.3172C27.7176 33.6248 27.711 34.0299 27.3104 34.1848C26.7504 34.4017 26.1816 34.5876 25.5464 34.5234C24.8071 34.4504 24.0612 34.4614 23.3175 34.4349C22.9059 34.4194 22.4942 34.3751 22.0825 34.384C21.4827 34.3973 20.8829 34.4305 20.2853 34.4836C19.8205 34.5256 19.805 34.4194 19.774 33.928C19.7541 33.616 19.825 33.3172 19.794 33.0051C19.7364 32.4385 19.7608 31.8608 19.7497 31.2898C19.7386 30.5948 19.7209 29.8976 19.7231 29.2026C19.7231 28.9105 19.7696 28.6183 19.7829 28.3239C19.8095 27.6777 19.836 27.0314 19.8493 26.3851C19.8648 25.7078 19.8936 25.0283 19.8626 24.3533C19.8272 23.5344 19.7231 22.7176 19.6767 21.8987C19.6678 21.746 19.774 21.58 19.8493 21.4295C19.929 21.2679 20.0131 21.1418 19.774 21.0245C19.5926 20.9337 19.4155 20.3228 19.4775 20.1369C19.5771 19.8359 19.9245 19.6367 20.2831 19.65C20.728 19.6655 21.1861 19.5925 21.6133 19.6832C22.4566 19.8647 23.3021 19.6411 24.1431 19.7916C24.8757 19.92 25.6172 19.982 26.3099 20.0683ZM21.0002 21.2746C21.0865 21.6176 21.1706 21.912 21.2304 22.2108C21.3521 22.8128 21.3499 23.4215 21.3477 24.0323C21.3477 24.7716 21.3411 25.5108 21.3455 26.2501C21.3477 26.5179 21.4141 26.7879 21.3898 27.0513C21.3521 27.4563 21.2636 27.8592 21.195 28.262C21.1551 28.4899 21.0046 28.7688 21.0865 28.9348C21.2946 29.3664 21.1507 29.8047 21.1906 30.2318C21.2658 31.0485 21.1972 31.8785 21.1596 32.7019C21.1463 32.9985 21.2105 33.0582 21.4982 32.9763C21.6863 32.9232 21.9032 32.9498 22.1047 32.9675C22.4588 32.9985 22.8107 33.0826 23.1648 33.0848C23.7425 33.0892 24.3224 33.0383 24.9023 33.025C25.4003 33.0139 25.8983 33.0228 26.2989 33.0228C26.2214 32.3854 26.113 31.6904 26.0576 30.9932C26.0222 30.555 26.0709 30.1101 26.0643 29.6696C26.051 28.8374 26.02 28.003 26.0067 27.1708C26.0001 26.7724 26.0333 26.3718 26.02 25.9712C26.0023 25.4267 25.9315 24.8823 25.9359 24.3378C25.9403 23.8663 26.0333 23.3949 26.0554 22.9235C26.0775 22.4321 26.0598 21.9408 26.0598 21.4605C25.885 21.4494 25.7345 21.4406 25.5862 21.4273C24.9244 21.3631 24.2648 21.2524 23.6031 21.248C22.886 21.2436 22.1733 21.5003 21.4473 21.2613C21.3123 21.2148 21.1441 21.2679 21.0002 21.2746Z"
                                        fill="url(#paint2_linear_2037_86643)"
                                      />
                                      <path
                                        d="M23.7685 37.6348C23.7685 37.6348 23.7796 37.5595 23.7951 37.471C23.7486 37.4843 23.7287 37.4865 23.711 37.4953C23.5516 37.5706 23.3923 37.71 23.2329 37.7122C22.6242 37.7145 22.0156 37.679 21.4069 37.6392C20.9598 37.6104 20.515 37.5308 20.0679 37.5175C19.5654 37.502 19.063 37.5285 18.5606 37.5485C18.0051 37.5706 17.4451 37.6613 16.894 37.6259C16.3384 37.5905 15.7918 37.4068 15.2362 37.3426C14.7382 37.2829 14.2336 37.2984 13.7312 37.2784C13.6205 37.274 13.5098 37.2629 13.3992 37.2563C13.3306 37.2519 13.2509 37.2209 13.1911 37.243C12.6024 37.471 11.9915 37.1456 11.3851 37.3316C11.0929 37.4223 10.741 37.2917 10.4156 37.2939C9.87116 37.2984 9.3289 37.336 8.78443 37.3448C8.60515 37.3471 8.42808 37.3028 8.24881 37.2829C7.48964 37.1965 6.72826 37.1213 5.97131 37.0128C5.83187 36.9929 5.71236 36.8402 5.58398 36.7495C5.69244 36.6211 5.77654 36.4285 5.91377 36.3776C6.79909 36.0412 7.68884 35.707 8.67598 35.9062C8.88845 35.9482 9.1297 35.8154 9.3621 35.7999C9.83353 35.7712 10.3072 35.7623 10.7808 35.7557C11.3696 35.7468 11.9605 35.7335 12.5493 35.7468C12.8104 35.7513 13.0716 35.8177 13.335 35.8486C13.6382 35.8841 13.9282 36.0102 14.2513 35.8331C14.3929 35.7557 14.6342 35.8663 14.8312 35.8863C15.4841 35.9571 16.137 36.0235 16.79 36.0921C16.8254 36.0965 16.8652 36.1076 16.8962 36.0987C17.3588 35.9372 17.8236 36.0833 18.2862 36.0833C18.7222 36.0833 19.156 36.0102 19.592 35.9903C19.8443 35.9792 20.0966 36.0191 20.349 36.0169C20.7806 36.0124 21.2631 35.8663 21.6349 36.0102C22.1285 36.2006 22.622 36.1784 23.1067 36.2205C23.7884 36.278 24.4812 36.2116 25.1695 36.205C25.32 36.2028 25.4706 36.2227 25.6211 36.2338C26.3913 36.2935 27.1615 36.3931 27.9317 36.3998C28.764 36.4086 29.5984 36.3024 30.4328 36.3024C31.1875 36.3024 31.9445 36.3754 32.6992 36.4175C32.7789 36.4219 32.863 36.433 32.9405 36.4197C33.1574 36.3843 33.3721 36.3002 33.5868 36.3002C34.0604 36.3024 34.5363 36.3887 35.0033 36.3555C35.5854 36.3156 36.1542 36.3488 36.7296 36.4175C37.4556 36.5038 38.1926 36.6521 38.912 36.599C39.5228 36.5547 40.043 36.8402 40.6251 36.8491C40.8486 36.8513 41.1009 37.0261 41.2846 37.1877C41.5281 37.4002 41.4152 37.7056 41.2138 37.9601C40.7623 38.5245 40.1935 38.2457 39.6667 38.239C39.2417 38.2346 38.819 38.1571 38.3918 38.1217C38.0621 38.0952 37.7101 38.1461 37.4069 38.0465C37.0417 37.9292 36.6942 38.011 36.3401 37.9845C35.9306 37.9535 35.5256 37.8694 35.1161 37.8251C34.9435 37.8052 34.7642 37.8185 34.5894 37.834C34.4012 37.8517 34.2153 37.9114 34.0272 37.9159C33.7948 37.9203 33.5624 37.8716 33.33 37.876C32.8209 37.8827 32.3119 37.9225 31.805 37.9203C31.4177 37.9181 31.0326 37.8716 30.6453 37.8495C30.5324 37.8428 30.4107 37.8185 30.3044 37.8473C29.8263 37.9756 29.3527 37.9181 28.868 37.876C28.3434 37.8318 27.81 37.9004 27.2788 37.8893C26.8185 37.8782 26.3514 37.7499 25.9044 37.8118C25.4883 37.8694 25.0899 37.5994 24.6826 37.8096C24.6184 37.8428 24.5144 37.8185 24.4325 37.8008C24.2267 37.7521 24.0186 37.6968 23.7685 37.6348Z"
                                        fill="url(#paint3_linear_2037_86643)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_2037_86643"
                                          x1="33.994"
                                          y1="8.20312"
                                          x2="33.994"
                                          y2="34.6803"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_2037_86643"
                                          x1="12.8226"
                                          y1="15.0381"
                                          x2="12.8226"
                                          y2="34.2276"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint2_linear_2037_86643"
                                          x1="23.5455"
                                          y1="19.543"
                                          x2="23.5455"
                                          y2="34.5363"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                        <linearGradient
                                          id="paint3_linear_2037_86643"
                                          x1="23.5034"
                                          y1="35.7412"
                                          x2="23.5034"
                                          y2="38.3137"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#5A2655" />
                                          <stop
                                            offset={1}
                                            stopColor="#5A2655"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className="stat_texts-author">
                                    <div className="text-size-regular">
                                      Target customers reached
                                    </div>
                                    <div>3.2 Million</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-e6632629-e6b9-5e43-db7a-c0505b6e4641-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="a logo of posthog"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
                <div
                  id="w-node-_6376d829-4716-8530-f26d-559ea56697c9-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Replit</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper obsidian-gradient replit-popup-compact"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f66e00900592991b00b06a_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content replit-popup-compact">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              sizes="(max-width: 479px) 100vw, (max-width: 991px) 460px, (max-width: 1279px) 32vw, 24vw"
                              alt="modal-img"
                              className="modal_img-item"
                            />

                          </div>
                          <div className="modal_content-block replit-popup-compact__body">
                            <div className="modal-testimonial white">
                              Supreme Coach has been essential in scaling
                              Replit’s creator marketing. What started as a
                              small test quickly 10x’d into a six-figure monthly
                              program because the platform made it easy to
                              discover, activate, and manage the right creators.
                              Supreme Coach has turned creator marketing into one of our most
                              impactful growth engines!
                            </div>
                            <div className="replit-popup-compact__meta">
                              <div className="replit-popup-compact__stat-line">
                                10x initial speed
                              </div>
                              <div className="modal-testimonial white replit-popup-compact__name">
                                Alex Lin
                              </div>
                              <div className="replit-popup-compact__role">
                                GTM, Replit
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_1e4d4ae1-9e4d-a358-39c5-fdcd9d75ea2c-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Nebius</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper blue-gradient nebius-popup-compact"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content nebius-popup-compact">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              alt="modal-img"
                              className="modal_img-item"
                            />
                          </div>
                          <div className="modal_content-block nebius-popup-compact__body">
                            <div className="modal-testimonial nebius-popup-compact__quote">
                              "Supreme Coach has been instrumental in helping
                              us reach engineers, founders, and researchers in
                              the AI space. By leveraging top-tier creators
                              across leading AI newsletters, we were able to
                              precisely target and engage the right audience
                              for Nebius. The platform made it easy to tap
                              into high-quality creators, driving both
                              visibility and impactful engagement in a way
                              that truly accelerated our growth."
                            </div>
                            <div className="nebius-popup-compact__meta">
                              <div className="modal-testimonial nebius-popup-compact__name">
                                Olga Reger
                              </div>
                              <div className="nebius-popup-compact__role">
                                Senior Digital Marketing Manager at Nebius
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_68bbab5f-3562-9108-62de-0ba1f7d3723c-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="a logo of jam"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
                <div
                  id="w-node-a8cbf130-a74b-ca3a-dc57-0f9a6b39db7f-41695672"
                  className="modal-item"
                >
                  <a href="#" className="modal-toggle w-inline-block">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="an image of gamma"
                      className="modal-inside-img"
                    />
                    <div className="modal_inside-overlay" />
                    <div className="modal_inside-text">
                      <h3 className="modal-inside-name">Guidde</h3>
                      <div className="open-icon w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 23 22"
                          fill="none"
                          preserveAspectRatio="xMidYMid meet"
                          aria-hidden="true"
                          role="img"
                        >
                          <rect
                            x="0.5"
                            width={22}
                            height={22}
                            rx={11}
                            fill="url(#paint0_linear_950_42968)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4977 6.09985C11.8843 6.09985 12.1977 6.41325 12.1977 6.79985V10.2999H15.6977C16.0843 10.2999 16.3977 10.6133 16.3977 10.9999C16.3977 11.3865 16.0843 11.6999 15.6977 11.6999H12.1977V15.1999C12.1977 15.5865 11.8843 15.8999 11.4977 15.8999C11.1111 15.8999 10.7977 15.5865 10.7977 15.1999V11.6999H7.29766C6.91106 11.6999 6.59766 11.3865 6.59766 10.9999C6.59766 10.6133 6.91106 10.2999 7.29766 10.2999H10.7977V6.79985C10.7977 6.41325 11.1111 6.09985 11.4977 6.09985Z"
                            fill="url(#paint1_linear_950_42968)"
                            stroke="url(#paint2_linear_950_42968)"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_950_42968"
                              x1="11.5"
                              y1={0}
                              x2="11.5"
                              y2={22}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FBFBF8" />
                              <stop offset={1} stopColor="#F7F5EE" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_950_42968"
                              x1="11.4977"
                              y1="6.09985"
                              x2="11.4977"
                              y2="15.8999"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3B3D3D" />
                              <stop offset={1} stopColor="#191A1A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="popup-wrapper" style={{ display: "none" }}>
                    <div style={{ opacity: 0 }} className="popup-inner">
                      <div
                        className="popup-content-wrapper red-gradient guidde-popup-compact"
                        style={{
                          transform:
                            "translate3d(0px, 3em, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <a href="#" className="popup-close w-inline-block">
                          <img
                            src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/66f64533346201ee79b0cc8b_Frame%20427322065.avif"
                            loading="lazy"
                            width={24}
                            alt="close-icon"
                          />
                        </a>
                        <div className="popup-content guidde-popup-compact">
                          <div className="modal_img-wrap">
                            <img
                              src="/images/trainer-clipboard-gym.jpg"
                              loading="lazy"
                              width={460}
                              sizes="(max-width: 479px) 100vw, (max-width: 991px) 460px, (max-width: 1279px) 32vw, 24vw"
                              alt="modal-img"
                              className="modal_img-item"
                            />
                          </div>
                          <div className="modal_content-block guidde-popup-compact__body">
                            <div className="modal-testimonial guidde-popup-compact__quote">
                              "Before using the platform, we spent countless
                              hours trying to find the right creators for our
                              niche—now, we've cut that time by over 50% while
                              doubling the effectiveness of our campaigns.
                              Supreme Coach's user-friendly interface made it
                              easy for us to book, communicate, and track
                              results seamlessly. Thanks to the platform, we've
                              scaled our outreach and boosted signups in just six
                              months. For marketers looking to maximize ROI, Passionfroot is
                              an absolute game-changer."
                            </div>
                            <div className="guidde-popup-compact__meta">
                              <div className="modal-testimonial guidde-popup-compact__name">
                                Moran Altarac
                              </div>
                              <div className="guidde-popup-compact__role">
                                VP Marketing at guidde.com
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="popup-background" />
                    </div>
                  </div>
                </div>
                <div
                  id="w-node-_5647faad-8071-df80-b254-6da836a95fef-41695672"
                  className="modal-item"
                >
                  <div className="modal-toggle outline">
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      alt="a logo of jam"
                      className="modal-inside-img"
                    />
                    <img
                      src="/images/trainer-clipboard-gym.jpg"
                      loading="lazy"
                      width={286}
                      sizes="(max-width: 479px) 100vw, 286px"
                      alt="testimonial-image-hover"
                      className="modal-inside-hover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModals;
