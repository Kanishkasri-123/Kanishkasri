import React, { useState, useEffect } from 'react'
import { X, Upload, PlusCircle, CheckCircle, Search, Filter } from 'lucide-react'

const ORDERS = []

const STATUS_COLORS = {
  'in-stock': 'badge-success',
  'low-stock': 'badge-warning',
  'out-of-stock': 'badge-danger',
  delivered: 'badge-success',
  processing: 'badge-warning',
  shipped: 'badge-info',
  pending: 'badge-default',
}

export default function PremiumGroceries() {
  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [products, setProducts] = useState([])
  const [loadingContent, setLoadingContent] = useState(true)

  // Seller Central Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'Organic Vegetables', 
    mrp: '', selling_price: '', weight: '', stock: '', description: '', tags: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/groceries/products')
      const data = await res.json()
      if (data.success) setProducts(data.data)
    } finally {
      setLoadingContent(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const fd = new FormData()
    Object.keys(formData).forEach(k => fd.append(k, formData[k]))
    if (imageFile) fd.append('image', imageFile)

    try {
      const res = await fetch('http://localhost:5000/api/groceries/products', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
        setIsModalOpen(false)
        setFormData({name: '', brand: '', category: 'Organic Vegetables', mrp: '', selling_price: '', weight: '', stock: '', description: '', tags: ''})
        setImageFile(null)
        setImagePreview(null)
      } else {
        alert(data.message)
      }
    } catch(err) {
      alert('Error connecting to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchCat
  })

  const filteredOrders = ORDERS.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Products', value: products.length, icon: '🛒', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'In Stock', value: products.filter(p => p.stock > 10).length, icon: '✅', color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Low Stock', value: products.filter(p => p.stock > 0 && p.stock <= 10).length, icon: '⚠️', color: 'var(--brand-primary)', bg: 'var(--warning-bg)' },
    { label: 'Total Orders', value: ORDERS.length, icon: '📦', color: 'var(--info)', bg: 'var(--info-bg)' },
  ]

  return (
    <div>
      <div className="service-hero">
        <div className="service-hero-icon">🛒</div>
        <div className="service-hero-text">
          <h1>Premium Groceries</h1>
          <p>Manage organic product inventory, customer orders, and delivery tracking.</p>
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
        <button className={`tab-btn${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>🥗 Products</button>
        <button className={`tab-btn${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>📦 Orders</button>
      </div>

      {tab === 'products' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Product Inventory</div>
              <div className="card-subtitle">{filteredProducts.length} products</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ width: '200px' }}>
                <span style={{ color: 'var(--text-muted)' }}>🔍</span>
                <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input" style={{ width: '170px' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                ))}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>+ Add Product</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th>Stock</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingContent ? <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading products...</td></tr> : filteredProducts.length === 0 ? <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No products cataloged yet.</td></tr> : filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {p.image_url ? <img src={`http://localhost:5000${p.image_url}`} alt={p.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /> : <div style={{width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px'}} />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                    <td>
                        <div style={{ fontWeight: 600, color: '#10b981' }}>₹{p.selling_price}</div>
                        {parseFloat(p.discount_percent) > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.mrp}</div>}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.875rem', fontWeight: p.stock < 10 ? 700 : 400, color: p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? 'var(--warning)' : 'var(--text-primary)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.weight}</td>
                    <td><span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Customer Orders</div>
              <div className="card-subtitle">{filteredOrders.length} orders</div>
            </div>
            <div className="search-bar" style={{ width: '200px' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔍</span>
              <input placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{o.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>{o.customer[0]}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{o.customer}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.items} items</td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>{o.total}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.date}</td>
                    <td><span className={`badge ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SELLER CENTRAL ADD PRODUCT MODAL ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#111827' }}>Add New Product</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Fill in the details to list a new item in your grocery catalog.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} id="sellerproductform">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '30px' }}>
                  {/* Left Column - Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Basic Info Box */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '0 0 16px 0' }}>Basic Information</h3>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Product Title *</label>
                        <input className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Farm Fresh Organic Avocados" style={{ width: '100%' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Brand / Farm</label>
                          <input className="input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g., Heritage Farms" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Category *</label>
                          <select className="input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%' }}>
                            <option>Organic Vegetables</option>
                            <option>Fresh Fruits</option>
                            <option>Dairy & Eggs</option>
                            <option>Whole Grains</option>
                            <option>Cold Pressed Oils</option>
                            <option>Exotic Spices</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pricing box */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '0 0 16px 0' }}>Pricing & Inventory</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>MRP (₹) *</label>
                          <input className="input" type="number" required value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} placeholder="100" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Selling Price (₹) *</label>
                          <input className="input" type="number" required value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} placeholder="85" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Stock Quantity *</label>
                          <input className="input" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="50" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Specs Box */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '0 0 16px 0' }}>Description</h3>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Weight / Unit (e.g. 500g, 1L)</label>
                        <input className="input" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 500g" style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Detailed Description</label>
                        <textarea className="input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Write compelling details about the product..." style={{ width: '100%', resize: 'none' }}></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Media */}
                  <div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#f9fafb', height: '100%' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '0 0 16px 0' }}>Product Image</h3>
                      
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '30px 10px', textAlign: 'center', cursor: 'pointer', background: '#fff', position: 'relative', overflow: 'hidden', height: '240px' }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <Upload size={32} color="#94a3b8" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Click to upload image</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>PNG, JPG up to 5MB</span>
                          </>
                        )}
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                      </label>
                      {imagePreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button type="button" onClick={() => {setImageFile(null); setImagePreview(null)}} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Remove Image</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" form="sellerproductform" disabled={isSubmitting} style={{ padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '6px', fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSubmitting ? 'Saving...' : <><PlusCircle size={16} /> Publish Listing</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
