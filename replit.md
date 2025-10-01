# Cycle Hub Express - E-commerce Platform

## Overview

Cycle Hub Express is a modern e-commerce platform built specifically for cycling enthusiasts in India. The application serves as a comprehensive marketplace for cycling gear, accessories, and equipment, targeting cyclists ranging from weekend riders to professional athletes. The platform emphasizes premium product curation, user experience, and community building within the Indian cycling ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 2025)

### Replit Environment Setup
- Installed all dependencies for frontend, backend, and admin panel
- Configured Vite dev servers to allow all hosts for Replit proxy compatibility
- Fixed CORS configuration to allow both localhost and 127.0.0.1 origins
- Fixed duplicate MongoDB schema index warnings in User, Product, Order, and Category models

### API Enhancements
- Added missing `/api/brands` endpoint to fetch all product brands
- Added `/api/products/:id/reviews` endpoint for product reviews with pagination
- Added `/api/orders/:id/tracking` endpoint for order tracking information
- Fixed wishlist `/wishlist/:productId/move-to-cart` endpoint path consistency

### Admin API Structure
The admin routes (`/api/admin/*`) provide enhanced functionality beyond basic CRUD:
- Bulk operations for products (bulk update, bulk delete)
- Analytics endpoints for dashboard, orders, users, and categories
- Export functionality for orders and users
- Additional admin-specific features (suspend/activate users, payment status management)

This separation is intentional and provides a clean architecture for admin features.

## System Architecture

### Frontend Architecture
The application follows a React-based single-page application (SPA) architecture using modern development practices:

- **Framework**: React 18 with TypeScript for type safety and enhanced developer experience
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router for client-side navigation and route management
- **Styling**: Tailwind CSS with a custom dark theme design system focused on cycling aesthetics
- **Component Library**: Radix UI primitives with shadcn/ui components for consistent, accessible UI elements

### State Management
The application implements Redux Toolkit for centralized state management across three main slices:
- **Cart Management**: Handles shopping cart operations, item quantities, and total calculations
- **Wishlist Management**: Manages user's saved products and favorites
- **Filters Management**: Controls product filtering, searching, sorting, and category selection

### Backend Architecture
The application features a fully TypeScript-converted Express.js backend with MongoDB integration:

- **Runtime**: Node.js with TypeScript compilation via ts-node for development
- **Framework**: Express.js with comprehensive middleware stack
- **Database**: MongoDB with Mongoose ODM for data modeling and validation
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful endpoints with structured JSON responses
- **Validation**: Joi schema validation for request data
- **Error Handling**: Centralized error handling middleware with detailed error responses
- **Development**: Hot reloading with nodemon for seamless development experience

### Data Layer
The backend implements comprehensive MongoDB models with TypeScript interfaces:
- **User Management**: Complete user profiles, authentication, and authorization
- **Product Catalog**: Detailed product models with specifications, inventory, and pricing
- **Order Processing**: Full order lifecycle with payment and shipping tracking
- **Review System**: Product reviews and ratings with moderation
- **Category Management**: Hierarchical product categorization
- **Shopping Cart**: Persistent cart management with user sessions

### UI/UX Design System
The platform implements a cohesive dark theme design system with:
- **Color Palette**: Dark backgrounds with cycling-green accents (#22C55E)
- **Typography**: Hierarchical text system optimized for product information
- **Component Variants**: Consistent button, card, and form styling
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support

### Page Architecture
The application follows a structured page-based architecture:
- **E-commerce Pages**: Product listing, detail views, cart, and checkout flow
- **Content Pages**: About, blog, help, and informational sections
- **User Management**: Account dashboard, wishlist, and order history
- **Legal/Policy Pages**: Terms, privacy, shipping, and return policies

### Routing Strategy
Implements client-side routing with dedicated routes for:
- Product categorization and filtering
- Individual product detail pages
- User account management
- Content and informational pages
- Error handling with 404 fallback

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Router, React Redux for core functionality
- **State Management**: Redux Toolkit for predictable state updates
- **UI Framework**: Radix UI primitives, shadcn/ui components, Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management (prepared for API integration)

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing and optimization

### Design and Icons
- **Heroicons**: Comprehensive icon library for UI elements
- **Lucide React**: Additional icon components
- **Embla Carousel**: Touch-friendly carousel component

### Authentication Ready
- **Supabase**: Authentication UI components prepared for user management integration
- Database-ready architecture for user accounts and order management

### Form and Validation
- **React Hook Form**: Efficient form state management
- **Hookform Resolvers**: Validation integration
- **Input OTP**: One-time password input components

The architecture is designed to be scalable and maintainable, with clear separation of concerns and preparation for backend integration. The component-based structure allows for easy feature expansion and modification while maintaining consistent user experience across the platform.