import { Post } from '../interfaces/Post';
import { postRepository } from '../repositories/PostRepository';

async function validatePostData(
  postData: Omit<Post, 'post_id' | 'create_at'> | Omit<Post, 'create_at'>,
  isUpdate: boolean
) {
  if (!postData.description) {
    throw new Error('Description is required');
  }

  if (!postData.user_id) {
    throw new Error('User ID is required');
  }

  if (isUpdate) {
    const post = await postRepository.findById(
      (postData as Omit<Post, 'create_at'>).post_id
    );

    if (post && post.user.user_id !== postData.user_id) {
      throw new Error('You are not allowed to update this post');
    }
  }

  return postData;
}

async function createPost(postData: Omit<Post, 'post_id' | 'create_at'>) {
  validatePostData(postData, false);
  return await postRepository.create(postData);
}

async function getPosts() {
  return await postRepository.findAll();
}

async function getPostById(post_id: string) {
  return await postRepository.findById(post_id);
}

async function updatePost(postData: Omit<Post, 'create_at'>) {
  validatePostData(postData, true);
  return await postRepository.update(postData);
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
