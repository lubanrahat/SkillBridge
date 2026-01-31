# 🎓 SkillBridge

**SkillBridge** is a comprehensive online tutoring platform that connects students with qualified tutors across various subjects. Built with modern technologies, it provides a seamless experience for booking tutoring sessions, managing availability, and leaving reviews.

---

## ✨ Features

### For Students

- 🔍 **Browse Tutors** - Search and filter tutors by subject, rating, and hourly rate
- 📅 **Book Sessions** - Schedule tutoring sessions based on tutor availability
- ⭐ **Leave Reviews** - Rate and review tutors after completing sessions
- 📊 **Dashboard** - Track booking history and manage upcoming sessions

### For Tutors

- 📝 **Profile Management** - Create and update comprehensive tutor profiles
- 💰 **Set Hourly Rates** - Define your own pricing for tutoring services
- 🕐 **Availability Management** - Set your available time slots for bookings
- 📈 **View Reviews** - See student feedback and ratings

### For Administrators

- 👥 **User Management** - Manage users, including banning/activating accounts
- 📂 **Category Management** - Organize subjects and categories
- 📊 **Platform Analytics** - Monitor platform usage and performance

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript/TypeScript runtime
- **Framework**: [Express.js](https://expressjs.com) - Web application framework
- **Database**: [PostgreSQL](https://www.postgresql.org) - Relational database
- **ORM**: [Prisma](https://www.prisma.io) - Next-generation TypeScript ORM
- **Authentication**: [JWT](https://jwt.io) - JSON Web Tokens for secure authentication
- **Validation**: [Zod](https://zod.dev) - TypeScript-first schema validation
- **Logging**: [Winston](https://github.com/winstonjs/winston) - Logging library



## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Bun** (v1.0 or higher) - [Installation Guide](https://bun.sh/docs/installation)
- **PostgreSQL** (v14 or higher)
- **Node.js** (v18 or higher) - Required for some frontend tooling

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillBridge
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
bun install
```

**Environment Variables** (`.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=8080
```

**Database Setup**:

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Seed the database (optional)
bun run prisma/seed.ts
```

**Start the Backend Server**:

```bash
bun run dev
```

The backend will be running at `http://localhost:8080`


## 📁 Project Structure

```
SkillBridge/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts           # Database seeding script
│   ├── src/
│   │   ├── modules/          # Feature modules (auth, tutor, booking, etc.)
│   │   ├── middlewares/      # Express middlewares
│   │   ├── utils/            # Utility functions
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── types/            # TypeScript type definitions
│   │   ├── config/           # Configuration files
│   │   ├── errors/           # Custom error classes
│   │   ├── app.ts            # Express app configuration
│   │   └── server.ts         # Server entry point
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schema

The application uses the following main models:

- **User** - Core user entity (students, tutors, admins)
- **TutorProfile** - Extended profile information for tutors
- **Booking** - Tutoring session bookings
- **Review** - Student reviews for tutors
- **Category** - Subject categories

For detailed schema information, see [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## 🔐 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Tutors

- `GET /api/v1/tutors` - Get all tutors
- `GET /api/v1/tutors/:id` - Get tutor by ID
- `GET /api/v1/tutors/profile` - Get authenticated tutor's profile
- `PUT /api/v1/tutors/profile` - Update tutor profile

### Bookings

- `POST /api/v1/bookings` - Create a new booking
- `GET /api/v1/bookings` - Get user's bookings
- `PATCH /api/v1/bookings/:id/status` - Update booking status

### Reviews

- `POST /api/v1/reviews` - Create a review
- `GET /api/v1/reviews/tutor/:tutorId` - Get reviews for a tutor

### Admin

- `GET /api/v1/admin/users` - Get all users
- `PATCH /api/v1/admin/users/:id/status` - Update user status
