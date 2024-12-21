import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = 'secret';

export interface Payload {
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

export enum StepType {
    BRANCH = "BRANCH",
    EXECUTE_QUERY = "EXECUTE_QUERY",
    SEND_EMAIL = "SEND_EMAIL",
    SLACK_MESSAGE = "SLACK_MESSAGE",
    REDIS = "REDIS",
    DYNAMODB = "DYNAMODB",
    HTTP = "HTTP",
    AI = "AI"
}
  
export enum SQLDatabases {
    POSTGRES = "POSTGRES",
    MYSQL = "MYSQL"
}

export const postgresConfigSchema = z.object({
    host: z.string(),
    port: z.number().int().positive(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
    ssl: z
      .union([
        z.boolean(),
        z.object({
          rejectUnauthorized: z.boolean(),
          ca: z.instanceof(Buffer),
        }),
      ])
      .optional(),
});