'use client';

import { useState } from 'react';
import { gallery, GalleryItem, businessInfo } from '@/lib/data';

interface GallerySectionProps {
  limit?: number;
  showFilters?: boolean;
  initialItems?: GalleryItem[];
}

export default function GallerySection({ limit, showFilters = true, initialItems }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const items = initialItems && initialItems.length > 0 ? initialItems : gallery;

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'weddings', label: 'Weddings & Mandap' },
    { id: 'cars', label: 'Luxury Car Décor' },
    { id: 'bouquets', label: 'Bouquets & Hampers' },
    { id: 'venues', label: 'Stage & Reception' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const handleInquirePhoto = (item: GalleryItem) => {
    const text = `Hello Laxman Phool Bhandar! I saw this arrangement in your gallery: "${item.title}" (${item.categoryLabel}). Can you provide pricing and options for this?`;
    const url = `https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="gallery-section-inner">
      {showFilters && (
        <div className="gallery-tabs-wrap">
          <div className="gallery-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`gallery-tab-btn ${activeCategory === cat.id ? 'is-active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="editorial-gallery-grid">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className={`gallery-card aspect-${item.aspect}`}
            onClick={() => setActiveItem(item)}
          >
            <div className="gallery-img-container">
              <img
                src={item.image}
                alt={item.title}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
              <div className="gallery-card-overlay">
                <span className="card-zoom-icon">⊕ View Fullscreen</span>
                <span className="card-category-tag">{item.categoryLabel}</span>
              </div>
            </div>
            <div className="gallery-card-details">
              <h4>{item.title}</h4>
              <p>{item.highlight}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="lightbox-backdrop" onClick={() => setActiveItem(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="lightbox-image-wrap">
              <img src={activeItem.image} alt={activeItem.title} />
            </div>
            <div className="lightbox-sidebar">
              <span className="pill-badge">{activeItem.categoryLabel}</span>
              <h3>{activeItem.title}</h3>
              <p className="lightbox-desc">{activeItem.highlight}</p>
              <div className="lightbox-meta">
                <div>
                  <strong>Freshness Guarantee</strong>
                  <span>Handcrafted on event morning</span>
                </div>
                <div>
                  <strong>Availability</strong>
                  <span>Custom quotes & doorstep delivery</span>
                </div>
              </div>
              <div className="lightbox-actions">
                <button
                  type="button"
                  onClick={() => handleInquirePhoto(activeItem)}
                  className="button button-emerald"
                >
                  <span>Inquire on WhatsApp ↗</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="button button-ghost"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
