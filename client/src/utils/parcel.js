export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatParcelStatus = (status = 'pending') => {
  const labels = {
    pending: 'Waiting for driver acceptance',
    confirmed: 'Driver accepted',
    collected: 'Picked up from sender',
    in_transit: 'In transit to collector',
    delivered: 'Delivered to collector'
  };

  return labels[status] || status;
};

export const getParcelStepIndex = (status = 'pending') => {
  const order = ['pending', 'confirmed', 'collected', 'in_transit', 'delivered'];
  return Math.max(order.indexOf(status), 0);
};

export const getParcelTimeline = (parcel) => {
  const stepIndex = getParcelStepIndex(parcel?.status?.toLowerCase());

  return [
    {
      key: 'pending',
      label: 'Booked',
      description: 'The sender created the shipment and assigned a collector.'
    },
    {
      key: 'confirmed',
      label: 'Accepted',
      description: 'The driver accepted the parcel request.'
    },
    {
      key: 'collected',
      label: 'Picked Up',
      description: 'The driver collected the parcel from the sender.'
    },
    {
      key: 'in_transit',
      label: 'On the Way',
      description: 'The parcel is moving toward the collector.'
    },
    {
      key: 'delivered',
      label: 'Completed',
      description: 'The collector received the parcel.'
    }
  ].map((step, index) => ({
    ...step,
    state: index < stepIndex ? 'complete' : index === stepIndex ? 'active' : 'upcoming'
  }));
};

export const getCollectorTabs = (parcels = []) => {
  const pending = parcels.filter((parcel) =>
    ['pending', 'confirmed'].includes(parcel.status?.toLowerCase())
  );
  const inTransit = parcels.filter((parcel) =>
    ['collected', 'in_transit'].includes(parcel.status?.toLowerCase())
  );
  const payments = parcels.filter(
    (parcel) => parcel.paymentMethod === 'collector_pay' && parcel.paymentStatus !== 'completed'
  );

  return { pending, inTransit, payments };
};
