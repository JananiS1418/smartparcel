import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Truck, MapPin, Phone, Package, Clock, CheckCircle2, Navigation, Star, ChevronRight, Bell, User, ShieldCheck, Box, Activity, TrendingUp, LayoutDashboard, Route, ArrowRight, MessageSquare } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTripStore from '../store/tripStore';
import useParcelStore from '../store/parcelStore';

const DriverDashboard = () => {
  const { user } = useAuthStore();
  const { trips, fetchDriverTrips, updateTripStatus, loading: tripsLoading } = useTripStore();
  const { parcels, fetchAllParcels, updateParcelStatus } = useParcelStore();
  
  useEffect(() => {
    fetchDriverTrips();
    fetchAllParcels();
  }, [fetchDriverTrips, fetchAllParcels]);

  const handleConfirmLocation = async (parcelId) => {
    await updateParcelStatus(parcelId, 'confirmed');
  };

  const handleCollectParcel = async (parcelId) => {
    await updateParcelStatus(parcelId, 'collected');
    toast.success('Collector tracking is now updated.');
  };

  const activeTasks = parcels.filter(
    (p) =>
      (p.carrier?._id === user?._id || p.carrier === user?._id) &&
      ['pending', 'confirmed', 'collected', 'in_transit'].includes(p.status?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
               <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Fleet Operations Control</p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Driver dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Synchronized</span>
             </div>
             <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span className="text-xs font-bold text-slate-900">4.98 Rating</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* Profile Card */}
             <div className="enterprise-card p-8 flex flex-col items-center">
                <div className="relative mb-6">
                   {user?.profileImage ? (
                      <img src={user.profileImage} alt="Driver" className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-md" />
                   ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm text-slate-300">
                         <User className="w-8 h-8" />
                      </div>
                   )}
                   <div className="absolute -bottom-1 -right-1 bg-white border border-slate-100 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                   </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">{user?.name || 'Assigned driver'}</h3>
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em] mb-8 italic">Accept parcels, confirm pickup, and keep collectors informed.</p>

                <div className="w-full grid grid-cols-2 gap-4">
                   <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Daily Yield</p>
                      <p className="text-lg font-bold text-slate-900 tracking-tight">₹1,428</p>
                   </div>
                   <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Success Rate</p>
                      <p className="text-lg font-bold text-slate-900 tracking-tight">98.4%</p>
                   </div>
                </div>
             </div>

             {/* Vehicle Metrics */}
             <div className="enterprise-card p-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-20 transition-standard group-hover:scale-110 group-hover:rotate-12 translate-x-4 -translate-y-4">
                   <Truck className="w-20 h-20 text-slate-100" />
                </div>
                <div className="flex items-center gap-2 mb-8 relative">
                   <Activity className="w-4 h-4 text-blue-600" />
                   <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Fleet Capacity Metrics</p>
                </div>
                
                <div className="space-y-6 relative">
                   <div>
                      <div className="flex justify-between items-end mb-2.5 font-bold text-[9px] uppercase tracking-widest">
                         <span className="text-slate-400">Payload Load</span>
                         <span className="text-blue-600">84%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 w-[84%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.2)]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-end mb-2.5 font-bold text-[9px] uppercase tracking-widest">
                         <span className="text-slate-400">Cubic Volume</span>
                         <span className="text-emerald-500">66%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[66%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Deployment Manifest */}
             <div>
                <div className="flex justify-between items-center mb-6 px-2">
                   <h2 className="text-sm font-bold text-slate-900 tracking-tight">Assigned parcels</h2>
                   <div className="flex items-center gap-2">
                      <span className="bg-white text-slate-900 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
                         {activeTasks.length} Assignments Active
                      </span>
                   </div>
                </div>

                <div className="space-y-3">
                   {activeTasks.length === 0 ? (
                     <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-center">
                        <div className="bg-slate-50 p-4 rounded-2xl mb-6 shadow-inner">
                           <Box className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">No active deployment requests detected in registry.</p>
                     </div>
                   ) : (
                     activeTasks.map((parcel) => (
                        <div key={parcel._id} className="enterprise-card p-6 border-l-4 group relative overflow-hidden transition-standard hover:translate-x-1 shadow-sm" style={{ borderLeftColor: parcel.status?.toLowerCase() === 'pending' ? '#fbbf24' : parcel.status?.toLowerCase() === 'confirmed' ? '#2563eb' : '#10b981' }}>
                           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                              <div className="flex items-center gap-5">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-standard border ${
                                    parcel.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    parcel.status?.toLowerCase() === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                 }`}>
                                    <Package className="w-6 h-6" />
                                 </div>
                                 <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ID: SCR-MD-#{parcel._id.substring(parcel._id.length - 6).toUpperCase()}</span>
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                                       {parcel.parcelType} <span className="text-slate-400 font-medium ml-1">· {parcel.weight}kg Gross</span>
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic leading-none">
                                       <MapPin className="w-3 h-3 text-slate-300" />
                                       <span>Pickup: {parcel.pickupLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-2">
                                       <User className="w-3 h-3 text-slate-300" />
                                       <span>Collector: {parcel.collectorName || 'Not provided yet'}</span>
                                    </div>
                                    {parcel.status?.toLowerCase() !== 'pending' && parcel.sender?.phone && (
                                       <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold uppercase tracking-widest leading-none mt-2">
                                          <Phone className="w-3 h-3 text-blue-500" />
                                          <span>Sender Contact: {parcel.sender.phone} ({parcel.sender.name})</span>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              <div className="w-full lg:w-auto flex items-center">
                                 {parcel.status?.toLowerCase() === 'pending' && (
                                    <button 
                                       onClick={() => handleConfirmLocation(parcel._id)}
                                       className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-standard flex items-center justify-center gap-2.5 shadow-lg shadow-slate-900/10 active:scale-95"
                                    >
                                       <span>Accept Pickup</span>
                                       <Route className="w-3.5 h-3.5" />
                                    </button>
                                 )}

                                 {parcel.status?.toLowerCase() === 'confirmed' && (
                                    <button 
                                       onClick={() => handleCollectParcel(parcel._id)}
                                       className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-standard flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/10 active:scale-95"
                                    >
                                       <span>Log as Picked Up</span>
                                       <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                 )}

                                 {['collected', 'in_transit'].includes(parcel.status?.toLowerCase()) && (
                                    <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-600 px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm italic font-mono">
                                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                       <span>Collector can now track this parcel</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))
                   )}
                </div>
             </div>

             {/* Performance Analytics */}
             <div className="enterprise-card p-8">
                <div className="flex justify-between items-center mb-8 px-2">
                   <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Network Analytics</h3>
                   </div>
                   <button className="text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 group hover:text-slate-900 transition-standard">
                      Detailed Log <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-standard" />
                   </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                   <div className="space-y-2.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Net Valuation</p>
                      <div className="flex items-baseline gap-2">
                         <p className="text-xl font-bold text-slate-900 tracking-tight">₹4,892</p>
                         <div className="text-emerald-500 text-[9px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>+12%</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-2.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Fleet Distance</p>
                      <p className="text-xl font-bold text-slate-900 tracking-tight">1,240 <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">km</span></p>
                   </div>
                   <div className="space-y-2.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Fuel Efficiency</p>
                      <p className="text-xl font-bold text-slate-900 tracking-tight">18.2 <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">km/l</span></p>
                   </div>
                </div>
             </div>

             {/* Service Quality Feed */}
             <div className="enterprise-card p-8">
                <div className="flex justify-between items-center mb-8 px-2">
                   <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Service Quality Feed</h3>
                   </div>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Collector Reviews</span>
                </div>

                <div className="space-y-4">
                   {parcels.filter(p => p.driverRating).length > 0 ? (
                      parcels.filter(p => p.driverRating).map((parcel, index) => (
                         <div key={index} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-6">
                            <div className="space-y-2 flex-1">
                               <div className="flex items-center gap-1.5">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-3 h-3 ${i < parcel.driverRating ? 'text-amber-500 fill-current' : 'text-slate-200'}`} />
                                  ))}
                                  <span className="ml-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest">ID: {parcel._id?.slice(-6).toUpperCase()}</span>
                               </div>
                               <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic">"{parcel.driverFeedback || 'Standard operational excellence reported.'}"</p>
                            </div>
                            <div className="text-right flex flex-col justify-center border-l border-slate-100 pl-6 shrink-0">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Delivered to Hub</p>
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="py-10 text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No service reviews recorded yet.</p>
                      </div>
                   )}
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
