const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  price: { type: Number, required: true },
  data_id: { type: Number, required: true },
  image: { type: String, required: true }, // добавьте поле image
  specifications: { type: Object, default: {} },
  // другие поля, если есть
});

module.exports = mongoose.model('Monitor', monitorSchema);

