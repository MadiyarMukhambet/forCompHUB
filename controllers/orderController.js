// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
    try {
        // Ожидается, что в теле запроса придут: { items: [{ productId, category, quantity }], total }
        const { items, total } = req.body;
        const userId = req.user.id; // authMiddleware устанавливает req.user
        
        const order = new Order({ user: userId, items, total });
        await order.save();
        
        // Сохраняем идентификатор заказа в массиве заказов пользователя
        await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
        
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).lean().exec();
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
