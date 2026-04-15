import React, { useEffect } from 'react';
import { Package, Calendar, MapPin, CheckCircle2, Clock, ChevronRight, BarChart3, Search, Activity, Database, Zap, ShieldCheck, ArrowRight, Filter, Download, ListChecks, TrendingUp } from 'lucide-react';
import useParcelStore from '../store/parcelStore';

const History = () => {
  const { parcels, fetchUserParcels, loading } = useParcelStore();

  useEffect(() => {
    fetchUserParcels();
  }, [fetchUserParcels]);

  const deliveredParcels = parcels.filter(p => p.status?.toLowerCase() === 'delivered');
  const totalSent = parcels.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Header & Quick stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider mb-2">Network Archive</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shipment Records</h1>
          </div>
          <div className="flex items-center gap-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Shipments</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalSent}</p>
             </div>
             <div className="h-10 w-px bg-slate-100" />
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed Delivery</p>
                <p className="text-2xl font-bold text-blue-600 tracking-tight">{deliveredParcels.length}</p>
             </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-10 flex flex-col md:flex-row items-center gap-4 shadow-sm">
           <div className="flex items-center flex-1 w-full bg-slate-50/50 rounded-xl px-5 py-3 border border-slate-100 focus-within:border-blue-600 focus-within:bg-white transition-standard">
              <Search className="w-4 h-4 text-slate-300 mr-3" />
              <input type="text" placeholder="Search Shipment ID or Target..." className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-wider w-full text-slate-900 placeholder:text-slate-300" />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 transition-standard group">
                 <Download className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Export Logs</span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-standard">
                 <Filter className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Advanced Filtering</span>
              </button>
           </div>
        </div>

        {/* Record Ledger */}
        <div className="space-y-6">
           {loading ? (
             <div className="animate-pulse space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />)}
             </div>
           ) : parcels.length > 0 ? (
             parcels.map((parcel) => (
                <div key={parcel._id} className="enterprise-card p-8 group relative border-l-4 border-l-slate-100 hover:border-l-blue-600 overflow-hidden transition-standard">
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-standard group-hover:scale-105 ${
                           parcel.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                         }`}>
                            <Package className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic">ID: SPD-{parcel._id?.slice(-8).toUpperCase()}</p>
                            <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{parcel.parcelType || 'Standard Freight'}</h4>
                         </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 lg:px-10 border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center">
                               <MapPin className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Destination City</p>
                               <p className="text-sm font-bold text-slate-900 uppercase tracking-tight italic">{parcel.dropoffLocation}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center">
                               <Calendar className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Authorization Date</p>
                               <p className="text-sm font-bold text-slate-900 uppercase tracking-tight italic">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-t-0 pt-6 lg:pt-0">
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2 italic">Status</p>
                            <span className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest italic border ${
                              parcel.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                               {parcel.status}
                            </span>
                         </div>
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-standard scale-90 group-hover:scale-100 cursor-pointer">
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5" />
                         </div>
                      </div>
                   </div>
                </div>
             ))
           ) : (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Database className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-400 tracking-tight uppercase mb-4">No Historical Records Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 font-medium italic">The master ledger is currently empty. Initialize your first shipment to begin tracking historical asset data.</p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-standard shadow-xl active:scale-95 flex items-center gap-3"
                >
                   <Zap className="w-4 h-4" />
                   <span>Initialize New Manifest</span>
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default History;
