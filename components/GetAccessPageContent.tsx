"use client";

import { useState } from "react";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

export default function GetAccessPageContent() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <main className="ga-page">
        {/* ── Hero heading ── */}
        <section className="ga-hero">
          <h1 className="ga-hero-title">
            See Supreme Coach <span className="ga-accent">in action</span>
          </h1>
          <p className="ga-hero-sub">
            Watch how coaches and firms use Supreme Coach to manage clients,
            track progress, and grow — then request your personalised demo.
          </p>
        </section>

        {/* ── Main content: video + form ── */}
        <section className="ga-content">
          {/* Video column */}
          <div className="ga-video-col">
            <div className="ga-video-label">
              <Play className="ga-play-icon" size={14} />
              Demo Video
            </div>
            <div className="ga-video-wrapper">
              <iframe
                className="ga-iframe"
                src="https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&modestbranding=1"
                title="Supreme Coach Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <ul className="ga-features">
              {[
                "Client & session management",
                "Progress tracking & analytics",
                "Automated billing & invoicing",
                "Team collaboration tools",
              ].map((f) => (
                <li key={f} className="ga-feature-item">
                  <CheckCircle size={16} className="ga-check" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Form column */}
          <div className="ga-form-col">
            {submitted ? (
              <div className="ga-success">
                <div className="ga-success-icon">🎉</div>
                <h2 className="ga-success-title">You&apos;re on the list!</h2>
                <p className="ga-success-sub">
                  Our team will reach out within 1 business day to schedule your
                  personalised demo.
                </p>
              </div>
            ) : (
              <>
                <h2 className="ga-form-title">Request your demo</h2>
                <p className="ga-form-sub">
                  Fill in your details and we&apos;ll get back to you within 24 hours.
                </p>
                <form className="ga-form" onSubmit={handleSubmit}>
                  <div className="ga-field">
                    <label className="ga-label" htmlFor="ga-name">
                      Full name
                    </label>
                    <input
                      id="ga-name"
                      className="ga-input"
                      type="text"
                      placeholder="Jane Smith"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="ga-field">
                    <label className="ga-label" htmlFor="ga-email">
                      Work email
                    </label>
                    <input
                      id="ga-email"
                      className="ga-input"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="ga-field">
                    <label className="ga-label" htmlFor="ga-company">
                      Company / Organisation
                    </label>
                    <input
                      id="ga-company"
                      className="ga-input"
                      type="text"
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="ga-submit">
                    Request a demo
                    <ArrowRight size={16} />
                  </button>
                </form>
                <p className="ga-privacy">
                  No spam. We respect your privacy.
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
  .ga-page {
    min-height: 80vh;
    background: linear-gradient(180deg, rgba(255,164,102,0.08) 0%, #fff 40%);
    padding-bottom: 6rem;
  }

  /* Hero */
  .ga-hero {
    text-align: center;
    padding: 5rem 1.5rem 3rem;
    max-width: 720px;
    margin: 0 auto;
  }
  .ga-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,164,102,0.15);
    color: #c85a00;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 1.25rem;
  }
  .ga-hero-title {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 800;
    color: #191a1a;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .ga-accent {
    color: #191a1a;
    -webkit-text-fill-color: #191a1a;
  }
  .ga-hero-sub {
    font-size: 1.1rem;
    color: #5d5d5b;
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto;
  }

  /* Content grid */
  .ga-content {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 2.5rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    align-items: start;
  }

  /* Video column */
  .ga-video-col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .ga-video-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #5d5d5b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ga-play-icon {
    color: #ff6b35;
  }
  .ga-video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(25,26,26,0.12);
    background: #191a1a;
  }
  .ga-iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  .ga-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .ga-feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.92rem;
    color: #3b3d3d;
    font-weight: 500;
  }
  .ga-check {
    color: #22c55e;
    flex-shrink: 0;
  }

  /* Form column */
  .ga-form-col {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 32px rgba(25,26,26,0.08);
    border: 1px solid rgba(25,26,26,0.06);
    position: sticky;
    top: 100px;
  }
  .ga-form-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #191a1a;
    margin-bottom: 0.5rem;
  }
  .ga-form-sub {
    font-size: 0.92rem;
    color: #5d5d5b;
    margin-bottom: 1.75rem;
    line-height: 1.6;
  }
  .ga-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }
  .ga-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .ga-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #3b3d3d;
  }
  .ga-input {
    padding: 0.75rem 1rem;
    border: 1.5px solid #e5e5e3;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #191a1a;
    background: #fafafa;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .ga-input:focus {
    border-color: #191a1a;
    box-shadow: 0 0 0 3px rgba(25,26,26,0.12);
    background: #fff;
  }
  .ga-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 0.5rem;
    padding: 0.9rem 1.5rem;
    background: #191a1a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .ga-submit:hover {
    background: #3b3d3d;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(25,26,26,0.18);
  }
  .ga-privacy {
    text-align: center;
    font-size: 0.78rem;
    color: #9d9d9b;
    margin-top: 0.75rem;
  }

  /* Success state */
  .ga-success {
    text-align: center;
    padding: 2rem 0;
  }
  .ga-success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .ga-success-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #191a1a;
    margin-bottom: 0.75rem;
  }
  .ga-success-sub {
    font-size: 0.95rem;
    color: #5d5d5b;
    line-height: 1.7;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .ga-content {
      grid-template-columns: 1fr;
    }
    .ga-form-col {
      position: static;
    }
  }
  @media (max-width: 540px) {
    .ga-features {
      grid-template-columns: 1fr;
    }
    .ga-hero {
      padding: 3.5rem 1rem 2rem;
    }
  }
`;
