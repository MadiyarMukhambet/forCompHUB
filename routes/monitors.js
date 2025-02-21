// routes/monitors.js
const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', monitorController.getAll);
router.get('/:id', monitorController.getById);
router.post('/', monitorController.create);
router.put('/:id', monitorController.update);
router.delete('/:id', monitorController.remove);

module.exports = router;
