import Trip from '../models/Trip.js';

export const createTrip = async (req, res) => {
  const { source, destination, departureDate, availableWeight, availableVolume } = req.body;
  try {
    const trip = await Trip.create({
      driver: req.user._id,
      source,
      destination,
      departureDate,
      availableWeight,
      availableVolume
    });
    const populatedTrip = await Trip.findById(trip._id).populate('driver', 'name email phone rating truckDetails');
    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const query =
      req.user.role === 'driver'
        ? { driver: req.user._id }
        : req.user.role === 'admin'
          ? {}
          : { status: 'upcoming' };

    const trips = await Trip.find(query)
      .sort({ departureDate: 1, createdAt: -1 })
      .populate('driver', 'name email phone rating truckDetails');

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDriverTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user._id })
      .sort({ departureDate: 1, createdAt: -1 })
      .populate('driver', 'name email phone rating truckDetails');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    trip.status = req.body.status || trip.status;
    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
