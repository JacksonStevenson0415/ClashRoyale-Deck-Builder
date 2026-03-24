// This is the ENTRY POINT of our backend server.
// Think of it as the "main()" of our application.
// It sets up Express (our web framework) and starts listening for requests.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import cardRoutes from './routes/card.routes';
import deckRoutes from './routes/deck.routes';

// Load environment variables from .env file
dotenv.config();

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// Middleware runs on EVERY request before it reaches your routes.
// Think of it like security guards at the entrance of a building.
// ============================================

// cors() - Allows our React frontend (running on port 5173) to talk to
// our backend (running on port 3001). Without this, the browser blocks it.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// express.json() - Parses incoming JSON request bodies.
// When the frontend sends { "email": "test@test.com" }, this middleware
// converts that JSON string into a JavaScript object we can use.
app.use(express.json());

// ============================================
// ROUTES
// These define what happens when someone visits a URL.
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/decks', deckRoutes);

// Health check route - useful to verify the server is running
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Clash Royale Deck Builder API is running!' });
});

// ============================================
// START THE SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🏰 Server is running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;