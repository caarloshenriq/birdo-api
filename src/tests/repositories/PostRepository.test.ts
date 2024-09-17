import prisma from '../../database';
import { postRepository } from '../../repositories/PostRepository';
import { Post } from '../../interfaces/Post.interface';

jest.mock('../../database', () => ({
  post: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('postRepository', () => {
  const mockPost: Post = {
    post_id: '1',
    description: 'This is a test post.',
    create_at: new Date(),
    user_id: '1',
  };

  describe('create', () => {
    it('deve criar um novo post no banco de dados', async () => {
      const postData = {
        description: 'This is a test post.',
        user_id: '1',
      };

      (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

      const result = await postRepository.create(postData);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: postData,
      });
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os posts', async () => {
      const mockPosts: Post[] = [mockPost];
      (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

      const result = await postRepository.findAll();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        include: { user: { select: { user_id: true, username: true } } },
      });
      expect(result).toEqual(mockPosts);
    });

    it('deve retornar uma lista vazia se não houver posts', async () => {
      (prisma.post.findMany as jest.Mock).mockResolvedValue([]);

      const result = await postRepository.findAll();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        include: { user: { select: { user_id: true, username: true } } },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar um post pelo ID', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue(mockPost);

      const result = await postRepository.findById('1');

      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { post_id: '1' },
        include: { user: { select: { user_id: true, username: true } } },
      });
      expect(result).toEqual(mockPost);
    });

    it('deve retornar null se o post não for encontrado pelo ID', async () => {
      (prisma.post.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await postRepository.findById('2');

      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { post_id: '2' },
        include: { user: { select: { user_id: true, username: true } } },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar um post existente', async () => {
      const updatedPostData = {
        post_id: '1',
        description: 'This is a test post.',
        create_at: new Date(),
        user_id: '1',
      };

      const updatedPost = { ...mockPost, ...updatedPostData };
      (prisma.post.update as jest.Mock).mockResolvedValue(updatedPost);

      const result = await postRepository.update(updatedPostData);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { post_id: '1' },
        data: updatedPostData,
      });
      expect(result).toEqual(updatedPost);
    });
  });

  describe('remove', () => {
    it('deve remover um post pelo ID', async () => {
      (prisma.post.delete as jest.Mock).mockResolvedValue(mockPost);

      const result = await postRepository.remove('1');

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { post_id: '1' },
      });
      expect(result).toEqual(mockPost);
    });
  });
});
