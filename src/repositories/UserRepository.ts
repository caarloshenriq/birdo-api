import prisma from '../database';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../interfaces/User.interface';

async function create(
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
}

async function findByUsername(username: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { username },
  });
}

async function findById(userId: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { user_id: userId }, // Verifique se 'user_id' está correto no seu modelo Prisma
  });
}

async function findAll(): Promise<User[]> {
  return await prisma.user.findMany();
}

async function update(
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
    where: { user_id: userId }, // Verifique se 'user_id' está correto no seu modelo Prisma
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: userId }, // Verifique se 'user_id' está correto no seu modelo Prisma
    data: userData,
  });

  return updatedUser;
}

async function auth(userName: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username: userName },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = compareSync(password, user.password);

  if (!passwordMatch) {
    throw new Error('Incorrect username or password');
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
}

export const userRepository = {
  create,
  auth,
  findAll,
  findById,
  findByUsername,
  update,
};
