# Learning Process Management System

This repository contains the code for an API designed for a learning process management system, built using Node.js and Express. The API enables management of students, teachers, subjects, classes, schedules, and related operations such as adding and retrieving grades, managing materials, and more.

> This documentation was created as part of a Ukrainian national competition project in a dedicated team.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kozhydlo/server-for-Moodle5.0.git
cd server-for-Moodle5.0
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your environment variables. Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```bash
npm start
```

## API Endpoints

### User and Authentication Endpoints

- **Add Rating**
  - **URL:** `/addRating`
  - **Method:** `POST`
  - **Description:** Adds or updates grades for a student.
  - **Request Body Parameters:**
    - `studentName`: String
    - `date`: Date (YYYY-MM-DD)
    - `ratings`: Array of objects containing subject and ratings

- **List Students**
  - **URL:** `/listSTUDENT`
  - **Method:** `POST`
  - **Description:** Retrieves a list of students.
  - **Request Body Parameters:**
    - `username`: String (optional)

- **List Teachers**
  - **URL:** `/listTEACHER`
  - **Method:** `POST`
  - **Description:** Retrieves a list of teachers.
  - **Request Body Parameters:**
    - `username`: String (optional)

- **Delete Student Subject**
  - **URL:** `/deleteSubject`
  - **Method:** `POST`
  - **Description:** Deletes a subject from a student.
  - **Request Body Parameters:**
    - `username`: String
    - `subjectId`: String

- **Add Subject to Teacher**
  - **URL:** `/addSubjectToTeacher`
  - **Method:** `POST`
  - **Description:** Assigns a subject to a teacher.
  - **Request Body Parameters:**
    - `teacherName`: String
    - `subjectName`: String

- **List Students by Subject**
  - **URL:** `/studentsBySubject`
  - **Method:** `POST`
  - **Description:** Retrieves students enrolled in a specific subject.
  - **Request Body Parameters:**
    - `subject`: String

### Subject Endpoints

- **Get All Subjects**
  - **URL:** `/subjects`
  - **Method:** `GET`
  - **Description:** Retrieves a list of all subjects.

- **Add Subject**
  - **URL:** `/subjects`
  - **Method:** `POST`
  - **Description:** Adds a new subject.
  - **Request Body Parameters:**
    - `name`: String

- **Delete Subject**
  - **URL:** `/subjects`
  - **Method:** `DELETE`
  - **Description:** Deletes a subject.
  - **Request Body Parameters:**
    - `name`: String

### Schedule Endpoints

- **Add Schedule Entry**
  - **URL:** `/subjects/schedule`
  - **Method:** `POST`
  - **Description:** Adds a schedule entry for a subject.
  - **Request Body Parameters:**
    - `name`: String
    - `day`: String
    - `time`: String

- **Delete Schedule Entry**
  - **URL:** `/subjects/schedule`
  - **Method:** `DELETE`
  - **Description:** Deletes a schedule entry for a subject.
  - **Request Body Parameters:**
    - `name`: String
    - `day`: String
    - `time`: String

- **Get Schedule**
  - **URL:** `/subjects/schedule`
  - **Method:** `GET`
  - **Description:** Retrieves the schedule for a subject.
  - **Request Body Parameters:**
    - `name`: String

### Class Endpoints

- **Create Class**
  - **URL:** `/class`
  - **Method:** `POST`
  - **Description:** Creates a new class.
  - **Request Body Parameters:**
    - `name`: String

- **Add Student to Class**
  - **URL:** `/class/add-student`
  - **Method:** `POST`
  - **Description:** Adds a student to a class.
  - **Request Body Parameters:**
    - `className`: String
    - `studentUsername`: String

- **Delete Class**
  - **URL:** `/class`
  - **Method:** `DELETE`
  - **Description:** Deletes a class.
  - **Request Body Parameters:**
    - `name`: String

- **Get All Classes**
  - **URL:** `/class`
  - **Method:** `GET`
  - **Description:** Retrieves a list of all classes.

### Rating Endpoints

- **Get Subject Statistics**
  - **URL:** `/subject/statistics`
  - **Method:** `POST`
  - **Description:** Retrieves grade statistics for a subject.
  - **Request Body Parameters:**
    - `username`: String
    - `password`: String
    - `subject`: String

### Material Endpoints

- **Upload PDF**
  - **URL:** `/upload`
  - **Method:** `POST`
  - **Description:** Uploads a PDF file.
  - **Request Body Parameters:**
    - `username`: String
    - `password`: String
    - `className`: String
    - `subject`: String
    - `file`: PDF file

- **Get Materials**
  - **URL:** `/materials`
  - **Method:** `GET`
  - **Description:** Retrieves materials for a specific class and subject.
  - **Request Query Parameters:**
    - `className`: String (optional)
    - `subject`: String (optional)

- **View PDF**
  - **URL:** `/material/:id`
  - **Method:** `GET`
  - **Description:** Views a specific PDF file by ID.

- **Delete PDF**
  - **URL:** `/material/:id`
  - **Method:** `DELETE`
  - **Description:** Deletes a specific PDF file by ID.

## Middleware

The API uses several middleware functions for various functionalities:
- `authMiddleware`: For user authentication.
- `roleMiddleware`: For user authorization based on roles.
- `checkRole`: For checking specific roles for certain routes.

## Models

The API uses the following models:
- `User`: Manages user information.
- `Rating`: Stores student grades.
- `Subject`: Manages subjects.
- `Class`: Manages classes.
- `Material`: Stores uploaded PDF materials.

## Contribution

Contributions are welcome! Please create an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
