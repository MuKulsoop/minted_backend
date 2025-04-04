// routes/userRoutes.js
import express from 'express';
import upload from '../middleware/upload.js'; // for profile photo
import { registerUser, loginUser } from '../controllers/userContollers.js';
const router = express.Router();

// Signup with profile image upload
router.post('/signup', upload.single('profilePhoto'), registerUser);

router.post('/login', loginUser);

export default router;
