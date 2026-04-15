import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { clearAuthCookie, generateToken, setAuthCookie } from '../utils/auth.js';

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  rating: user.rating,
  location: user.location,
  collectionArea: user.collectionArea,
  truckDetails: user.truckDetails,
  profileImage: user.profileImage,
  vehicleImage: user.vehicleImage
});

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  setAuthCookie(res, token);
  res.status(statusCode).json(serializeUser(user));
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, truckDetails } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      truckDetails: role === 'driver' ? truckDetails : undefined
    });

    if (user) {
      sendAuthResponse(res, user, 201);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (role && user.role !== role) {
        return res.status(403).json({ message: `Unauthorized: User is not registered as ${role}` });
      }

      sendAuthResponse(res, user);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json(serializeUser(req.user));
};

export const logoutUser = async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out successfully' });
};

export const updateCurrentUser = async (req, res) => {
  const { name, email, phone, location, collectionArea, truckDetails } = req.body;

  try {
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && String(existingUser._id) !== String(req.user._id)) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name?.trim() || user.name;
    user.email = email?.trim().toLowerCase() || user.email;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.collectionArea = collectionArea ?? user.collectionArea;

    if (truckDetails && user.role === 'driver') {
      user.truckDetails = {
        ...user.truckDetails?.toObject?.(),
        ...truckDetails
      };
    }

    const updatedUser = await user.save();
    res.json(serializeUser(updatedUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
