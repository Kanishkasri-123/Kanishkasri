/**
 * admin.routes.js
 * Admin-only API endpoints.
 * All routes require valid JWT with role === 'admin'.
 */

const { Router } = require('express')
const router = Router()
const adminAuthMiddleware = require('../middlewares/adminAuth.middleware')
const userRepo = require('../repositories/user.repository')
const matrimonyRepo = require('../repositories/matrimony.repository')

// Apply admin auth to all routes in this file
router.use(adminAuthMiddleware)

/**
 * GET /api/admin/users
 * Returns all users (without passwordHash)
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await userRepo.findAll()
    const safeUsers = users.map(({ passwordHash, ...u }) => u)
    res.json({ success: true, data: safeUsers })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/matrimony-profiles
 * Returns all matrimony profiles (without passwordHash)
 */
router.get('/matrimony-profiles', async (req, res, next) => {
  try {
    const profiles = await matrimonyRepo.findAll()
    const safeProfiles = profiles.map(({ passwordHash, ...p }) => p)
    res.json({ success: true, data: safeProfiles })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/stats
 * Returns aggregate counts for the dashboard
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [users, profiles] = await Promise.all([
      userRepo.findAll(),
      matrimonyRepo.findAll()
    ])
    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        adminUsers: users.filter(u => u.role === 'admin').length,
        regularUsers: users.filter(u => u.role === 'user').length,
        totalMatrimonyProfiles: profiles.length,
        activeMatrimonyProfiles: profiles.filter(p => p.status === 'active').length,
        paidMatrimonyProfiles: profiles.filter(p => p.paymentStatus === 'paid').length,
      }
    })
  } catch (err) {
    next(err)
  }
})

/**
 * DELETE /api/admin/users/:id
 * Delete a user by ID (cannot delete yourself or last admin)
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    // Prevent deleting your own account
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' })
    }
    const deleted = await userRepo.deleteById(id)
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    res.json({ success: true, message: 'User deleted successfully.' })
  } catch (err) {
    next(err)
  }
})

/**
 * DELETE /api/admin/matrimony-profiles/:id
 * Hard-delete a matrimony profile
 */
router.delete('/matrimony-profiles/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await matrimonyRepo.deleteById(id)
    if (!deleted) return res.status(404).json({ success: false, message: 'Profile not found.' })
    res.json({ success: true, message: 'Profile deleted successfully.' })
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/admin/matrimony-profiles/:id
 * Update status or paymentStatus of a matrimony profile
 */
router.patch('/matrimony-profiles/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, paymentStatus, profileData } = req.body
    const updates = {}
    if (status) updates.status = status
    if (paymentStatus) updates.paymentStatus = paymentStatus
    if (profileData) updates.profileData = profileData
    const updated = await matrimonyRepo.updateById(id, updates)
    if (!updated) return res.status(404).json({ success: false, message: 'Profile not found.' })
    res.json({ success: true, message: 'Profile updated.', data: updated })
  } catch (err) {
    next(err)
  }
})

module.exports = router
