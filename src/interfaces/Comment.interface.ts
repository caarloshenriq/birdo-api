import { Post } from './Post.interface';
import { User } from './User.interface';

export interface Comment {
  comment_id: string;
  description: string;
  user_id: string;
  post_id: string;
  create_at: Date;

  user?: User;
  post?: Post;
}
