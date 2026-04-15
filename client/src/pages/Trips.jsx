import React, { useEffect } from 'react';
import { Truck, MapPin, Navigation, Clock, Shield, Search, Filter, AlertCircle, CheckCircle2, Activity, Zap, Compass, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import useParcelStore from '../store/parcelStore';

const Trips = () => {
  const { parcels, fetchUserParcels, loading } = useParcelStore();

  useEffect(() => {
    fetchUserParcels();
  }, [fetchUserParcels]);

  const activeTrips = parcels.filter(p => !['delivered', 'cancelled'].includes(p.status?.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider mb-2">Network Monitoring</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Logistics</h1>
          </div>
          <div className="flex items-center gap-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Vectors</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{activeTrips.length}</p>
             </div>
             <div className="h-10 w-px bg-slate-100" />
             <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">System Active</span>
             </div>
          </div>
        </div>

        {/* Operational Feed */}
        <div className="space-y-10">
           <div className="flex justify-between items-end px-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Operational Feed</h3>
              <div className="flex items-center gap-3">
                 <button className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-standard shadow-sm">
                    <Search className="w-4 h-4 text-slate-400" />
                 </button>
                 <button className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-standard shadow-sm">
                    <Filter className="w-4 h-4 text-slate-400" />
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              {loading ? (
                <div className="animate-pulse space-y-6">
                   {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200" />)}
                </div>
              ) : activeTrips.length > 0 ? (
                activeTrips.map((trip) => (
                  <div key={trip._id} className="enterprise-card p-8 group relative border-l-4 border-l-blue-600 overflow-hidden transition-standard">
                     <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                        
                        {/* Trip Identity */}
                        <div className="flex items-center gap-6 min-w-[260px]">
                           <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl group-hover:bg-blue-600 transition-standard">
                              <Compass className="w-7 h-7 text-white" />
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic leading-none">Trip ID: SPD-TRK-{trip._id?.slice(-8).toUpperCase()}</p>
                              <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{trip.dropoffLocation} Hub</h4>
                              <div className="mt-2">
                                 <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase border border-blue-100 tracking-wider font-mono shadow-sm">{trip.status || 'Active'}</span>
                              </div>
                           </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 flex items-center gap-8 min-w-[300px] border-t xl:border-t-0 pt-6 xl:pt-0 border-slate-50">
                           <div className="text-left w-24">
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1 leading-none">Origin</p>
                              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight italic truncate">{trip.pickupLocation}</p>
                           </div>
                           
                           <div className="relative flex-1 flex items-center px-2">
                              <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                                 <div className="h-full bg-blue-600 w-[65%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                              </div>
                              <div className="absolute left-[65%] -translate-x-1/2 -top-2 flex flex-col items-center">
                                 <div className="bg-slate-900 p-1.5 rounded-lg shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-standard">
                                    <Truck className="w-3 h-3 text-white" />
                                 </div>
                              </div>
                           </div>

                           <div className="text-right w-24">
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1 leading-none">Terminal</p>
                              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight italic truncate">{trip.dropoffLocation}</p>
                           </div>
                        </div>

                        {/* Action Box */}
                        <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-6 border-t xl:border-t-0 pt-6 xl:pt-0 border-slate-50 min-w-[200px]">
                           <div className="text-left xl:text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Estimated Window</p>
                              <p className="text-lg font-bold text-slate-900 tracking-tight uppercase">T-Minus 04:30 <span className="text-[9px] font-bold text-slate-300">HRS</span></p>
                           </div>
                           <Link 
                             to="/tracking" 
                             className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-standard shadow-lg shadow-slate-900/10 active:scale-95 flex items-center gap-3"
                           >
                             Watch Live
                             <Activity className="w-4 h-4" />
                           </Link>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-400 tracking-tight uppercase mb-4">No Active Units Detected</h3>
                   <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 font-medium italic">The global dashboard registry contains no active in-transit units for your account. Systems are currently idle.</p>
                   <button 
                     onClick={() => window.location.href = '/dashboard'}
                     className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-standard shadow-xl active:scale-95 flex items-center gap-3"
                   >
                      <Zap className="w-4 h-4" />
                      <span>Initiate New Deployment</span>
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
