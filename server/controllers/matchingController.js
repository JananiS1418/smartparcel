import Trip from '../models/Trip.js';

// Logic to find trips that can accommodate a specific parcel
// Based on route (source/destination), date, and capacity
export const matchParcelsWithTrips = async (req, res) => {
  const { pickupLocation, dropoffLocation, weight, volume, date } = req.query;
  
  try {
    // Simple exact match logic for initial implementation
    // In a real system, this would use geospatial queries or fuzzy matching
    const normalizedPickup = pickupLocation?.trim();
    const normalizedDropoff = dropoffLocation?.trim();

    let query = {
      source: { $regex: `^${normalizedPickup}$`, $options: 'i' },
      destination: { $regex: `^${normalizedDropoff}$`, $options: 'i' },
      status: 'upcoming'
    };
    
    // Optional date filtering
    if (date) {
      query.departureDate = { $gte: new Date(date) };
    }
    
    const potentialTrips = await Trip.find(query).populate('driver', 'name rating email phone truckDetails');
    
    // Filter by capacity
    const filteredTrips = potentialTrips.filter(trip => 
      trip.availableWeight >= (Number(weight) || 0) && 
      trip.availableVolume >= (Number(volume) || 0)
    );
    
    res.json(filteredTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
