import express from 'express';
import { createTrip, getDriverTrips, getTrips, updateTripStatus } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/driver', protect, getDriverTrips);
router.post('/', protect, createTrip);
router.get('/', protect, getTrips);
router.patch('/:id/status', protect, updateTripStatus);

export default router;
