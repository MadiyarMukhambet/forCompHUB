// models/Mouse.js
const mongoose = require('mongoose');

const GenericProductSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    price: { type: Number },
    data_id: { type: Number },
    title: { type: String },
    specifications: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Mouse', GenericProductSchema);
