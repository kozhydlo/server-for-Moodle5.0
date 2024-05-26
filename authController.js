const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
    const payload = {
        id, 
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" });
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Помилка при реєстрації", errors: errors.array() });
            }
            
            const { username, password, role } = req.body;
            const candidate = await User.findOne({ username });
    
            if (candidate) {
                return res.status(400).json({ message: "Користувач з таким іменем вже існує" });
            }
    
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: role || "USER" });
    
            let grades = {};
            if (userRole.value === "USER") {
                grades = {
                    math: [],
                    physics: [],
                    chemistry: []
                };
            }
    
            const user = new User({ username, password: hashPassword, roles: [userRole.value], grades });
    
            await user.save();
            return res.json({ message: "Користувач був успішно зареєстрований" });
        } catch (e) {
            console.log(e);
            res.status(400).json('Помилка реєстрації');
        } 
    } 
    
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Користувач ${username} не знайдений` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: `Введений не вірний пароль` })
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({ token })
        } catch (e) {
            console.log(e)
            res.status(400).json('Помилка авторизації')
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json('Помилка отримання списку користувачів')
        }
    }
}

module.exports = new AuthController();
