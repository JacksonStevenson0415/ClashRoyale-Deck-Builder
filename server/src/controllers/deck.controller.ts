// DECK CONTROLLER
// Handles creating, reading, updating, and deleting decks.
// All deck operations require authentication (user must be logged in).

import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

// Validation: A Clash Royale deck must have exactly 8 cards
const createDeckSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(50, 'Deck name too long'),
  cardIds: z
    .array(z.number())
    .length(8, 'A deck must have exactly 8 cards'),
});

const updateDeckSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  cardIds: z.array(z.number()).length(8, 'A deck must have exactly 8 cards').optional(),
});

// ============================================
// GET ALL USER'S DECKS
// GET /api/decks
// ============================================
export const getUserDecks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const decks = await prisma.deck.findMany({
      where: { userId: req.userId! },
      include: {
        cards: {
          include: { card: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Flatten the response so cards are easier to work with on the frontend
    const formattedDecks = decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      cards: deck.cards.map((dc) => dc.card),
    }));

    res.json({ decks: formattedDecks });
  } catch (error) {
    console.error('Get decks error:', error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
};

// ============================================
// CREATE A NEW DECK
// POST /api/decks
// ============================================
export const createDeck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = createDeckSchema.parse(req.body);

    // Verify all 8 cards exist in the database
    const cards = await prisma.card.findMany({
      where: { id: { in: validated.cardIds } },
    });

    if (cards.length !== 8) {
      res.status(400).json({ error: 'One or more cards are invalid' });
      return;
    }

    // Check for duplicate cards
    const uniqueIds = new Set(validated.cardIds);
    if (uniqueIds.size !== 8) {
      res.status(400).json({ error: 'Deck cannot contain duplicate cards' });
      return;
    }

    // Create the deck with its cards
    const deck = await prisma.deck.create({
      data: {
        name: validated.name,
        userId: req.userId!,
        cards: {
          create: validated.cardIds.map((cardId) => ({
            cardId,
          })),
        },
      },
      include: {
        cards: { include: { card: true } },
      },
    });

    res.status(201).json({
      message: 'Deck created!',
      deck: {
        id: deck.id,
        name: deck.name,
        cards: deck.cards.map((dc) => dc.card),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Create deck error:', error);
    res.status(500).json({ error: 'Failed to create deck' });
  }
};

// ============================================
// DELETE A DECK
// DELETE /api/decks/:id
// ============================================
export const deleteDeck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deckId = req.params.id;

    // Make sure the deck belongs to this user
    const deck = await prisma.deck.findFirst({
      where: { id: deckId, userId: req.userId! },
    });

    if (!deck) {
      res.status(404).json({ error: 'Deck not found' });
      return;
    }

    await prisma.deck.delete({ where: { id: deckId } });

    res.json({ message: 'Deck deleted' });
  } catch (error) {
    console.error('Delete deck error:', error);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
};