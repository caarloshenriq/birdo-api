import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/UserController';
import { IsAuthenticated } from '../middlewares/IsAuthenticatedMiddleware';

const userRouter = Router();

userRouter.get('/ping', (req: Request, res: Response) => {
  return res.json({ message: 'pong' });
});

userRouter.post('/new', (req: Request, res: Response, next: NextFunction) => {
  userController.createUser(req, res);
});

userRouter.get('/:id', (req: Request, res: Response) => {
  userController.getUser(req, res);
});

userRouter.get('/', (req: Request, res: Response) => {
  userController.getAllUsers(req, res);
});

userRouter.put(
  '/',
  IsAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    userController.updateUser(req, res);
  }
);

userRouter.post('/auth', (req: Request, res: Response, next: NextFunction) => {
  userController.authUser(req, res, next);
});

export { userRouter };
