const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', loanController.getAll);
router.get('/pending', loanController.getPending);
router.get('/notpending', loanController.getNotPending);
router.get('/:id', loanController.getById);
router.post('/', loanController.create);
router.put('/:id', loanController.update);
router.delete('/:id', loanController.delete);
router.put('/accept/:id', loanController.accept);

module.exports = router;
