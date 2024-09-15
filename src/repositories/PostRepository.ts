import prisma from '../database';
import { Post } from '../interfaces/Post.interface';

async function create(
  postData: Omit<
    Post,
    'post_id' | 'create_at' | 'user' | 'comments' | 'likes' | 'image'
  >
): Promise<Post> {
  const post = await prisma.post.create({ data: postData });
  return post;
}

async function findAll() {
  const posts = await prisma.post.findMany({
    include: { user: { select: { user_id: true, username: true } } },
  });
  return posts;
}

async function findById(post_id: string) {
  const post = await prisma.post.findFirst({
    where: { post_id },
    include: { user: { select: { user_id: true, username: true } } },
  });
  return post;
}

async function update(
  postData: Omit<Post, 'create_at' | 'user' | 'comments' | 'likes' | 'image'>
): Promise<Post> {
  const updatedPost = await prisma.post.update({
    where: { post_id: postData.post_id },
    data: postData,
  });
  return updatedPost;
}

async function remove(postId: string) {
  const deletedPost = await prisma.post.delete({ where: { post_id: postId } });
  return deletedPost;
}

export const postRepository = {
  create,
  findAll,
  findById,
  update,
  remove,
};
