import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section-padded bg-canvas text-center" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div className="page-shell">
        <span className="pill-badge">✿ 404 — Page Not Found</span>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '16px' }}>
          This Petal Seems to Have <em>Blown Away</em>
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto 32px', color: 'var(--text-muted)' }}>
          The arrangement or page you were looking for doesn&apos;t exist or has moved. Let&apos;s guide you back to our floral studio.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="button button-emerald">
            Return to Home ↗
          </Link>
          <Link href="/services" className="button button-outline">
            Explore Services ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
