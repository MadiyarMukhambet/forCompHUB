const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            refPath: 'items.onModel' 
        },
        onModel: { 
            type: String, 
            required: true, 
            enum: ['Monitor', 'Mouse', 'Microphone', 'Headphone', 'Keyboard'] 
          },          
        quantity: { type: Number, required: true, default: 1 }
    }],
    total: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['cart', 'pending', 'completed'], default: 'cart' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
