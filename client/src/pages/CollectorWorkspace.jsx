import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
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
import useParcelStore from '../store/parcelStore';
import { formatCurrency, formatParcelStatus, getCollectorTabs, getParcelTimeline } from '../utils/parcel';

const tabConfig = {
  manifest: {
    label: 'Incoming parcels',
    title: 'Parcels waiting for pickup or driver acceptance',
    emptyTitle: 'No incoming parcels yet',
    emptyText: 'As soon as a sender assigns a parcel to you, it will appear here.'
  },
  transit: {
    label: 'In transit',
    title: 'Parcels currently moving to your location',
    emptyTitle: 'Nothing is on the way right now',
    emptyText: 'Once the driver picks up a parcel, you will see live handoff details here.'
  },
  settlements: {
    label: 'Payments',
    title: 'Parcels that still need collector payment',
    emptyTitle: 'No payments are pending',
    emptyText: 'Any cash-on-delivery or collector-paid parcel will appear here until payment is settled.'
  }
};

const tabRouteMap = {
  manifest: '/dashboard',
  transit: '/transit',
  settlements: '/settlements'
};

const CollectorWorkspace = () => {
  const { user } = useAuthStore();
  const { parcels, fetchAllParcels, settlePayment, submitReview, updateParcelStatus, loading } = useParcelStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAllParcels();
  }, [fetchAllParcels]);

  const activeTab = useMemo(() => {
    if (location.pathname === '/transit' || location.hash === '#transit') return 'transit';
    if (location.pathname === '/settlements' || location.hash === '#settlements') return 'settlements';
    return 'manifest';
  }, [location.hash, location.pathname]);

  const { pending, inTransit, payments } = useMemo(() => getCollectorTabs(parcels), [parcels]);

  const tabData = {
    manifest: pending,
    transit: inTransit,
    settlements: payments
  };

  const stats = [
    { label: 'Assigned to you', value: parcels.length, icon: Package },
    { label: 'Currently moving', value: inTransit.length, icon: Route },
    { label: 'Need payment', value: payments.length, icon: CircleDollarSign },
    {
      label: 'Completed',
      value: parcels.filter((parcel) => parcel.status === 'delivered').length,
      icon: CheckCircle2
    }
  ];

  const closeDialogs = () => {
    setSelectedParcel(null);
    setShowPaymentModal(false);
    setShowReceiveModal(false);
    setRating(5);
    setFeedback('');
  };

  const handleSettlePayment = async () => {
    if (!selectedParcel) return;

    const success = await settlePayment(selectedParcel._id);
    if (success) {
      toast.success('Payment recorded successfully.');
      closeDialogs();
    }
  };

  const handleReceiveParcel = async () => {
    if (!selectedParcel) return;

    const reviewSaved = await submitReview(selectedParcel._id, rating, feedback);
    if (!reviewSaved) return;

    const delivered = await updateParcelStatus(selectedParcel._id, 'delivered');
    if (delivered) {
      toast.success('Parcel marked as received.');
      closeDialogs();
    }
  };

  const list = tabData[activeTab];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7faf7_0%,#eef6ff_45%,#ffffff_100%)] pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 space-y-8">
        <section className="rounded-[2rem] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-300">Collector workspace</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">Welcome, {user?.name}</h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                This page shows every parcel assigned to you. When the sender enters your collector
                name, your login will show the matching parcel, and driver updates will appear here
                automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                    <stat.icon className="h-4 w-4 text-emerald-300" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(tabConfig).map(([id, config]) => {
              const count = tabData[id].length;
              const active = activeTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(tabRouteMap[id])}
                  className={`rounded-[1.5rem] px-5 py-4 text-left transition-standard ${
                    active ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{config.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-white/10 text-white' : 'bg-white text-slate-900'}`}>
                      {count}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${active ? 'text-slate-300' : 'text-slate-500'}`}>{config.title}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-700">{tabConfig[activeTab].label}</p>
                <h2 className="text-2xl font-bold text-slate-950">{tabConfig[activeTab].title}</h2>
              </div>
              <button
                type="button"
                onClick={fetchAllParcels}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-950"
              >
                Refresh
              </button>
            </div>

            {list.length > 0 ? (
              list.map((parcel) => (
                <article key={parcel._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Parcel #{parcel._id.slice(-6).toUpperCase()}
                          </p>
                          <h3 className="mt-1 text-xl font-bold text-slate-950">{parcel.parcelType}</h3>
                          <p className="mt-1 text-sm text-slate-600">{formatParcelStatus(parcel.status)}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <InfoRow icon={User} label="Sender" value={parcel.sender?.name || 'Sender details unavailable'} />
                        <InfoRow icon={Truck} label="Driver" value={parcel.carrier?.name || 'Waiting for driver assignment'} />
                        <InfoRow icon={MapPin} label="Pickup" value={parcel.pickupLocation} />
                        <InfoRow icon={MapPin} label="Drop-off" value={parcel.dropoffLocation} />
                        <InfoRow icon={Phone} label="Collector phone" value={parcel.collectorPhone || 'Not provided'} />
                        <InfoRow
                          icon={CreditCard}
                          label="Payment"
                          value={`${formatCurrency(parcel.price)} • ${
                            parcel.paymentMethod === 'collector_pay' ? 'Collector pays on receipt' : 'Sender already pays'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="min-w-[280px] rounded-[1.5rem] bg-slate-50 p-5">
                      <div className="space-y-4">
                        {getParcelTimeline(parcel).map((step) => (
                          <div key={step.key} className="flex gap-3">
                            <div
                              className={`mt-1 h-3 w-3 rounded-full ${
                                step.state === 'complete'
                                  ? 'bg-emerald-500'
                                  : step.state === 'active'
                                    ? 'bg-sky-500'
                                    : 'bg-slate-300'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                              <p className="text-sm text-slate-500">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {activeTab === 'settlements' && parcel.paymentStatus !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setShowPaymentModal(true);
                            }}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Record payment
                          </button>
                        )}

                        {['collected', 'in_transit'].includes(parcel.status) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setShowReceiveModal(true);
                            }}
                            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Confirm receipt
                          </button>
                        )}

                        {parcel.status === 'delivered' && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <ShieldCheck className="h-4 w-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-xl font-bold text-slate-900">{tabConfig[activeTab].emptyTitle}</h3>
                <p className="mt-2 text-sm text-slate-500">{tabConfig[activeTab].emptyText}</p>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">How this works</p>
              <div className="mt-4 space-y-4">
                <ChecklistItem text="Sender enters your collector name when creating the parcel." />
                <ChecklistItem text="Driver accepts the job and the parcel appears under Incoming parcels." />
                <ChecklistItem text="When pickup happens, the parcel moves to In transit automatically." />
                <ChecklistItem text="You can settle payment and confirm receipt from this page." />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-emerald-300">Collector details</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p><span className="font-semibold text-white">Signed in as:</span> {user?.name}</p>
                <p><span className="font-semibold text-white">Email:</span> {user?.email}</p>
                <p><span className="font-semibold text-white">Phone:</span> {user?.phone || 'Not added yet'}</p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showPaymentModal && selectedParcel && (
        <Modal title="Confirm collector payment" onClose={closeDialogs}>
          <p className="text-sm text-slate-600">
            Record payment for parcel #{selectedParcel._id.slice(-6).toUpperCase()}.
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{formatCurrency(selectedParcel.price)}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={closeDialogs}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSettlePayment}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Save payment
            </button>
          </div>
        </Modal>
      )}

      {showReceiveModal && selectedParcel && (
        <Modal title="Confirm parcel receipt" onClose={closeDialogs}>
          <p className="text-sm text-slate-600">
            Rate the handoff and mark this parcel as received.
          </p>
          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-800">Driver rating</label>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`rounded-full p-2 ${rating >= star ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-300'}`}
                >
                  <Star className={`h-5 w-5 ${rating >= star ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="collector-feedback" className="text-sm font-semibold text-slate-800">
              Notes
            </label>
            <textarea
              id="collector-feedback"
              rows={4}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Example: Parcel arrived safely and on time."
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={closeDialogs}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleReceiveParcel}
              className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Mark as received
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);

const ChecklistItem = ({ text }) => (
  <div className="flex gap-3">
    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
    <p className="text-sm text-slate-600">{text}</p>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
    <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-950">{title}</h3>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
          Close
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  </div>
);

export default CollectorWorkspace;
