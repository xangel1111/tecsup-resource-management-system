const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware')

router.get('/public', (req, res) => { 
  res.json({ message: 'Public route (no jwt required)'});
});

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  })
});

router.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: "You don't have admin permissions" });
  }
  res.json({ message: 'Access granted to admin route' });
});

module.exports = router;