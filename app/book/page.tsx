import type { Metadata } from 'next';
import { Suspense } from 'react';
import BookingForm from '@/components/BookingForm';
import { businessInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Book an Event & Floral Consultation | Laxman Phool Bhandar',
  description: 'Book your wedding, car decoration, or bespoke bouquet consultation on WhatsApp with Laxman Phool Bhandar. Direct florist chat & transparent pricing.',
};

function BookingContent() {
  return <BookingForm />;
}

export default function BookPage() {
  return (
    <>
      <section className="page-hero-editorial book-hero-accent">
        <div className="page-shell">
          <div className="hero-editorial-center">
            <span className="pill-badge">✨ Seamless WhatsApp Booking</span>
            <h1>
              Let&apos;s Plan Something<br />
              <em>Unforgettable</em>
            </h1>
            <p>
              Fill out your celebration details below. Your inquiry will open immediately in WhatsApp so you can converse 1-on-1 with our head floral artisan.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padded bg-surface">
        <div className="page-shell">
          <div className="booking-split-layout">
            {/* Left Info & Reassurances */}
            <aside className="booking-aside-panel">
              <div className="aside-card-box">
                <span className="pill-badge">✿ The Booking Promise</span>
                <h2>How It Works</h2>
                <div className="booking-steps-list">
                  <div className="step-item">
                    <span className="step-num">01</span>
                    <div>
                      <strong>Select Your Services</strong>
                      <p>Choose from weddings, car decor, bouquets, or custom themes.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-num">02</span>
                    <div>
                      <strong>Instant WhatsApp Chat</strong>
                      <p>Your details pre-fill into WhatsApp with zero duplicate typing.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-num">03</span>
                    <div>
                      <strong>Transparent Quote & Mockup</strong>
                      <p>Discuss flower varieties, delivery slots, and finalize with token.</p>
                    </div>
                  </div>
                </div>

                <div className="aside-contact-block">
                  <h4>Prefer Calling Directly?</h4>
                  <p>Our florists are available 7 days a week from 6:30 AM to 10:30 PM.</p>
                  <a href={`tel:${businessInfo.rawPhone}`} className="aside-phone-btn">
                    📞 Call {businessInfo.phone}
                  </a>
                </div>

                <div className="aside-testimonial-quote">
                  <span className="quote-mark">“</span>
                  <p>
                    Booking on WhatsApp was effortless. We finalized our entire wedding car and mandap decor in under 15 minutes!
                  </p>
                  <small>— Vikramaditya V., Verified Customer</small>
                </div>
              </div>
            </aside>

            {/* Right Booking Form */}
            <div className="booking-main-panel">
              <Suspense
                fallback={
                  <div className="luxury-booking-form form-loading-skeleton">
                    <p>Loading booking atelier…</p>
                  </div>
                }
              >
                <BookingContent />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
