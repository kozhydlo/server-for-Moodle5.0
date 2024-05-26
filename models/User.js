const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
    grades: {
        Матиматика: [{ type: Number }],
        Хімія: [{ type: Number }],
        Біологія: [{ type: Number }],
        Зарубіжна_література: [{ type: Number }],
        Українська_мова: [{ type: Number }],
        Фізика: [{ type: Number }],
        Музика: [{ type: Number }],
        Інформатика: [{ type: Number }],
    },
    class: { type: Schema.Types.ObjectId, ref: 'Class' }
});

module.exports = model('User', UserSchema);
