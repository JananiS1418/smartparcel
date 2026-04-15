// Mock pricing calculation logic
// In a real app, this would use Google Distance Matrix API
export const calculatePrice = (req, res) => {
  const { distance, weight, parcelType } = req.body;
  
  try {
    // Base rate: $10
    // + $0.50 per km
    // + $2.00 per kg
    // + Multiplier for fragile items
    
    let baseRate = 10;
    let distanceRate = (Number(distance) || 0) * 0.5;
    let weightRate = (Number(weight) || 0) * 2;
    
    let total = baseRate + distanceRate + weightRate;
    
    if (parcelType === 'fragile') {
      total *= 1.2;
    }
    
    res.json({
      price: Math.round(total * 100) / 100,
      currency: 'USD',
      breakdown: {
        base: baseRate,
        distance: distanceRate,
        weight: weightRate,
        multiplier: parcelType === 'fragile' ? 1.2 : 1.0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
