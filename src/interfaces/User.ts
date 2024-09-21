import { Comment } from './Comment';
import { Like } from './Like';
import { Post } from './Post';
import { UserBlocked } from './UserBlocked.interface';
import { UserFollow } from './UserFollow.interface';

export interface User {
  user_id: string;
  name: string;
  username: string;
  password: string;
  active: boolean;
  birth_date: Date | null;
  // profile_image: string | null;
  create_at: Date;

  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];

  following?: UserFollow[];
  followers?: UserFollow[];
  blocked?: UserBlocked[];
  blockedBy?: UserBlocked[];
}
