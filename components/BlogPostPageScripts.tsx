'use client'

import { useEffect } from 'react';

declare global {
  interface Window {
    Webflow: any;
  }
}

export default function BlogPostPageScripts() {
  useEffect(() => {
    // Intercom banner issue fix
    const handleBodyMargin = () => {
      const bodyMarginTop = document.body.style.marginTop;
      if (!bodyMarginTop || bodyMarginTop === '0px') {
        document.body.classList.remove('intercom-banner-active');
      } else {
        document.body.classList.add('intercom-banner-active');
      }
    };

    handleBodyMargin();
    const observer = new MutationObserver(handleBodyMargin);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Update #currentYear with the current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear().toString();
    }

    // Table of Contents functionality (Finsweet attributes)
    // This would be handled by the Finsweet TOC script loaded in layout.tsx
    const scrollTargetInsideContainer = (
      container: HTMLElement,
      target: HTMLElement,
      offsetPx: number,
    ) => {
      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const nextTop =
        container.scrollTop + (tRect.top - cRect.top) - offsetPx;
      container.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
    };

    const setTocActiveLink = (activeAnchor: HTMLAnchorElement) => {
      const tocRoot = activeAnchor.closest('[fs-toc-element="list"]');
      if (!tocRoot) return;
      tocRoot.querySelectorAll("a.toc-link").forEach((a) => {
        a.classList.remove("is-active");
      });
      activeAnchor.classList.add("is-active");
    };

    const initTOC = () => {
      const tocContainer = document.querySelector('[fs-toc-element="list"]');
      const contentContainer = document.querySelector('[fs-toc-element="contents"]');
      
      if (tocContainer && contentContainer) {
        tocContainer.innerHTML = "";
        const headings = contentContainer.querySelectorAll('h2, h3');
        
        headings.forEach((heading, index) => {
          // Add ID to heading if not present
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
          
          // Create TOC link
          const tocItem = document.createElement("a");
          tocItem.href = `#${heading.id}`;
          tocItem.textContent = heading.textContent;
          tocItem.className = "toc-link";

          tocContainer.appendChild(tocItem);
        });
      }
    };

    // Run TOC init after a short delay to ensure content is rendered
    setTimeout(initTOC, 100);

    const handleAnchorClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const anchor = el?.closest("a");
      if (!anchor?.hash || anchor.hash === "#") return;

      let target: Element | null = null;
      try {
        target = document.querySelector(anchor.hash);
      } catch {
        return;
      }
      if (!target || !(target instanceof HTMLElement)) return;

      const isTocLink =
        anchor.classList.contains("toc-link") &&
        Boolean(anchor.closest('[fs-toc-element="list"]'));
      if (isTocLink) {
        setTocActiveLink(anchor as HTMLAnchorElement);
      }

      const scrollContainer = document.querySelector(
        "[data-blog-scroll-container]",
      ) as HTMLElement | null;
      const desktopToc =
        window.matchMedia("(min-width: 992px)").matches &&
        scrollContainer &&
        scrollContainer.contains(target);

      if (desktopToc) {
        e.preventDefault();
        scrollTargetInsideContainer(scrollContainer, target, 12);
        return;
      }

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", handleAnchorClick);

    // Social share functionality
    const initSocialShare = () => {
      const shareButtons = document.querySelectorAll('[data-social-share]');
      shareButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const platform = (button as HTMLElement).dataset.socialShare;
          const url = encodeURIComponent(window.location.href);
          const title = encodeURIComponent(document.title);
          
          let shareUrl = '';
          switch (platform) {
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
              break;
            case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
              break;
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
          }
          
          if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
          }
        });
      });
    };

    initSocialShare();

    // Cleanup
    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null; // This component doesn't render anything itself
}

