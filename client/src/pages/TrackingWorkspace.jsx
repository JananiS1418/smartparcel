import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, Package, Phone, ShieldCheck, Truck, User } from 'lucide-react';
import useParcelStore from '../store/parcelStore';
import { formatCurrency, formatParcelStatus, getParcelTimeline, getParcelStepIndex } from '../utils/parcel';

const TrackingWorkspace = () => {
  const { parcels, fetchUserParcels, loading } = useParcelStore();

  useEffect(() => {
    fetchUserParcels();
  }, [fetchUserParcels]);

  const activeParcel = useMemo(
    () => parcels.find((parcel) => parcel.status !== 'delivered') || parcels[0],
    [parcels]
  );

  const timeline = getParcelTimeline(activeParcel);
  const progress = `${((getParcelStepIndex(activeParcel?.status) + 1) / 5) * 100}%`;

  if (!loading && !activeParcel) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-3xl font-bold text-slate-950">No parcels to track yet</h1>
          <p className="mt-3 text-sm text-slate-500">
            Once a sender creates a parcel, the live tracking view will show each step here.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 space-y-8">
        <section className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold text-sky-300">Live parcel tracking</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Parcel #{activeParcel?._id?.slice(-6).toUpperCase()}</h1>
              <p className="mt-3 text-sm text-slate-300">{formatParcelStatus(activeParcel?.status)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Estimated charge</p>
              <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(activeParcel?.price)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">Current progress</p>
                <h2 className="text-2xl font-bold text-slate-950">Shipment journey</h2>
              </div>
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                {activeParcel?.dropoffLocation}
              </span>
            </div>

            <div className="mt-8 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-sky-600 transition-all duration-500" style={{ width: progress }} />
            </div>

            <div className="mt-8 space-y-5">
              {timeline.map((step) => (
                <div key={step.key} className="flex gap-4 rounded-[1.5rem] border border-slate-200 p-4">
                  <div
                    className={`mt-1 h-4 w-4 rounded-full ${
                      step.state === 'complete'
                        ? 'bg-emerald-500'
                        : step.state === 'active'
                          ? 'bg-sky-500'
                          : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{step.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">People on this parcel</p>
              <div className="mt-5 space-y-4">
                <DetailRow icon={User} label="Sender" value={activeParcel?.sender?.name || 'Unknown sender'} />
                <DetailRow icon={Truck} label="Driver" value={activeParcel?.carrier?.name || 'Waiting for driver'} />
                <DetailRow icon={User} label="Collector" value={activeParcel?.collectorName || 'Collector not set'} />
                <DetailRow icon={Phone} label="Collector phone" value={activeParcel?.collectorPhone || 'Not provided'} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">Route details</p>
              <div className="mt-5 space-y-4">
                <DetailRow icon={MapPin} label="Pickup" value={activeParcel?.pickupLocation} />
                <DetailRow icon={MapPin} label="Drop-off" value={activeParcel?.dropoffLocation} />
                <DetailRow
                  icon={ShieldCheck}
                  label="Payment"
                  value={activeParcel?.paymentMethod === 'collector_pay' ? 'Collector pays on receipt' : 'Sender paid during booking'}
                />
                <DetailRow
                  icon={CheckCircle2}
                  label="Payment status"
                  value={activeParcel?.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value || 'Not available'}</p>
  </div>
);

export default TrackingWorkspace;
