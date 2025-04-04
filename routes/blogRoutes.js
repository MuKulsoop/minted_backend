import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentOnBlog,
} from '../controllers/blogController.js';

const router = express.Router();

router.post('/createBlog', authMiddleware, createBlog);

router.get('/getallblogs', getAllBlogs);

router.get('/:id', getSingleBlog);

router.put('/:id', authMiddleware, updateBlog);

router.delete('/:id', authMiddleware, deleteBlog);

router.post('/:id/like', authMiddleware, likeBlog);

router.post('/:id/comment', authMiddleware, commentOnBlog);

export default router;
