'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { businessInfo } from '@/lib/data';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services & Pricing' },
    { href: '/gallery', label: 'Inspiration Journal' },
    { href: '/book', label: 'Book an Event' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand Logo */}
        <Link
          href="/"
          className="brand-logo"
          onClick={() => setOpen(false)}
          aria-label="Laxman Phool Bhandar - Home"
        >
          <span className="brand-symbol" aria-hidden="true">✿</span>
          <div className="brand-titles">
            <span className="brand-main">Laxman</span>
            <span className="brand-sub">PHOOL BHANDAR · ESTD. 1975</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-item ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
                {isActive && <span className="active-dot" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Nav Actions */}
        <div className="nav-actions-desktop">
          <a
            href={`tel:${businessInfo.rawPhone}`}
            className="phone-quick-link"
            aria-label="Call business phone"
          >
            <span className="phone-icon">📞</span>
            <span>{businessInfo.phone}</span>
          </a>
          <Link href="/book" className="cta-button-nav">
            <span>Book Consultation</span>
            <span className="cta-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link href="/admin/login" className="nav-login-btn" title="Admin Studio Login">
            <span className="nav-login-icon">🔒</span>
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`hamburger-bar ${open ? 'open-1' : ''}`}></span>
          <span className={`hamburger-bar ${open ? 'open-2' : ''}`}></span>
          <span className={`hamburger-bar ${open ? 'open-3' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${open ? 'is-open' : ''}`}>
        <div className="mobile-drawer-inner">
          <div className="mobile-nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`mobile-nav-item ${pathname === link.href ? 'is-active' : ''}`}
              >
                <span>{link.label}</span>
                <span className="mobile-arrow">→</span>
              </Link>
            ))}
          </div>

          <div className="mobile-drawer-footer">
            <div className="mobile-contact-card">
              <p>Speak directly with our florist:</p>
              <a href={`tel:${businessInfo.rawPhone}`} className="mobile-call-btn">
                📞 Call {businessInfo.phone}
              </a>
              <a
                href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I am looking for flowers/decor.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-wa-btn"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mobile-book-cta"
            >
              Plan Your Celebration ↗
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mobile-login-btn"
            >
              <span>🔒 Admin Studio Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
