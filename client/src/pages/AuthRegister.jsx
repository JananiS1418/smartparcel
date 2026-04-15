import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail, MapPin, Package, Phone, ShieldCheck, Truck, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

const roleOptions = [
  { id: 'user', label: 'Sender', icon: User, description: 'Create and track parcels' },
  { id: 'collector', label: 'Collector', icon: MapPin, description: 'Receive and confirm handoffs' },
  { id: 'driver', label: 'Driver', icon: Truck, description: 'Handle pickups and updates' }
];

const AuthRegister = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'driver' ? 'driver' : 'user';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole,
    truckDetails: { model: '', licensePlate: '', weightCapacity: '', volumeCapacity: '' }
  });

  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await register(formData);
    if (success) navigate('/dashboard');
  };

  const updateField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eff8ff_50%,#ffffff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(145deg,#0f172a_0%,#153963_55%,#10b981_130%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
          <div className="absolute -left-10 top-14 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-48 w-48 rounded-full bg-sky-300/15 blur-3xl" />

          <Link to="/" className="relative z-10 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-xl font-bold">SmartParcel</span>
              <span className="block text-xs uppercase tracking-[0.25em] text-emerald-100">Delivery Workspace</span>
            </div>
          </Link>

          <div className="relative z-10 mt-20">
            <p className="text-sm font-semibold text-emerald-200">Get started</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-white">Create the account your delivery flow will recognize.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
              Use the same name and contact details you expect senders, drivers, or collectors to use during parcel handoff.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="Role-based access for sender, collector, and driver" />
              <Benefit text="Cleaner parcel matching through real collector details" />
              <Benefit text="One shared experience from booking to final receipt" />
            </div>
          </div>

          <div className="relative z-10 mt-12 rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Tip for collectors</p>
                <p className="text-sm text-white/65">Register using the same name a sender will enter, like “Jeni”, so parcels match your account correctly.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-10">
          <div>
            <p className="text-sm font-semibold text-emerald-700">New account</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Register with the details you want the delivery flow to use for parcel booking and confirmation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-7">
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Choose role</label>
              <div className="grid gap-3 md:grid-cols-3">
                {roleOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('role', item.id)}
                    className={`rounded-[1.5rem] border px-4 py-5 text-left transition-standard ${
                      formData.role === item.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${formData.role === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="mt-4 text-sm font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-[1.4rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
                {error.toLowerCase().includes('exists') && (
                  <Link to={`/login?email=${encodeURIComponent(formData.email)}`} className="mt-3 inline-flex font-semibold text-rose-700 underline">
                    Sign in to the existing account
                  </Link>
                )}
              </div>
            )}

            <div className="grid gap-5">
              <Field label="Full name">
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field label="Phone number">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="Optional, but useful for delivery updates"
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Create a password"
                    className={inputClass}
                  />
                </div>
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition-standard hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-slate-950">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

const Benefit = ({ text }) => (
  <div className="flex gap-3">
    <div className="mt-1 h-3 w-3 rounded-full bg-emerald-300" />
    <p className="text-sm text-white/75">{text}</p>
  </div>
);

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full rounded-[1.3rem] border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-950 outline-none transition-standard focus:border-emerald-500 focus:bg-white';

export default AuthRegister;
