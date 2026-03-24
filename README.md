# 🏰 Clash Royale Deck Builder

A full-stack web application that helps Clash Royale players build optimized decks to counter cards and strategies they struggle against.

## Features

- **User Authentication** - Register and login with secure JWT-based auth
- **Card Browser** - Browse all Clash Royale cards with search and filtering
- **"I Hate Facing This" System** - Mark cards you struggle against
- **Counter Suggestions** - Get deck suggestions that counter your most hated cards
- **Deck Builder** - Build, save, and manage your custom decks

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express + TypeScript
- PostgreSQL database
- Prisma ORM
- JWT Authentication
- Zod validation

### DevOps
- Docker
- Git + GitHub

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- npm

### Installation

1. Clone the repository:
git clone https://github.com/YOUR_USERNAME/ClashRoyale-Deck-Builder.git
cd ClashRoyale-Deck-Builder

2. Install all dependencies:
npm run install:all

3. Set up the database:
cd server
cp .env.example .env
# Edit .env and add your PostgreSQL password
npx prisma migrate dev --name init
npm run seed

4. Start the development servers:
npm run dev

The backend runs on http://localhost:3001 and the frontend on http://localhost:5173.

## Project Structure

ClashRoyale-Deck-Builder/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API call functions
│       ├── context/        # React context (auth state)
│       └── types/          # TypeScript type definitions
├── server/                 # Express backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Request handlers
│       ├── middleware/      # Auth middleware
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic
│       └── utils/          # Seed scripts, helpers
└── package.json            # Root package (monorepo scripts)

## API Endpoints

### Auth
- POST /api/auth/register - Create account
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user (protected)

### Cards
- GET /api/cards - Get all cards
- GET /api/cards/:id - Get card with counters
- GET /api/cards/user/hated - Get hated cards (protected)
- POST /api/cards/:id/hate - Toggle hated card (protected)
- GET /api/cards/user/counter-suggestions - Get counter suggestions (protected)

### Decks
- GET /api/decks - Get user's decks (protected)
- POST /api/decks - Create deck (protected)
- DELETE /api/decks/:id - Delete deck (protected)