import request from 'supertest';
import express, { application } from 'express';
import { userController } from '../../controllers/UserController';
import { userService } from '../../services/UserService';

const server = application.listen();
app.use(express.json());
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUser);
app.get('/users', userController.getAllUsers);
app.put('/users', userController.updateUser);
app.post('/auth', userController.authUser);

jest.mock('../../services/UserService');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password',
        active: true,
        birth_date: '1990-01-01',
      };
      const createdUser = { id: '1', ...userData };

      userService.createUser.mockResolvedValue(createdUser);

      const response = await request(app).post('/users').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ ...createdUser, active: true });
      expect(userService.createUser).toHaveBeenCalledWith({
        ...userData,
        birth_date: new Date(userData.birth_date),
      });
    });

    it('should return 500 on service error', async () => {
      userService.createUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app).post('/users').send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = { id: userId, name: 'John Doe' };
      userService.getUserById.mockResolvedValue(user);

      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      const userId = '1';
      userService.getUserById.mockResolvedValue(null);

      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 on service error', async () => {
      const userId = '1';
      userService.getUserById.mockRejectedValue(new Error('Service error'));

      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Doe' },
      ];
      userService.getAllUsers.mockResolvedValue(users);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
    });

    it('should return 500 on service error', async () => {
      userService.getAllUsers.mockRejectedValue(new Error('Service error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });

  describe('updateUser', () => {
    it('should return 400 if userId is missing', async () => {
      const response = await request(app).put('/users').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User ID is required' });
    });

    it('should update a user and return it', async () => {
      const userId = '123';
      const userData = { name: 'John Doe Updated' };
      const updatedUser = { id: userId, ...userData };

      userService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/users')
        .set('Authorization', `Bearer token`)
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(userService.updateUser).toHaveBeenCalledWith(userData, userId);
    });

    it('should return 500 on service error', async () => {
      const userId = '123';
      userService.updateUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .put('/users')
        .set('Authorization', `Bearer token`)
        .send({ name: 'John Doe Updated' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });

  describe('authUser', () => {
    it('should authenticate a user and return user data', async () => {
      const credentials = { username: 'johndoe', password: 'password' };
      const user = { id: '1', username: 'johndoe' };

      userService.authUser.mockResolvedValue(user);

      const response = await request(app).post('/auth').send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return 500 on service error', async () => {
      const credentials = { username: 'johndoe', password: 'wrongpassword' };
      userService.authUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app).post('/auth').send(credentials);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });
});
