import { Post } from './Post';
import { User } from './User';

export interface Comment {
  comment_id: string;
  description: string;
  user_id: string;
  post_id: string;
  create_at: Date;

  user?: User;
  post?: Post;
}
