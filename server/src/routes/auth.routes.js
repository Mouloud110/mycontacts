const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'email and password (>=6) required' });
    }
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    
    // Générer le token JWT après création
    const token = jwt.sign(
      { sub: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({ 
      token,
      user: {
        id: user._id,
        email: user.email, 
        createdAt: user.createdAt 
      }
    });
  } catch (e) {
    console.error(e);
    
    // Si c'est une erreur de validation Mongoose
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data', errors: e.errors });
    }
    
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { sub: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return res.json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user._id, email: user.email, createdAt: user.createdAt });
});

module.exports = router;