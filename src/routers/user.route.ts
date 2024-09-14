import { Router, Request, Response, NextFunction } from 'express';
import { UserController as userController } from '../controllers/UserController';
import { userMiddleware } from '../middlewares/User.middleware';
import { IsAuthenticated } from '../middlewares/IsAuthenticated.middleware';

const userRouter = Router();

userRouter.get('/ping', (req: Request, res: Response) => {
  return res.json({ message: 'pong' });
});

userRouter.post(
  '/new',
  userMiddleware.newUser,
  (req: Request, res: Response) => {
    userController.createUser(req, res);
  }
);

userRouter.get('/:id', (req: Request, res: Response) => {
  userController.getUser(req, res);
});

userRouter.get('/', (req: Request, res: Response) => {
  userController.getAllUsers(req, res);
});

userRouter.put(
  '/',
  IsAuthenticated,
  userMiddleware.updateUser,
  (req: Request, res: Response) => {
    userController.updateUser(req, res);
  }
);

userRouter.post('/auth', (req: Request, res: Response, next: NextFunction) => {
  userController.authUser(req, res, next);
});

export { userRouter };
