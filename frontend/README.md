# PedalBharat Frontend

Customer-facing e-commerce frontend for PedalBharat cycling marketplace.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🌐 Access
- **Development**: http://localhost:5173
- **Production**: Deploy the `dist` folder to your web server

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store and slices
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🔧 Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

## 📦 Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the SPA (handle client-side routing)
