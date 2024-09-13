import { Request, Response } from 'express';
import { UserController } from '../../controllers/UserController';
import { UserService as userService } from '../../services/UserService';
import { CustomRequest } from '../../middlewares/IsAuthenticated.middleware';

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
    // it('deve retornar 400 se faltar campos obrigatórios', async () => {
    //   req.body = {
    //     name: 'Test User',
    //     username: '',
    //     password: '',
    //     active: undefined,
    //   };

    //   await UserController.createUser(req as Request, res as Response);

    //   expect(status).toHaveBeenCalledWith(201);
    //   expect(json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    // });

    it('deve criar um novo usuário e retornar 201', async () => {
      req.body = {
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        active: true,
        birth_date: new Date().toISOString(),
      };
      const mockUser = { id: '1', ...req.body };
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
        birth_date: new Date().toISOString(),
      };
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await UserController.createUser(req as Request, res as Response);

      await UserController.authUser(req as Request, res as Response, () => {});

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
      const mockUser = { id: '1', name: 'Test User' };
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
      const mockUsers = [{ id: '1', name: 'Test User' }];
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

  describe('updateUser', () => {
    it('deve retornar 400 se o ID do usuário não estiver presente', async () => {
      req.body = {
        name: 'Updated User',
        username: 'updateduser',
        active: true,
      };
      await UserController.updateUser(req as CustomRequest, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('deve atualizar o usuário e retornar 200', async () => {
      (req as CustomRequest).userId = '1';
      req.body = {
        name: 'Updated User',
        username: 'updateduser',
        active: true,
      };
      const updatedUser = { id: '1', ...req.body };
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await UserController.updateUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(updatedUser);
    });

    it('deve retornar 500 em caso de erro', async () => {
      (req as CustomRequest).userId = '1';
      req.body = {
        name: 'Updated User',
        username: 'updateduser',
        active: true,
      };
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      await UserController.updateUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: new Error('Error') });
    });
  });

  describe('authUser', () => {
    it('deve retornar 200 com o token do usuário', async () => {
      const user = { id: '1', username: 'testuser', token: 'abc123' };
      req.body = { username: 'testuser', password: 'password' };
      (userService.authUser as jest.Mock).mockResolvedValue(user);

      await UserController.authUser(req as Request, res as Response, () => {});

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(user);
    });

    // it('deve retornar 500 em caso de erro', async () => {
    //   req.body = { username: 'testuser', password: 'password' };
    //   (userService.authUser as jest.Mock).mockRejectedValue(new Error('Error'));

    //   await UserController.authUser(req as Request, res as Response, () => {});

    //   // expect(status).toHaveBeenCalledWith(500);
    //   expect(json).toHaveBeenCalledWith({ error: new Error('Error') });
    //   expect(status).toHaveBeenCalledTimes(1);
    // });
  });
});
