import prisma from '../database';
import { User } from '../interfaces/User.interface';

export const UserRepository = {
  async create(
    userData: Omit<
      User,
      | 'user_id'
      | 'create_at'
      | 'posts'
      | 'comments'
      | 'likes'
      | 'following'
      | 'followers'
      | 'blocked'
      | 'blockedBy'
    >
  ): Promise<User> {
    const newUser = await prisma.user.create({
      data: userData,
    });

    return newUser;
  },

  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    return user;
  },

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users;
  },

  async update(
    userData: Omit<
      User,
      | 'create_at'
      | 'posts'
      | 'comments'
      | 'likes'
      | 'following'
      | 'followers'
      | 'blocked'
      | 'blockedBy'
      | 'user_id'
      | 'password'
    >,
    userId: string
  ): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const newUser = await prisma.user.update({
      where: { user_id: userId },
      data: { ...userData },
    });

    return newUser;
  },
};
