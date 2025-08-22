import { Router } from 'express';
import Post from '../models/Post.js';

const router = Router();

/**
 * GET /api/forum
 * Lấy danh sách bài viết, sắp xếp mới nhất trước
 */
router.get('/forum', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/forum
 * body: { title, content, authorId, authorName, role }
 */
router.post('/forum', async (req, res, next) => {
  try {
    const { title, content, authorId, authorName, role } = req.body || {};
    if (!title || !content || !authorId || !authorName) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const post = await Post.create({
      title,
      content,
      authorId,
      authorName,
      role,
    });
    res.json(post);
  } catch (e) {
    next(e);
  }
});

export default router;
