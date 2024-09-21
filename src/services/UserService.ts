import { User } from '../interfaces/User';
import { userRepository } from '../repositories/UserRepository';
import { hash } from 'bcryptjs';

async function validateData(
  userData: Omit<User, 'user_id' | 'create_at' | 'active'>
) {
  console.log(userData);
  if (!userData.name || !userData.username || !userData.password) {
    throw new Error('Missing required fields');
  }

  if (/\s/.test(userData.username)) {
    throw new Error('Username cannot contain spaces');
  }

  const existingUser = await userRepository.findByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username is already in use');
  }
}

async function createUser(
  userData: Omit<User, 'user_id' | 'create_at'>
): Promise<User> {
  await validateData(userData);
  userData.password = await hash(userData.password, 10);
  return await userRepository.create(userData);
}

async function updateValidation(
  userData: Omit<User, 'create_at' | 'password'>
) {
  if (userData.username) {
    if (/\s/.test(userData.username)) {
      throw new Error('Username cannot contain spaces');
    }
    const existingUser = await userRepository.findByUsername(userData.username);
    if (existingUser?.user_id !== userData.user_id) {
      throw new Error('Username is already in use');
    }
  }
}

async function getUserById(userId: string): Promise<User | null> {
  return await userRepository.findById(userId);
}

async function getAllUsers(): Promise<User[]> {
  return await userRepository.findAll();
}

async function updateUser(
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
    | 'password'
  >,
  userId: string
): Promise<User> {
  await updateValidation(userData);
  return await userRepository.update(userData, userId);
}

async function authUser(username: string, password: string) {
  return await userRepository.auth(username, password);
}

export const userService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  authUser,
};
