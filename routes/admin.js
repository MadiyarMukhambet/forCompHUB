const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getUsersPage);
router.get('/users/create', adminController.getCreateUserPage);
router.post('/users', adminController.createUser);
router.get('/users/:id/edit', adminController.getEditUserPage);
router.put('/users/:id', adminController.updateUser);
router.get('/users/:id/delete', adminController.deleteUser);

module.exports = router;