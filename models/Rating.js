const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    date: { type: Date, required: true },
    studentName: { type: String, required: true },
    subjects: [{
        name: { type: String, required: true },
        ratings: [Number]
    }]
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
