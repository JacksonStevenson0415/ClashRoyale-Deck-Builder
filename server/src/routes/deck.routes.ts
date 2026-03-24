// DECK ROUTES

import { Router } from 'express';
import { getUserDecks, createDeck, deleteDeck } from '../controllers/deck.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All deck routes are protected - you must be logged in
router.get('/', authenticate, getUserDecks);
router.post('/', authenticate, createDeck);
router.delete('/:id', authenticate, deleteDeck);

export default router;