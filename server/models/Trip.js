import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  availableWeight: { type: Number, required: true },
  availableVolume: { type: Number, required: true },
  status: { type: String, enum: ['upcoming', 'in_progress', 'completed'], default: 'upcoming' },
  parcels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' }]
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
