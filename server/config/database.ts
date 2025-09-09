import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Skip database connection in development if no MongoDB available
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI?.startsWith('mongodb://') && !process.env.MONGODB_URI?.startsWith('mongodb+srv://')) {
      console.log('⚠️  Running in development mode without MongoDB - using static data');
      return;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyclehub';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    if (error.message.includes('IP')) {
      console.log('💡 Tip: Make sure to whitelist your current IP in MongoDB Atlas Network Access settings');
    }
    console.log('⚠️  Server will continue running without database for development');
    // Don't exit in development, continue running for frontend testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;