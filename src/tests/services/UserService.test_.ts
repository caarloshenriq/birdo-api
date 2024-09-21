import { userService } from '../../services/UserService';
import { userRepository } from '../../repositories/UserRepository';
import { hash } from 'bcryptjs';

jest.mock('../../repositories/UserRepository');
jest.mock('bcryptjs');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        birth_date: '1990-01-01',
        active: true,
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { user_id: '1', ...userData, active: true };

      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(createdUser);
      expect(hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
    });

    it('should throw error if required fields are missing', async () => {
      const userData = { name: '', username: '', password: '' };

      await expect(userService.createUser(userData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should throw error if username contains spaces', async () => {
      const userData = {
        name: 'John Doe',
        username: 'john doe',
        password: 'password123',
      };

      await expect(userService.createUser(userData)).rejects.toThrow(
        'Username cannot contain spaces'
      );
    });

    it('should throw error if username is already in use', async () => {
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
      };
      (userRepository.findByUsername as jest.Mock).mockResolvedValue({
        user_id: '1',
      });

      await expect(userService.createUser(userData)).rejects.toThrow(
        'Username is already in use'
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = { user_id: userId, name: 'John Doe' };
      (userRepository.findById as jest.Mock).mockResolvedValue(user);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const userId = '1';
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { user_id: '1', name: 'John Doe' },
        { user_id: '2', name: 'Jane Doe' },
      ];
      (userRepository.findAll as jest.Mock).mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userData = { user_id: '1', username: 'john_doe' };
      const updatedUser = { user_id: '1', ...userData };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (userRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userData, '1');

      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(userData, '1');
    });

    it('should throw error if username contains spaces', async () => {
      const userData = { user_id: '1', username: 'john doe' };

      await expect(userService.updateUser(userData, '1')).rejects.toThrow(
        'Username cannot contain spaces'
      );
    });

    it('should throw error if username is already in use', async () => {
      const userData = { user_id: '1', username: 'johndoe' };
      (userRepository.findByUsername as jest.Mock).mockResolvedValue({
        user_id: '2',
      });

      await expect(userService.updateUser(userData, '1')).rejects.toThrow(
        'Username is already in use'
      );
    });
  });

  describe('authUser', () => {
    it('should authenticate a user', async () => {
      const username = 'johndoe';
      const password = 'password123';
      const user = { user_id: '1', username: 'johndoe' };

      (userRepository.auth as jest.Mock).mockResolvedValue(user);

      const result = await userService.authUser(username, password);

      expect(result).toEqual(user);
    });
  });
});
