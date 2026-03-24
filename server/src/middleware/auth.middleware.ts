// AUTH MIDDLEWARE
// This runs BEFORE protected routes to verify the user is logged in.
//
// How JWT auth works:
// 1. User logs in → server creates a "token" (like a wristband at a concert)
// 2. Frontend stores this token and sends it with every request
// 3. This middleware checks if the wristband is valid before letting them through

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request type to include our user data
export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get the token from the Authorization header
    // It comes in the format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided. Please log in.' });
      return;
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token is valid and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Attach the user's ID to the request so our routes can use it
    req.userId = decoded.userId;

    // Token is valid - let the request continue to the route
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};