import { User } from '../interfaces/User.interface';
import { UserRepository } from '../repositories/UserRepository';
import { hash } from 'bcryptjs';

export const UserService = {
  async createUser(
    userData: Omit<User, 'user_id' | 'create_at'>
  ): Promise<User> {
    userData.password = await hash(userData.password, 10);
    return await UserRepository.create(userData);
  },

  async getUserById(userId: string): Promise<User | null> {
    return await UserRepository.findById(userId);
  },

  async getAllUsers(): Promise<User[]> {
    return await UserRepository.findAll();
  },
};
