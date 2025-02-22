const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  price: { type: Number, required: true },
  data_id: { type: Number, required: true, unique: true, index: true }, 
  image: { type: String, required: true },
  specifications: { type: Object, default: {} }
});

module.exports = mongoose.model('Monitor', monitorSchema);


