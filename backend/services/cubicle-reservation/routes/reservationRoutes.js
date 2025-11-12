const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations, getUserReservations, deleteReservation, getReservationById, getPending, getNotPending, acceptReservation } = require('../controllers/reservationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getAllReservations);
router.get('/pending', verifyToken, getPending);
router.put('/pending/:reservationId', verifyToken, acceptReservation);
router.get('/notpending', verifyToken, getNotPending);
router.get('/:reservationId', verifyToken, getReservationById);
router.get('/user/', verifyToken, getUserReservations);
router.post('/create', verifyToken, createReservation);
router.delete('/delete', verifyToken, deleteReservation);

module.exports = router;
