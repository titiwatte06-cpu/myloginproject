import express from 'express'
import bcrypt from 'bcrypt'
import User from '../data/user.model.js'
import { requireAuth } from './auth-utils.js'

const router = express.Router()

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    const user = await User.findById(req.auth.id).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account does not have a password yet' })
    }

    const isMatch = await bcrypt.compare(currentPassword || '', user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
