const { Schema, model } = require('mongoose');

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  schedule: [
    {
      day: { type: String, required: true }, 
      time: { type: String, required: true } 
    }
  ]
});

module.exports = model('Subject', SubjectSchema);
