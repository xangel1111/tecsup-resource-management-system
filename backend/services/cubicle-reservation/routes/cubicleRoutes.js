const express = require('express');
const router = express.Router();
const { getCubicles, getAvailableCubicles } = require('../controllers/cubicleController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getCubicles);
router.get('/available', verifyToken, getAvailableCubicles);

module.exports = router;
