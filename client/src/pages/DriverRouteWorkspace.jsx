import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  Plus,
  Route,
  ShieldCheck,
  Truck,
  User
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTripStore from '../store/tripStore';
import useParcelStore from '../store/parcelStore';
import { formatCurrency, formatParcelStatus } from '../utils/parcel';

const DriverRouteWorkspace = () => {
  const { user } = useAuthStore();
  const { trips, createTrip, fetchDriverTrips } = useTripStore();
  const { parcels, fetchAllParcels, updateParcelStatus, updateDriverProgress } = useParcelStore();
  const [tripForm, setTripForm] = useState({
    source: 'Chennai',
    destination: 'Bangalore',
    departureDate: new Date().toISOString().slice(0, 10),
    availableWeight: '50',
    availableVolume: '10'
  });

  useEffect(() => {
    fetchDriverTrips();
    fetchAllParcels();
  }, [fetchAllParcels, fetchDriverTrips]);

  const activeParcels = useMemo(
    () =>
      parcels.filter(
        (parcel) =>
          (parcel.carrier?._id === user?._id || parcel.carrier === user?._id) &&
          ['pending', 'confirmed', 'collected', 'in_transit'].includes(parcel.status?.toLowerCase())
      ),
    [parcels, user?._id]
  );

  const handleTripChange = (key, value) => {
    setTripForm((current) => ({ ...current, [key]: value }));
  };

  const handleCreateTrip = async (event) => {
    event.preventDefault();
    const success = await createTrip(tripForm);
    if (success) {
      toast.success('Driver route created. Senders can now match this route.');
      fetchDriverTrips();
    }
  };

  const handleAccept = async (parcelId) => {
    const success = await updateParcelStatus(parcelId, 'confirmed');
    if (success) toast.success('Sender booking received. You can now contact the sender.');
  };

  const handlePickup = async (parcelId) => {
    const success = await updateParcelStatus(parcelId, 'collected');
    if (success) toast.success('Parcel marked as collected and the collector has been notified.');
  };

  const handleNearCollector = async (parcelId) => {
    const success = await updateDriverProgress(parcelId, 10);
    if (success) toast.success('Collector notified that you are within 10 km.');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_50%,#eff8ff_100%)] pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 space-y-8">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#0b2447_55%,#123d6c_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-sky-300">Driver workspace</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Set your route, receive sender bookings, and keep the collector updated.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                When your route matches the sender route, you become visible for booking. Once booked, you can see both sender and collector details here.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <Metric label="Saved routes" value={trips.length} />
              <Metric label="Assigned parcels" value={activeParcels.length} />
              <Metric label="Parcel value" value={formatCurrency(activeParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0))} />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleCreateTrip} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-700">Route setup</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Create your travel route</h2>
              </div>
              <div className="rounded-full bg-sky-50 p-3 text-sky-700">
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Field label="From">
                <input value={tripForm.source} onChange={(e) => handleTripChange('source', e.target.value)} className={inputClass} />
              </Field>
              <Field label="To">
                <input value={tripForm.destination} onChange={(e) => handleTripChange('destination', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Departure date">
                <input type="date" value={tripForm.departureDate} onChange={(e) => handleTripChange('departureDate', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Available weight">
                <input type="number" value={tripForm.availableWeight} onChange={(e) => handleTripChange('availableWeight', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Available volume">
                <input type="number" value={tripForm.availableVolume} onChange={(e) => handleTripChange('availableVolume', e.target.value)} className={inputClass} />
              </Field>
            </div>

            <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-sky-600">
              Save route
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-7 space-y-3">
              <p className="text-sm font-semibold text-slate-950">Your active routes</p>
              {trips.length ? (
                trips.map((trip) => (
                  <div key={trip._id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-950">{trip.source} to {trip.destination}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(trip.departureDate).toLocaleDateString()} • {trip.availableWeight} kg • {trip.availableVolume} volume
                    </p>
                  </div>
                ))
              ) : (
                <EmptyBlock text="No routes added yet." />
              )}
            </div>
          </form>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">Assigned parcels</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Sender and collector details</h2>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {activeParcels.length ? (
                activeParcels.map((parcel) => (
                  <article key={parcel._id} className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Parcel #{parcel._id.slice(-6).toUpperCase()}</p>
                            <h3 className="mt-1 text-xl font-bold text-slate-950">{parcel.parcelType}</h3>
                            <p className="mt-1 text-sm text-slate-500">{formatParcelStatus(parcel.status)}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <MiniRow icon={User} label="Sender" value={parcel.sender?.name || 'Unknown sender'} />
                          <MiniRow icon={Phone} label="Sender phone" value={parcel.sender?.phone || 'Not available'} />
                          <MiniRow icon={User} label="Collector" value={parcel.collectorName || 'Not provided'} />
                          <MiniRow icon={Phone} label="Collector phone" value={parcel.collectorPhone || 'Not available'} />
                          <MiniRow icon={MapPin} label="Pickup" value={parcel.pickupLocation} />
                          <MiniRow icon={Route} label="Drop-off" value={parcel.dropoffLocation} />
                        </div>
                      </div>

                      <div className="min-w-[280px] rounded-[1.5rem] bg-slate-950 p-5 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Parcel value</p>
                        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(parcel.price)}</p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {parcel.status === 'pending' && (
                            <button type="button" onClick={() => handleAccept(parcel._id)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-100">
                              Accept booking
                            </button>
                          )}
                          {parcel.status === 'confirmed' && (
                            <button type="button" onClick={() => handlePickup(parcel._id)} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                              Parcel collected
                            </button>
                          )}
                          {['collected', 'in_transit'].includes(parcel.status) && (
                            <button type="button" onClick={() => handleNearCollector(parcel._id)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
                              Notify within 10 km
                            </button>
                          )}
                        </div>

                        {parcel.collectorDistanceKm !== null && (
                          <p className="mt-4 text-sm text-slate-300">Distance to collector: {parcel.collectorDistanceKm} km</p>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyBlock text="No sender bookings are assigned right now." />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const inputClass =
  'w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition-standard focus:border-sky-500 focus:bg-white';

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</span>
    {children}
  </label>
);

const Metric = ({ label, value }) => (
  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-3 text-3xl font-bold text-white">{value}</p>
  </div>
);

const MiniRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

const EmptyBlock = ({ text }) => (
  <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
    {text}
  </div>
);

export default DriverRouteWorkspace;
