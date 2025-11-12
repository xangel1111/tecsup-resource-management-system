const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { verifyToken } = require('../middlewares/authMiddleware');

function unless(path, middleware) {
  return function(req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

router.use(unless('/openai', verifyToken));

router.get('/openai', equipmentController.getAllForOpenAI);

router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);
router.post('/', equipmentController.create);
router.put('/:id', equipmentController.update);
router.delete('/:id', equipmentController.delete);

module.exports = router;
