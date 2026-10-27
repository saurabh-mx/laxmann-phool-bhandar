'use client';

import { usePathname } from 'next/navigation';
import { businessInfo } from '@/lib/data';

export default function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <div className="announcement-badge">
          <span className="pulse-dot"></span>
          <span>Open Today · 6:30 AM – 10:30 PM</span>
        </div>
        <p className="announcement-text">
          🌸 <strong>Wedding & Festival Season Booking:</strong> Reserve early for handcrafted Mandap & Car Décor setups
        </p>
        <div className="announcement-contact">
          <a
            href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I would like to check booking availability for an upcoming event.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-link"
          >
            <span>WhatsApp: {businessInfo.phone}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
