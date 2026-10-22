'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <section className="section-padded bg-canvas text-center" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div className="page-shell">
        <span className="pill-badge">⚠️ Temporary Interruption</span>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '16px' }}>
          Something Unexpected <em>Occurred</em>
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto 28px', color: 'var(--text-muted)' }}>
          We apologize for the inconvenience. Our florists are looking into it. Please try refreshing or return to the main studio.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="button button-emerald"
          >
            Try Again ↻
          </button>
          <Link href="/" className="button button-outline">
            Return to Home ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
