import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'driver', 'admin', 'collector'], default: 'user' },
  phone: { type: String },
  location: { type: String },
  rating: { type: Number, default: 5.0 },
  collectionArea: { type: String },
  truckDetails: {
    model: String,
    licensePlate: String,
    weightCapacity: Number,
    volumeCapacity: Number
  },
  profileImage: { type: String },
  vehicleImage: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
