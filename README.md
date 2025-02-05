# ECO-BLOG: Environmental Awareness Platform

## Overview

ECO-BLOG is a comprehensive digital platform developed using React and Node.js. It serves as an interactive forum where environmentally conscious individuals can engage in discussions, share ideas, and collaborate on sustainability projects. The platform enables users to create posts, comment on discussions, and interact with others to foster a strong community for environmental awareness.

## Features

- **User-generated content**: Users can create and publish articles on environmental topics.
- **Discussion forums**: Engage in conversations about sustainability and environmental protection.
- **Comment system**: Users can comment on posts and interact with the community.
- **User authentication**: Secure login and registration system with JWT authentication.
- **News updates**: Stay informed with the latest environmental news and developments.
- **Collaboration tools**: Work together on eco-friendly projects and initiatives.
- **Interactive dashboard**: Personalized user experience with saved posts and notifications.
- **Responsive UI**: A mobile-friendly and intuitive interface built using modern web technologies.

## Technologies Used

### Frontend
- React.js
- CSS
- Bootstrap

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB for storing user posts, comments, and user data

### Other Tools
- Redux for state management
- Cloudinary for image hosting

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd eco-blog
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Configure environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   ```
5. Start the development server:
   ```sh
   npm start
   ```

## Project Goals

The primary goal of ECO-BLOG is to build an online forum dedicated to environmental awareness, where users can actively participate in discussions, exchange ideas, and collaborate on sustainability projects. It aims to provide an engaging and interactive space for eco-conscious individuals to make a positive impact.

## Screenshots

*(Add screenshots here)*

## Project Report

For an in-depth understanding of the platform and its development, refer to the full scientific research document (in Ukrainian): **[ECO-BLOG Scientific Report](<link-to-scientific-report>)**

## Competition Participation

This project was developed for the **All-Ukrainian competition "Eko - Tekhno Ukraina 2024"**, the national stage of the **International Science and Engineering Fair (Regeneron ISEF-2024)**.

## Contribution

We welcome contributions! Feel free to submit pull requests or open issues to suggest improvements and new features.

## License

This project is licensed under [Specify License].

---

# Learning Management System

This repository contains the API code for a Learning Management System built using Node.js and Express. The API allows managing students, teachers, subjects, classes, schedules, and related operations such as adding and retrieving grades, managing learning materials, and more.

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

*(All API endpoints are the same as in the Ukrainian version above.)*

## Contribution

Contributions are welcome! Please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Competition Information

This project was prepared for the **All-Ukrainian competition "Eko - Tekhno Ukraina 2024"**, the national stage of the **International Science and Engineering Fair (Regeneron ISEF-2024)**. However, due to poor teamwork, we divided responsibilities: my teammates were responsible for the frontend while I handled the backend. I completed my part, but they did not finish theirs.
