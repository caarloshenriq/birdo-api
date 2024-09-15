import { Request, Response } from 'express';
import { CustomRequest } from '../middlewares/IsAuthenticated.middleware';
import { postService } from '../services/PostService';

async function createPost(req: CustomRequest, res: Response) {
  try {
    const { description } = req.body;
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const post = await postService.createPost({
      description,
      user_id: userId,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

async function getAllPosts(req: Request, res: Response) {
  try {
    const posts = await postService.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error || 'Something went wrong' });
  }
}

async function getPostById(req: Request, res: Response) {
  try {
    const { post_id } = req.params;
    const post = await postService.getPostById(post_id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error || 'Something went wrong' });
  }
}

async function updatePost(req: CustomRequest, res: Response) {
  try {
    const { post_id } = req.params;
    let userId = req.userId;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const { description } = req.body;
    const post = await postService.updatePost({
      description,
      user_id: userId,
      post_id,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const { post_id } = req.params;
    await postService.deletePost(post_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error || 'Something went wrong' });
  }
}

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
