// routes/protected.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/secret', authMiddleware, (req, res) => {
  res.json({ message: `Hello user ${req.user}, this is protected.` });
});

export default router;
