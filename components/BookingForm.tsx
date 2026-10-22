'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { services, businessInfo } from '@/lib/data';
import { supabase } from '@/lib/supabase';

const BUDGET_OPTIONS = [
  'Under ₹1,500',
  '₹1,500 – ₹5,000',
  '₹5,000 – ₹15,000',
  '₹15,000 – ₹40,000',
  '₹40,000+',
  'Custom Quote Needed'
];

export default function BookingForm() {
  const params = useSearchParams();
  const preset = params.get('service') || '';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: services.some((s) => s.id === preset) ? preset : (services[0]?.id || 'car'),
    date: '',
    venue: '',
    budget: '₹15,000 – ₹40,000',
    details: '',
  });

  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const rawNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || businessInfo.rawPhone).replace(/\D/g, '');
  const WHATSAPP_NUMBER = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;

  const selectedServiceObj = services.find((s) => s.id === form.service);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setBusy(true);

    const serviceName = selectedServiceObj?.title || 'Custom Floral Design';

    let saved = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('booking_requests').insert({
          customer_name: form.name,
          phone: form.phone,
          email: form.email || null,
          service: serviceName,
          event_date: form.date || null,
          venue: form.venue || null,
          budget: form.budget || null,
          details: form.details || null,
          status: 'new',
        });
        saved = !error;
      } catch (e) {
        console.error('Supabase insert error', e);
      }
    }

    const message = [
      '🌸 *NEW INQUIRY — LAXMAN PHOOL BHANDAR*',
      '--------------------------------',
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : '',
      `*Service Required:* ${serviceName}`,
      `*Event Date:* ${form.date ? new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not finalized / Flexible'}`,
      `*Venue / Area:* ${form.venue || 'To be decided'}`,
      `*Approx. Budget:* ${form.budget || 'Open for consultation'}`,
      form.details ? `*Special Notes / Ideas:* ${form.details}` : '',
      '--------------------------------',
      'Please let me know your availability and recommendations!'
    ].filter(Boolean).join('\n');

    setBusy(false);

    setStatus(
      saved
        ? '✓ Inquiry recorded! Opening WhatsApp to connect directly with our florist...'
        : 'Opening WhatsApp with your details. Press Send in WhatsApp to complete your inquiry.'
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <form className="luxury-booking-form" onSubmit={submit}>
      <div className="form-card-header">
        <span className="pill-badge">✨ Step-by-Step Inquiry</span>
        <h2>Tell Us About Your Celebration</h2>
        <p>
          Fill in your preferences below. Once you click continue, WhatsApp will open with your customized summary ready to send.
        </p>
      </div>

      {/* Step 1: Visual Service Selection */}
      <div className="form-section-block">
        <label className="form-block-label">
          <span>1. Choose Desired Service</span>
          <small>Select the arrangement that best matches your celebration</small>
        </label>
        <div className="service-selection-grid">
          {services.map((s) => {
            const isSelected = form.service === s.id;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => update('service', s.id)}
                className={`service-select-card ${isSelected ? 'is-selected' : ''}`}
              >
                <div className="service-select-thumb">
                  <img src={s.image} alt={s.title} />
                  {isSelected && <span className="select-check">✓</span>}
                </div>
                <div className="service-select-info">
                  <strong>{s.title}</strong>
                  <span>{s.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Contact Details */}
      <div className="form-section-block">
        <label className="form-block-label">
          <span>2. Your Contact Information</span>
          <small>Required so our senior designer can follow up with you</small>
        </label>
        <div className="form-inputs-grid">
          <div className="input-group">
            <label htmlFor="customer-name">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="customer-name"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Priya Sharma"
              autoComplete="name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="customer-phone">
              WhatsApp / Phone Number <span className="req">*</span>
            </label>
            <input
              id="customer-phone"
              required
              type="tel"
              inputMode="tel"
              pattern="[+0-9() -]{7,20}"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              autoComplete="tel"
            />
          </div>

          <div className="input-group">
            <label htmlFor="customer-email">
              Email Address <small className="opt">(Optional)</small>
            </label>
            <input
              id="customer-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="event-date">
              Event Date <small className="opt">(Tentative is fine)</small>
            </label>
            <input
              id="event-date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Event Location & Budget */}
      <div className="form-section-block">
        <label className="form-block-label">
          <span>3. Event Location & Budget Range</span>
        </label>
        <div className="form-inputs-grid">
          <div className="input-group full-width">
            <label htmlFor="event-venue">
              Venue / City / Delivery Area <small className="opt">(Optional)</small>
            </label>
            <input
              id="event-venue"
              value={form.venue}
              onChange={(e) => update('venue', e.target.value)}
              placeholder="e.g. Taj Hotel Banquet, Boring Road, Patna"
            />
          </div>
        </div>

        <div className="budget-chips-group">
          <span className="chips-title">Approximate Budget:</span>
          <div className="chips-list">
            {BUDGET_OPTIONS.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => update('budget', b)}
                className={`budget-chip ${form.budget === b ? 'is-selected' : ''}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group full-width mt-4">
          <label htmlFor="event-details">
            Flower Preferences / Theme Notes <small className="opt">(Optional)</small>
          </label>
          <textarea
            id="event-details"
            rows={3}
            value={form.details}
            onChange={(e) => update('details', e.target.value)}
            placeholder="Tell us about your theme, color choices (e.g. pastel pink & cream), flower varieties, or mention if you have an Instagram photo to share..."
          />
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="preview-message-card">
        <div className="preview-header">
          <span className="preview-icon">💬</span>
          <strong>Instant WhatsApp Message Preview</strong>
        </div>
        <p className="preview-content">
          “Hello Laxman Phool Bhandar! I am looking for <strong>{selectedServiceObj?.title}</strong> for my event {form.date ? `on ${form.date}` : '(flexible date)'} with a budget of {form.budget}. Let&apos;s discuss availability!”
        </p>
      </div>

      {/* Submit Action */}
      <div className="form-actions-row">
        <div className="guarantee-note">
          <span>🔒 Direct Florist Chat</span>
          <span>• No upfront payment required to inquire</span>
        </div>
        <button
          className="button button-emerald button-large"
          disabled={busy}
          type="submit"
        >
          {busy ? 'Preparing Inquiry…' : 'Continue to WhatsApp Chat ↗'}
        </button>
      </div>

      {status && (
        <div className="form-status-alert" role="status">
          <span className="status-badge-icon">✓</span>
          <p>{status}</p>
        </div>
      )}
    </form>
  );
}
