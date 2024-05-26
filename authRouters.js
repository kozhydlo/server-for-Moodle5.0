const Router = require('express');
const router = new Router();
const config = require('./config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Rating = require('./models/Rating');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Class = require('./models/Class');
const controller = require('./authController');
const { check } = require("express-validator");
const authMiddleware = require('./middlewaree/authMiddleware');
const roleMiddleware = require('./middlewaree/roleMiddleware');
const checkRole = require('./middlewaree/checkRole');
const Material = require('./models/Material');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/registration', [
  check('username', "імя не може бути пустим").notEmpty(),
  check('password', "Пароль повинен бути більше 4 і менше 10 символів").isLength({min:4, max:10}),
  check('roles').optional().isIn(['CHIEF-TEACHER', 'TEACHER', 'STUDENT']),
  check('className').optional().isString()
], async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, roles, className } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
          username,
          password: hashedPassword,
          roles
      });

      if (roles.includes('STUDENT') && className) {
          const classObj = await Class.findOneAndUpdate(
              { name: className },
              { $push: { students: user._id } },
              { new: true, upsert: true }
          );
          user.class = classObj._id;
      }

      await user.save();

      if (roles.includes('TEACHER') || roles.includes('CHIEF-TEACHER')) {
          user.grades = [];
          await user.save();
      }

      return res.status(201).json({ message: 'Користувач успішно зареєстрований' });
  } catch (error) {
      console.error('Помилка при реєстрації користувача:', error);
      res.status(500).json({ message: 'Помилка при реєстрації користувача' });
  }
});
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["CHIEF-TEACHER"]), controller.getUsers)
router.post('/personalCabinet', async (req, res) => {
    try {
        const { username } = req.body;

        const ratings = await Rating.find({ studentName: username });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'Оцінок користувача не знайдено' });
        }

        const progress = ratings.map(rating => ({
            date: rating.date,
            subjects: rating.subjects.map(subject => ({
                name: subject.name,
                ratings: subject.ratings
            }))
        }));

        res.json({ progress });
    } catch (error) {
        console.error('Помилка при отриманні прогресу:', error);
        res.status(500).json({ message: 'Помилка при отриманні прогресу' });
    }
});

module.exports = router;