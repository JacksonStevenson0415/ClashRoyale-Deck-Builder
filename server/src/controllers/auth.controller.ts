// AUTH CONTROLLER
// Controllers contain the actual logic for handling requests.
// Think of routes as the "address" and controllers as "what happens when you arrive."

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS (using Zod)
// These define what valid input looks like.
// If someone sends garbage data, Zod catches it before it hits the database.
// ============================================
const registerSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// Helper function to create a JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

// ============================================
// REGISTER - Create a new account
// POST /api/auth/register
// ============================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Validate the input
    const validated = registerSchema.parse(req.body);

    // Step 2: Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { username: validated.username },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === validated.email ? 'Email' : 'Username';
      res.status(409).json({ error: `${field} is already taken` });
      return;
    }

    // Step 3: Hash the password
    // NEVER store plain text passwords! bcrypt turns "password123" into
    // something like "$2b$10$X7z..." that can't be reversed.
    // The "10" is the salt rounds - higher = more secure but slower.
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Step 4: Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        username: validated.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        // Notice we do NOT select password - never send it back!
      },
    });

    // Step 5: Generate a token so they're automatically logged in
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Account created successfully!',
      user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// LOGIN - Sign into an existing account
// POST /api/auth/login
// ============================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare the password they sent with the hashed one in the database
    const passwordMatch = await bcrypt.compare(validated.password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ============================================
// GET ME - Get the currently logged-in user
// GET /api/auth/me
// ============================================
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};