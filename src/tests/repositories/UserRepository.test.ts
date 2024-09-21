import prisma from '../../database';
import { userRepository } from '../../repositories/UserRepository';
import { User } from '../../interfaces/User';

jest.mock('../../database', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('userRepository', () => {
  const mockUser: User = {
    user_id: '1',
    name: 'Test User',
    username: 'testuser',
    password: 'hashedpassword',
    active: true,
    birth_date: new Date(),
    create_at: new Date(),
    posts: [],
    comments: [],
    likes: [],
    following: [],
    followers: [],
    blocked: [],
    blockedBy: [],
  };

  describe('create', () => {
    it('deve criar um novo usuário no banco de dados', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        password: 'hashedpassword',
        active: true,
        birth_date: new Date(),
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.create(userData);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('deve retornar um usuário pelo username', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByUsername('testuser');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByUsername('unknownuser');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'unknownuser' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado pelo ID', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById('2');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: '2' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers: User[] = [mockUser];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('deve retornar uma lista vazia se não houver usuários', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await userRepository.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
