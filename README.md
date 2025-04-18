# MERN Stack Portfolio

A full-stack portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a modern UI and comprehensive admin dashboard.

## Project Structure

```
MERN-Stack-portfolio/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service functions
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
├── backend/               # Node.js/Express backend server
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── uploads/          # File uploads directory
│       ├── profile-images/
│       ├── projects/
│       ├── skills/
│       └── cv/
```

## Features

### Frontend

- Modern, responsive UI with Tailwind CSS
- Dark/Light mode support
- Multi-language support (i18n)
- Interactive components and animations
- Admin dashboard for content management
- Profile image upload and management
- Project showcase with image gallery
- Skills management with icons
- Contact form with email integration

### Backend

- RESTful API architecture
- JWT-based authentication
- Role-based access control (Admin/User)
- File upload handling with Multer
- MongoDB database integration
- Email service using Nodemailer
- Rate limiting and security measures
- Error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ELMACHHOUNE/MERN-Stack-portfolio.git
   cd MERN-Stack-portfolio
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create environment files:

   Backend (.env):

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password_here
   CLIENT_URL=http://localhost:5173
   ```

   Frontend (.env):

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Development

1. Start the backend server:

   ```bash
   cd backend
   npm run dev or nodemon
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Production Deployment

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   cd backend
   npm start
   ```

## Creating Admin User

To create an admin user, run:

```bash
cd backend
npm run create-admin
```

Default admin credentials:

- Email: admin@example.com
- Password: admin123

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- Error handling
- File upload restrictions
- XSS protection

## License

ISC
