// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Массив заказанных товаров. Каждый элемент содержит идентификатор товара, категорию и количество.
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
