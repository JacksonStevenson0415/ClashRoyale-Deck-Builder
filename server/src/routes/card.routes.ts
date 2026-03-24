// CARD ROUTES

import { Router } from 'express';
import {
  getAllCards,
  getCardById,
  getHatedCards,
  toggleHatedCard,
  getCounterSuggestions,
} from '../controllers/card.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCards);

// Protected routes (must be logged in)
router.get('/user/hated', authenticate, getHatedCards);
router.get('/user/counter-suggestions', authenticate, getCounterSuggestions);

// This one is below the /user/ routes on purpose - Express matches top to bottom.
// If /:id was first, visiting /user/hated would think "user" is a card ID.
router.get('/:id', getCardById);
router.post('/:id/hate', authenticate, toggleHatedCard);

export default router;