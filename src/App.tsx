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
      "Stripe-powered donations and recurring giving",
    ],
  },
];

const launchHighlights = [
  "30-day free trial",
  "Launch date: April 1",
  "Fast setup for churches of every size",
  "Per-member pricing stays in pence",
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

const pencePerMember = (tier: PricingTier): number => {
  return Math.round((tier.monthlyGbp / tier.maxMembers) * 100);
};

export default function App() {
  return (
    <div className="site-shell">
      <header className="hero">
        <nav className="top-nav">
          <div className="brand-mark">Church Circle</div>
          <div className="nav-actions">
            <a href="#pricing">Pricing</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
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
            <p className="rate-note">USD shown as estimate at 1 GBP = 1.28 USD.</p>
          </div>

          <div className="highlight-panel">
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
          <div className="section-head">
            <p className="eyebrow">What You Get</p>
            <h2>Built for pastors, admins, and every member in your church.</h2>
          </div>
          <div className="feature-grid">
            {featureGroups.map((group, groupIndex) => (
              <article key={group.title} className="feature-card" style={{ animationDelay: `${groupIndex * 90}ms` }}>
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

        <section id="pricing" className="section section-pricing">
          <div className="section-head">
            <p className="eyebrow">Pricing</p>
            <h2>Simple monthly pricing based on member count.</h2>
          </div>

          <div className="pricing-board" role="table" aria-label="Pricing tiers">
            {pricingTiers.map((tier) => (
              <div key={tier.memberRange} className="pricing-row" role="row">
                <div className="pricing-range" role="cell">
                  {tier.memberRange} members
                </div>
                <div className="pricing-amount" role="cell">
                  <strong>{formatCurrency(tier.monthlyGbp, "GBP")}/month</strong>
                  <span>{formatCurrency(usdValue(tier.monthlyGbp), "USD")}/month</span>
                </div>
                <div className="pricing-per-member" role="cell">
                  ~{pencePerMember(tier)}p/member
                </div>
              </div>
            ))}
          </div>

          <p className="pricing-footnote">Per-member cost is only pence across every tier.</p>
        </section>

        <section className="section section-trust">
          <div className="section-head">
            <p className="eyebrow">Trust</p>
            <h2>Designed for live ministry operations.</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <h3>Live-ready communication</h3>
              <p>Prayer line conference calls, push notifications, and real-time member updates.</p>
            </div>
            <div className="trust-card">
              <h3>Financial visibility</h3>
              <p>One-time and recurring giving, donation history, and receipt support in-app.</p>
            </div>
            <div className="trust-card">
              <h3>Church leadership controls</h3>
              <p>Role-based access, approvals, and user administration across churches.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-contact">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Ready to launch Church Circle in your ministry?</h2>
            <p>Email us and we will help you onboard your church, configure billing, and go live fast.</p>
          </div>
          <div className="contact-actions">
            <a className="btn btn-primary" href="mailto:support@church-circle.com?subject=Church%20Circle%20Demo%20Request">
              support@church-circle.com
            </a>
            <a className="btn btn-ghost" href="mailto:sales@church-circle.com?subject=Church%20Circle%20Pricing%20Question">
              Contact Sales
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Church Circle. All rights reserved.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  );
}
