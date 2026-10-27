'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AppStoreData, PricingConfig, BusinessInfo } from '@/lib/store';
import type { Service, GalleryItem } from '@/lib/data';

interface AdminDashboardProps {
  initialData: AppStoreData;
  isSupabaseConnected?: boolean;
}

type TabType = 'services' | 'pricing' | 'gallery' | 'business';

export default function AdminDashboard({ initialData, isSupabaseConnected }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('services');
  const [data, setData] = useState<AppStoreData>(initialData);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Supabase State
  const [supabaseConnected, setSupabaseConnected] = useState(Boolean(isSupabaseConnected));
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Service Edit / Create State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [serviceFeaturesText, setServiceFeaturesText] = useState('');
  const [serviceUploading, setServiceUploading] = useState(false);

  // Gallery Add / Edit State
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [photoUploading, setPhotoUploading] = useState(false);

  // Pricing State
  const [pricingForm, setPricingForm] = useState<PricingConfig>(initialData.pricing);
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // Business Info State
  const [businessForm, setBusinessForm] = useState<BusinessInfo>(initialData.businessInfo);
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  // Notification helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Upload image helper
  const uploadImageFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        return result.url;
      }
      showToast(result.error || 'Image upload failed', 'error');
      return null;
    } catch {
      showToast('Image upload failed', 'error');
      return null;
    }
  };

  // ===================== SERVICES ACTIONS =====================
  const openNewServiceModal = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: '',
      category: 'weddings',
      short: '',
      description: '',
      price: 'From ₹',
      startingNumericPrice: 2000,
      image: '/images/services/wedding-stage.jpg',
      tag: 'New Floral Service',
      features: ['Morning-fresh blooms', 'On-site installation included'],
    };
    setEditingService(newService);
    setIsNewService(true);
    setServiceFeaturesText(newService.features.join('\n'));
  };

  const openEditServiceModal = (service: Service) => {
    setEditingService({ ...service });
    setIsNewService(false);
    setServiceFeaturesText(service.features.join('\n'));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const cleanedFeatures = serviceFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const serviceToSave: Service = {
      ...editingService,
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ['Premium fresh flowers'],
    };

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceToSave }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, services: resData.services }));
        setEditingService(null);
        showToast(
          supabaseConnected
            ? (isNewService ? 'Service created & auto-synced to Supabase!' : 'Service updated & auto-synced to Supabase!')
            : (isNewService ? 'Service created successfully!' : 'Service updated successfully!')
        );
      } else {
        showToast(resData.error || 'Failed to save service', 'error');
      }
    } catch {
      showToast('Error saving service', 'error');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.status === 401) {
        showToast('Your session has expired. Please sign in again.', 'error');
        router.push('/admin/login');
        return;
      }
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, services: resData.services }));
        showToast(
          supabaseConnected
            ? `"${title}" deleted & removed from Supabase`
            : `"${title}" deleted successfully`
        );
      } else {
        showToast(resData.error || 'Failed to delete service. Please check your connection.', 'error');
      }
    } catch {
      showToast('Error deleting service. Please check connection.', 'error');
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingService) return;

    setServiceUploading(true);
    const url = await uploadImageFile(file);
    setServiceUploading(false);

    if (url) {
      setEditingService((prev) => (prev ? { ...prev, image: url } : null));
      showToast('Image uploaded and linked!');
    }
  };

  // ===================== PRICING ACTIONS =====================
  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: pricingForm }),
      });
      const resData = await res.json();
      setIsSavingPricing(false);

      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, pricing: resData.pricing }));
        showToast('Pricing estimator configuration updated!');
      } else {
        showToast(resData.error || 'Failed to update pricing', 'error');
      }
    } catch {
      setIsSavingPricing(false);
      showToast('Error saving pricing', 'error');
    }
  };

  const updateEventTypePrice = (index: number, field: 'baseMin' | 'baseMax' | 'name' | 'icon', value: any) => {
    const updated = [...pricingForm.eventTypes];
    updated[index] = { ...updated[index], [field]: value };
    setPricingForm({ ...pricingForm, eventTypes: updated });
  };

  const updateAddonPrice = (index: number, field: 'name' | 'price', value: any) => {
    const updated = [...pricingForm.addons];
    updated[index] = { ...updated[index], [field]: value };
    setPricingForm({ ...pricingForm, addons: updated });
  };

  const handleAddAddon = () => {
    const newAddon = {
      id: `addon-${Date.now()}`,
      name: 'New Custom Add-on',
      price: 1500,
    };
    setPricingForm({
      ...pricingForm,
      addons: [...pricingForm.addons, newAddon],
    });
  };

  const handleRemoveAddon = (index: number) => {
    const updated = pricingForm.addons.filter((_, i) => i !== index);
    setPricingForm({ ...pricingForm, addons: updated });
  };

  // ===================== GALLERY ACTIONS =====================
  const openNewPhotoModal = () => {
    const newPhoto: GalleryItem = {
      id: `photo-${Date.now()}`,
      title: '',
      category: 'weddings',
      categoryLabel: 'Weddings & Mandap',
      image: '',
      aspect: 'tall',
      highlight: '',
    };
    setEditingPhoto(newPhoto);
    setIsAddingPhoto(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.image || !editingPhoto.title) {
      showToast('Please provide a title and image.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editingPhoto }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, gallery: resData.gallery }));
        setEditingPhoto(null);
        showToast(
          supabaseConnected
            ? (isAddingPhoto ? 'Photo published & synced to Supabase!' : 'Photo details updated & synced to Supabase!')
            : (isAddingPhoto ? 'Photo published to gallery!' : 'Photo details updated!')
        );
      } else {
        showToast(resData.error || 'Failed to save photo', 'error');
      }
    } catch {
      showToast('Error saving photo', 'error');
    }
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    if (!confirm(`Delete photo "${title || 'this creation'}" from gallery?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, gallery: resData.gallery }));
        showToast(
          supabaseConnected
            ? `Photo "${title || 'item'}" removed from Supabase`
            : 'Photo removed from gallery'
        );
      } else {
        showToast(resData.error || 'Failed to delete photo', 'error');
      }
    } catch {
      showToast('Error deleting photo', 'error');
    }
  };

  const handlePhotoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhoto) return;

    setPhotoUploading(true);
    const url = await uploadImageFile(file);
    setPhotoUploading(false);

    if (url) {
      setEditingPhoto((prev) => (prev ? { ...prev, image: url } : null));
      showToast(
        supabaseConnected
          ? 'Image uploaded & ready to save to database!'
          : 'Image uploaded successfully!'
      );
    }
  };

  // ===================== BUSINESS ACTIONS =====================
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBusiness(true);

    try {
      const res = await fetch('/api/admin/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo: businessForm }),
      });
      const resData = await res.json();
      setIsSavingBusiness(false);

      if (res.ok && resData.success) {
        setData((prev) => ({ ...prev, businessInfo: resData.businessInfo }));
        showToast('Business details updated!');
      } else {
        showToast(resData.error || 'Failed to update business details', 'error');
      }
    } catch {
      setIsSavingBusiness(false);
      showToast('Error saving business info', 'error');
    }
  };

  const filteredGallery = data.gallery.filter((item) => {
    if (galleryCategoryFilter === 'all') return true;
    return item.category === galleryCategoryFilter;
  });

  return (
    <div className="admin-panel-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast-notice ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="admin-top-header">
        <div className="header-left">
          <Link href="/" className="admin-brand-link">
            <span className="brand-flower">✿</span>
            <div>
              <strong>Laxman Phool Bhandar</strong>
              <span className="brand-subline">Studio Operations Portal · ESTD. 1975</span>
            </div>
          </Link>
          <span className="status-badge-live">● Live Store Active</span>
        </div>

        <div className="header-actions">
          <Link href="/" target="_blank" className="btn-preview-store">
            <span>View Public Store ↗</span>
          </Link>
          <button type="button" onClick={handleLogout} className="btn-admin-logout">
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="admin-dashboard-body">
        {/* Navigation Tabs Bar */}
        <nav className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'services' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span className="tab-icon">🌺</span>
            <span>Services & Packages</span>
            <span className="tab-count">{data.services.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'pricing' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <span className="tab-icon">💰</span>
            <span>Estimator & Pricing</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'gallery' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span className="tab-icon">📸</span>
            <span>Photo Showcase</span>
            <span className="tab-count">{data.gallery.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'business' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            <span className="tab-icon">⚙️</span>
            <span>Studio Profile</span>
          </button>
        </nav>

        {/* ============================================================== */}
        {/* TAB 1: SERVICES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <section className="admin-tab-content">
            <div className="content-action-bar">
              <div>
                <div className="title-with-badge">
                  <h2>Services & Floral Packages</h2>
                  {supabaseConnected ? (
                    <span className="badge-db-supabase" title="Real-time auto sync active: all additions, edits, and deletions instantly sync to Supabase">
                      <span className="pulse-dot-green">●</span> Supabase Auto-Sync Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="badge-db-local"
                      onClick={() => setShowSqlModal(true)}
                      title="Click for Supabase DB setup instructions"
                    >
                      <span className="pulse-dot-amber">●</span> Local Storage (Setup Supabase ↗)
                    </button>
                  )}
                </div>
                <p>All additions, edits, and deletions automatically synchronize with your Supabase database in real time.</p>
              </div>
              <div className="header-action-buttons">
                <button
                  type="button"
                  className="button button-emerald btn-add-item"
                  onClick={openNewServiceModal}
                >
                  <span>+ Add New Service</span>
                </button>
              </div>
            </div>

            <div className="admin-services-grid">
              {data.services.map((service, index) => (
                <div key={service.id} className="admin-service-card">
                  <div className="service-card-image">
                    <img src={service.image} alt={service.title} />
                    <span className="service-badge-tag">{service.tag || service.category}</span>
                    <span className="service-index-number">#{index + 1}</span>
                  </div>

                  <div className="service-card-info">
                    <div className="service-title-price-row">
                      <h3>{service.title}</h3>
                      <span className="service-highlight-price">{service.price}</span>
                    </div>

                    <p className="service-short-desc">{service.short}</p>

                    <div className="service-features-list">
                      <strong>Included In Package ({service.features.length}):</strong>
                      <ul>
                        {service.features.slice(0, 3).map((feat, i) => (
                          <li key={i}>✓ {feat}</li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="more-features">+{service.features.length - 3} more items...</li>
                        )}
                      </ul>
                    </div>

                    <div className="service-card-actions">
                      <button
                        type="button"
                        className="btn-edit-item"
                        onClick={() => openEditServiceModal(service)}
                      >
                        ✏️ Edit Details & Pricing
                      </button>
                      <button
                        type="button"
                        className="btn-delete-item"
                        onClick={() => handleDeleteService(service.id, service.title)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRICING ESTIMATOR */}
        {/* ============================================================== */}
        {activeTab === 'pricing' && (
          <section className="admin-tab-content">
            <div className="content-action-bar">
              <div>
                <h2>Package Estimator & Calculator Pricing</h2>
                <p>Configure base prices for celebration types, scale multipliers, and optional add-ons used in the instant quote calculator.</p>
              </div>
              <button
                type="button"
                className="button button-emerald"
                disabled={isSavingPricing}
                onClick={handleSavePricing}
              >
                {isSavingPricing ? 'Saving Changes...' : '💾 Save All Pricing Changes'}
              </button>
            </div>

            <div className="pricing-config-grid">
              {/* Event Types */}
              <div className="pricing-box">
                <div className="box-header">
                  <h3>1. Event & Celebration Base Rates</h3>
                  <p>Minimum and maximum base cost before venue scaling and add-ons.</p>
                </div>

                <div className="pricing-rows-table">
                  {pricingForm.eventTypes.map((item, index) => (
                    <div key={item.id} className="pricing-editor-row">
                      <div className="row-cell-icon">
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateEventTypePrice(index, 'icon', e.target.value)}
                          className="icon-input"
                          title="Emoji Icon"
                        />
                      </div>
                      <div className="row-cell-name">
                        <label>Occasion Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateEventTypePrice(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="row-cell-price">
                        <label>Base Min (₹)</label>
                        <input
                          type="number"
                          value={item.baseMin}
                          onChange={(e) => updateEventTypePrice(index, 'baseMin', Number(e.target.value))}
                        />
                      </div>
                      <div className="row-cell-price">
                        <label>Base Max (₹)</label>
                        <input
                          type="number"
                          value={item.baseMax}
                          onChange={(e) => updateEventTypePrice(index, 'baseMax', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="pricing-box">
                <div className="box-header-flex">
                  <div>
                    <h3>2. Optional Add-on Upgrades</h3>
                    <p>Flat additions that customers can toggle in the estimator.</p>
                  </div>
                  <button type="button" onClick={handleAddAddon} className="btn-small-add">
                    + Add New Add-on
                  </button>
                </div>

                <div className="pricing-rows-table">
                  {pricingForm.addons.map((addon, index) => (
                    <div key={addon.id || index} className="pricing-editor-row addon-row">
                      <div className="row-cell-name">
                        <label>Add-on Name</label>
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) => updateAddonPrice(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="row-cell-price">
                        <label>Price (₹)</label>
                        <input
                          type="number"
                          value={addon.price}
                          onChange={(e) => updateAddonPrice(index, 'price', Number(e.target.value))}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddon(index)}
                        className="btn-remove-row"
                        title="Remove add-on"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scales */}
              <div className="pricing-box full-width">
                <div className="box-header">
                  <h3>3. Venue Scale Multipliers</h3>
                  <p>Multiplier factor applied to the base rate based on venue size / guest count.</p>
                </div>
                <div className="scales-preview-row">
                  {pricingForm.scales.map((scale, i) => (
                    <div key={scale.id} className="scale-preview-pill">
                      <strong>{scale.name}</strong>
                      <div className="scale-multiplier-input">
                        <span>Multiplier:</span>
                        <input
                          type="number"
                          step="0.1"
                          value={scale.multiplier}
                          onChange={(e) => {
                            const updated = [...pricingForm.scales];
                            updated[i] = { ...updated[i], multiplier: parseFloat(e.target.value) || 1.0 };
                            setPricingForm({ ...pricingForm, scales: updated });
                          }}
                        />
                        <span>x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PHOTO GALLERY */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <section className="admin-tab-content">
            <div className="content-action-bar">
              <div>
                <div className="title-with-badge">
                  <h2>Photo Showcase & Customer Journal</h2>
                  {supabaseConnected ? (
                    <span className="badge-db-supabase" title="Real-time photo database auto-sync active">
                      <span className="pulse-dot-green">●</span> Supabase Photo DB Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="badge-db-local"
                      onClick={() => setShowSqlModal(true)}
                      title="Click for Supabase DB setup instructions"
                    >
                      <span className="pulse-dot-amber">●</span> Local Storage (Setup Supabase ↗)
                    </button>
                  )}
                </div>
                <p>Upload new photos from your phone/computer or link photos. All photos auto-sync with Supabase in real time.</p>
              </div>
              <button
                type="button"
                className="button button-emerald btn-add-item"
                onClick={openNewPhotoModal}
              >
                <span>+ Upload / Add New Photo</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="admin-gallery-filters">
              {['all', 'weddings', 'cars', 'bouquets', 'venues'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`gallery-filter-pill ${galleryCategoryFilter === cat ? 'is-active' : ''}`}
                  onClick={() => setGalleryCategoryFilter(cat)}
                >
                  {cat === 'all' ? 'All Photos' : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="admin-gallery-grid">
              {filteredGallery.map((item) => (
                <div key={item.id} className="admin-gallery-card">
                  <div className="gallery-thumb-wrap">
                    <img src={item.image} alt={item.title} />
                    <span className="gallery-card-badge">{item.categoryLabel}</span>
                    <span className="gallery-aspect-tag">{item.aspect}</span>
                  </div>
                  <div className="gallery-card-content">
                    <h4>{item.title}</h4>
                    <p className="gallery-card-highlight">{item.highlight}</p>
                    <div className="gallery-card-footer">
                      <button
                        type="button"
                        className="btn-delete-photo"
                        onClick={() => handleDeletePhoto(item.id, item.title)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STUDIO PROFILE */}
        {/* ============================================================== */}
        {activeTab === 'business' && (
          <section className="admin-tab-content">
            <div className="content-action-bar">
              <div>
                <h2>Studio Contact & Profile Details</h2>
                <p>Update phone numbers, WhatsApp routing, address, operating hours, and business metrics.</p>
              </div>
            </div>

            <form onSubmit={handleSaveBusiness} className="business-details-form">
              <div className="form-grid-two">
                <div className="admin-input-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Tagline / Motto</label>
                  <input
                    type="text"
                    value={businessForm.tagline}
                    onChange={(e) => setBusinessForm({ ...businessForm, tagline: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Display Phone Number</label>
                  <input
                    type="text"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>WhatsApp Number (Digits only, including country code)</label>
                  <input
                    type="text"
                    value={businessForm.rawPhone}
                    onChange={(e) => setBusinessForm({ ...businessForm, rawPhone: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Physical Address</label>
                  <input
                    type="text"
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>City & State</label>
                  <input
                    type="text"
                    value={businessForm.city}
                    onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Operating Hours</label>
                  <input
                    type="text"
                    value={businessForm.hours}
                    onChange={(e) => setBusinessForm({ ...businessForm, hours: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Years in Business (Since 1975)</label>
                  <input
                    type="number"
                    value={businessForm.experienceYears}
                    onChange={(e) => setBusinessForm({ ...businessForm, experienceYears: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Celebrations Styled Count</label>
                  <input
                    type="text"
                    value={businessForm.eventsCount}
                    onChange={(e) => setBusinessForm({ ...businessForm, eventsCount: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Rating Display</label>
                  <input
                    type="text"
                    value={businessForm.rating}
                    onChange={(e) => setBusinessForm({ ...businessForm, rating: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-submit-row">
                <button
                  type="submit"
                  className="button button-emerald button-large"
                  disabled={isSavingBusiness}
                >
                  {isSavingBusiness ? 'Saving...' : '💾 Save Profile Information'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: EDIT / CREATE SERVICE */}
      {/* ============================================================== */}
      {editingService && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog">
            <div className="modal-header">
              <h3>{isNewService ? 'Create New Service' : `Edit "${editingService.title}"`}</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setEditingService(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="modal-form">
              <div className="modal-form-grid">
                <div className="admin-input-group full-width">
                  <label>Service Title</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Royal Wedding Mandap Styling"
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  >
                    <option value="weddings">Weddings</option>
                    <option value="cars">Car Decoration</option>
                    <option value="bouquets">Bouquets & Hampers</option>
                    <option value="venues">Venues & Reception</option>
                    <option value="occasions">Special Occasions & Haldi</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label>Display Price Tag</label>
                  <input
                    type="text"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    placeholder="e.g. From ₹1,499 or Packages from ₹15,000"
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Badge / Highlight Tag</label>
                  <input
                    type="text"
                    value={editingService.tag}
                    onChange={(e) => setEditingService({ ...editingService, tag: e.target.value })}
                    placeholder="e.g. Customer Favourite, Fast 40-Min Setup"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Starting Price (Numeric ₹ for sorting)</label>
                  <input
                    type="number"
                    value={editingService.startingNumericPrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        startingNumericPrice: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="admin-input-group full-width">
                  <label>Service Image</label>
                  <div className="image-source-wrap">
                    <input
                      type="text"
                      value={editingService.image}
                      onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                      placeholder="Paste Image URL or upload a file below"
                      required
                    />
                    <label className="button button-outline btn-upload-label">
                      <span>{serviceUploading ? 'Uploading...' : '📁 Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleServiceImageUpload}
                        style={{ display: 'none' }}
                        disabled={serviceUploading}
                      />
                    </label>
                  </div>
                  {editingService.image && (
                    <div className="image-preview-strip">
                      <img src={editingService.image} alt="Preview" />
                      <span>Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="admin-input-group full-width">
                  <label>Short Summary / Subtitle</label>
                  <input
                    type="text"
                    value={editingService.short}
                    onChange={(e) => setEditingService({ ...editingService, short: e.target.value })}
                    placeholder="One-line summary shown on cards"
                    required
                  />
                </div>

                <div className="admin-input-group full-width">
                  <label>Comprehensive Description</label>
                  <textarea
                    rows={3}
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Detailed explanation of floral types, craftsmanship, setup process..."
                    required
                  />
                </div>

                <div className="admin-input-group full-width">
                  <label>Included Features (One item per line)</label>
                  <textarea
                    rows={4}
                    value={serviceFeaturesText}
                    onChange={(e) => setServiceFeaturesText(e.target.value)}
                    placeholder="Farm-fresh morning flowers&#10;Doorstep delivery & installation&#10;Water-resistant tape"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-emerald">
                  <span>Save Service & Pricing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PHOTO */}
      {/* ============================================================== */}
      {editingPhoto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog">
            <div className="modal-header">
              <h3>{isAddingPhoto ? 'Add New Photo to Showcase' : 'Edit Photo Details'}</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setEditingPhoto(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="modal-form">
              <div className="modal-form-grid">
                <div className="admin-input-group full-width">
                  <label>Photo Title / Subject</label>
                  <input
                    type="text"
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    placeholder="e.g. Mercedes Benz Fresh Rose & Ribbon Setup"
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Category</label>
                  <select
                    value={editingPhoto.category}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      const labelMap: Record<string, string> = {
                        weddings: 'Weddings & Mandap',
                        cars: 'Luxury Car Décor',
                        bouquets: 'Bouquets & Hampers',
                        venues: 'Stage & Reception',
                      };
                      setEditingPhoto({
                        ...editingPhoto,
                        category: cat,
                        categoryLabel: labelMap[cat] || 'Floral Styling',
                      });
                    }}
                  >
                    <option value="weddings">Weddings & Mandap</option>
                    <option value="cars">Luxury Car Décor</option>
                    <option value="bouquets">Bouquets & Hampers</option>
                    <option value="venues">Stage & Reception</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label>Aspect Ratio Frame</label>
                  <select
                    value={editingPhoto.aspect}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, aspect: e.target.value as any })}
                  >
                    <option value="tall">Tall (Portrait)</option>
                    <option value="wide">Wide (Landscape / Banner)</option>
                    <option value="square">Square</option>
                  </select>
                </div>

                <div className="admin-input-group full-width">
                  <label>Image Source (Upload file or paste URL)</label>
                  <div className="image-source-wrap">
                    <input
                      type="text"
                      value={editingPhoto.image}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                      placeholder="Paste image URL or choose file from device"
                      required
                    />
                    <label className="button button-outline btn-upload-label">
                      <span>{photoUploading ? 'Uploading...' : '📁 Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoImageUpload}
                        style={{ display: 'none' }}
                        disabled={photoUploading}
                      />
                    </label>
                  </div>
                  {editingPhoto.image && (
                    <div className="image-preview-strip">
                      <img src={editingPhoto.image} alt="Preview" />
                      <span>Ready to publish</span>
                    </div>
                  )}
                </div>

                <div className="admin-input-group full-width">
                  <label>Highlight Caption</label>
                  <input
                    type="text"
                    value={editingPhoto.highlight}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, highlight: e.target.value })}
                    placeholder="e.g. Handcrafted with 150 Dutch red roses & satin organza ribbon"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditingPhoto(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-emerald">
                  <span>Publish Photo to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SUPABASE SETUP INSTRUCTIONS */}
      {/* ============================================================== */}
      {showSqlModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-dialog sql-setup-dialog">
            <div className="modal-header">
              <h3>⚡ Setup Supabase Database for Services</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowSqlModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="sql-modal-body">
              <p className="sql-intro-note">
                Follow these 3 easy steps to connect your live Supabase cloud database to the Laxman Phool Bhandar studio portal:
              </p>

              <div className="setup-step-box">
                <span className="step-num">Step 1</span>
                <div>
                  <strong>Run the Database Table Script</strong>
                  <p>Open your Supabase Project &rarr; <strong>SQL Editor</strong>, paste this script and click <strong>Run</strong>:</p>
                </div>
              </div>

              <div className="sql-snippet-box">
                <pre>
{`-- 1. Services Table
create table if not exists public.services (
  id text primary key,
  title text not null,
  category text not null default 'weddings',
  short text not null default '',
  description text not null default '',
  price text not null default '',
  starting_numeric_price numeric not null default 0,
  image text not null default '',
  tag text not null default '',
  features jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.services enable row level security;
drop policy if exists "Allow public read access to services" on public.services;
drop policy if exists "Allow public read services" on public.services;
create policy "Allow public read access to services" on public.services for select using (true);
drop policy if exists "Allow all write access to services" on public.services;
drop policy if exists "Allow write services" on public.services for all using (true) with check (true);
create policy "Allow all write access to services" on public.services for all using (true) with check (true);

-- 2. Photo Showcase / Gallery Table
create table if not exists public.gallery (
  id text primary key,
  title text not null,
  category text not null default 'weddings',
  category_label text not null default '',
  image text not null,
  aspect text not null default 'square',
  highlight text not null default '',
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.gallery enable row level security;
drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow public read gallery" on public.gallery;
create policy "Allow public read access to gallery" on public.gallery for select using (true);
drop policy if exists "Allow all write access to gallery" on public.gallery;
drop policy if exists "Allow write gallery" on public.gallery;
create policy "Allow all write access to gallery" on public.gallery for all using (true) with check (true);

-- 3. Storage Bucket for Photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do update set public = true;
drop policy if exists "Public Access to Photos" on storage.objects;
create policy "Public Access to Photos" on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "Allow Upload to Photos" on storage.objects;
create policy "Allow Upload to Photos" on storage.objects for insert with check (bucket_id = 'photos');
drop policy if exists "Allow Update/Delete to Photos" on storage.objects;
drop policy if exists "Allow Manage Photos" on storage.objects;
create policy "Allow Update/Delete to Photos" on storage.objects for all using (bucket_id = 'photos');`}
                </pre>
              </div>

              <div className="setup-step-box">
                <span className="step-num">Step 2</span>
                <div>
                  <strong>Add Credentials to .env.local</strong>
                  <p>In your project root, open <code>.env.local</code> and set your project details:</p>
                  <pre className="env-snippet">
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
                  </pre>
                </div>
              </div>

              <div className="setup-step-box">
                <span className="step-num">Step 3</span>
                <div>
                  <strong>Automatic Real-Time Sync</strong>
                  <p>Once credentials are added to <code>.env.local</code>, every change you make (add, edit, or delete) automatically synchronizes with Supabase with zero manual effort!</p>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button
                type="button"
                className="button button-emerald"
                onClick={() => setShowSqlModal(false)}
              >
                <span>Got It, Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
