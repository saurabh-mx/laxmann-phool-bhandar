import type { Metadata } from 'next';
import Link from 'next/link';
import { getStoreDataAsync } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Floral Services & Pricing Packages | Laxman Phool Bhandar',
  description: 'Explore our luxury floral packages: wedding mandaps, doorstep car decoration, artisanal hand-tied bouquets, haldi jhoola setups, and custom Pinterest designs in Patna.',
};

export default async function ServicesPage() {
  const { services, businessInfo } = await getStoreDataAsync();

  return (
    <>
      <section className="page-hero-editorial">
        <div className="page-shell">
          <div className="hero-editorial-center">
            <span className="pill-badge">✿ Complete Floral Offerings</span>
            <h1>
              Floral Couture & Event Styling<br />
              <em>Crafted for Every Occasion</em>
            </h1>
            <p>
              From royal Mandaps and festive Haldi canopies to same-day doorstep car decoration and luxury hand-tied bouquets. Transparent pricing, morning-fresh blooms, and tailored artistry.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padded bg-surface">
        <div className="page-shell">
          <div className="services-full-list">
            {services.map((service, index) => (
              <article key={service.id} className="service-editorial-row" id={service.id}>
                <div className="service-row-media">
                  <img src={service.image} alt={service.title} />
                  <span className="service-row-index">0{index + 1}</span>
                  <span className="service-row-tag">{service.tag}</span>
                </div>
                <div className="service-row-details">
                  <div className="service-row-header">
                    <h2>{service.title}</h2>
                    <span className="service-row-price">{service.price}</span>
                  </div>
                  <p className="service-row-desc">{service.description}</p>
                  
                  <div className="service-row-features">
                    <strong>What&apos;s Included in this Package:</strong>
                    <ul>
                      {service.features.map((feat, i) => (
                        <li key={i}>
                          <span className="feat-bullet">✿</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-row-actions">
                    <Link
                      href={`/book?service=${service.id}`}
                      className="button button-emerald"
                    >
                      <span>Book Consultation ↗</span>
                    </Link>
                    <a
                      href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent(`Hello Laxman Phool Bhandar! I am inquiring about the "${service.title}" package (${service.price}). Please share details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-outline"
                    >
                      <span className="btn-wa-icon">💬</span>
                      <span>Ask on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bespoke Custom Design Banner */}
          <div className="bespoke-cta-card">
            <div className="bespoke-card-content">
              <span className="pill-badge">🎨 Custom Inspiration</span>
              <h2>Have a Pinterest or Instagram Idea?</h2>
              <p>
                Found your dream wedding backdrop or bouquet on social media? Send the picture to our master florists on WhatsApp. We recreate the exact floral arrangement to fit your venue scale and budget.
              </p>
              <div className="bespoke-actions">
                <a
                  href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I have a reference photo for floral decoration and would like to get a custom quotation.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-emerald button-large"
                >
                  <span>Send Reference Photo on WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
