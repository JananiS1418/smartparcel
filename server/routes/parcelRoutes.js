import express from 'express';
import { createParcel, getUserParcels, getParcelById, updateParcelStatus, settlePayment, submitReview, updateDriverProgress } from '../controllers/parcelController.js';
import { matchParcelsWithTrips } from '../controllers/matchingController.js';
import { calculatePrice } from '../controllers/pricingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/calculate-price', protect, calculatePrice);
router.get('/match', protect, matchParcelsWithTrips);
router.post('/', protect, createParcel);
router.get('/', protect, getUserParcels);
router.get('/:id', protect, getParcelById);
router.patch('/:id/status', protect, updateParcelStatus);
router.patch('/:id/driver-progress', protect, updateDriverProgress);
router.patch('/:id/settle', protect, settlePayment);
router.patch('/:id/review', protect, submitReview);

export default router;
