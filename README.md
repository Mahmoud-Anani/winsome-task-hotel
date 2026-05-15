# Hotel Booking Management System

A full-stack hotel booking management system built with NestJS, PostgreSQL, Prisma, Next.js, and React.

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Swagger** - API Documentation
- **bcrypt** - Password hashing

### Frontend
- **Next.js** - React framework with App Router
- **React** - UI library
- **TailwindCSS** - Styling
- **React Query** - Server state management
- **Zustand** - Auth state management
- **React Hook Form + Zod** - Form validation

## Project Structure

```
├── backendServer/          # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── hotels/       # Hotels module
│   │   ├── rooms/        # Rooms module
│   │   ├── bookings/     # Bookings module
│   │   ├── dashboard/    # Dashboard module
│   │   └── prisma/       # Prisma service
│   ├── prisma/           # Prisma schema & seed
│   └── docker-compose.yml
│
└── frontendWeb/          # Next.js frontend
    ├── src/
    │   ├── app/          # Next.js App Router pages
    │   ├── components/   # UI components
    │   ├── lib/          # API client & utilities
    │   ├── store/        # Zustand stores
    │   └── types/        # TypeScript types
    └── tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backendServer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_booking"
   JWT_SECRET="your-secret-key"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

6. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

7. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```

8. Start the backend:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3001`
Swagger docs at `http://localhost:3001/api/docs`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontendWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Setup (Optional)

1. Navigate to backend directory:
   ```bash
   cd backendServer
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

This will start PostgreSQL and the backend API.

## Default Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@hotel.com | password123 | ADMIN |
| manager@hotel.com | password123 | HOTEL_MANAGER |

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Hotels
- `GET /hotels` - List all hotels (with search & pagination)
- `GET /hotels/:id` - Get hotel by ID
- `POST /hotels` - Create hotel (Authenticated)
- `PATCH /hotels/:id` - Update hotel (Authenticated)
- `DELETE /hotels/:id` - Delete hotel (Authenticated)

### Rooms
- `GET /rooms` - List all rooms
- `GET /rooms/:id` - Get room by ID
- `POST /rooms` - Create room (Authenticated)
- `PATCH /rooms/:id` - Update room (Authenticated)
- `DELETE /rooms/:id` - Delete room (Authenticated)

### Bookings
- `GET /bookings` - List all bookings
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create booking (Authenticated)
- `PATCH /bookings/:id/status` - Update booking status (Authenticated)

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics (Authenticated)

## Features

- JWT Authentication with role-based authorization
- Hotel management with CRUD operations
- Room management linked to hotels
- Booking system with date validation
- Prevent overlapping bookings
- Dashboard with statistics
- Search hotels by name or city
- Pagination support
- Swagger API documentation
- Docker support
- Responsive UI

## License

MIT