import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  userId?: string;
}

export const IsAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token is missing' }).end();
  }

  const [, token] = authToken.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;

    req.userId = decoded.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' }).end();
  }
};
