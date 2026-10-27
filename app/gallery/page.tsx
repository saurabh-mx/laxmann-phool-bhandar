import type { Metadata } from 'next';
import GallerySection from '@/components/GallerySection';
import { getStoreDataAsync } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Floral Inspiration Journal & Portfolio | Laxman Phool Bhandar',
  description: 'Browse our real portfolio of luxury weddings, Defender car decorations, fresh rose bouquets, and reception stage decor in Patna.',
};

export default async function GalleryPage() {
  const { gallery, businessInfo } = await getStoreDataAsync();

  return (
    <>
      <section className="page-hero-editorial">
        <div className="page-shell">
          <div className="hero-editorial-center">
            <span className="pill-badge">📷 Real Celebrations Portfolio</span>
            <h1>
              The Flower Journal<br />
              <em>Moments Captured in Bloom</em>
            </h1>
            <p>
              Click any photo to view in high resolution or directly inquire about recreation. Every design shown was handcrafted with fresh morning blooms for our valued clients.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padded bg-surface">
        <div className="page-shell">
          <GallerySection initialItems={gallery} />

          <div className="gallery-bottom-consultation">
            <div className="consultation-box">
              <span className="consultation-icon">✿</span>
              <h3>Love a specific flower or color scheme?</h3>
              <p>
                Our master florist can tailor any arrangement using seasonal Dutch roses, imported orchids, lilies, or traditional marigolds.
              </p>
              <a
                href={`https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent('Hello Laxman Phool Bhandar! I loved your gallery arrangements and would like to consult on my event decor.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-emerald button-large"
              >
                <span>Consult Our Senior Florist on WhatsApp ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
