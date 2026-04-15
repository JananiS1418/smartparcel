import React, { useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  DollarSign,
  Download,
  History,
  ShieldCheck,
  TrendingUp,
  Truck,
  Wallet
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useParcelStore from '../store/parcelStore';
import { formatCurrency } from '../utils/parcel';

const Earnings = () => {
  const { user } = useAuthStore();
  const { parcels, fetchAllParcels, loading } = useParcelStore();

  useEffect(() => {
    if (user?.role === 'driver') {
      fetchAllParcels();
    }
  }, [fetchAllParcels, user?.role]);

  const driverParcels = useMemo(
    () =>
      parcels.filter(
        (parcel) => parcel.carrier?._id === user?._id || parcel.carrier === user?._id
      ),
    [parcels, user?._id]
  );

  const deliveredParcels = useMemo(
    () => driverParcels.filter((parcel) => parcel.status?.toLowerCase() === 'delivered'),
    [driverParcels]
  );

  const activeParcels = useMemo(
    () => driverParcels.filter((parcel) => parcel.status?.toLowerCase() !== 'delivered'),
    [driverParcels]
  );

  const totalEarnings = useMemo(
    () => driverParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0),
    [driverParcels]
  );

  const availableBalance = useMemo(
    () => deliveredParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0),
    [deliveredParcels]
  );

  const pendingSettlement = useMemo(
    () => activeParcels.reduce((sum, parcel) => sum + Number(parcel.price || 0), 0),
    [activeParcels]
  );

  const recentTransactions = useMemo(
    () =>
      [...deliveredParcels]
        .sort((left, right) => new Date(right.updatedAt || right.createdAt) - new Date(left.updatedAt || left.createdAt))
        .slice(0, 6),
    [deliveredParcels]
  );

  if (user?.role !== 'driver') {
    return (
      <div className="min-h-screen bg-slate-50/50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Truck className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-3xl font-bold text-slate-950">Driver workspace only</h1>
          <p className="mt-3 text-sm text-slate-500">
            Earnings are calculated from driver-assigned parcels stored in MongoDB.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="bg-slate-900 text-white sticky top-0 z-30 px-6 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Financial Center</p>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">Driver Earnings</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-3 py-1.5 bg-emerald-400/10 rounded-lg border border-emerald-400/20 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              MongoDB Synced
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
            <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Total Earnings</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalEarnings)}</h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5" />
                <span>{driverParcels.length} parcels assigned</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-colors" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Available Balance</p>
              <h3 className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-2">
                {formatCurrency(availableBalance)}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Delivered</span>
              </h3>
              <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-white hover:text-slate-900 transition-standard rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Export Ledger
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pending Settlement</p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{formatCurrency(pendingSettlement)}</h3>
              <div className="mt-4 flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>{activeParcels.length} active shipments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-10">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completed parcel payouts</p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Download JSON
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)
            ) : recentTransactions.length ? (
              recentTransactions.map((parcel) => (
                <div key={parcel._id} className="flex justify-between items-center p-6 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 transition-standard group">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Delivery Completed</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        SPD-{parcel._id.slice(-8).toUpperCase()} • {new Date(parcel.updatedAt || parcel.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">+{formatCurrency(parcel.price)}</span>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 px-6 py-14 text-center">
                <History className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-2xl font-bold text-slate-950">No completed payouts yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Once assigned parcels are marked delivered, they will appear here automatically from MongoDB data.
                </p>
              </div>
            )}

            {!loading && activeParcels.length > 0 && (
              <div className="flex justify-between items-center p-6 bg-amber-50/50 rounded-2xl border border-amber-100/50 transition-standard">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">In Progress Parcels</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {activeParcels[0].pickupLocation} to {activeParcels[0].dropoffLocation}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-amber-600">{formatCurrency(pendingSettlement)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
