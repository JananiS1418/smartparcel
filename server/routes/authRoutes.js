import express from 'express';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateCurrentUser);

export default router;
