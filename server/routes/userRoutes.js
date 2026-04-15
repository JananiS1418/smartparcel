import express from 'express';
import { getAdminOverview, getPublicDrivers, getUsers } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public/drivers', getPublicDrivers);
router.get('/admin/overview', protect, adminOnly, getAdminOverview);
router.get('/', protect, adminOnly, getUsers);

export default router;
