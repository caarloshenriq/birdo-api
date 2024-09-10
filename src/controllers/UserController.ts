import { Request, Response } from 'express';
import { UserService as userService } from '../services/UserService';

export const UserController = {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, username, password, active, birth_date } = req.body;
      if (!name || !username || !password || active === undefined) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      const newUser = await userService.createUser({
        name,
        username,
        password,
        active,
        birth_date: birth_date ? new Date(birth_date) : null,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error: error });
    }
  },

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userService.updateUser(req.body, userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error || 'Something went wrong' });
    }
  },
};
