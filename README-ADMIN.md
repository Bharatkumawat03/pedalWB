# PedalBharat Admin Panel

A comprehensive admin panel for managing the PedalBharat e-commerce platform.

## 🚀 Quick Start

### Development Workflow

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Admin Panel** (in new terminal):
   ```bash
   cd admin-panel
   npm run dev
   ```

3. **Start Main Frontend** (in new terminal):
   ```bash
   npm run dev
   ```

## 📋 Prerequisites

- **Node.js** 18+ 
- **MongoDB** (running locally or remote)
- **Git** (for cloning)

## 🔧 Installation

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Create admin user** (if not already created):
   ```bash
   cd server && node scripts/createAdmin.js
   ```

## 🌐 Access Points

- **Main Frontend**: http://localhost:5000
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 🔑 Admin Login

- **Email**: admin@pedalbharat.com
- **Password**: admin123

## 📁 Project Structure

```
pedalWB/
├── admin-panel/              # React admin frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Admin pages
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── types/           # TypeScript types
│   └── package.json
├── server/                   # Node.js backend
│   ├── controllers/         # Route controllers
│   │   └── admin/           # Admin-specific controllers
│   ├── routes/              # API routes
│   │   └── admin/           # Admin API routes
│   ├── models/              # Database models
│   ├── middleware/          # Express middleware
│   └── scripts/             # Utility scripts
├── src/                     # Main frontend (customer-facing)
├── start-admin.sh           # Setup script
└── README-ADMIN.md          # This file
```

## 🎯 Admin Panel Features

### 📊 Dashboard
- **Statistics Overview**: Total users, orders, revenue, products
- **Recent Orders**: Latest customer orders
- **Top Products**: Best-selling products
- **Analytics Charts**: Revenue and user growth trends

### 🛍️ Product Management
- **Product Listing**: View all products with pagination
- **Search & Filters**: Find products by name, brand, category
- **Product Details**: View comprehensive product information
- **CRUD Operations**: Create, update, delete products
- **Bulk Actions**: Update multiple products at once
- **Image Management**: Upload and manage product images

### 📦 Order Management
- **Order Listing**: View all orders with filters
- **Order Details**: Comprehensive order information
- **Status Updates**: Update order status (pending, shipped, delivered, etc.)
- **Payment Management**: Track payment status
- **Tracking Numbers**: Add shipping tracking
- **Order Actions**: Cancel orders, process refunds

### 👥 User Management
- **User Listing**: View all customers
- **User Details**: Individual user information
- **Account Management**: Suspend/activate user accounts
- **User Analytics**: Registration trends and activity
- **Export Functionality**: Export user data

### 🏷️ Category Management
- **Category Listing**: View all product categories
- **Category CRUD**: Create, update, delete categories
- **Status Toggle**: Enable/disable categories
- **Category Analytics**: Usage statistics

## 🔌 API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin
- `POST /api/admin/auth/logout` - Admin logout

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/analytics` - Analytics data

### Products
- `GET /api/admin/products` - List products
- `GET /api/admin/products/:id` - Get product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order
- `PATCH /api/admin/orders/:id/status` - Update order status
- `PATCH /api/admin/orders/:id/payment-status` - Update payment status
- `PATCH /api/admin/orders/:id/tracking` - Add tracking number

### Users
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/suspend` - Suspend user
- `PATCH /api/admin/users/:id/activate` - Activate user

### Categories
- `GET /api/admin/categories` - List categories
- `GET /api/admin/categories/:id` - Get category
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `PATCH /api/admin/categories/:id/toggle-status` - Toggle category status

## 🛠️ Development

### Available Scripts

- `npm run install-all` - Install all dependencies
- `npm run build` - Build admin panel for production

### Individual Development

#### Backend Development
```bash
cd server
npm run dev
```

#### Admin Panel Development
```bash
cd admin-panel
npm run dev
```

#### Main Frontend Development
```bash
npm run dev
```

### Environment Variables

#### Server (.env in server directory)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pedalbharat
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5000
```

#### Admin Panel (.env in admin-panel directory)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Deployment

### Backend Deployment
1. Build the server:
   ```bash
   cd server
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build the admin panel:
   ```bash
   cd admin-panel
   npm run build
   ```

2. Deploy the `dist` folder to your web server

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin-only access to admin panel
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for production security

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**:
   - Change ports in configuration
   - Kill existing processes

3. **Admin Login Fails**:
   - Run the admin creation script
   - Check user role in database

4. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Logs

- **Backend logs**: Check server console output
- **Frontend logs**: Check browser developer tools
- **Database logs**: Check MongoDB logs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for errors

## 📄 License

This project is part of the PedalBharat e-commerce platform.
