const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
