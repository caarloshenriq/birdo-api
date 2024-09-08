import { Post } from './Post.interface';
import { User } from './User.interface';

export interface Like {
  user_id: string;
  post_id: string;

  user?: User;
  post?: Post;
}
