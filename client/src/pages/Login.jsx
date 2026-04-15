import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, User, Truck, Eye, EyeOff, Package, MapPin, ChevronRight, Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-16 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20 group-hover:bg-slate-700 transition-standard">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Smart<span className="text-blue-500">Parcel</span></span>
          </Link>
          
          <div className="mt-40 max-w-md">
            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">Enterprise Logistics Hub</p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 tracking-tight">
               Global supply <br />
               chain <span className="text-blue-500">orchestration.</span>
            </h1>
            <p className="text-base text-slate-400 font-medium leading-relaxed italic">
               Professional logistical operations and real-time asset management for the modern enterprise.
            </p>
          </div>
        </div>

        <div className="relative z-10">
           <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-6 shadow-xl">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                 <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                 <p className="text-sm font-bold text-white">Advanced Encryption</p>
                 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Multi-Node Security Protocol Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in</h2>
            <p className="text-sm text-slate-500 font-medium">Choose your role and use the same account details used during registration.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Identity Tier */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'user', label: 'Sender', icon: User },
                  { id: 'collector', label: 'Collector', icon: MapPin },
                  { id: 'driver', label: 'Driver', icon: Truck }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-standard group ${
                      role === item.id 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mb-2 transition-colors ${role === item.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                 <AlertCircle className="w-4 h-4" />
                 <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-50/80 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-standard text-sm font-semibold text-slate-900"
                    placeholder="name@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end ml-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Need help?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-11 pr-11 py-4 bg-slate-50/80 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-standard text-sm font-semibold text-slate-900 font-mono"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-standard active:scale-95 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-16 text-center text-xs font-semibold text-slate-400 tracking-wider">
            NEW TERMINAL? <Link to="/register" className="text-blue-600 hover:underline ml-1.5 uppercase font-bold">Register Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
