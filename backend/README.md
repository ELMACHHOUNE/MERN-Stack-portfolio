# Portfolio Backend

This is the backend server for the portfolio website, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication (register/login)
- Contact form with email notifications
- Admin dashboard access
- JWT-based authentication
- TypeScript support
- MongoDB database integration
- Email service using Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email service)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password_here
   ```

## Development

To run the development server:

```bash
npm run dev
```

## Production

To build and run the production server:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Contact

- POST `/api/contact` - Submit contact form

## Creating Admin User

To create an admin user, run:

```bash
npm run create-admin
```

This will create a default admin user with the following credentials:

- Email: admin@example.com
- Password: admin123

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- Error handling

## License

ISC
