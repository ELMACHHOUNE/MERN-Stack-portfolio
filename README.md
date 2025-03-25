# Modern Portfolio Website

A full-stack portfolio website built with React, TypeScript, Node.js, and MongoDB. Features a beautiful, responsive design with dark mode support and an admin dashboard for content management.

## 🌟 Features

### Frontend

- Modern, responsive design with dark mode support
- Smooth animations using Framer Motion
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Beautiful UI components with Tabler Icons

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Role-based access control (Admin/User)
- RESTful API architecture
- Input validation and error handling
- Rate limiting and security middleware

### Admin Dashboard

- Protected admin routes
- Skills management (CRUD operations)
- Projects management (CRUD operations)
- Drag-and-drop reordering
- Image upload support
- Real-time updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd portfolio
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
PORT=5000
```

5. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Create an admin user:

```bash
cd backend
node src/scripts/createAdmin.js
```

4. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin

## 📁 Project Structure

```
portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── scripts/
    │   └── index.js
    └── package.json
```

## 🔒 Authentication

The application uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/admin/check` - Check admin status
- `GET /api/auth/admin/users` - Get all users (admin only)

## 📝 API Endpoints

### Skills

- `GET /api/skills` - Get all active skills
- `GET /api/skills/admin` - Get all skills (admin only)
- `POST /api/skills` - Create new skill (admin only)
- `PATCH /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Projects

- `GET /api/projects` - Get all active projects
- `GET /api/projects/admin` - Get all projects (admin only)
- `POST /api/projects` - Create new project (admin only)
- `PATCH /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `PATCH /api/projects/reorder` - Reorder projects (admin only)

## 🛠️ Technologies Used

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Tabler Icons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Express Validator
- CORS
- Rate Limiter

## 🔒 Security Features

- JWT authentication
- Password hashing
- Rate limiting
- CORS protection
- Input validation
- XSS protection
- Secure headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tabler Icons](https://tabler-icons.io/)
- [MongoDB](https://www.mongodb.com/)
