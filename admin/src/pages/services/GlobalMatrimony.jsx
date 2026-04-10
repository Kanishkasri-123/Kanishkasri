import React, { useState, useEffect } from 'react'
import client from '../../api/client'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function calcAge(dob) {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000)) + ' yrs'
}

const STATUS_COLORS = {
  active: 'badge-success',
  inactive: 'badge-default',
  pending: 'badge-warning',
  paid: 'badge-success',
  unpaid: 'badge-danger',
}

const Field = ({ label, value }) => (
  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</div>
  </div>
)

export default function GlobalMatrimony() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [payFilter, setPayFilter] = useState('all')

  // Modal states
  const [viewProfile, setViewProfile] = useState(null)
  const [editProfile, setEditProfile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Edit form
  const [editForm, setEditForm] = useState({ status: '', paymentStatus: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => { fetchProfiles() }, [])

  function fetchProfiles() {
    setLoading(true)
    client.get('/admin/matrimony-profiles')
      .then(res => setProfiles(res.data.data || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load profiles'))
      .finally(() => setLoading(false))
  }

  const filtered = profiles.filter(p => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    const matchSearch = fullName.includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase())
    const matchGender = genderFilter === 'all' || p.profileData?.gender === genderFilter
    const matchPay = payFilter === 'all' || p.paymentStatus === payFilter
    return matchSearch && matchGender && matchPay
  })

  const stats = [
    { label: 'Total Profiles', value: profiles.length, icon: '💍', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Active Profiles', value: profiles.filter(p => p.status === 'active').length, icon: '✅', color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Paid Members', value: profiles.filter(p => p.paymentStatus === 'paid').length, icon: '💳', color: 'var(--brand-primary)', bg: 'var(--warning-bg)' },
    { label: 'Male Profiles', value: profiles.filter(p => p.profileData?.gender === 'Male').length, icon: '👨', color: 'var(--info)', bg: 'var(--info-bg)' },
  ]

  // ── Open Edit ─────────────────────────────────────────────────────
  function openEdit(p) {
    setEditForm({ status: p.status || 'active', paymentStatus: p.paymentStatus || 'unpaid' })
    setSaveError('')
    setEditProfile(p)
  }

  // ── Save Edit ─────────────────────────────────────────────────────
  async function handleSaveEdit() {
    setSaving(true); setSaveError('')
    try {
      const res = await client.patch(`/admin/matrimony-profiles/${editProfile.id}`, editForm)
      const updated = res.data.data
      setProfiles(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p))
      setEditProfile(null)
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true)
    try {
      await client.delete(`/admin/matrimony-profiles/${deleteTarget.id}`)
      setProfiles(prev => prev.filter(p => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="service-hero">
        <div className="service-hero-icon">💍</div>
        <div className="service-hero-text">
          <h1>Global Matrimony</h1>
          <p>Manage matrimony profiles, matches, and member payments. View, edit, or remove profiles.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Matrimony Profiles</div>
            <div className="card-subtitle">{loading ? 'Loading…' : `${filtered.length} of ${profiles.length} profiles`}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ width: '200px' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔍</span>
              <input placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input" style={{ width: '120px' }} value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="all">All Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className="input" style={{ width: '130px' }} value={payFilter} onChange={e => setPayFilter(e.target.value)}>
              <option value="all">All Payment</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <button className="btn btn-ghost btn-sm" onClick={fetchProfiles}>🔄 Refresh</button>
          </div>
        </div>

        {error && <div style={{ padding: '20px', color: 'var(--danger)', fontSize: '0.9rem' }}>⚠️ {error}</div>}

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>⏳ Loading profiles…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💍</div>
            <h3>No profiles found</h3>
            <p>Adjust your filters</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Education</th>
                  <th>Profession</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {p.profilePhoto ? (
                          <img src={`http://localhost:5000${p.profilePhoto}`} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div className="avatar avatar-sm" style={{ background: 'rgba(236,72,153,0.2)', color: '#ec4899' }}>
                            {p.firstName?.[0]}{p.lastName?.[0]}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.firstName} {p.lastName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.profileData?.gender || '—'}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{calcAge(p.profileData?.dob)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.profileData?.education || '—'}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.profileData?.profession || '—'}</td>
                    <td><span className={`badge ${STATUS_COLORS[p.paymentStatus] || 'badge-default'}`}>{p.paymentStatus || 'unknown'}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[p.status] || 'badge-default'}`}>{p.status || 'unknown'}</span></td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{timeAgo(p.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* VIEW */}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setViewProfile(p)}
                          title="View Profile"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          👁 View
                        </button>
                        {/* EDIT */}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(p)}
                          title="Edit Profile"
                          style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--brand-primary)' }}
                        >
                          ✏️ Edit
                        </button>
                        {/* DELETE */}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteTarget(p)}
                          title="Delete Profile"
                          style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--danger)' }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ─────────────────────────────────────────────── */}
      {viewProfile && (
        <div className="modal-overlay" onClick={() => setViewProfile(null)}>
          <div className="modal" style={{ width: '560px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">👁 Profile Details</div>
              <button className="modal-close" onClick={() => setViewProfile(null)}>✕</button>
            </div>

            {/* Top card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {viewProfile.profilePhoto ? (
                <img src={`http://localhost:5000${viewProfile.profilePhoto}`} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="avatar avatar-lg" style={{ background: 'rgba(236,72,153,0.2)', color: '#ec4899', flexShrink: 0 }}>
                  {viewProfile.firstName?.[0]}{viewProfile.lastName?.[0]}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem' }}>{viewProfile.firstName} {viewProfile.lastName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{viewProfile.email}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{viewProfile.phone}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <span className={`badge ${STATUS_COLORS[viewProfile.paymentStatus] || 'badge-default'}`}>{viewProfile.paymentStatus}</span>
                <span className={`badge ${STATUS_COLORS[viewProfile.status] || 'badge-default'}`}>{viewProfile.status}</span>
              </div>
            </div>

            {/* Basic info */}
            <div style={{ marginBottom: '10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Basic Info</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <Field label="Gender" value={viewProfile.profileData?.gender} />
              <Field label="Age" value={calcAge(viewProfile.profileData?.dob)} />
              <Field label="Date of Birth" value={viewProfile.profileData?.dob} />
              <Field label="Marital Status" value={viewProfile.profileData?.maritalStatus} />
            </div>

            {/* Bio data */}
            <div style={{ marginBottom: '10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Bio Data</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <Field label="Religion" value={viewProfile.profileData?.religion} />
              <Field label="Caste" value={viewProfile.profileData?.caste} />
              <Field label="Mother Tongue" value={viewProfile.profileData?.motherTongue} />
              <Field label="Height" value={viewProfile.profileData?.height} />
              <Field label="Education" value={viewProfile.profileData?.education} />
              <Field label="Profession" value={viewProfile.profileData?.profession} />
              <Field label="Annual Income" value={viewProfile.profileData?.annualIncome} />
              <Field label="City" value={viewProfile.profileData?.city} />
              <Field label="State" value={viewProfile.profileData?.state} />
              <Field label="Profile For" value={viewProfile.profileData?.profileFor} />
            </div>

            {viewProfile.profileData?.about && (
              <>
                <div style={{ marginBottom: '10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>About</div>
                <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {viewProfile.profileData.about}
                </div>
              </>
            )}

            {viewProfile.transactionId && (
              <Field label="Transaction ID" value={viewProfile.transactionId} />
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setViewProfile(null); openEdit(viewProfile); }}>✏️ Edit</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewProfile(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ─────────────────────────────────────────────── */}
      {editProfile && (
        <div className="modal-overlay" onClick={() => setEditProfile(null)}>
          <div className="modal" style={{ width: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">✏️ Edit Profile — {editProfile.firstName} {editProfile.lastName}</div>
              <button className="modal-close" onClick={() => setEditProfile(null)}>✕</button>
            </div>

            {saveError && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>⚠️ {saveError}</div>}

            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Profile Status</label>
                <select className="input" value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Payment Status</label>
                <select className="input" value={editForm.paymentStatus} onChange={e => setEditForm(f => ({ ...f, paymentStatus: e.target.value }))}>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditProfile(null)}>Cancel</button>
              <button
                className="btn btn-sm"
                disabled={saving}
                onClick={handleSaveEdit}
                style={{ background: 'var(--brand-primary)', color: '#000', fontWeight: 700, borderRadius: '8px', padding: '6px 18px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? '⏳ Saving…' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ───────────────────────────────────── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" style={{ width: '380px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--danger)' }}>🗑 Delete Profile</div>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Are you sure you want to permanently delete
              </p>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{deleteTarget.email}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '14px', fontWeight: 600 }}>This action cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                style={{ background: 'var(--danger)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? '⏳ Deleting…' : '🗑 Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
