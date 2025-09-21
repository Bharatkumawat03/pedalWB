#!/bin/bash

echo "🚀 PedalBharat Admin Panel Setup"
echo "================================"
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
echo "1. Start Backend Server:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "2. Start Admin Panel (in new terminal):"
echo "   cd admin-panel"
echo "   npm run dev"
echo ""
echo "3. Start Main Frontend (in new terminal):"
echo "   npm run dev"
echo ""
echo "🌐 Access Points:"
echo "   Backend API: http://localhost:3001"
echo "   Admin Panel: http://localhost:5173"
echo "   Main Frontend: http://localhost:5000"
echo ""
echo "🔑 Admin Login:"
echo "   Email: admin@pedalbharat.com"
echo "   Password: admin123"
echo ""

# Check if dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "admin-panel/node_modules" ]; then
    echo "📦 Installing admin panel dependencies..."
    cd admin-panel && npm install && cd ..
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing main frontend dependencies..."
    npm install
fi

echo "✅ Setup complete! Follow the workflow above to start development."
