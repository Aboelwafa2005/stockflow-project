const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  address: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
