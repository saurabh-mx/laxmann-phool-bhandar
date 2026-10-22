'use client';

import { useState } from 'react';
import { faqs, FAQ } from '@/lib/data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-accordion">
      {faqs.map((faq: FAQ, idx: number) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="faq-question-btn"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
            >
              <span className="faq-q-text">{faq.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className="faq-answer-wrap"
              style={{ maxHeight: isOpen ? '300px' : '0' }}
            >
              <p className="faq-answer-text">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
