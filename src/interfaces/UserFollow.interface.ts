import { User } from './User.interface';

export interface UserFollow {
  user_id: string;
  user_follow_id: string;

  user?: User;
  user_follow?: User;
}
