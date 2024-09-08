import { User } from './user.interface';

export interface UserBlocked {
  user_id: string;
  user_blocked_id: string;

  user?: User;
  user_blocked?: User;
}
