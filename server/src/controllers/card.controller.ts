// CARD CONTROLLER
// Handles all card-related operations:
// - Getting all cards
// - Getting a single card
// - Getting counter relationships
// - Managing "hated cards" for a user

import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// ============================================
// GET ALL CARDS
// GET /api/cards
// Public - anyone can view the card list
// ============================================
export const getAllCards = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ cards });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

// ============================================
// GET SINGLE CARD WITH COUNTERS
// GET /api/cards/:id
// Public
// ============================================
export const getCardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cardId = parseInt(req.params.id);

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        // Get all cards that counter this card
        counteredBy: {
          include: { counterCard: true },
          orderBy: { effectiveness: 'desc' },
        },
        // Get all cards this card counters
        counters: {
          include: { counteredCard: true },
          orderBy: { effectiveness: 'desc' },
        },
      },
    });

    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    res.json({ card });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

// ============================================
// GET USER'S HATED CARDS
// GET /api/cards/hated
// Protected - must be logged in
// ============================================
export const getHatedCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hatedCards = await prisma.userHatedCard.findMany({
      where: { userId: req.userId! },
      include: { card: true },
    });

    res.json({ hatedCards: hatedCards.map((hc) => hc.card) });
  } catch (error) {
    console.error('Get hated cards error:', error);
    res.status(500).json({ error: 'Failed to fetch hated cards' });
  }
};

// ============================================
// TOGGLE HATED CARD
// POST /api/cards/:id/hate
// Protected - adds or removes a card from the user's hated list
// ============================================
export const toggleHatedCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cardId = parseInt(req.params.id);
    const userId = req.userId!;

    // Check if already hated
    const existing = await prisma.userHatedCard.findUnique({
      where: {
        userId_cardId: { userId, cardId },
      },
    });

    if (existing) {
      // Remove from hated list
      await prisma.userHatedCard.delete({
        where: { id: existing.id },
      });
      res.json({ message: 'Card removed from hated list', hated: false });
    } else {
      // Add to hated list
      await prisma.userHatedCard.create({
        data: { userId, cardId },
      });
      res.json({ message: 'Card added to hated list', hated: true });
    }
  } catch (error) {
    console.error('Toggle hated card error:', error);
    res.status(500).json({ error: 'Failed to update hated card' });
  }
};

// ============================================
// GET COUNTERS FOR HATED CARDS
// GET /api/cards/counter-suggestions
// Protected - returns cards that counter the user's hated cards
// This is the CORE FEATURE of the app
// ============================================
export const getCounterSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // Step 1: Get all the user's hated cards
    const hatedCards = await prisma.userHatedCard.findMany({
      where: { userId },
      select: { cardId: true },
    });

    if (hatedCards.length === 0) {
      res.json({
        message: 'No hated cards selected. Mark some cards you hate facing!',
        suggestions: [],
      });
      return;
    }

    const hatedCardIds = hatedCards.map((hc) => hc.cardId);

    // Step 2: Find all cards that counter the hated cards
    const counterRel