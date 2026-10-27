'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { businessInfo, services } from '@/lib/data';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="footer-top-accent" />
      <div className="page-shell">
        <div className="footer-main-grid">
          {/* Brand & Heritage */}
          <div className="footer-col brand-col">
            <Link href="/" className="footer-brand-logo">
              <span className="brand-symbol">✿</span>
              <div className="brand-titles">
                <span className="brand-main">Laxman</span>
                <span className="brand-sub">PHOOL BHANDAR</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Artisanal blooms, bespoke floral couture, and royal celebration styling. Bringing your once-in-a-lifetime moments to life with morning-fresh flowers since 1975.
            </p>
            <div className="footer-trust-pill">
              <span className="star-icon">★</span>
              <span><strong>4.9 / 5.0 Rating</strong> · Over 2,500+ celebrations styled</span>
            </div>
          </div>

          {/* Floral Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Floral Couture</h4>
            <ul className="footer-nav-list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/book?service=${s.id}`}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore Studio</h4>
            <ul className="footer-nav-list">
              <li><Link href="/">Home Overview</Link></li>
              <li><Link href="/services">Full Pricing & Packages</Link></li>
              <li><Link href="/gallery">Inspiration Gallery</Link></li>
              <li><Link href="/book">Custom Inquiry & WhatsApp</Link></li>
              <li>
                <a
                  href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello! I would like to request a bespoke quote.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Direct WhatsApp Chat ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Atelier Visit & Hours */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Atelier & Contact</h4>
            <div className="footer-contact-items">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Shop & Studio:</strong>
                  <p>{businessInfo.address}, {businessInfo.city}</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <div>
                  <strong>Operating Hours:</strong>
                  <p>{businessInfo.hours}</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone / WhatsApp:</strong>
                  <p>
                    <a href={`tel:${businessInfo.rawPhone}`} className="footer-link-highlight">
                      {businessInfo.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="footer-cta-wrapper">
              <Link href="/book" className="footer-action-btn">
                Plan Your Event Setup ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Laxman Phool Bhandar. All rights reserved.</p>
          <div className="footer-badges">
            <span>🌸 100% Fresh Farm Blooms</span>
            <span>•</span>
            <span>Handcrafted Daily with Care</span>
            <span>•</span>
            <Link href="/admin" className="admin-portal-link">
              Studio Admin ↗
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
