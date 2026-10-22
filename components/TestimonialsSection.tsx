import { testimonials } from '@/lib/data';

export default function TestimonialsSection() {
  return (
    <div className="testimonials-grid">
      {testimonials.map((t) => (
        <div key={t.id} className="testimonial-card">
          <div className="testimonial-stars" aria-label="5 out of 5 stars">
            {'★'.repeat(t.rating)}
          </div>
          <p className="testimonial-body">“{t.text}”</p>
          <div className="testimonial-footer">
            <div className="testimonial-avatar">
              <span>{t.name[0]}</span>
            </div>
            <div className="testimonial-author-meta">
              <strong>{t.name}</strong>
              <small>{t.occasion}</small>
            </div>
            <span className="verified-badge">✓ Verified Client</span>
          </div>
        </div>
      ))}
    </div>
  );
}
