// AUTH ROUTES
// Routes are like a table of contents - they map URLs to controller functions.
// When someone visits POST /api/auth/register, Express runs the register function.

import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes (no login needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (must be logged in)
router.get('/me', authenticate, getMe);

export default router;