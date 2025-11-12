const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.home);

router.post('/login', authController.login);

router.get('/user/:id', authController.getUserById);
router.get('/users', authController.getUsers);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

router.get('/logout', authController.logout);

module.exports = router;
