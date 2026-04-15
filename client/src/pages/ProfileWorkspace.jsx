import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Route,
  Save,
  ShieldCheck,
  Truck,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useParcelStore from '../store/parcelStore';
import useTripStore from '../store/tripStore';
import { formatCurrency, formatParcelStatus } from '../utils/parcel';

const ProfileWorkspace = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { parcels, fetchAllParcels, settlePayment, loading } = useParcelStore();
  const { trips, fetchDriverTrips } = useTripStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  useEffect(() => {
    fetchAllParcels();
    if (user?.role === 'driver') {
      fetchDriverTrips();
    }
  }, [fetchAllParcels, fetchDriverTrips, user?.role]);

  const pendingCollectorSettlements = useMemo(
    () => parcels.filter((parcel) => parcel.paymentMethod === 'collector_pay' && parcel.paymentStatus !== 'completed'),
    [parcels]
  );

  const roleStats = useMemo(() => {
    if (user?.role === 'collector') {
      return [
        { label: 'Assigned parcels', value: parcels.length, icon: Package },
        { label: 'Pending settlements', value: pendingCollectorSettlements.length, icon: CircleDollarSign },
        { label: 'Completed receipts', value: parcels.filter((parcel) => parcel.status === 'delivered').length, icon: CheckCircle2 }
      ];
    }

    if (user?.role === 'driver') {
      return [
        { label: 'Saved routes', value: trips.length, icon: Route },
        { label: 'Assigned parcels', value: parcels.filter((parcel) => parcel.carrier?._id === user?._id || parcel.carrier === user?._id).length, icon: Truck },
        { label: 'Collected value', value: formatCurrency(parcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0)), icon: CreditCard }
      ];
    }

    return [
      { label: 'Booked parcels', value: parcels.length, icon: Package },
      { label: 'Active shipments', value: parcels.filter((parcel) => parcel.status !== 'delivered').length, icon: Route },
      { label: 'Collector-pay bookings', value: pendingCollectorSettlements.length, icon: CircleDollarSign }
    ];
  }, [parcels, pendingCollectorSettlements.length, trips.length, user?._id, user?.role]);

  const handleSave = async () => {
    const success = await updateUser(formData);

    if (success) {
      setIsEditing(false);
      toast.success('Profile updated.');
    } else {
      toast.error('We could not save your profile changes.');
    }
  };

  const handleSettlePayment = async (parcelId) => {
    const success = await settlePayment(parcelId);
    if (success) {
      toast.success('Collector payment settled.');
    }
  };

  const roleTitle = {
    user: 'Sender profile',
    driver: 'Driver profile',
    collector: 'Collector profile',
    admin: 'Admin profile'
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_55%,#eef7ff_100%)] pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#123b67_50%,#1d4ed8_120%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-sky-300/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold text-sky-200">Account center</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">{roleTitle[user?.role] || 'Profile'}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                Manage your account details, review your role-specific activity, and keep your delivery information ready for the next parcel handoff.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white/10 text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{user?.name}</p>
                  <p className="text-sm text-white/70">{user?.email}</p>
                  <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {roleStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-sky-200" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-sky-700">Personal details</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">Contact information</h2>
                </div>
                <button
                  type="button"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Save changes' : 'Edit profile'}
                </button>
              </div>

              <div className="mt-7 grid gap-4">
                <ProfileField icon={User} label="Full name" value={formData.name} isEditing={isEditing} onChange={(value) => setFormData((current) => ({ ...current, name: value }))} />
                <ProfileField icon={Mail} label="Email" value={formData.email} isEditing={isEditing} onChange={(value) => setFormData((current) => ({ ...current, email: value }))} type="email" />
                <ProfileField icon={Phone} label="Phone" value={formData.phone} isEditing={isEditing} onChange={(value) => setFormData((current) => ({ ...current, phone: value }))} placeholder="Add your phone number" />
                <ProfileField icon={MapPin} label="Location" value={formData.location} isEditing={isEditing} onChange={(value) => setFormData((current) => ({ ...current, location: value }))} placeholder="Add your address or hub location" />
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      location: user?.location || ''
                    });
                  }}
                  className="mt-4 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-950"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">Account actions</p>
              <div className="mt-5 space-y-3">
                <ActionPill icon={ShieldCheck} title="Account verified" text="Your account is active and ready for delivery updates." />
                <ActionPill icon={Mail} title="Email on file" text={user?.email || 'No email added'} />
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex w-full items-center justify-center rounded-[1.3rem] border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {user?.role === 'collector' && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Collector payment center</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">Pending settlements</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      When the sender chose “collector pays later,” those parcels appear here until you settle the payment.
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {pendingCollectorSettlements.length ? (
                    pendingCollectorSettlements.map((parcel) => (
                      <div key={parcel._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{parcel.parcelType}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              Sender: {parcel.sender?.name || 'Unknown'} • Route: {parcel.pickupLocation} to {parcel.dropoffLocation}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-emerald-700">{formatCurrency(parcel.price)}</p>
                          </div>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleSettlePayment(parcel._id)}
                            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            Settle payment
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyCard text="No collector settlements are pending right now." />
                  )}
                </div>
              </div>
            )}

            {user?.role === 'driver' && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold text-sky-700">Driver route summary</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Saved routes</h2>
                <div className="mt-7 space-y-4">
                  {trips.length ? (
                    trips.map((trip) => (
                      <div key={trip._id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-950">{trip.source} to {trip.destination}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(trip.departureDate).toLocaleDateString()} • {trip.availableWeight} kg • {trip.availableVolume} volume
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyCard text="No driver routes are saved yet." />
                  )}
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">Parcel activity</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Recent parcel summary</h2>
              <div className="mt-7 space-y-4">
                {parcels.length ? (
                  parcels.slice(0, 5).map((parcel) => (
                    <div key={parcel._id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{parcel.parcelType}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {parcel.pickupLocation} to {parcel.dropoffLocation}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {formatParcelStatus(parcel.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyCard text="No parcel activity yet." />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, type = 'text', placeholder = 'Not added yet' }) => (
  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-standard focus:border-sky-500"
      />
    ) : (
      <p className="mt-3 text-base font-semibold text-slate-950">{value || placeholder}</p>
    )}
  </div>
);

const ActionPill = ({ icon: Icon, title, text }) => (
  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  </div>
);

const EmptyCard = ({ text }) => (
  <div className="rounded-[1.6rem] border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
    {text}
  </div>
);

export default ProfileWorkspace;
