const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true }, // Добавлено email
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Добавлена role
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('User', UserSchema);    