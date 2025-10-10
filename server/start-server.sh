#!/bin/bash

echo "🚀 PedalBharat Backend Server Setup"
echo "===================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: sudo systemctl start mongod"
    echo "   Or: mongod --dbpath /var/lib/mongodb"
    echo ""
fi

echo "📋 Development Workflow:"
echo ""
echo "1. Install dependencies:"
echo "   npm install"
echo ""
echo "2. Create admin user (if not already created):"
echo "   node scripts/createAdmin.js"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "🌐 Access Points:"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "🔑 Admin Login:"
echo "   Email: admin@pedalbharat.com"
echo "   Password: admin123"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

echo "✅ Setup complete! Run 'npm run dev' to start the development server."
