import { postService } from '../../services/PostService';
import { postRepository } from '../../repositories/PostRepository';

jest.mock('../../repositories/PostRepository');

describe('postService', () => {
  const mockPost = {
    post_id: '1',
    description: 'Test Post',
    user_id: 'user123',
    create_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post', async () => {
    const postData = {
      description: 'Test Post',
      user_id: 'user123',
    };

    (postRepository.create as jest.Mock).mockResolvedValue(mockPost);

    const result = await postService.createPost(postData);

    expect(result).toEqual(mockPost);
    expect(postRepository.create).toHaveBeenCalledWith(postData);
  });

  it('should get all posts', async () => {
    const posts = [mockPost];

    (postRepository.findAll as jest.Mock).mockResolvedValue(posts);

    const result = await postService.getPosts();

    expect(result).toEqual(posts);
    expect(postRepository.findAll).toHaveBeenCalled();
  });

  it('should get a post by id', async () => {
    (postRepository.findById as jest.Mock).mockResolvedValue(mockPost);

    const result = await postService.getPostById('1');

    expect(result).toEqual(mockPost);
    expect(postRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should update a post', async () => {
    const postData = {
      post_id: '1',
      description: 'Updated Post',
      user_id: 'user123',
    };

    (postRepository.findById as jest.Mock).mockResolvedValue(mockPost);
    (postRepository.update as jest.Mock).mockResolvedValue({
      ...mockPost,
      description: 'Updated Post',
    });

    const result = await postService.updatePost(postData);

    expect(result).toEqual({ ...mockPost, description: 'Updated Post' });
    expect(postRepository.update).toHaveBeenCalledWith(postData);
  });

  it('should delete a post', async () => {
    (postRepository.remove as jest.Mock).mockResolvedValue(undefined);

    await postService.deletePost('1');

    expect(postRepository.remove).toHaveBeenCalledWith('1');
  });

  it('should throw error if description is missing when creating post', async () => {
    const postData = {
      user_id: 'user123',
    };

    await expect(postService.createPost(postData as any)).rejects.toThrow(
      'Description is required'
    );
  });

  it('should throw error if user_id is missing when creating post', async () => {
    const postData = {
      description: 'Test Post',
    };

    await expect(postService.createPost(postData as any)).rejects.toThrow(
      'User ID is required'
    );
  });

  it('should throw error if trying to update a post not owned by user', async () => {
    const postData = {
      post_id: '1',
      description: 'Updated Post',
      user_id: 'differentUser',
    };

    (postRepository.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      user: { user_id: 'user123' },
    });

    await expect(postService.updatePost(postData as any)).rejects.toThrow(
      'You are not allowed to update this post'
    );
  });
});
