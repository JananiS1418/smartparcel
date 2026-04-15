import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, MapPin, Package, ShieldCheck, Truck, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

const roleOptions = [
  { id: 'user', label: 'Sender', icon: User, description: 'Book and track parcels' },
  { id: 'collector', label: 'Collector', icon: MapPin, description: 'Receive and confirm parcels' },
  { id: 'driver', label: 'Driver', icon: Truck, description: 'Pickup and update delivery status' }
];

const AuthLogin = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(email, password, role);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eff7ff_50%,#ffffff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(145deg,#0f172a_0%,#12325b_55%,#1d4ed8_120%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
          <div className="absolute -right-12 top-16 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -left-8 bottom-8 h-36 w-36 rounded-full bg-emerald-300/15 blur-3xl" />

          <Link to="/" className="relative z-10 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-xl font-bold">SmartParcel</span>
              <span className="block text-xs uppercase tracking-[0.25em] text-sky-200">Delivery Workspace</span>
            </div>
          </Link>

          <div className="relative z-10 mt-20">
            <p className="text-sm font-semibold text-sky-200">Welcome back</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-white">Sign in to your delivery workspace.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
              Continue where you left off, whether you are booking a parcel, driving a pickup, or receiving a shipment as a collector.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="One role-aware workspace for sender, driver, and collector" />
              <Benefit text="Cleaner parcel status updates across every handoff" />
              <Benefit text="Fast tracking, payment, and receipt confirmation flow" />
            </div>
          </div>

          <div className="relative z-10 mt-12 rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Secure sign-in flow</p>
                <p className="text-sm text-white/65">Choose the correct role and use the same account details used during registration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-10">
          <div>
            <p className="text-sm font-semibold text-sky-700">Account access</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Select your role, enter your email and password, and continue to your workspace.
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
                    onClick={() => setRole(item.id)}
                    className={`rounded-[1.5rem] border px-4 py-5 text-left transition-standard ${
                      role === item.id ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${role === item.id ? 'text-sky-600' : 'text-slate-400'}`} />
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
              </div>
            )}

            <div className="grid gap-5">
              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-standard hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition-standard hover:bg-sky-600 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-sky-700 hover:text-slate-950">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

const Benefit = ({ text }) => (
  <div className="flex gap-3">
    <div className="mt-1 h-3 w-3 rounded-full bg-sky-300" />
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
  'w-full rounded-[1.3rem] border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-sm text-slate-950 outline-none transition-standard focus:border-sky-500 focus:bg-white';

export default AuthLogin;
