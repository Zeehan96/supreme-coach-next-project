import React, { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  col?: number;
};

const faqItems: FaqItem[] = [
  {
    id: "faq-4",
    question: "Is Supreme Coach free for creators?",
    answer:
      "Yes, it’s free to sign up with no upfront costs. We add a 2% fee per transaction (brand covers it) and 15% when we match you with a brand.",
    col: 0,
  },
  {
    id: "faq-5",
    question: "How do I get started?",
    answer:
      "Sign up to our waitlist, set up your profile with offerings and audience insights, and you’re start receiving collaboration requests from brands.",
    col: 0,
  },
  {
    id: "faq-6",
    question: "How does Supreme Coach help me find brand partnerships?",
    answer:
      "We match you with B2B brands by audience and niche. You manage booking and payments on the platform; Live Campaigns lets you discover and apply to active campaigns.",
    col: 0,
  },
  {
    id: "faq-7",
    question: "Can I set my own rates?",
    answer:
      "Yes. You set your pricing and services (shoutouts, sponsored posts, newsletter, etc.).",
    col: 0,
  },
  {
    id: "faq-10",
    question: "What type of brands will I work with?",
    answer:
      "B2B brands across tech, SaaS, AI, finance and more that fit your niche and audience.",
    col: 1,
  },
  {
    id: "faq-11",
    question: "How do I get more visibility with brands?",
    answer:
      "Keep your profile updated with audience stats, content examples and pricing. Share your link on your channels for more leads.",
    col: 1,
  },
  {
    id: "faq-12",
    question: "How do I communicate with brands?",
    answer:
      "Use the in-platform messaging to talk to brands, discuss campaigns and share feedback.",
    col: 1,
  },
];

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AccordionItem: React.FC<{
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
  return (
    <div
      data-delay={0}
      data-hover="false"
      className="faq-p faq-card"
      style={{
        height: isOpen ? "auto" : undefined,
        transition: "height 0.3s ease-in-out",
      }}
    >
      <button
        type="button"
        className="faq-card-toggle"
        aria-controls={`${item.id}-body`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="faq-card-toggle__text">{item.question}</span>
        <span className="faq-card-toggle__icon">{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
      </button>

      <div
        id={`${item.id}-body`}
        className="faq-card-answer"
        role="region"
        aria-hidden={!isOpen}
        style={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
          minHeight: isOpen ? undefined : 0,
          transition: "opacity 0.2s ease-in-out, height 0.2s ease-in-out",
        }}
      >
        <div className="faq-card-answer-inner">{item.answer}</div>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const leftItems = faqItems.filter((i) => (i.col ?? 0) === 0);
  const rightItems = faqItems.filter((i) => (i.col ?? 0) === 1);

  return (
    <div className="section_faqs">
      <div className="padding-section-xmedium faq-creator">
        <div className="padding-global">
          <div className="container-xlarge">
            <div className="faqs_component">
              <div className="faqs_top-wrapper">
                <h2 className="heading-style-h3-v2">Frequently Asked Questions</h2>
                <p className="faqs_subtitle">
                  From pricing to partnerships—quick answers about how Supreme Coach works for creators and brands.
                </p>
              </div>

              <div className="faq_grid flex-inners">
                <div className="faq_grid-side">
                  {leftItems.map((it) => (
                    <AccordionItem key={it.id} item={it} isOpen={!!openMap[it.id]} onToggle={() => toggle(it.id)} />
                  ))}
                </div>

                <div className="faq_grid-side">
                  {rightItems.map((it) => (
                    <AccordionItem key={it.id} item={it} isOpen={!!openMap[it.id]} onToggle={() => toggle(it.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
