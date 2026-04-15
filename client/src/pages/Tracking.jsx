import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Truck, Shield, Clock, ArrowRight, Search, Filter, Star, Info, ChevronDown, CheckCircle2, Navigation, Users, LifeBuoy, Activity, Globe, Zap, Box, Compass, ShieldCheck, AlertCircle } from 'lucide-react';
import useParcelStore from '../store/parcelStore';

const Tracking = () => {
  const [currentStatus] = useState('In Transit');
  const { parcels, fetchUserParcels } = useParcelStore();

  useEffect(() => {
    fetchUserParcels();
  }, [fetchUserParcels]);

  // Find the active parcel to track
  const activeParcel = parcels.find(p => !['delivered', 'cancelled'].includes(p.status?.toLowerCase())) || parcels[0];
  
  // Create dynamic driver details based on the parcel
  const driverName = activeParcel?.carrier?.name || 'Authorized Carrier';
  const driverInitials = driverName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AC';
  const vehicleName = activeParcel?.carrier?.truckDetails?.model || 'White Transit Van';
  const logisticsCompany = 'Enterprise Logistics';
  
  // Format shipment ID
  const shipmentId = activeParcel ? `SPD-${activeParcel._id.substring(activeParcel._id.length - 6).toUpperCase()}` : "SPD-7291-ZX901";
  
  // Dynamic steps based on status
  const currentStat = activeParcel?.status?.toLowerCase() || 'in_transit';
  const steps = [
    { label: 'Order Confirmed', status: 'completed', time: activeParcel ? new Date(activeParcel.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '10:30 AM', desc: 'Your booking has been received and confirmed.' },
    { label: 'Picked Up', status: currentStat === 'pending' || currentStat === 'confirmed' ? 'pending' : 'completed', time: '--:--', desc: 'Your package has been picked up by the driver.' },
    { label: 'On The Way', status: currentStat === 'collected' || currentStat === 'in_transit' ? 'active' : currentStat === 'delivered' ? 'completed' : 'pending', time: 'Expected Shortly', desc: 'Your package is on its way to the destination.' },
    { label: 'Delivered', status: currentStat === 'delivered' ? 'completed' : 'pending', time: '--:--', desc: 'Package delivered successfully.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      
      {/* Telemetry Header */}
      <div className="bg-slate-900 text-white sticky top-0 z-30 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
             <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
               <Package className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Tracking ID</p>
               <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono">{shipmentId}</h2>
             </div>
          </div>
          <div className="flex items-center gap-8">
             <div className="text-right hidden md:block">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-0.5 h-2.5 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-700'}`} />)}
                </div>
             </div>
             <div className="h-8 w-px bg-slate-800 hidden md:block" />
             <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Tracking</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Timeline Card */}
            <div className="enterprise-card p-10 relative overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                  <div>
                     <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">Order Journey</p>
                     <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Tracking Overview</h3>
                  </div>
                  <div className="text-left md:text-right">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                     <p className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Today, 20:30 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-1">LCL</span></p>
                  </div>
               </div>

               {/* Professional Timeline */}
               <div className="relative py-8 px-4">
                  <div className="absolute top-[2.75rem] left-0 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 w-[65%] transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                  </div>
                  
                  <div className="relative flex justify-between">
                     {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center group relative">
                           <div className={`w-12 h-12 rounded-xl border-4 border-white shadow-lg flex items-center justify-center transition-standard z-10 ${
                             step.status === 'completed' ? 'bg-blue-600 text-white' : 
                             step.status === 'active' ? 'bg-slate-900 text-blue-400 border-blue-50 scale-110' : 
                             'bg-slate-50 text-slate-200 border-slate-50'
                           }`}>
                              {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                               step.status === 'active' ? <Activity className="w-5 h-5 animate-pulse" /> : 
                               <Clock className="w-4 h-4" />}
                           </div>
                           <div className={`absolute top-16 text-center min-w-[140px] ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                              <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${step.status === 'active' ? 'text-blue-600' : 'text-slate-900'}`}>{step.label}</p>
                              <p className="font-bold text-[10px] text-slate-400 italic">{step.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Active Status Box */}
               <div className="mt-20 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                     <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest Update: {steps.find(s => s.status === 'active')?.label}</p>
                     <p className="text-sm font-medium text-slate-700 italic">
                        "{steps.find(s => s.status === 'active')?.desc}"
                     </p>
                  </div>
               </div>
            </div>

            {/* Geospatial Map Terminal */}
            <div className="bg-slate-900 rounded-[2.5rem] h-[540px] relative overflow-hidden shadow-2xl group border-4 border-white">
               {/* Map Background */}
               <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-118.2437,34.0522,10/1000x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwM2YycXBndWRMOGF3Z3MifQ.m69_psdf397_sh-8366')] bg-cover opacity-20 grayscale group-hover:scale-105 transition-transform duration-[6000ms]" />
               
               {/* Pulse Animation */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_40px_15px_rgba(37,99,235,0.6)] animate-ping" />
               </div>

               {/* Map Hud */}
               <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-standard">
                           <Compass className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Location</p>
                           <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">12.4 mi away / <span className="text-blue-600">Austin</span></h4>
                        </div>
                     </div>
                     <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-10">
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Current Speed</p>
                           <p className="text-xl font-bold text-slate-900 tracking-tight">65<span className="text-[10px] ml-1">km/h</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">ETA</p>
                           <p className="text-xl font-bold text-slate-900 tracking-tight">45<span className="text-[10px] ml-1">mins</span></p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Carrier Info */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl text-white group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl" />
               <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-10">Driver Details</p>
               
               <div className="flex flex-col items-center mb-10">
                  <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-blue-500/20 flex items-center justify-center p-1 group-hover:border-blue-500/50 transition-standard overflow-hidden shadow-[0_0_25px_rgba(37,99,235,0.4)] relative">
                     <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />
                     {activeParcel?.carrier?.profileImage ? (
                         <img src={activeParcel.carrier.profileImage} className="object-cover w-full h-full rounded-full transition-standard relative z-10" alt="Driver" />
                     ) : (
                         <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-2xl relative z-10">
                            {driverInitials}
                         </div>
                     )}
                  </div>
                  <h4 className="text-xl font-bold text-white mt-6 tracking-tight">{driverName}</h4>
                  <div className="flex items-center gap-1 mt-2 mb-1 text-yellow-500">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">{logisticsCompany}</p>
               </div>

               <div className="space-y-3 mb-10">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-standard group/item">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Info</span>
                     <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-blue-400 group-hover/item:translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold text-white uppercase italic">{vehicleName}</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-standard">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Driver Status</span>
                     <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                     </span>
                  </div>
               </div>

               <Link to="/support" className="w-full py-4 bg-blue-600 text-white hover:bg-white hover:text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-standard shadow-lg flex items-center justify-center gap-2 group/btn">
                  <LifeBuoy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Contact Support
               </Link>
            </div>

            {/* Shipment Specs */}
            <div className="enterprise-card p-10">
               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-10">Package Details</p>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-5">
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">4.5 <span className="text-[10px] text-slate-300">KG</span></p>
                     </div>
                     <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-50 pb-5">
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Size</p>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">Medium Box</p>
                     </div>
                     <Box className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping Speed</p>
                        <p className="text-lg font-bold text-slate-900 tracking-tight uppercase">Standard <span className="text-blue-600">Delivery</span></p>
                     </div>
                     <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
               </div>
               
               <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] italic">Powered by SmartParcel™</p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
