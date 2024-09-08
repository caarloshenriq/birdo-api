import { Like } from './Like.interface';
import { User } from './User.interface';

export interface Post {
  post_id: string;
  description: string;
  image?: Uint8Array; // Optional binary data
  user_id: string;
  create_at: Date;

  user?: User;
  comments?: Comment[];
  likes?: Like[];
}
