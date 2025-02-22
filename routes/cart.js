const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Импорт моделей продуктов (ключи соответствуют нижнему регистру значений из формы)
const ProductModels = {
    headphones: require('../models/Headphone'),
    keyboards: require('../models/Keyboard'),
    microphones: require('../models/Microphone'),
    monitors: require('../models/Monitor'),
    mice: require('../models/Mouse')
};

// Маппинг для преобразования значения категории из формы в формат перечисления
const categoryMapForEnum = {
    monitors: 'Monitor',
    mice: 'Mouse',
    microphones: 'Microphone',
    headphones: 'Headphone',
    keyboards: 'Keyboard'
};

// Маппинг для преобразования значения enum (например, "Monitor") в ключ для ProductModels (например, "monitors")
const enumToModelKey = {
    Monitor: 'monitors',
    Mouse: 'mice',
    Microphone: 'microphones',
    Headphone: 'headphones',
    Keyboard: 'keyboards'
};

const requireAuth = require('../middleware/requireAuth');

// Добавление товара в корзину
router.post('/add', requireAuth, async (req, res) => {
    try {
        const { productId, category, quantity } = req.body;
        console.log("Received category from form:", category); // Debug
        const qty = quantity ? parseInt(quantity) : 1;

        // Преобразуем значение категории с помощью маппинга
        const formattedCategory = categoryMapForEnum[category];
        console.log("Converted category:", formattedCategory); // Debug

        if (!formattedCategory) {
            return res.status(400).send('Invalid product category');
        }

        // Получаем модель продукта по ключу (значение из формы в нижнем регистре)
        const Product = ProductModels[category];
        if (!Product) {
            return res.status(400).send('Invalid product category');
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Ищем уже существующую корзину (со статусом "cart") для пользователя
        let order = await Order.findOne({ user: req.user._id, status: 'cart' });
        if (!order) {
            order = new Order({ user: req.user._id, items: [], total: 0, status: 'cart' });
        }

        // Если товар уже есть в корзине, увеличиваем его количество
        const existingItem = order.items.find(item =>
            item.product.toString() === productId && item.onModel === formattedCategory
        );
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            order.items.push({ product: productId, onModel: formattedCategory, quantity: qty });
        }

        // Пересчитываем общую сумму
        order.total += product.price * qty;
        await order.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Обновление количества товара в корзине
router.post('/update', requireAuth, async (req, res) => {
    try {
        const { productId, category, quantity } = req.body;
        const qty = parseInt(quantity);
        if (qty < 1) {
            // Если количество меньше 1, перенаправляем без изменений
            return res.redirect('/cart');
        }

        let order = await Order.findOne({ user: req.user._id, status: 'cart' });
        if (!order) {
            return res.redirect('/cart');
        }

        // Обновляем количество для подходящего товара
        const item = order.items.find(item =>
            item.product.toString() === productId && item.onModel.toLowerCase() === category
        );
        if (item) {
            item.quantity = qty;
        }

        // Пересчитываем общую сумму для всех товаров
        let newTotal = 0;
        for (let cartItem of order.items) {
            // Получаем правильный ключ модели из enumToModelKey
            const modelKey = enumToModelKey[cartItem.onModel];
            const Product = ProductModels[modelKey];
            if (Product) {
                const prod = await Product.findById(cartItem.product);
                newTotal += prod.price * cartItem.quantity;
            }
        }
        order.total = newTotal;

        await order.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Удаление товара из корзины
router.post('/delete', requireAuth, async (req, res) => {
    try {
        const { productId, category } = req.body;
        let order = await Order.findOne({ user: req.user._id, status: 'cart' });
        if (!order) {
            return res.redirect('/cart');
        }

        // Удаляем товар, соответствующий productId и категории
        order.items = order.items.filter(item =>
            !(item.product.toString() === productId && item.onModel.toLowerCase() === category)
        );

        // Пересчитываем общую сумму
        let newTotal = 0;
        for (let cartItem of order.items) {
            const modelKey = enumToModelKey[cartItem.onModel];
            const Product = ProductModels[modelKey];
            if (Product) {
                const prod = await Product.findById(cartItem.product);
                newTotal += prod.price * cartItem.quantity;
            }
        }
        order.total = newTotal;

        await order.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Отображение корзины
router.get('/', requireAuth, async (req, res) => {
    try {
        let order = await Order.findOne({ user: req.user._id, status: 'cart' })
            .populate('items.product');
        res.render('cart', { order });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
