const mongoose = require('mongoose');

const GenericProductSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    price: { type: Number },
    data_id: { type: Number, unique: true, index: true }, 
    image: { type: String },
    specifications: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Microphone', GenericProductSchema);


