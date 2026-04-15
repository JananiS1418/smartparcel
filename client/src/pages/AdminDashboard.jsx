import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Database,
  Download,
  Filter,
  IndianRupee,
  MoreVertical,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useParcelStore from '../store/parcelStore';
import useTripStore from '../store/tripStore';
import useUserStore from '../store/userStore';
import { formatCurrency, formatParcelStatus } from '../utils/parcel';

const navigationTabs = [
  { id: 'bookings', label: 'Shipment Records', icon: Package },
  { id: 'users', label: 'User Directory', icon: Users },
  { id: 'drivers', label: 'Fleet Management', icon: Truck },
  { id: 'reports', label: 'Operations Log', icon: AlertCircle },
  { id: 'analytics', label: 'Route Insights', icon: BarChart3 },
  { id: 'settings', label: 'System Status', icon: Settings }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const { user } = useAuthStore();
  const { parcels, fetchAllParcels, loading: parcelLoading } = useParcelStore();
  const { trips, fetchTrips, loading: tripLoading } = useTripStore();
  const {
    adminOverview,
    users,
    fetchAdminOverview,
    fetchUsers,
    loadingOverview,
    loadingUsers
  } = useUserStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminOverview();
      fetchUsers();
      fetchAllParcels();
      fetchTrips();
    }
  }, [fetchAdminOverview, fetchAllParcels, fetchTrips, fetchUsers, user?.role]);

  const loading = parcelLoading || tripLoading || loadingUsers || loadingOverview;

  const stats = useMemo(
    () => [
      {
        label: 'Total Revenue',
        val: formatCurrency(adminOverview?.totalRevenue ?? 0),
        icon: IndianRupee,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
      },
      {
        label: 'Active Trips',
        val: adminOverview?.activeTrips ?? 0,
        icon: Truck,
        color: 'text-blue-500',
        bg: 'bg-blue-50'
      },
      {
        label: 'Shipment Records',
        val: adminOverview?.parcelCount ?? parcels.length,
        icon: Package,
        color: 'text-amber-500',
        bg: 'bg-amber-50'
      },
      {
        label: 'Registered Users',
        val: adminOverview?.userCount ?? users.length,
        icon: Users,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50'
      }
    ],
    [adminOverview, parcels.length, users.length]
  );

  const driverUsers = useMemo(
    () => users.filter((entry) => entry.role === 'driver'),
    [users]
  );

  const driverRouteCounts = useMemo(
    () =>
      trips.reduce((counts, trip) => {
        const driverId = String(trip.driver?._id || '');
        if (!driverId) {
          return counts;
        }

        counts[driverId] = (counts[driverId] || 0) + 1;
        return counts;
      }, {}),
    [trips]
  );

  const recordsByTab = useMemo(() => {
    const recentParcels = [...parcels]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map((parcel) => ({
        reference: `SPD-${parcel._id.slice(-8).toUpperCase()}`,
        subject: `${parcel.pickupLocation} to ${parcel.dropoffLocation}`,
        meta: `${parcel.parcelType} • ${parcel.sender?.name || 'Unknown sender'}`,
        timeline: formatDate(parcel.createdAt),
        value: formatCurrency(parcel.price),
        status: formatParcelStatus(parcel.status)
      }));

    const userRecords = [...users]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map((entry) => ({
        reference: `USR-${entry._id.slice(-8).toUpperCase()}`,
        subject: entry.name,
        meta: `${entry.role} • ${entry.email}`,
        timeline: `Joined ${formatDate(entry.createdAt)}`,
        value: entry.phone || 'Phone not added',
        status: entry.location || entry.collectionArea || 'Profile active'
      }));

    const driverRecords = [...driverUsers]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map((entry) => ({
        reference: `DRV-${entry._id.slice(-8).toUpperCase()}`,
        subject: entry.name,
        meta: `${entry.truckDetails?.model || 'Vehicle not set'} • ${entry.email}`,
        timeline: `Joined ${formatDate(entry.createdAt)}`,
        value: `${driverRouteCounts[String(entry._id)] || 0} saved routes`,
        status: entry.phone || 'Phone not added'
      }));

    const routeRecords = [...trips]
      .sort((left, right) => new Date(right.departureDate) - new Date(left.departureDate))
      .map((trip) => ({
        reference: `TRP-${trip._id.slice(-8).toUpperCase()}`,
        subject: `${trip.source} to ${trip.destination}`,
        meta: `${trip.driver?.name || 'Unknown driver'} • ${trip.driver?.truckDetails?.model || 'Vehicle not set'}`,
        timeline: formatDate(trip.departureDate),
        value: `${trip.availableWeight} kg • ${trip.availableVolume} vol`,
        status: trip.status.replace('_', ' ')
      }));

    const issueRecords = recentParcels.filter((record) => !record.status.toLowerCase().includes('delivered'));

    const systemRecords = [
      {
        reference: 'CFG-AUTH',
        subject: 'Authentication mode',
        meta: 'Browser localStorage removed from sign-in flow',
        timeline: 'Live',
        value: 'HTTP-only cookie session',
        status: 'Enabled'
      },
      {
        reference: 'CFG-DATA',
        subject: 'Primary data source',
        meta: 'Users, parcels, trips, and notifications',
        timeline: 'Live',
        value: 'MongoDB server',
        status: 'Connected'
      },
      {
        reference: 'CFG-PUBLIC',
        subject: 'Public driver search',
        meta: 'Reads upcoming routes from MongoDB',
        timeline: 'Live',
        value: `${adminOverview?.driverCount ?? driverUsers.length} drivers indexed`,
        status: 'Available'
      }
    ];

    return {
      bookings: recentParcels,
      users: userRecords,
      drivers: driverRecords,
      reports: issueRecords,
      analytics: routeRecords,
      settings: systemRecords
    };
  }, [adminOverview?.driverCount, driverRouteCounts, driverUsers, parcels, trips, users]);

  const activeRecords = recordsByTab[activeTab] || [];

  const handleRefresh = () => {
    fetchAdminOverview();
    fetchUsers();
    fetchAllParcels();
    fetchTrips();
  };

  const handleExport = () => {
    const payload = JSON.stringify(activeRecords, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-${activeTab}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50/50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-3xl font-bold text-slate-950">Admin access required</h1>
          <p className="mt-3 text-sm text-slate-500">
            This workspace reads live operational data from MongoDB and is only available to admin accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Administrative Control</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Operations</h1>
            <p className="mt-2 text-sm text-slate-500">This panel now reads its metrics and records from the server MongoDB data set.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-white border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-standard flex items-center gap-3 shadow-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-standard flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>Export Active Tab</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="enterprise-card p-6 flex items-center gap-5 hover:translate-y-[-4px] transition-standard group">
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-standard`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3 space-y-3">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-standard border text-[11px] font-bold uppercase tracking-widest group ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-standard ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-600'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9">
            <div className="enterprise-card overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">{activeTab} Overview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:bg-white transition-standard">
                    <Filter className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:bg-white transition-standard">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : activeRecords.length ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Reference ID</th>
                          <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Subject Profile</th>
                          <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Timeline</th>
                          <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Valuation</th>
                          <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {activeRecords.slice(0, 8).map((record) => (
                          <tr key={record.reference} className="hover:bg-slate-50/30 transition-standard group">
                            <td className="px-8 py-5">
                              <p className="font-mono text-blue-600 text-[11px] font-bold">{record.reference}</p>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px] italic">
                                  {record.reference.slice(0, 3)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm leading-none mb-1 tracking-tight">{record.subject}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{record.meta}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-[11px] font-bold text-slate-400 italic">{record.timeline}</td>
                            <td className="px-8 py-5">
                              <p className="text-lg font-bold text-slate-900 tracking-tight">{record.value}</p>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex justify-center">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-standard flex items-center gap-2 group"
                    >
                      Synchronize Latest MongoDB Records
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-standard" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-16 text-center">
                  <Database className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-2xl font-bold text-slate-950">No records available</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    This tab has no matching MongoDB records yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDate = (value) => new Date(value).toLocaleDateString();

export default AdminDashboard;
