'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An error occurred during sign in. Please verify your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-backdrop" aria-hidden="true">
        <div className="admin-bloom-blob blob-1" />
        <div className="admin-bloom-blob blob-2" />
      </div>

      <div className="admin-login-card">
        <div className="admin-brand-header">
          <Link href="/" className="admin-brand-logo">
            <span className="brand-symbol">✿</span>
            <div className="brand-titles">
              <span className="brand-main">Laxman</span>
              <span className="brand-sub">PHOOL BHANDAR · ESTD. 1975</span>
            </div>
          </Link>
          <div className="admin-badge-pill">Studio Management Portal</div>
        </div>

        <div className="admin-intro-text">
          <h1>Admin Sign In</h1>
          <p>Manage floral services, live pricing packages, and photo showcase.</p>
        </div>

        {error && (
          <div className="admin-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="admin-username">Username</label>
            <div className="admin-field-wrap">
              <span className="field-icon">👤</span>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-input-group">
            <div className="label-row">
              <label htmlFor="admin-password">Password</label>
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="admin-field-wrap">
              <span className="field-icon">🔒</span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="button button-emerald admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner-row">
                <span className="spinner-dot" /> Authenticating...
              </span>
            ) : (
              <span>Sign In to Admin Portal →</span>
            )}
          </button>
        </form>


        <div className="admin-login-footer">
          <Link href="/" className="back-link">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
