# MERN Stack Portfolio

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a beautiful UI, dark mode support, and multilingual capabilities.

## Features

- 🌐 **Multilingual Support**: Built-in translation system supporting English and French
- 🌓 **Dark Mode**: Seamless dark/light theme switching
- 📱 **Responsive Design**: Fully responsive layout for all devices
- 🔒 **Authentication**: Secure user authentication with JWT
- 👑 **Admin Dashboard**: Comprehensive admin panel for content management
- 📬 **Contact Form**: Interactive contact form with email notifications
- 🎨 **Modern UI**: Beautiful and intuitive user interface
- ⚡ **Performance Optimized**: Fast loading times and smooth transitions

## Tech Stack

### Frontend

- React.js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Context API for state management
- i18n for internationalization

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications
- Nodemon for development

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- nodemon (for development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/MERN-Stack-portfolio.git
cd MERN-Stack-portfolio
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Install nodemon globally (if not already installed)
npm install -g nodemon
```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Start the development servers:

```bash
# Start backend server with nodemon (in one terminal)
cd server
nodemon

# Start frontend server (in another terminal)
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
MERN-Stack-portfolio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── locales/       # Translation files
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## Translation System

The application uses a custom translation system built with React Context. Translation files are located in `src/locales/`:

- `en.json`: English translations
- `fr.json`: French translations

To add new translations:

1. Add the translation key to both language files
2. Use the `useLanguage` hook in your components:

```typescript
const { t } = useLanguage();
t("your.translation.key");
```

For interpolation:

```typescript
t("your.translation.key", { variable: "value" });
```

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
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Nodemon](https://nodemon.io/)

## Contact

Mohamed EL MACHHOUNE - [@ELMACHHOUNE](https://github.com/ELMACHHOUNE) - mohamed.elmachhoune@gmail.com

Project Link: [https://github.com/ELMACHHOUNE/MERN-Stack-portfolio](https://github.com/ELMACHHOUNE/MERN-Stack-portfolio)
