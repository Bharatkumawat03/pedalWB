import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

import connectDB from './config/database';
import errorHandler from './middleware/errorHandler';
import { protect } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import userRoutes from './routes/users';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import categoryRoutes from './routes/categories';
import careersRoutes from './routes/careers';
import contactRoutes from './routes/contact';
import newsletterRoutes from './routes/newsletter';
import brandRoutes from './routes/brands';

// Import admin routes
import adminAuthRoutes from './routes/admin/auth';
import adminDashboardRoutes from './routes/admin/dashboard';
import adminProductRoutes from './routes/admin/products';
import adminOrderRoutes from './routes/admin/orders';
import adminUserRoutes from './routes/admin/users';
import adminCategoryRoutes from './routes/admin/categories';
import adminContactRoutes from './routes/admin/contact';
import adminCareerRoutes from './routes/admin/careers';
import adminNewsletterRoutes from './routes/admin/newsletter';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Middleware
app.use(compression());

// Custom morgan format to sanitize sensitive data (passwords) from logs
morgan.token('body', (req: any) => {
  if (req.body && typeof req.body === 'object') {
    const sanitized = { ...req.body };
    // Remove password fields from logs
    if (sanitized.password) sanitized.password = '[REDACTED]';
    if (sanitized.currentPassword) sanitized.currentPassword = '[REDACTED]';
    if (sanitized.newPassword) sanitized.newPassword = '[REDACTED]';
    if (sanitized.confirmPassword) sanitized.confirmPassword = '[REDACTED]';
    return JSON.stringify(sanitized);
  }
  return '';
});

// Use custom format that doesn't log sensitive data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: (req: any, res: any) => {
    // Skip logging for health checks
    return req.url === '/health';
  }
}));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5000',
    process.env.ADMIN_URL || 'http://localhost:8080',
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/brands', brandRoutes);

// Admin API Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/contact', adminContactRoutes);
app.use('/api/admin/careers', adminCareerRoutes);
app.use('/api/admin/newsletter', adminNewsletterRoutes);

// Test authentication endpoint
app.get('/api/test-auth', protect as any, (req: Request, res: Response) => {
  console.log('Test auth route - User:', (req as any).user);
  res.json({ 
    success: true, 
    message: 'Authentication working!',
    user: (req as any).user 
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Cycle Hub Express API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
