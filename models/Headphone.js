const mongoose = require('mongoose');

const GenericProductSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    price: { type: Number },
    data_id: { type: Number },
    image: { type: String }, // Новое поле image для URL изображения
    specifications: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Headphone', GenericProductSchema);

