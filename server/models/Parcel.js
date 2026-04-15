import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  weight: { type: Number, required: true }, // in kg
  volume: { type: Number, required: true }, // length * width * height
  parcelType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'collected', 'in_transit', 'delivered'], default: 'pending' },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  price: { type: Number },
  paymentMethod: { type: String, enum: ['sender_pay', 'collector_pay'], default: 'sender_pay' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  driverRating: { type: Number, min: 1, max: 5 },
  driverFeedback: { type: String },
  collectorName: { type: String },
  collectorEmail: { type: String },
  collectorPhone: { type: String },
  collectorDistanceKm: { type: Number, default: null },
  collectorProximityNotifiedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Parcel', parcelSchema);
