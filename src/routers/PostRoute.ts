import { NextFunction, Request, Response, Router } from 'express';
import { postController } from '../controllers/PostController';
import { IsAuthenticated } from '../middlewares/IsAuthenticatedMiddleware';

const postRouter = Router();

postRouter.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

postRouter.post(
  '/',
  IsAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    postController.createPost(req, res);
  }
);

postRouter.get('/', (req: Request, res: Response) => {
  postController.getAllPosts(req, res);
});

postRouter.get('/:post_id', (req: Request, res: Response) => {
  postController.getPostById(req, res);
});

postRouter.put(
  '/:post_id',
  IsAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    postController.updatePost(req, res);
  }
);

postRouter.delete(
  '/:post_id',
  IsAuthenticated,
  (req: Request, res: Response) => {
    postController.deletePost(req, res);
  }
);

export { postRouter };
