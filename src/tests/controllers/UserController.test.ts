import { Request, Response } from 'express';
import { UserController } from '../../controllers/UserController';
import { UserService as userService } from '../../services/UserService';

// Mock do userService
jest.mock('../../services/UserService');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnThis();
    req = {};
    res = {
      status,
      json,
    };
  });

  describe('createUser', () => {
    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      req.body = {
        name: 'Test User',
        username: '',
        password: '',
        active: undefined,
      };

      await UserController.createUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('deve criar um novo usuário e retornar 201', async () => {
      req.body = {
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        active: true,
      };
      const mockUser = { id: 1, ...req.body };
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await UserController.createUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = {
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        active: true,
      };
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await UserController.createUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error: new Error('Error'),
      });
    });
  });

  describe('getUser', () => {
    it('deve retornar 404 se o usuário não for encontrado', async () => {
      req.params = { id: '1' };
      (userService.getUserById as jest.Mock).mockResolvedValue(null);

      await UserController.getUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('deve retornar o usuário e status 200', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      req.params = { id: '1' };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await UserController.getUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params = { id: '1' };
      (userService.getUserById as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await UserController.getUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: new Error('Error') });
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários e status 200', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await UserController.getAllUsers(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(mockUsers);
    });

    it('deve retornar 500 em caso de erro', async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await UserController.getAllUsers(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: new Error('Error') });
    });
  });
});
