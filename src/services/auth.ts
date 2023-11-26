import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';

type TokenPayload = {
  id: User['id'];
  email: User['email'];
} & jwt.JwtPayload;

export abstract class Auth {
  static secret = process.env.JWT_SECRET as string;
  static hash(value: string): Promise<string> {
    const satRound = 10;
    return hash(value, satRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }

  static signJWT(payload: TokenPayload) {
    return jwt.sign(payload, Auth.secret);
  }

  static verifyJWT(token: string) {
    try {
      const result = jwt.verify(token, Auth.secret);
      if (typeof result === 'string')
        throw new HttpError(498, 'Invalid token', result);
      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message);
    }
  }
}
