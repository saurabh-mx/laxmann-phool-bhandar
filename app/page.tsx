import Link from 'next/link';
import { getStoreDataAsync } from '@/lib/store';
import CostCalculator from '@/components/CostCalculator';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const store = await getStoreDataAsync();
  const services = store.services;
  const pricing = store.pricing;
  const gallery = store.gallery;
  const businessInfo = store.businessInfo;

  return (
    <>
      {/* Editorial Luxury Hero */}
      <section className="luxury-hero">
        <div className="hero-atmosphere-glow" aria-hidden="true" />
        <div className="page-shell">
          <div className="hero-split-grid">
            {/* Left Content */}
            <div className="hero-editorial-copy">
              <div className="hero-top-strip">
                <div className="hero-trust-tag">
                  <span className="gold-star">★</span>
                  <span>Rated 4.9/5 by 380+ Families in Patna & Beyond</span>
                </div>
                <Link href="/admin/login" className="hero-studio-login-pill" title="Studio Admin Login">
                  <span>🔒 Studio Login</span>
                </Link>
              </div>

              <h1 className="hero-main-title">
                Crafting Moments<br />
                Into <em>Living Bloom.</em>
              </h1>

              <p className="hero-narrative">
                Bespoke wedding mandaps, regal car decorations, and morning-picked artisanal bouquets. We bring life, fragrance, and unforgettable grandeur to your most cherished celebrations.
              </p>

              <div className="hero-badges-row">
                <div className="hero-badge-item">
                  <span className="badge-icon">🌿</span>
                  <span>100% Farm-Fresh Daily</span>
                </div>
                <div className="hero-badge-item">
                  <span className="badge-icon">✨</span>
                  <span>Pinterest Concept Matching</span>
                </div>
                <div className="hero-badge-item">
                  <span className="badge-icon">🚗</span>
                  <span>Doorstep Car Setup</span>
                </div>
              </div>

              <div className="hero-cta-group">
                <Link href="/book" className="button button-emerald button-large">
                  <span>Plan Your Celebration</span>
                  <span className="btn-arrow" aria-hidden="true">↗</span>
                </Link>
                <a
                  href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I am looking for flower decoration for an upcoming event.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-outline button-large"
                >
                  <span className="btn-wa-icon">💬</span>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Stats Strip */}
              <div className="hero-metrics-strip">
                <div className="metric-box">
                  <strong>50+</strong>
                  <span>Years of Mastery</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-box">
                  <strong>2,500+</strong>
                  <span>Events Styled</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-box">
                  <strong>40 min</strong>
                  <span>Fast Car Décor</span>
                </div>
              </div>
            </div>

            {/* Right Visual Stack */}
            <div className="hero-visual-composition">
              <div className="hero-main-image-frame">
                <img
                  src="/images/services/wedding-stage.jpg"
                  alt="Luxurious wedding floral mandap styled with fresh roses and orchids"
                  className="hero-primary-photo"
                />
                <div className="hero-floating-card top-float">
                  <span className="flower-emblem">✿</span>
                  <div>
                    <strong>Signature Mandap Styling</strong>
                    <small>Dutch roses, exotic lilies & warm ambient lights</small>
                  </div>
                </div>
                <div className="hero-floating-card bottom-float">
                  <span className="dot-online" />
                  <div>
                    <strong>Florist Online Now</strong>
                    <small>Instant quotes & date availability</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Cost Estimator Banner */}
      <section className="section-padded bg-canvas">
        <div className="page-shell">
          <CostCalculator initialPricing={pricing} />
        </div>
      </section>

      {/* Signature Services Section */}
      <section className="section-padded bg-surface">
        <div className="page-shell">
          <div className="section-header-centered">
            <span className="pill-badge">✿ Artisanal Offerings</span>
            <h2 className="section-title">
              Floral Couture Designed for <em>Every Milestone</em>
            </h2>
            <p className="section-subtitle">
              From intimate morning anniversary bouquets to royal banquet mandaps, every stem is curated with precision and passion.
            </p>
          </div>

          <div className="services-showcase-grid">
            {services.map((service, index) => (
              <div key={service.id} className="service-feature-card">
                <div className="service-card-media">
                  <img src={service.image} alt={service.title} />
                  <span className="service-number">0{index + 1}</span>
                  <span className="service-category-pill">{service.tag}</span>
                </div>
                <div className="service-card-content">
                  <div className="service-card-heading">
                    <h3>{service.title}</h3>
                    <span className="service-price-tag">{service.price}</span>
                  </div>
                  <p className="service-card-desc">{service.description}</p>
                  <ul className="service-features-list">
                    {service.features.map((feat, i) => (
                      <li key={i}>
                        <span className="feat-check">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="service-card-action">
                    <Link
                      href={`/book?service=${service.id}`}
                      className="button button-emerald button-full"
                    >
                      <span>Book Consultation for this Service ↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="services-footer-banner">
            <div>
              <h3>Have a Saved Pinterest or Instagram Reference?</h3>
              <p>Send your screenshot directly on WhatsApp. We match the exact florals and scale it to your budget.</p>
            </div>
            <a
              href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I have a photo from Instagram/Pinterest that I would like to recreate for my event.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-gold"
            >
              Share Your Photo on WhatsApp ↗
            </a>
          </div>
        </div>
      </section>

      {/* The Botanical Difference (4 Pillars) */}
      <section className="section-padded bg-canvas">
        <div className="page-shell">
          <div className="section-header-centered">
            <span className="pill-badge">✨ The Laxman Phool Standard</span>
            <h2 className="section-title">
              Why Patna’s Most Memorable Events <em>Choose Us</em>
            </h2>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-num">01</span>
              <h3>Farm-Fresh Morning Harvest</h3>
              <p>We source long-stem roses, Dutch carnations, and Bangalore orchids directly every morning to ensure radiant fragrance and 48-hour freshness.</p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">02</span>
              <h3>Non-Abrasive Car Décor</h3>
              <p>Gentle, vehicle-safe mounting pads and wind-resistant framing protect your car&apos;s paint finish during high-speed highway transit.</p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">03</span>
              <h3>Pinterest Conception Team</h3>
              <p>Share your vision board with our creative artisans. We provide 3D layout advice and customized mockups before event day.</p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">04</span>
              <h3>No Hidden Costs & On-Time Arrival</h3>
              <p>Transparent itemized quotations with zero last-minute surprises. Our on-site styling crew finishes setup 2 hours before guests arrive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Preview */}
      <section className="section-padded bg-surface">
        <div className="page-shell">
          <div className="section-header-centered">
            <span className="pill-badge">📷 Real Celebrations</span>
            <h2 className="section-title">
              Moments We Have <em>Brought to Bloom</em>
            </h2>
            <p className="section-subtitle">
              Explore our real wedding mandaps, doorstep luxury car styling, and bespoke gift arrangements.
            </p>
          </div>

          <GallerySection limit={6} showFilters={false} initialItems={gallery} />

          <div className="gallery-bottom-cta">
            <Link href="/gallery" className="button button-outline button-large">
              <span>View Full Inspiration Journal (9+ Styles) ↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="section-padded bg-canvas">
        <div className="page-shell">
          <div className="section-header-centered">
            <span className="pill-badge">💬 Client Love</span>
            <h2 className="section-title">
              Trusted by Over <em>2,500+ Happy Families</em>
            </h2>
          </div>
          <TestimonialsSection />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section-padded bg-surface">
        <div className="page-shell">
          <div className="section-header-centered">
            <span className="pill-badge">❓ Common Questions</span>
            <h2 className="section-title">
              Everything You Need to Know <em>Before Booking</em>
            </h2>
          </div>
          <div className="faq-container-narrow">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* Bottom Grand Call-to-Action */}
      <section className="grand-cta-section">
        <div className="cta-background-pattern" aria-hidden="true">✿</div>
        <div className="page-shell">
          <div className="cta-inner-card">
            <span className="pill-badge-light">🌸 Let&apos;s Create Magic Together</span>
            <h2>
              Your Dream Celebration Deserves<br />
              <em>Flawless Florals.</em>
            </h2>
            <p>
              Connect with our master florists today. Tell us your date, venue, and theme, and let us design an unforgettable floral setup.
            </p>
            <div className="cta-buttons-wrap">
              <Link href="/book" className="button button-light button-large">
                <span>Start Event Planning ↗</span>
              </Link>
              <a
                href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I would like to discuss wedding and event floral styling.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-outline-light button-large"
              >
                <span className="btn-wa-icon">💬</span>
                <span>Direct WhatsApp Chat</span>
              </a>
            </div>
            <div className="cta-reassurances">
              <span>✓ Instant Response on WhatsApp</span>
              <span>•</span>
              <span>✓ Free Design Consultation</span>
              <span>•</span>
              <span>✓ Doorstep Service Available</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
