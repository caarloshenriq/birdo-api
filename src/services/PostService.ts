import { Post } from '../interfaces/Post.interface';
import { postRepository } from '../repositories/PostRepository';

async function createPost(postData: Omit<Post, 'post_id' | 'create_at'>) {
  return await postRepository.create(postData);
}

async function getPosts() {
  return await postRepository.findAll();
}

async function getPostById(post_id: string) {
  return await postRepository.findById(post_id);
}

async function updatePost(
  postData: Omit<Post, 'post_id' | 'create_at'>,
  post_id: string
) {
  return await postRepository.update(postData, post_id);
}

async function deletePost(post_id: string) {
  return await postRepository.remove(post_id);
}

export const postService = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
