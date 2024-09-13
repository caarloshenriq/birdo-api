import { Request, Response, NextFunction } from 'express';
import { UserRepository as userRepository } from '../repositories/UserRepository';
import { CustomRequest } from './IsAuthenticated.middleware';

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, username, password, active } = req.body;

  if (!name || !username || !password || active === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (/\s/.test(username)) {
    return res.status(400).json({ message: 'Username cannot contain spaces' });
  }

  try {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use' });
    }

    next();
  } catch (error) {
    console.error('Error validating user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, username, active } = req.body;

  if (!name || !username || active === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (/\s/.test(username)) {
    return res.status(400).json({ message: 'Username cannot contain spaces' });
  }

  try {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser && existingUser.user_id !== req.userId) {
      return res.status(400).json({ message: 'Username is already in use' });
    }

    next();
  } catch (error) {
    console.error('Error validating user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const userMiddleware = {
  newUser,
  updateUser,
};
