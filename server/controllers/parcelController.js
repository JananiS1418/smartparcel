import mongoose from 'mongoose';
import Parcel from '../models/Parcel.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizePhone = (value = '') => value.replace(/\D/g, '');
const estimatePrice = ({ weight, volume, paymentMethod }) => {
  const base = 80;
  const weightRate = Number(weight || 0) * 18;
  const volumeRate = Number(volume || 0) * 12;
  const surcharge = paymentMethod === 'collector_pay' ? 25 : 0;
  return Math.round((base + weightRate + volumeRate + surcharge) * 100) / 100;
};

export const createParcel = async (req, res) => {
  const {
    pickupLocation,
    dropoffLocation,
    weight,
    volume,
    parcelType,
    paymentMethod,
    collectorName,
    collectorEmail,
    collectorPhone,
    driverId,
    tripId
  } = req.body;
  try {
    let actualDriverId = driverId;
    
    // Automatically resolve to Janani Driver to satisfy demo constraints if using placeholder ID
    if (driverId === '69cf6020c5e92f2ddf5f44fb') {
        const User = mongoose.model('User');
        const janani = await User.findOne({ name: { $regex: /Janani/i }, role: 'driver' });
        if (janani) {
            actualDriverId = janani._id;
        }
    }

    const parcel = await Parcel.create({
      sender: req.user._id,
      pickupLocation,
      dropoffLocation,
      weight,
      volume,
      parcelType,
      paymentMethod: paymentMethod || 'sender_pay',
      collectorName: collectorName?.trim(),
      collectorEmail: collectorEmail?.trim().toLowerCase(),
      collectorPhone: normalizePhone(collectorPhone),
      carrier: actualDriverId,
      trip: tripId || undefined,
      price: estimatePrice({ weight, volume, paymentMethod })
    });

    if (tripId) {
      await Trip.findByIdAndUpdate(tripId, { $addToSet: { parcels: parcel._id } });
    }

    const populatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage truckDetails');

    if (actualDriverId) {
      await createNotification({
        user: actualDriverId,
        parcel: parcel._id,
        type: 'booking',
        title: 'New parcel booking',
        message: `${req.user.name} booked a parcel from ${pickupLocation} to ${dropoffLocation}.`
      });
    }

    res.status(201).json(populatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserParcels = async (req, res) => {
  try {
    let parcels = [];
    const collectorQueries = [];

    if (req.user.role === 'collector') {
      if (req.user.name?.trim()) {
        collectorQueries.push({
          collectorName: { $regex: `^${escapeRegex(req.user.name.trim())}$`, $options: 'i' }
        });
      }

      if (req.user.email?.trim()) {
        collectorQueries.push({ collectorEmail: req.user.email.trim().toLowerCase() });
      }

      if (req.user.phone?.trim()) {
        collectorQueries.push({ collectorPhone: normalizePhone(req.user.phone) });
      }
    }

    if (req.user.role === 'admin') {
      parcels = await Parcel.find({});
    } else if (req.user.role === 'collector') {
      parcels = await Parcel.find(collectorQueries.length ? { $or: collectorQueries } : { _id: null });
    } else if (req.user.role === 'driver') {
      parcels = await Parcel.find({ carrier: req.user._id });
    } else {
      parcels = await Parcel.find({ sender: req.user._id });
    }

    parcels = await Parcel.populate(parcels, [
      { path: 'sender', select: 'name email phone' },
      { path: 'carrier', select: 'name email phone profileImage truckDetails' }
    ]);

    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage vehicleImage truckDetails');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateParcelStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    
    parcel.status = status;
    if (['confirmed', 'collected', 'in_transit'].includes(status) && ['driver', 'admin'].includes(req.user.role)) {
      parcel.carrier = req.user._id;
    }
    
    await parcel.save();
    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage truckDetails');

    if (status === 'collected') {
      const collectors = await User.find({
        role: 'collector',
        $or: [
          parcel.collectorName ? { name: { $regex: `^${escapeRegex(parcel.collectorName)}$`, $options: 'i' } } : null,
          parcel.collectorEmail ? { email: parcel.collectorEmail } : null
        ].filter(Boolean)
      }).select('_id');

      await Promise.all(
        collectors.map((collector) =>
          createNotification({
            user: collector._id,
            parcel: parcel._id,
            type: 'pickup',
            title: 'Parcel collected',
            message: `Your parcel has been collected by the driver and is now on the way to ${parcel.dropoffLocation}.`
          })
        )
      );
    }

    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDriverProgress = async (req, res) => {
  const { collectorDistanceKm } = req.body;

  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    if (!['driver', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only drivers can update trip progress' });
    }

    parcel.collectorDistanceKm = Number(collectorDistanceKm);

    if (
      Number.isFinite(parcel.collectorDistanceKm) &&
      parcel.collectorDistanceKm <= 10 &&
      !parcel.collectorProximityNotifiedAt
    ) {
      parcel.collectorProximityNotifiedAt = new Date();

      const collectors = await User.find({
        role: 'collector',
        $or: [
          parcel.collectorName ? { name: { $regex: `^${escapeRegex(parcel.collectorName)}$`, $options: 'i' } } : null,
          parcel.collectorEmail ? { email: parcel.collectorEmail } : null
        ].filter(Boolean)
      }).select('_id');

      await Promise.all(
        collectors.map((collector) =>
          createNotification({
            user: collector._id,
            parcel: parcel._id,
            type: 'proximity',
            title: 'Driver is nearby',
            message: `The driver is now within ${parcel.collectorDistanceKm} km of your location. Please be ready to receive the parcel.`
          })
        )
      );
    }

    await parcel.save();

    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage truckDetails');

    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const settlePayment = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    
    if (req.user.role !== 'collector' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only collectors can settle payments' });
    }

    parcel.paymentStatus = 'completed';
    await parcel.save();
    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage truckDetails');
    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitReview = async (req, res) => {
  const { rating, feedback } = req.body;
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    
    if (req.user.role !== 'collector' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only collectors can review drivers' });
    }

    parcel.driverRating = rating;
    parcel.driverFeedback = feedback;
    await parcel.save();
    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name email phone')
      .populate('carrier', 'name email phone profileImage truckDetails');
    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
