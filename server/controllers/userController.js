import Parcel from '../models/Parcel.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicDrivers = async (req, res) => {
  try {
    const city = req.query.city?.trim();
    const tripQuery = { status: 'upcoming' };

    if (city) {
      const pattern = escapeRegex(city);
      tripQuery.$or = [
        { source: { $regex: pattern, $options: 'i' } },
        { destination: { $regex: pattern, $options: 'i' } }
      ];
    }

    const trips = await Trip.find(tripQuery)
      .sort({ departureDate: 1, createdAt: -1 })
      .populate('driver', 'name rating truckDetails profileImage');

    const uniqueDrivers = [];
    const seenDrivers = new Set();

    for (const trip of trips) {
      if (!trip.driver?._id) {
        continue;
      }

      const driverId = String(trip.driver._id);
      if (seenDrivers.has(driverId)) {
        continue;
      }

      seenDrivers.add(driverId);

      uniqueDrivers.push({
        _id: trip.driver._id,
        name: trip.driver.name,
        rating: trip.driver.rating || 5,
        city: trip.destination,
        route: `${trip.source} to ${trip.destination}`,
        vehicle: trip.driver.truckDetails?.model || 'Delivery vehicle',
        availableWeight: trip.availableWeight,
        availableVolume: trip.availableVolume,
        departureDate: trip.departureDate,
        image: trip.driver.profileImage || null
      });

      if (uniqueDrivers.length >= 12) {
        break;
      }
    }

    res.json(uniqueDrivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminOverview = async (req, res) => {
  try {
    const [userCount, driverCount, parcelCount, deliveredParcels, activeTrips] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'driver' }),
      Parcel.countDocuments(),
      Parcel.find({ status: 'delivered' }).select('price'),
      Trip.countDocuments({ status: { $in: ['upcoming', 'in_progress'] } })
    ]);

    const totalRevenue = deliveredParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0);

    res.json({
      userCount,
      driverCount,
      parcelCount,
      activeTrips,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
