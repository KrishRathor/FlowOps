import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
      return res.status(401).json({ message: 'No token provided. Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as Payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token. Unauthorized' });
    }
};