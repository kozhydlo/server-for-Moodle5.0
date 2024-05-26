const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subject: { type: String, required: true },
  file: { type: Buffer, required: true },
  fileType: { type: String, required: true },
  fileName: { type: String, required: true },
});

module.exports = mongoose.model('Material', MaterialSchema);
