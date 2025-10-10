# PedalBharat Backend API

Node.js/Express backend API for PedalBharat e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (running locally or remote)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pedalbharat
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 🌐 Access
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🛠️ Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting

## 📁 Project Structure
```
├── controllers/        # Route controllers
│   └── admin/         # Admin-specific controllers
├── routes/            # API routes
│   └── admin/         # Admin API routes
├── models/            # Database models
├── middleware/        # Express middleware
├── services/          # Business logic
├── utils/             # Utility functions
├── config/            # Configuration files
└── scripts/           # Utility scripts
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `GET /api/categories` - List categories

### Admin Endpoints
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/products` - Admin product management
- `GET /api/admin/orders` - Admin order management
- `GET /api/admin/users` - Admin user management

## 🔑 Admin Setup
Create admin user:
```bash
node scripts/createAdmin.js
```

Default admin credentials:
- Email: admin@pedalbharat.com
- Password: admin123

## 📦 Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## 🚀 Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`
4. Use PM2 or similar for process management

## 🔒 Security Features
- JWT authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet security headers
