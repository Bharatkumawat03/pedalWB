# PedalBharat Admin Panel

A comprehensive admin panel for managing the PedalBharat e-commerce platform.

## Features

- **Dashboard Analytics** - Overview of sales, users, orders, and products
- **Product Management** - CRUD operations for products with image upload
- **Order Management** - Track and manage customer orders
- **User Management** - Manage customer accounts and permissions
- **Category Management** - Organize products into categories
- **Analytics & Reports** - Detailed insights and reporting

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB
- Backend server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Admin Login

Default admin credentials:
- **Email**: admin@pedalbharat.com
- **Password**: admin123

## Project Structure

```
admin-panel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── ui/             # Basic UI components
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   ├── users/          # User management
│   │   └── categories/     # Category management
│   ├── services/           # API service functions
│   ├── store/              # Redux store and slices
│   ├── types/              # TypeScript type definitions
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── dist/                   # Build output
```

## API Endpoints

The admin panel connects to the following backend endpoints:

- `/api/admin/auth/*` - Authentication
- `/api/admin/dashboard/*` - Dashboard analytics
- `/api/admin/products/*` - Product management
- `/api/admin/orders/*` - Order management
- `/api/admin/users/*` - User management
- `/api/admin/categories/*` - Category management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. The `dist` folder contains the production build
3. Deploy the contents to your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the PedalBharat e-commerce platform.
