import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils';

const JWT_SECRET = 'secret';

interface Payload {
    userId: string;
    email: string;
    name: string;
    avatar: string | null
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      res.status(401).json({ message: 'No token provided. Unauthorized' });
    }
  
    try {
      token && verifyToken(token);
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token. Unauthorized' });
    }
};