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

router.post('/addRating', async (req, res) => {
    try {
        const { studentName, date, ratings } = req.body;

        const rating = await Rating.findOne({ studentName, date });

        if (rating) {
            ratings.forEach(subjectRating => {
                const subject = rating.subjects.find(sub => sub.name === subjectRating.subject);
                if (subject) {
                    subject.ratings = subjectRating.ratings;
                } else {
                    rating.subjects.push({
                        name: subjectRating.subject,
                        ratings: subjectRating.ratings
                    });
                }
            });

            await rating.save();
        } else {
            const newRating = new Rating({
                date,
                studentName,
                subjects: ratings.map(subjectRating => ({
                    name: subjectRating.subject,
                    ratings: subjectRating.ratings
                }))
            });

            await newRating.save();
        }

        res.json({ message: 'Оцінки успішно додані' });
    } catch (error) {
        console.error('Помилка при додаванні оцінок:', error);
        res.status(500).json({ message: 'Помилка при додаванні оцінок' });
    }
});

router.post('/listSTUDENT', async (req, res) => {
    try {
      const { username } = req.body;
      let usersQuery = User.find({ roles: 'STUDENT' });
      if (username) {
        usersQuery = usersQuery.where('username').equals(username);
      }
      const users = await usersQuery.exec();

      if (!users.length) {
        return res.status(404).json({ message: 'Студентів не знайдено' });
      }

      const studentData = users.map(user => {
        const subjects = Object.keys(user.grades || {});

        return {
          username: user.username,
          subjects
        };
      });
  
      res.json(studentData);
    } catch (error) {
      console.error('Помилка при отриманні списку студентів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку студентів' });
    }
});

router.post('/listTEACHER', async (req, res) => {
    try {
      const { username } = req.body;
      let usersQuery = User.find({ roles: 'TEACHER' });
      if (username) {
        usersQuery = usersQuery.where('username').equals(username);
      }

      const users = await usersQuery.exec();
  
      if (!users.length) {
        return res.status(404).json({ message: 'Вчителя не знайдено' });
      }

      const teacherData = users.map(user => {
        const subjects = Object.keys(user.grades || {});
  
        return {
          username: user.username,
          subjects
        };
      });
  
      res.json(teacherData);
    } catch (error) {
      console.error('Помилка при отриманні списку користувачів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку користувачів' });
    }
});
  
router.post('/deleteSubject', async (req, res) => {
    try {
        const { username, subjectId } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        if (!user.grades[subjectId]) {
            return res.status(404).json({ message: 'Користувач не має такого предмету' });
        }
        await User.updateOne({ username }, { $unset: { [`grades.${subjectId}`]: '' } });
        res.json({ message: 'Предмет успішно видалено' });
    } catch (error) {
        console.error('Помилка при видаленні предмету:', error);
        res.status(500).json({ message: 'Помилка при видаленні предмету' });
    }
});

router.post('/addSubjectToTeacher', async (req, res) => {
    try {
        const { teacherName, subjectName } = req.body;
        const teacher = await User.findOne({ username: teacherName });
        if (!teacher) {
            return res.status(404).json({ message: 'Викладача не знайдено' });
        }
        teacher.grades = {};
        teacher.grades[subjectName] = [];
        await teacher.save();

        return res.json({ message: `Предмет ${subjectName} успішно додано до викладача` });
    } catch (error) {
        console.error('Помилка при додаванні предмета до вчителя:', error);
        res.status(500).json({ message: 'Помилка при додаванні предмета до вчителя' });
    }
});

router.post('/studentsBySubject', async (req, res) => {
    try {
        const { subject } = req.body;   
        const studentsQuery = { roles: 'STUDENT', [`grades.${subject}`]: { $exists: true } };
        const students = await User.find(studentsQuery);
        const studentNames = students.map(student => student.username);
        
        return res.json({ students: studentNames });
    } catch (error) {
        console.error('Помилка при отриманні списку студентів за предметом:', error);
        res.status(500).json({ message: 'Помилка при отриманні списку студентів за предметом' });
    }
});

// Перегляд придметів 
router.get('/subjects', async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.json(subjects);
    } catch (error) {
      console.error('Помилка при отриманні списку предметів:', error);
      res.status(500).json({ message: 'Помилка при отриманні списку предметів' });
    }
});

// Додавання придметів
router.post('/subjects', async (req, res) => {
    try {
      const { name } = req.body;
      const subject = new Subject({ name });
      await subject.save();
      res.status(201).json({ message: 'Предмет успішно додано', subject });
    } catch (error) {
      console.error('Помилка при додаванні предмету:', error);
      res.status(500).json({ message: 'Помилка при додаванні предмету' });
    }
  });

// Видалення предмету
router.delete('/subjects', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Не вказано ім\'я предмету' });
      }
      const deletedSubject = await Subject.findOneAndDelete({ name });
      if (!deletedSubject) {
        return res.status(404).json({ message: 'Предмет не знайдено' });
      }
      res.json({ message: 'Предмет успішно видалено', deletedSubject });
    } catch (error) {
      console.error('Помилка при видаленні предмету:', error);
      res.status(500).json({ message: 'Помилка при видаленні предмету' });
    }
});

// Створення розкладу
router.post('/subjects/schedule', async (req, res) => {
  try {
    const { name, day, time } = req.body;

    if (!name || !day || !time) {
      return res.status(400).json({ message: 'Name, day, and time are required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.schedule.push({ day, time });
    await subject.save();

    res.status(201).json({ message: 'Schedule entry added successfully', subject });
  } catch (error) {
    console.error('Error adding schedule entry:', error);
    res.status(500).json({ message: 'Error adding schedule entry' });
  }
});


// Видалення розкладу
router.delete('/subjects/schedule', async (req, res) => {
  try {
    const { name, day, time } = req.body;

    if (!name || !day || !time) {
      return res.status(400).json({ message: 'Name, day, and time are required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.schedule = subject.schedule.filter(entry => entry.day !== day || entry.time !== time);
    await subject.save();

    res.json({ message: 'Schedule entry removed successfully', subject });
  } catch (error) {
    console.error('Error removing schedule entry:', error);
    res.status(500).json({ message: 'Error removing schedule entry' });
  }
});

// Отримати розклад
router.get('/subjects/schedule', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const subject = await Subject.findOne({ name });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject.schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ message: 'Error getting schedule' });
  }
});

// Створення класу 
router.post('/class', checkRole(['CHIEF-TEACHER']), async (req, res) => {
  try {
      const { name } = req.body;
      const classObj = new Class({ name });
      await classObj.save();
      res.status(201).json({ message: 'Клас успішно доданий' });
  } catch (error) {
      console.error('Помилка при додаванні класу:', error);
      res.status(500).json({ message: 'Помилка при додаванні класу' });
  }
});

// Додавання учня до класу
router.post('/class/add-student', checkRole(['CHIEF-TEACHER']), async (req, res) => {
  try {
      const { className, studentUsername } = req.body;

      const classObj = await Class.findOne({ name: className });
      if (!classObj) {
          return res.status(404).json({ message: 'Клас не знайдено' });
      }

      const student = await User.findOne({ username: studentUsername });
      if (!student) {
          return res.status(404).json({ message: 'Учня не знайдено' });
      }

      if (classObj.students.includes(student._id)) {
          return res.status(400).json({ message: 'Учень вже доданий до цього класу' });
      }

      classObj.students.push(student._id);
      await classObj.save();

      res.status(200).json({ message: 'Учня успішно додано до класу' });
  } catch (error) {
      console.error('Помилка при додаванні учня до класу:', error);
      res.status(500).json({ message: 'Помилка при додаванні учня до класу' });
  }
});

// Видалення класу
router.delete('/class', checkRole(['CHIEF-TEACHER']), async (req, res) => {
  try {
      const { name } = req.body;
      const classObj = await Class.findOneAndDelete({ name });
      if (!classObj) {
          return res.status(404).json({ message: 'Клас не знайдено' });
      }
      await User.updateMany({ class: classObj._id }, { $unset: { class: 1 } });
      res.status(200).json({ message: 'Клас успішно видалено' });
  } catch (error) {
      console.error('Помилка при видаленні класу:', error);
      res.status(500).json({ message: 'Помилка при видаленні класу' });
  }
});

// Отримання всіх класів
router.get('/class', async (req, res) => {
  try {
      const classes = await Class.find().populate('students', 'username _id');
      res.status(200).json(classes);
  } catch (error) {
      console.error('Помилка при отриманні класів:', error);
      res.status(500).json({ message: 'Помилка при отриманні класів' });
  }
});

// Отримання статиски по оцінкам
router.post('/subject/statistics', async (req, res) => {
  try {
    const { username, password, subject } = req.body;
    if (!username || !password || !subject) {
      return res.status(400).json({ message: 'Необхідно вказати username, password та subject' });
    }
    const teacher = await User.findOne({ username, roles: 'TEACHER' });
    if (!teacher) {
      return res.status(400).json({ message: 'Користувач не знайдений' });
    }
    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неправильний пароль' });
    }

    const subjectRatings = await Rating.find({ "subjects.name": subject });

    if (subjectRatings.length === 0) {
      return res.status(404).json({ message: 'Оцінки по цьому предмету не знайдено' });
    }

    const statistics = subjectRatings.reduce((acc, rating) => {
      const subjectData = rating.subjects.find(s => s.name === subject);
      if (subjectData) {
        const date = rating.date.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          studentName: rating.studentName,
          grades: subjectData.ratings
        });
      }
      return acc;
    }, {});

    res.status(200).json(statistics);
  } catch (error) {
    console.error('Помилка при отриманні статистики по оцінках:', error);
    res.status(500).json({ message: 'Помилка при отриманні статистики по оцінках' });
  }
});

// Завантаження PDF файлу
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { username, password, className, subject } = req.body;
    const file = req.file;

    const teacher = await User.findOne({ username, roles: 'TEACHER' });
    if (!teacher) {
      return res.status(400).json({ message: 'Користувач не знайдений або не є вчителем' });
    }

    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неправильний пароль' });
    }

    if (!file) {
      return res.status(400).json({ message: 'Файл не завантажено' });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Можна завантажувати лише PDF файли' });
    }

    const newMaterial = new Material({
      className,
      subject,
      file: file.buffer,
      fileType: file.mimetype,
      fileName: file.originalname,
    });

    await newMaterial.save();
    res.status(200).json({ message: 'Файл успішно завантажено' });
  } catch (error) {
    console.error('Помилка при завантаженні файлу:', error);
    res.status(500).json({ message: 'Помилка при завантаженні файлу' });
  }
});

// Отримання PDF файлів для конкретного класу та предмету або всіх матеріалів
router.get('/materials', async (req, res) => {
  try {
    const { className, subject } = req.query;
    let query = {};

    if (className) {
      query.className = className;
    }
    if (subject) {
      query.subject = subject;
    }

    const materials = await Material.find(query);

    if (materials.length === 0) {
      return res.status(404).json({ message: 'Матеріали не знайдено' });
    }

    res.status(200).json(materials.map(material => ({
      id: material._id,
      className: material.className,
      subject: material.subject,
      fileName: material.fileName,
      fileType: material.fileType,
    })));
  } catch (error) {
    console.error('Помилка при отриманні матеріалів:', error);
    res.status(500).json({ message: 'Помилка при отриманні матеріалів' });
  }
});

// Перегляд PDF файлу
router.get('/material/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ message: 'Матеріал не знайдено' });
    }

    res.contentType(material.fileType);
    res.send(material.file);
  } catch (error) {
    console.error('Помилка при отриманні матеріалу:', error);
    res.status(500).json({ message: 'Помилка при отриманні матеріалу' });
  }
});

// Видалення PDF файлу
router.delete('/material/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return res.status(404).json({ message: 'Матеріал не знайдено' });
    }

    res.status(200).json({ message: 'Матеріал успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні матеріалу:', error);
    res.status(500).json({ message: 'Помилка при видаленні матеріалу' });
  }
});


module.exports = router;