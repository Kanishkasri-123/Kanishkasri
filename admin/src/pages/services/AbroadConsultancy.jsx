import React, { useState, useEffect } from 'react';

const STATUS_COLORS = {
  new: 'badge-info',
  'in-progress': 'badge-warning',
  'documents-pending': 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
}

const STATUS_LABELS = {
  new: '🆕 New',
  'in-progress': '⏳ In Progress',
  'documents-pending': '📄 Docs Pending',
  approved: '✅ Approved',
  rejected: '❌ Rejected',
}

export default function AbroadConsultancy() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(null);

  const [tab, setTab] = useState('applications');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destFilter, setDestFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/abroad/enquiries');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Error fetching abroad enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdateLoading(id);
    try {
      const res = await fetch(`http://localhost:5000/api/abroad/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const filtered = applications.filter(a => {
    const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || (a.country && a.country.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchDest = destFilter === 'all' || a.country === destFilter;
    return matchSearch && matchStatus && matchDest;
  });

  const uniqueDestinations = [...new Set(applications.filter(a => a.country).map(a => a.country))];
  const DESTINATIONS = uniqueDestinations.map(d => {
      const appsForDest = applications.filter(a => a.country === d);
      return { country: d, icon: '🌍', applications: appsForDest.length, approved: appsForDest.filter(a => a.status === 'approved').length };
  });

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: '📋', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'In Progress', value: applications.filter(a => a.status === 'in-progress').length, icon: '⏳', color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, icon: '✅', color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Destinations', value: uniqueDestinations.length, icon: '🌍', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="service-hero">
        <div className="service-hero-icon">✈️</div>
        <div className="service-hero-text">
          <h1>Abroad Consultancy</h1>
          <p>Manage visa applications, study abroad programs, and international consultancy cases.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-nav">
        <button className={`tab-btn${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>📋 Applications</button>
        <button className={`tab-btn${tab === 'destinations' ? ' active' : ''}`} onClick={() => setTab('destinations')}>🌍 Destinations</button>
      </div>

      {tab === 'applications' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Visa & Study Applications</div>
              <div className="card-subtitle">{filtered.length} applications</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ width: '190px' }}>
                <span style={{ color: 'var(--text-muted)' }}>🔍</span>
                <input placeholder="Search name…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input" style={{ width: '150px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="documents-pending">Docs Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="input" style={{ width: '140px' }} value={destFilter} onChange={e => setDestFilter(e.target.value)}>
                <option value="all">All Countries</option>
                {uniqueDestinations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Destination/Date</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>{(a.firstName || 'A')[0]}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{a.firstName} {a.lastName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                        <div style={{ fontWeight: 500 }}>{a.country || 'Not Set'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.preferredDate} {a.preferredTime}</div>
                    </td>
                    <td>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.phone}</div>
                    </td>
                    <td><span className={`badge ${STATUS_COLORS[a.status]}`}>{STATUS_LABELS[a.status]}</span></td>
                    <td>
                      <select 
                        className="input" 
                        style={{ width: '120px', padding: '4px 8px', fontSize: '0.8rem' }}
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                        disabled={updateLoading === a.id}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="documents-pending">Docs Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'destinations' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {DESTINATIONS.map(d => {
              const successRate = Math.round((d.approved / d.applications) * 100)
              return (
                <div key={d.country} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>{d.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.country}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.applications} applications</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Approvals</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>{d.approved}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Success Rate</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: successRate >= 70 ? 'var(--success)' : 'var(--warning)' }}>{successRate}%</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${successRate}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '2px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
