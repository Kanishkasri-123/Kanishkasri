import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import ITTraining from './pages/services/ITTraining'
import GlobalMatrimony from './pages/services/GlobalMatrimony'
import MeditationSpirituality from './pages/services/MeditationSpirituality'
import RealEstate from './pages/services/RealEstate'
import AbroadConsultancy from './pages/services/AbroadConsultancy'
import PremiumGroceries from './pages/services/PremiumGroceries'

function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="admin-main" style={{ marginLeft: sidebarCollapsed ? '70px' : 'var(--sidebar-width)' }}>
        <Topbar sidebarCollapsed={sidebarCollapsed} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <AdminLayout><Users /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/it-training" element={
            <ProtectedRoute>
              <AdminLayout><ITTraining /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/global-matrimony" element={
            <ProtectedRoute>
              <AdminLayout><GlobalMatrimony /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/meditation" element={
            <ProtectedRoute>
              <AdminLayout><MeditationSpirituality /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/real-estate" element={
            <ProtectedRoute>
              <AdminLayout><RealEstate /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/abroad-consultancy" element={
            <ProtectedRoute>
              <AdminLayout><AbroadConsultancy /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/services/premium-groceries" element={
            <ProtectedRoute>
              <AdminLayout><PremiumGroceries /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  )
}
