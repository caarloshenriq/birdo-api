import { User } from './User';

export interface UserFollow {
  user_id: string;
  user_follow_id: string;

  user?: User;
  user_follow?: User;
}
