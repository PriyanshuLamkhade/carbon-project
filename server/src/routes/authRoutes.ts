import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../index.js';
import type { AuthRequest } from '../middleware/auth.js';

const authRouter = express.Router();

// Login route
authRouter.post('/login', async (req, res) => {
  try {
    const { pubkey, signature } = req.body;

    // Verify signature (implement your signature verification logic)
    // For now, we'll just check if user exists
    const user = await db.user.findUnique({
      where: { pubkey },
      select: { userId: true, pubkey: true, role: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      user: {
        userId: user.userId,
        pubkey: user.pubkey,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
authRouter.get('/me', async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ user: req.user });
});

export default authRouter;