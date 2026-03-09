import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type TouchEvent } from "react";
import "./App.css";

type PricingTier = {
  memberRange: string;
  maxMembers: number;
  monthlyGbp: number;
};

const GBP_TO_USD = 1.28;
const pricingTiers: PricingTier[] = [
  { memberRange: "1-25", maxMembers: 25, monthlyGbp: 14.99 },
  { memberRange: "25-50", maxMembers: 50, monthlyGbp: 24.99 },
  { memberRange: "50-100", maxMembers: 100, monthlyGbp: 39.99 },
  { memberRange: "100-150", maxMembers: 150, monthlyGbp: 59.99 },
  { memberRange: "150-200", maxMembers: 200, monthlyGbp: 79.99 },
];

const featureGroups = [
  {
    title: "Community",
    points: [
      "Events calendar with attendance tracking",
      "Life events feed with reactions, views, and comments",
      "Announcements with acknowledgement tracking",
      "Role-based notifications and real-time updates",
    ],
  },
  {
    title: "Ministry",
    points: [
      "Sermon publishing with record, upload, and playback",
      "Live Prayer Line conference calls",
      "Prayer requests with categories",
      "Service requests for transportation and accommodation",
    ],
  },
  {
    title: "Operations",
    points: [
      "Church admin, pastor, trustee, and believer roles",
      "Signup approvals for church and believer onboarding",
      "User management with activation controls",
      "Donations and recurring giving with clear tracking",
    ],
  },
];

const launchHighlights = [
  "30-day free trial",
  "Believers get real-time push notifications",
  "24/7 support",
  "Built for churches of every size",
  "Fast setup for churches of every size",
  "Gift Aid-ready giving support",
];

const platformPreview = [
  {
    title: "Shepherd Board",
    subtitle: "Daily ministry pulse",
    points: ["Upcoming events at a glance", "Prayer-ready dashboard", "Weather-aware planning"],
  },
  {
    title: "Events Explorer",
    subtitle: "Search, filter, and manage",
    points: ["List + calendar modes", "Attendance tracking", "Recurring event control"],
  },
  {
    title: "Announcements Board",
    subtitle: "Clear communication to everyone",
    points: ["Post updates in seconds", "Read tracking", "Admin edit controls"],
  },
  {
    title: "Sermons + Prayer Line",
    subtitle: "Live spiritual engagement",
    points: ["Audio upload and recording", "Start/join prayer line", "Real-time member participation"],
  },
  {
    title: "Giving Experience",
    subtitle: "Designed for generosity",
    points: ["One-time, weekly, monthly", "Gift Aid-ready flow", "Receipts sent to users automatically"],
  },
  {
    title: "Payments View",
    subtitle: "Operational clarity for leaders",
    points: ["Church transaction history", "Net vs fee visibility", "Reliable giving records"],
  },
];

const screenshotSlides = [
  {
    title: "Home Dashboard",
    subtitle: "Daily overview for pastors and admins",
    module: "Home",
    accent: "sunset",
  },
  {
    title: "Events Explorer",
    subtitle: "Manage calendar, filters, and attendance",
    module: "Events",
    accent: "violet",
  },
  {
    title: "Announcements Board",
    subtitle: "Broadcast updates and track reads",
    module: "Announcements",
    accent: "plum",
  },
  {
    title: "Sermons + Prayer Line",
    subtitle: "Live prayer calls and sermon publishing",
    module: "Sermons",
    accent: "ember",
  },
  {
    title: "Giving Flow",
    subtitle: "Simple, recurring, and Gift Aid-ready giving",
    module: "Give",
    accent: "gold",
  },
  {
    title: "Payments Reporting",
    subtitle: "Net received, donor history, and payment status",
    module: "Payments",
    accent: "navy",
  },
];

const faqItems = [
  {
    question: "How long does initial setup take?",
    answer: "Most churches can be set up within a few days, including roles, events, announcements, and giving configuration.",
  },
  {
    question: "Can different roles have different permissions?",
    answer: "Yes. Church Circle supports role-based access so pastors, admins, trustees, and members see the right controls.",
  },
  {
    question: "How do prayer line calls work for members?",
    answer: "Leaders can start a prayer line and members can join live from the app with real-time participation updates.",
  },
  {
    question: "Can we manage recurring and one-time giving in one place?",
    answer: "Yes. The giving flow supports both one-time and recurring giving in one unified church giving experience.",
  },
  {
    question: "How do notifications reach members?",
    answer:
      "Members receive both in-app and push notifications, and key updates are delivered through Church Circle communication tools.",
  },
  {
    question: "Do you provide onboarding help for church admins?",
    answer: "Yes. We provide guided onboarding support to help church admins launch smoothly and train their teams.",
  },
  {
    question: "Can we request custom features for our ministry needs?",
    answer: "Yes. We regularly review client requests and prioritize feature delivery based on church impact.",
  },
];

const flexibilityPoints = [
  "Cool new features are added regularly based on real church feedback.",
  "Clients can request custom features for their church workflow.",
  "Church admins can turn off features that are not needed for their church.",
];

const formatCurrency = (value: number, currency: "GBP" | "USD"): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const usdValue = (gbpValue: number): number => gbpValue * GBP_TO_USD;
const contactFormEndpoint = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? "").trim();

export default function App() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    churchName: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: -120, y: -120 });

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScrollable <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / maxScrollable) * 100));
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveSlideIndex((previous) => (previous + 1) % screenshotSlides.length);
    }, 5200);
    return () => clearInterval(timerId);
  }, []);

  const activeSlide = useMemo(() => screenshotSlides[activeSlideIndex], [activeSlideIndex]);

  const goToSlide = (nextIndex: number) => {
    if (nextIndex < 0) {
      setActiveSlideIndex(screenshotSlides.length - 1);
      return;
    }
    if (nextIndex >= screenshotSlides.length) {
      setActiveSlideIndex(0);
      return;
    }
    setActiveSlideIndex(nextIndex);
  };

  const onCarouselTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setDragStartX(event.touches[0]?.clientX ?? null);
  };

  const onCarouselTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (dragStartX == null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? dragStartX;
    const delta = endX - dragStartX;
    if (Math.abs(delta) > 40) {
      goToSlide(delta > 0 ? activeSlideIndex - 1 : activeSlideIndex + 1);
    }
    setDragStartX(null);
  };

  const onContactFieldChange =
    (key: "fullName" | "email" | "churchName" | "message") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContactForm((previous) => ({ ...previous, [key]: event.target.value }));
    };

  const copyInfoEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText("info@church-circle.com");
      setContactStatus("Copied: info@church-circle.com");
    } catch {
      setContactStatus("Please email info@church-circle.com");
    }
  };

  const onContactSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const fullName = contactForm.fullName.trim();
    const email = contactForm.email.trim();
    const churchName = contactForm.churchName.trim();
    const message = contactForm.message.trim();

    if (!fullName || !email || !message) {
      setContactStatus("Please fill your name, email, and message.");
      return;
    }

    if (!contactFormEndpoint) {
      setContactStatus("Contact form not configured yet. Please email info@church-circle.com directly.");
      return;
    }

    setIsSubmittingContact(true);
    try {
      const response = await fetch(contactFormEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          churchName,
          message,
          _subject: `Church Circle enquiry from ${fullName}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact submission failed");
      }

      setContactForm({
        fullName: "",
        email: "",
        churchName: "",
        message: "",
      });
      setContactStatus("Message sent. We will get back to you soon.");
    } catch {
      setContactStatus("Unable to send right now. Please email info@church-circle.com directly.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div
        className="cursor-glow"
        style={{ transform: `translate(${cursorPosition.x - 90}px, ${cursorPosition.y - 90}px)` }}
        aria-hidden="true"
      />
      <header className="hero">
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />
        <nav className="top-nav">
          <div className="brand-mark">
            <img className="brand-logo" src="/church-circle-logo.png" alt="Church Circle logo" />
            <span>Church Circle</span>
          </div>
          <div className="nav-actions">
            <a href="#pricing">Pricing</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="reveal">
            <p className="eyebrow">Church Management Platform</p>
            <h1>Run your church community from one trusted platform.</h1>
            <p className="hero-copy">
              Church Circle brings events, sermons, prayer, giving, announcements, and member engagement together in one
              production-ready app for modern ministries.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                Book a Demo
              </a>
              <a className="btn btn-ghost" href="#pricing">
                View Pricing
              </a>
            </div>
          </div>

          <div className="highlight-panel reveal">
            {launchHighlights.map((item, index) => (
              <div key={item} className="highlight-pill" style={{ animationDelay: `${index * 80}ms` }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section id="features" className="section section-features">
          <div className="section-head reveal">
            <p className="eyebrow">What You Get</p>
            <h2>Built for pastors, admins, and every member in your church.</h2>
          </div>
          <div className="feature-grid">
            {featureGroups.map((group, groupIndex) => (
              <article key={group.title} className="feature-card reveal" style={{ transitionDelay: `${groupIndex * 90}ms` }}>
                <h3>{group.title}</h3>
                <ul>
                  {group.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-preview">
          <div className="section-head reveal">
            <p className="eyebrow">Platform Preview</p>
            <h2>See how Church Circle runs daily church life, end to end.</h2>
          </div>
          <div
            className="carousel reveal"
            onTouchStart={onCarouselTouchStart}
            onTouchEnd={onCarouselTouchEnd}
            role="region"
            aria-label="Church Circle app screenshots"
          >
            <button className="carousel-nav carousel-prev" onClick={() => goToSlide(activeSlideIndex - 1)} aria-label="Previous screenshot">
              ←
            </button>
            <article className={`carousel-slide accent-${activeSlide.accent}`}>
              <div className="preview-phone-shell">
                <div className="preview-phone-notch" />
                <div className="preview-phone-content">
                  <p className="preview-subtitle">{activeSlide.subtitle}</p>
                  <h3>{activeSlide.title}</h3>
                  <p className="preview-module-tag">{activeSlide.module}</p>
                </div>
              </div>
              <div className="carousel-copy">
                <h3>{platformPreview[activeSlideIndex]?.title ?? activeSlide.title}</h3>
                <ul>
                  {(platformPreview[activeSlideIndex]?.points ?? []).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
            <button className="carousel-nav carousel-next" onClick={() => goToSlide(activeSlideIndex + 1)} aria-label="Next screenshot">
              →
            </button>
          </div>
          <div className="carousel-dots reveal" aria-hidden="true">
            {screenshotSlides.map((item, index) => (
              <button
                key={item.title}
                className={`carousel-dot ${index === activeSlideIndex ? "is-active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>
        </section>

        <section className="section section-faq" id="faq">
          <div className="section-head reveal">
            <p className="eyebrow">FAQ</p>
            <h2>Answers churches ask before onboarding.</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <article key={item.question} className={`faq-item reveal ${isOpen ? "is-open" : ""}`}>
                  <button className="faq-trigger" type="button" onClick={() => setActiveFaqIndex(index)} aria-expanded={isOpen}>
                    <span>{item.question}</span>
                    <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div className="faq-answer" aria-hidden={!isOpen}>
                    <p>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section section-flexibility">
          <div className="section-head reveal">
            <p className="eyebrow">Product Flexibility</p>
            <h2>Built to adapt to each church, not force one rigid setup.</h2>
          </div>
          <div className="flexibility-card reveal">
            <ul>
              {flexibilityPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className="section section-pricing">
          <div className="section-head reveal">
            <p className="eyebrow">Pricing</p>
            <h2>Simple monthly pricing based on member count.</h2>
          </div>

          <div className="pricing-board reveal" role="table" aria-label="Pricing tiers">
            {pricingTiers.map((tier) => (
              <div key={tier.memberRange} className="pricing-row" role="row">
                <div className="pricing-range" role="cell">
                  {tier.memberRange} members
                </div>
                <div className="pricing-amount" role="cell">
                  <strong>{formatCurrency(tier.monthlyGbp, "GBP")}/month per church</strong>
                  <span>{formatCurrency(usdValue(tier.monthlyGbp), "USD")}/month per church</span>
                </div>
              </div>
            ))}
          </div>

          <p className="pricing-footnote reveal">
            Revenue-focused pricing built to help churches grow giving and claim Gift Aid with confidence.
          </p>
        </section>

        <section className="section section-trust">
          <div className="section-head reveal">
            <p className="eyebrow">Trust</p>
            <h2>Designed for live ministry operations.</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-card reveal">
              <h3>Live-ready communication</h3>
              <p>Prayer line conference calls, push notifications, and real-time member updates.</p>
            </div>
            <div className="trust-card reveal" style={{ transitionDelay: "80ms" }}>
              <h3>Revenue growth and Gift Aid</h3>
              <p>Increase church giving with one-time and recurring donations, plus stronger Gift Aid claim support.</p>
            </div>
            <div className="trust-card reveal" style={{ transitionDelay: "160ms" }}>
              <h3>Church leadership controls</h3>
              <p>Role-based access, approvals, and user administration across churches.</p>
            </div>
          </div>
        </section>

        <section className="section section-stores reveal">
          <div className="section-head">
            <p className="eyebrow">Mobile Apps</p>
            <h2>Available in App Store and Google Play</h2>
          </div>
          <div className="store-badges" aria-label="Store availability badges">
            <div className="store-badge store-badge-apple" role="img" aria-label="Available on the App Store">
              <span className="store-badge-small">Available on the</span>
              <span className="store-badge-big">App Store</span>
            </div>
            <div className="store-badge store-badge-google" role="img" aria-label="Get it on Google Play">
              <span className="store-badge-small">Get it on</span>
              <span className="store-badge-big">Google Play</span>
            </div>
          </div>
          <p className="store-note">Store links will be enabled once app listings are live.</p>
        </section>

        <section id="contact" className="section section-contact reveal">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Ready to launch Church Circle in your ministry?</h2>
            <p>Email us and we will help you onboard your church, configure billing, and go live fast.</p>
          </div>
          <form className="contact-form" onSubmit={(event) => void onContactSubmit(event)}>
            <input
              className="contact-input"
              value={contactForm.fullName}
              onChange={onContactFieldChange("fullName")}
              placeholder="Your full name"
            />
            <input
              className="contact-input"
              type="email"
              value={contactForm.email}
              onChange={onContactFieldChange("email")}
              placeholder="Your email"
            />
            <input
              className="contact-input"
              value={contactForm.churchName}
              onChange={onContactFieldChange("churchName")}
              placeholder="Church name (optional)"
            />
            <textarea
              className="contact-textarea"
              value={contactForm.message}
              onChange={onContactFieldChange("message")}
              placeholder="How can we help your church?"
              rows={4}
            />
            <div className="contact-actions">
              <button className="btn btn-primary" type="submit" disabled={isSubmittingContact}>
                {isSubmittingContact ? "Sending..." : "Send Message"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => void copyInfoEmail()}>
                Copy info@church-circle.com
              </button>
            </div>
            {contactStatus ? <p className="contact-status">{contactStatus}</p> : null}
            {!contactFormEndpoint ? (
              <p className="contact-status">Set `VITE_CONTACT_FORM_ENDPOINT` to your Formspree/Web3Forms endpoint.</p>
            ) : null}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Church Circle. All rights reserved.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>

      <div className="mobile-sticky-bar" role="navigation" aria-label="Quick actions">
        <a className="sticky-btn sticky-primary" href="#contact">
          Book Demo
        </a>
        <a className="sticky-btn" href="#contact">
          Contact
        </a>
        <a className="sticky-btn" href="#pricing">
          Pricing
        </a>
      </div>
    </div>
  );
}
