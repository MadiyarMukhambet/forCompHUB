const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');
const requireAuth = require('../middleware/requireAuth');
const adminMiddleware = require('../middleware/adminMiddleware');

// Применяем middleware для всех маршрутов
router.use(requireAuth);
router.use(adminMiddleware);

/*
  Работаем с товарами для выбранной категории.
  Админ выбирает категорию через query-параметр (например, ?category=monitors)
*/
router.get('/products', adminProductController.getProducts);
router.get('/products/create', adminProductController.getCreateProductPage);
router.post('/products', adminProductController.createProduct);
router.get('/products/:id/edit', adminProductController.getEditProductPage);
router.put('/products/:id', adminProductController.updateProduct);
router.delete('/products/:id', adminProductController.deleteProduct);

module.exports = router;


