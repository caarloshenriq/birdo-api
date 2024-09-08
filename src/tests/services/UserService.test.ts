import { UserService } from '../../services/UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { hash } from 'bcryptjs';
import { User } from '../../interfaces/User.interface';

// Mock dos módulos
jest.mock('../../repositories/UserRepository');
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

const mockUser: User = {
  user_id: '1',
  name: 'Test User',
  username: 'testuser',
  password: 'hashedpassword',
  active: true,
  birth_date: new Date(),
  create_at: new Date(),
};
describe('UserService', () => {
  describe('createUser', () => {
    it('deve criar um usuário com senha criptografada', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        password: 'plainpassword',
        active: true,
        birth_date: new Date(),
      };

      (hash as jest.Mock).mockResolvedValue('hashedpassword');
      (UserRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.createUser(userData);

      // Verifique se o hash foi chamado com a senha não criptografada
      expect(hash).toHaveBeenCalledWith('plainpassword', 10);

      // Verifique se o repositório cria o usuário com a senha criptografada
      expect(UserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedpassword',
      });
      expect(result).toEqual(mockUser);
    });
  });

  it('deve lançar erro se o hash falhar', async () => {
    const userData = {
      name: 'Test User',
      username: 'testuser',
      password: 'plainpassword',
      active: true,
      birth_date: new Date(),
    };

    (hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

    await expect(UserService.createUser(userData)).rejects.toThrow(
      'Hash failed'
    );
  });
});

describe('getUserById', () => {
  it('deve retornar o usuário pelo ID', async () => {
    (UserRepository.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserService.getUserById('1');

    expect(UserRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

  it('deve retornar null se o usuário não for encontrado', async () => {
    (UserRepository.findById as jest.Mock).mockResolvedValue(null);

    const result = await UserService.getUserById('2');

    expect(UserRepository.findById).toHaveBeenCalledWith('2');
    expect(result).toBeNull();
  });
});

describe('getAllUsers', () => {
  it('deve retornar todos os usuários', async () => {
    const mockUsers: User[] = [mockUser];
    (UserRepository.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const result = await UserService.getAllUsers();

    expect(UserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('deve retornar uma lista vazia se não houver usuários', async () => {
    (UserRepository.findAll as jest.Mock).mockResolvedValue([]);

    const result = await UserService.getAllUsers();

    expect(UserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
