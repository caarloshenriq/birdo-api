import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { userRouter } from './routers/user.route';

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use('/user', userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
