import prisma from '../database';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
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

  async auth(userName: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username: userName },
    });
    if (!user) {
      throw new Error('user not found!!!');
    }

    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email/password incorrect!!!');
    }

    const token = sign(
      {
        name: user.name,
        username: user.username,
      },
      process.env.JWT_SECRET ?? 'default-secret',
      {
        subject: user.user_id,
        expiresIn: '10h',
      }
    );

    return {
      id: user.user_id,
      name: user.name,
      username: user.username,
      token,
    };
  },
};
