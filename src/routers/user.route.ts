import { Router, Request, Response } from 'express';
import { UserController as userController } from '../controllers/UserController';

const userRouter = Router();

userRouter.get('/ping', (req: Request, res: Response) => {
  return res.json({ message: 'pong' });
});

userRouter.post('/new', (req: Request, res: Response) => {
  userController.createUser(req, res);
});

userRouter.get('/:id', (req: Request, res: Response) => {
  userController.getUser(req, res);
});

userRouter.get('/', (req: Request, res: Response) => {
  userController.getAllUsers(req, res);
});

export { userRouter };
