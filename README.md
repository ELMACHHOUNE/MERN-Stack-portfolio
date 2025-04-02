# MERN Stack Portfolio

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a dark mode, admin dashboard, and dynamic content management.

## Features

- 🌙 Dark/Light Mode Toggle
- 📱 Fully Responsive Design
- 🔐 Secure Authentication System
- 👨‍💼 Admin Dashboard
- 📊 Dynamic Content Management
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast Performance
- 🔒 Protected Admin Routes
- 📝 Contact Form
- 🎯 Skills Management
- 📁 Project Management
- 📚 Experience Management
- 📋 Category Management

## Tech Stack

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Context API
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose
- CORS
- Express Validator

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/MERN-Stack-portfolio.git
cd MERN-Stack-portfolio
```

2. Install dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

## Project Structure

```
MERN-Stack-portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout user

### Admin

- GET /api/auth/admin/users - Get all users
- PUT /api/auth/admin/users/:id - Update user
- DELETE /api/auth/admin/users/:id - Delete user

### Skills

- GET /api/skills - Get all skills
- POST /api/skills - Create new skill
- PUT /api/skills/:id - Update skill
- DELETE /api/skills/:id - Delete skill

### Projects

- GET /api/projects - Get all projects
- POST /api/projects - Create new project
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Categories

- GET /api/categories - Get all categories
- POST /api/categories - Create new category
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

## Contact

Mohamed EL MACHHOUNE - [@ELMACHHOUNE](https://github.com/ELMACHHOUNE) - mohamed.elmachhoune@gmail.com

Project Link: [https://github.com/ELMACHHOUNE/MERN-Stack-portfolio](https://github.com/ELMACHHOUNE/MERN-Stack-portfolio)
