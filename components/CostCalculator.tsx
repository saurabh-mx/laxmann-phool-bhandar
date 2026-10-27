'use client';

import { useState } from 'react';
import { businessInfo } from '@/lib/data';

interface EventTypeOption {
  id: string;
  name: string;
  baseMin: number;
  baseMax: number;
  icon: string;
}

const EVENT_TYPES: EventTypeOption[] = [
  { id: 'wedding', name: 'Grand Wedding & Mandap', baseMin: 18000, baseMax: 35000, icon: '🏛️' },
  { id: 'car', name: 'Luxury Car Decoration', baseMin: 1500, baseMax: 3500, icon: '🚗' },
  { id: 'stage', name: 'Reception Stage & Backdrop', baseMin: 12000, baseMax: 25000, icon: '✨' },
  { id: 'haldi', name: 'Haldi & Mehendi Jhoola', baseMin: 5500, baseMax: 12000, icon: '🌼' },
  { id: 'bouquet', name: 'Bespoke Rose Bouquet / Basket', baseMin: 500, baseMax: 2000, icon: '💐' },
  { id: 'custom', name: 'Pinterest / Custom Idea', baseMin: 5000, baseMax: 15000, icon: '🎨' },
];

const SCALES = [
  { id: 'intimate', name: 'Intimate / Home Gathering', multiplier: 1.0 },
  { id: 'grand', name: 'Banquet / Hall (100–300 Guests)', multiplier: 1.4 },
  { id: 'royal', name: 'Grand Royal Resort (500+ Guests)', multiplier: 2.1 },
];

const ADDONS = [
  { id: 'varmala', name: 'Rose & Orchid Varmalas (Pair)', price: 2500 },
  { id: 'arch', name: 'Grand Floral Entrance Arch', price: 4500 },
  { id: 'jewelry', name: 'Bridal Floral Jewelry Set', price: 1500 },
  { id: 'car_decor', name: 'Doorstep Wedding Car Decor', price: 1800 },
  { id: 'petals', name: 'Organic Petal Shower Baskets', price: 800 },
];

interface CostCalculatorProps {
  initialPricing?: {
    eventTypes?: EventTypeOption[];
    scales?: { id: string; name: string; multiplier: number }[];
    addons?: { id: string; name: string; price: number }[];
  };
}

export default function CostCalculator({ initialPricing }: CostCalculatorProps) {
  const eventTypes = initialPricing?.eventTypes?.length ? initialPricing.eventTypes : EVENT_TYPES;
  const scales = initialPricing?.scales?.length ? initialPricing.scales : SCALES;
  const addons = initialPricing?.addons?.length ? initialPricing.addons : ADDONS;

  const [selectedType, setSelectedType] = useState<string>(eventTypes[0]?.id || 'wedding');
  const [selectedScale, setSelectedScale] = useState<string>(scales[1]?.id || 'grand');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    addons.slice(0, 2).map((a) => a.id)
  );

  const currentType = eventTypes.find((t) => t.id === selectedType) || eventTypes[0] || EVENT_TYPES[0];
  const currentScale = scales.find((s) => s.id === selectedScale) || scales[0] || SCALES[0];

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = addons.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const minTotal = Math.round(currentType.baseMin * currentScale.multiplier + addonsTotal);
  const maxTotal = Math.round(currentType.baseMax * currentScale.multiplier + addonsTotal);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleWhatsAppSend = () => {
    const addonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const text = [
      'Hello Laxman Phool Bhandar! I just customized a floral package on your website estimator:',
      '',
      `• Event Type: ${currentType.name}`,
      `• Scale / Venue: ${currentScale.name}`,
      `• Selected Add-ons: ${addonNames || 'None'}`,
      `• Estimated Budget Range: ₹${minTotal.toLocaleString('en-IN')} – ₹${maxTotal.toLocaleString('en-IN')}`,
      '',
      'Could you confirm availability for my date and provide final pricing details?'
    ].join('\n');

    const url = `https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-header">
        <span className="pill-badge">✨ Instant Package Estimator</span>
        <h3>Plan Your Floral Budget in 30 Seconds</h3>
        <p>Get a quick, transparent price range and send your customized package directly to our master florist on WhatsApp.</p>
      </div>

      <div className="calculator-body">
        {/* Step 1: Event Type */}
        <div className="calc-group">
          <label className="calc-label">1. Select Celebration Type</label>
          <div className="calc-grid-types">
            {eventTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`calc-type-card ${selectedType === t.id ? 'is-selected' : ''}`}
              >
                <span className="type-icon">{t.icon}</span>
                <span className="type-name">{t.name}</span>
                <span className="type-price">From ₹{t.baseMin.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Scale */}
        <div className="calc-group">
          <label className="calc-label">2. Venue & Guest Scale</label>
          <div className="calc-chips">
            {scales.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScale(s.id)}
                className={`calc-chip ${selectedScale === s.id ? 'is-selected' : ''}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Add-ons */}
        <div className="calc-group">
          <label className="calc-label">3. Optional Bespoke Add-ons</label>
          <div className="calc-addons-grid">
            {addons.map((a) => {
              const checked = selectedAddons.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAddon(a.id)}
                  className={`addon-chip ${checked ? 'is-active' : ''}`}
                >
                  <span className="addon-check">{checked ? '✓' : '+'}</span>
                  <span className="addon-name">{a.name}</span>
                  <span className="addon-cost">+₹{a.price.toLocaleString('en-IN')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Output Banner */}
        <div className="calc-result-box">
          <div className="result-text">
            <span className="result-label">Estimated Package Investment</span>
            <div className="result-numbers">
              <strong>₹{minTotal.toLocaleString('en-IN')}</strong>
              <span>to</span>
              <strong>₹{maxTotal.toLocaleString('en-IN')}</strong>
            </div>
            <small className="result-note">*Includes fresh morning floral sourcing, setup, on-site styling, and venue teardown guidance.</small>
          </div>
          <button
            type="button"
            onClick={handleWhatsAppSend}
            className="calc-submit-btn"
          >
            <span>Lock Quote on WhatsApp ↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
