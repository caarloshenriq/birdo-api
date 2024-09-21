import { Like } from './Like';
import { User } from './User';

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
