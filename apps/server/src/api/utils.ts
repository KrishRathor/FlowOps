import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

interface Payload {
    userId: string;
    email: string;
    name: string;
    avatar: string | null
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: Payload): string => {
    return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
};