import { Post } from './Post';
import { User } from './User';

export interface Like {
  user_id: string;
  post_id: string;

  user?: User;
  post?: Post;
}
