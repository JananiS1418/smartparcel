import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Fuel,
  MapPin,
  Package,
  Phone,
  Route,
  ShieldCheck,
  Star,
  Truck,
  User
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTripStore from '../store/tripStore';
import useParcelStore from '../store/parcelStore';
import { formatCurrency, formatParcelStatus } from '../utils/parcel';

const DriverWorkspace = () => {
  const { user } = useAuthStore();
  const { fetchDriverTrips } = useTripStore();
  const { parcels, fetchAllParcels, updateParcelStatus } = useParcelStore();

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

  const completedCount = parcels.filter(
    (parcel) => (parcel.carrier?._id === user?._id || parcel.carrier === user?._id) && parcel.status === 'delivered'
  ).length;

  const earnings = activeParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0);

  const handleAccept = async (parcelId) => {
    const success = await updateParcelStatus(parcelId, 'confirmed');
    if (success) toast.success('Parcel accepted.');
  };

  const handlePickup = async (parcelId) => {
    const success = await updateParcelStatus(parcelId, 'collected');
    if (success) toast.success('Pickup logged. Collector tracking is updated.');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_50%,#eff8ff_100%)] pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 space-y-8">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#0b2447_55%,#123d6c_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-sky-300">Driver workspace</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Stay ahead of pickups and keep collectors updated in real time.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Accept the assigned parcel, confirm pickup, and keep every handoff visible to the sender and collector.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <StatusBadge icon={Truck} text={`${activeParcels.length} active assignments`} />
                <StatusBadge icon={CheckCircle2} text={`${completedCount} completed deliveries`} />
                <StatusBadge icon={ShieldCheck} text="Collector status sync enabled" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <DriverMetric label="Live assignments" value={activeParcels.length} />
              <DriverMetric label="Current parcel value" value={formatCurrency(earnings)} />
              <DriverMetric label="Service rating" value="4.9 / 5" />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">Assigned parcels</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Pickup queue</h2>
              </div>
              <button
                type="button"
                onClick={fetchAllParcels}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
              >
                Refresh
              </button>
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
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Parcel #{parcel._id.slice(-6).toUpperCase()}
                            </p>
                            <h3 className="mt-1 text-xl font-bold text-slate-950">{parcel.parcelType}</h3>
                            <p className="mt-1 text-sm text-slate-500">{formatParcelStatus(parcel.status)}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <MiniRow icon={MapPin} label="Pickup" value={parcel.pickupLocation} />
                          <MiniRow icon={MapPin} label="Destination" value={parcel.dropoffLocation} />
                          <MiniRow icon={User} label="Collector" value={parcel.collectorName || 'Not provided yet'} />
                          <MiniRow icon={Phone} label="Sender contact" value={parcel.sender?.phone || 'Not available'} />
                        </div>
                      </div>

                      <div className="min-w-[260px] rounded-[1.5rem] bg-slate-950 p-5 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Parcel value</p>
                        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(parcel.price)}</p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {parcel.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleAccept(parcel._id)}
                              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-100"
                            >
                              Accept parcel
                            </button>
                          )}

                          {parcel.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handlePickup(parcel._id)}
                              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                            >
                              Confirm pickup
                            </button>
                          )}

                          {['collected', 'in_transit'].includes(parcel.status) && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                              <CheckCircle2 className="h-4 w-4" />
                              Collector can track now
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyBlock text="No parcels are assigned right now." />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">Driver profile</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-sky-50 text-sky-700">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{user?.name || 'Driver'}</h3>
                  <p className="text-sm text-slate-500">Assigned delivery partner</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <MiniRow icon={Truck} label="Vehicle" value={user?.truckDetails?.model || 'Van details not added'} />
                <MiniRow icon={Fuel} label="Availability" value="Ready for assigned pickups" />
                <MiniRow icon={Clock3} label="Shift status" value="Online" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Collector reviews</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-950">Recent feedback</h3>
                </div>
                <Star className="h-5 w-5 text-amber-500" />
              </div>

              <div className="mt-6 space-y-4">
                {parcels.filter((parcel) => parcel.driverRating).length ? (
                  parcels
                    .filter((parcel) => parcel.driverRating)
                    .slice(0, 3)
                    .map((parcel) => (
                      <div key={parcel._id} className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, index) => (
                            <Star key={index} className={`h-4 w-4 ${index < parcel.driverRating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                          {parcel.driverFeedback || 'Collector confirmed a smooth handoff.'}
                        </p>
                      </div>
                    ))
                ) : (
                  <EmptyBlock text="Collector reviews will appear here after completed deliveries." />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatusBadge = ({ icon: Icon, text }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
    <Icon className="h-4 w-4 text-sky-300" />
    <span>{text}</span>
  </div>
);

const DriverMetric = ({ label, value }) => (
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

export default DriverWorkspace;
