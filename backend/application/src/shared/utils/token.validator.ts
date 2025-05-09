import * as jwt from 'jsonwebtoken';

export function validateSocketToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as { sub: string; email: string };
  } catch (err) {
    throw err;
  }
}
