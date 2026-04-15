import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, MapPin, Clock, ArrowRight, Plus, Search, History, Settings, LifeBuoy, CreditCard, LogOut, ChevronRight, CheckCircle2, Globe, Truck, Star, Filter, X, Navigation, Shield, Users, Lock, CreditCard as CardIcon, AlertCircle, Activity, Box, Zap, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useParcelStore from '../store/parcelStore';
import useTripStore from '../store/tripStore';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { parcels, fetchUserParcels, createParcel, loading: parcelLoading } = useParcelStore();
  const { trips, fetchTrips, loading: tripsLoading } = useTripStore();
  
  const [bookingStep, setBookingStep] = useState(1); // 1: Initial, 2: City Search, 3: Driver Selection, 4: Payment, 5: Success
  const [searchCity, setSearchCity] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errorStatus, setErrorStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    pickupLocation: 'My Address',
    dropoffLocation: '', 
    weight: '5.0',
    volume: '0.5',
    parcelType: 'Regular',
    driverId: '',
    collectorName: '',
    collectorEmail: '',
    collectorPhone: ''
  });

  useEffect(() => {
    fetchUserParcels();
    fetchTrips();
  }, [fetchUserParcels, fetchTrips]);

  const handleStartBooking = () => {
    setBookingStep(2);
    setErrorStatus(null);
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setFormData({ ...formData, dropoffLocation: searchCity });
      setBookingStep(3);
    }
  };

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setBookingStep(4);
  };

  const handleProcessPayment = async () => {
    setErrorStatus(null);
    const bookingData = {
      ...formData,
      driverId: selectedDriver?._id || '660000000000000000000001',
      dropoffLocation: searchCity,
      paymentMethod: paymentMethod === 'card' ? 'sender_pay' : 'collector_pay'
    };
    
    try {
      const success = await createParcel(bookingData);
      if (success) {
        setBookingStep(5);
        fetchUserParcels();
        toast.success('Your parcel has been created and sent to the driver.');
      } else {
        setErrorStatus('Something went wrong while creating the parcel. Please try again.');
      }
    } catch (err) {
      setErrorStatus('We could not reach the server. Please try again in a moment.');
    }
  };

  const activeShipments = parcels.filter(p => !['delivered', 'cancelled'].includes(p.status?.toLowerCase()));
  const filteredDrivers = trips.filter(t => 
    t.destination?.toLowerCase().includes(searchCity.toLowerCase()) || 
    t.source?.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider mb-2">My Account</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Delivery Dashboard</h1>
          </div>
          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <div className="text-right px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Orders</p>
                <p className="text-2xl font-bold text-slate-900">{activeShipments.length}</p>
             </div>
             <div className="h-10 w-px bg-slate-100" />
             <div className="text-right px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{parcels.length}</p>
             </div>
          </div>
        </div>

        {/* Multi-Step Booking Module */}
        <div className="mb-16">
            <div className={`enterprise-card min-h-[440px] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden transition-all duration-500 ${bookingStep === 5 ? 'bg-blue-50/20' : ''}`}>
                
                {errorStatus && (
                   <div className="absolute top-8 flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-xl text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorStatus}</span>
                   </div>
                )}

                {bookingStep === 1 && (
                    <div className="max-w-md animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/20">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Send a Package</h2>
                        <p className="text-slate-500 text-sm mb-10 font-medium">Create a parcel, assign the collector, and follow the full handoff from one place.</p>
                        <button 
                            onClick={handleStartBooking}
                            className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-standard active:scale-95 flex items-center mx-auto group"
                        >
                            Create New Shipment
                            <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {bookingStep === 2 && (
                    <div className="w-full max-w-lg animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-center">
                           <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                           Shipment details
                        </h2>
                        <form onSubmit={handleCitySearch} className="relative mb-8 group space-y-4">
                            <input 
                                type="text" 
                                placeholder="Enter destination city"
                                required
                                className="w-full px-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none text-slate-900 text-lg font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white transition-all text-center shadow-inner"
                                autoFocus
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                            />
                            <input 
                                type="text" 
                                placeholder="Collector name (for example, Jeni)" 
                                required
                                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:bg-white transition-all text-center text-sm shadow-inner"
                                value={formData.collectorName}
                                onChange={(e) => setFormData({...formData, collectorName: e.target.value})}
                            />
                            <input 
                                type="email" 
                                placeholder="Collector email (optional)" 
                                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:bg-white transition-all text-center text-sm shadow-inner"
                                value={formData.collectorEmail}
                                onChange={(e) => setFormData({...formData, collectorEmail: e.target.value})}
                            />
                            <input 
                                type="tel" 
                                placeholder="Collector phone number" 
                                required
                                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:bg-white transition-all text-center text-sm shadow-inner"
                                value={formData.collectorPhone}
                                onChange={(e) => setFormData({...formData, collectorPhone: e.target.value})}
                            />
                            <button 
                                type="submit"
                                className="w-full p-4 bg-blue-600 rounded-2xl shadow-sm text-white font-bold tracking-widest uppercase text-xs hover:bg-slate-900 transition-standard mt-2 flex items-center justify-center gap-2"
                            >
                                Continue to driver selection <ChevronRight className="w-4 h-4" />
                            </button>
                        </form>
                        <button onClick={() => setBookingStep(1)} className="text-[10px] text-slate-400 hover:text-slate-900 font-bold tracking-widest transition-all uppercase">Back to Overview</button>
                    </div>
                )}

                {bookingStep === 3 && (
                    <div className="w-full animate-in fade-in duration-500 max-w-5xl">
                        <div className="flex justify-between items-end mb-8 px-4 text-left">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">Available Drivers in <span className="text-blue-600">{searchCity}</span></h2>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider italic">Choose a driver who can pick up from the sender and deliver to your collector</p>
                            </div>
                            <button onClick={() => setBookingStep(2)} className="text-xs font-bold text-blue-600 hover:underline">Change Route</button>
                        </div>

                        <div className="grid grid-cols-1 max-w-sm mx-auto gap-6 place-content-center">
                            {[{_id: '69cf6020c5e92f2ddf5f44fb', driver: {name: 'Janani Driver'}}].map((driver, i) => (
                                <div 
                                    key={driver._id || i} 
                                    className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-blue-200 hover:shadow-xl transition-all group text-left relative"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                                           <Truck className="text-slate-400 w-6 h-6 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        <div className="text-right">
                                           <p className="text-xl font-bold text-slate-900 tracking-tight">₹35.00</p>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Estimated price</p>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">{driver.driver?.name || 'Verified Carrier'}</h4>
                                    <div className="flex items-center gap-1.5 mb-6 text-yellow-500">
                                       <Star className="w-3 h-3 fill-current" />
                                       <span className="text-[11px] font-bold text-slate-400">4.9 Score</span>
                                    </div>
                                    <button 
                                        onClick={() => handleSelectDriver(driver)}
                                        className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-standard active:scale-95 shadow-sm"
                                    >
                                        Choose This Driver
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {bookingStep === 4 && (
                    <div className="w-full max-w-5xl animate-in slide-in-from-bottom-4 duration-500 text-left">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            
                            {/* Summary */}
                            <div className="space-y-8">
                                <div>
                                   <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-1">Check Your Details</p>
                                   <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Review your shipment</h3>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-4">
                                   <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-400 font-medium whitespace-nowrap">Driver</span>
                                      <span className="text-slate-900 font-bold truncate ml-4">{selectedDriver?.driver?.name || 'Verified Driver'}</span>
                                   </div>
                                   <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-400 font-medium whitespace-nowrap">Collector</span>
                                      <span className="text-slate-900 font-bold truncate ml-4 ">{formData.collectorName}</span>
                                   </div>
                                   <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-400 font-medium whitespace-nowrap">Destination</span>
                                      <span className="text-slate-900 font-bold truncate ml-4 ">{searchCity}</span>
                                   </div>
                                   <div className="h-px bg-slate-200/50 my-2" />
                                   <div className="flex justify-between items-center">
                                      <span className="text-slate-900 font-bold text-xs uppercase tracking-wider">Total Cost</span>
                                      <span className="text-3xl font-bold text-blue-600 tracking-tight">₹35.00</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                   <div className="bg-emerald-50 p-2 rounded-lg">
                                      <Lock className="w-4 h-4 text-emerald-500" />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-tight">Simple handoff</p>
                                      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-tight">Sender, driver, and collector stay in sync</p>
                                   </div>
                                </div>
                            </div>

                            {/* Billing */}
                            <div className="space-y-8">
                                <div>
                                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">Payment Method</p>
                                   <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Choose Payment</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                   <button 
                                      onClick={() => setPaymentMethod('card')}
                                      className={`p-6 rounded-2xl border-2 transition-standard text-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}
                                   >
                                      <CardIcon className={`w-6 h-6 mx-auto mb-3 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                                      <p className="text-[10px] font-bold uppercase tracking-wider">Sender pays now</p>
                                   </button>
                                   <button 
                                      onClick={() => setPaymentMethod('settle')}
                                      className={`p-6 rounded-2xl border-2 transition-standard text-center ${paymentMethod === 'settle' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}
                                   >
                                      <Zap className={`w-6 h-6 mx-auto mb-3 ${paymentMethod === 'settle' ? 'text-blue-600' : 'text-slate-400'}`} />
                                      <p className="text-[10px] font-bold uppercase tracking-wider">Collector pays later</p>
                                   </button>
                                </div>
 
                                <button 
                                   onClick={handleProcessPayment}
                                   disabled={parcelLoading}
                                   className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-standard active:scale-95 disabled:opacity-50 text-white ${
                                      paymentMethod === 'card' ? 'bg-blue-600 hover:bg-slate-900' : 'bg-slate-900 hover:bg-blue-600'
                                   }`}
                                >
                                   {parcelLoading ? 'Saving parcel...' : 'Confirm shipment'}
                                </button>
                                <button onClick={() => setBookingStep(3)} className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">Back to Selection</button>
                            </div>
                        </div>
                    </div>
                )}

                {bookingStep === 5 && (
                    <div className="max-w-2xl w-full animate-in zoom-in duration-700 py-10 px-4">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Shipment created</h2>
                        <p className="text-slate-500 text-sm mb-12 font-medium">The driver has been notified and the collector details are now attached to this parcel.</p>
 
                        <div className="bg-slate-900 rounded-3xl p-8 text-left relative overflow-hidden group mb-10">
                           <Activity className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                           <div className="relative z-10">
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                 Parcel status: Active
                              </p>
                              <p className="text-lg font-bold text-white mb-6">Collector: {formData.collectorName}</p>
                              
                              <div className="flex gap-4">
                                 <Link to="/tracking" className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-600 hover:text-white transition-standard">
                                     Track this parcel
                                 </Link>
                                 <button onClick={() => setBookingStep(1)} className="bg-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-standard">
                                     Back to dashboard
                                 </button>
                              </div>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Manifest Registry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
             <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xl font-bold text-slate-900">My Order History</h3>
                <button className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-standard">Download History</button>
             </div>
 
             <div className="space-y-4">
                {activeShipments.length > 0 ? activeShipments.map((parcel) => (
                   <div key={parcel._id} className="enterprise-card p-8 relative overflow-hidden group">
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-600" />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-standard">
                               <Package className="w-6 h-6" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: SPD-{parcel._id?.slice(-6).toUpperCase()}</span>
                                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider italic">Collector: {parcel.collectorName || 'Not set'}</span>
                               </div>
                               <h4 className="text-lg font-bold text-slate-900 capitalize">{parcel.status || 'Processing'}</h4>
                            </div>
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-sm font-bold text-slate-900 flex items-center gap-2 sm:justify-end">
                               {parcel.pickupLocation === 'Main Logistics Hub' || parcel.pickupLocation === 'Local Pickup Hub' ? 'My Address' : parcel.pickupLocation} <ArrowRight className="w-3.5 h-3.5 text-blue-600" /> {parcel.dropoffLocation}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase tracking-wider">Standard Shipping</p>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.3)] transition-all duration-1000" style={{ width: parcel.status?.toLowerCase() === 'delivered' ? '100%' : ['collected', 'in_transit'].includes(parcel.status?.toLowerCase()) ? '75%' : parcel.status?.toLowerCase() === 'confirmed' ? '50%' : '25%' }} />
                         </div>
                         <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className={['pending', 'confirmed', 'collected', 'in_transit', 'delivered'].includes(parcel.status?.toLowerCase()) ? 'text-blue-600' : ''}>Booked</span>
                            <span className={['confirmed', 'collected', 'in_transit', 'delivered'].includes(parcel.status?.toLowerCase()) ? 'text-blue-600' : ''}>Accepted</span>
                            <span className={['collected', 'in_transit', 'delivered'].includes(parcel.status?.toLowerCase()) ? 'text-blue-600' : ''}>On the way</span>
                            <span className={parcel.status?.toLowerCase() === 'delivered' ? 'text-blue-600' : ''}>Received</span>
                         </div>
                      </div>
                   </div>
                )) : (
                   <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                       <Box className="w-10 h-10 text-slate-200 mb-4" />
                       <p className="text-slate-400 font-medium tracking-tight italic text-sm">You have no active orders.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Infrastructure Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Support Card */}
             <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <LifeBuoy className="absolute -left-6 -bottom-6 w-32 h-32 text-white/5" />
                
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">Support Center</p>
                
                <h4 className="relative z-10 text-white font-bold text-xl mb-2">Need Assistance?</h4>
                <p className="text-[12px] text-white/60 font-medium mb-8 leading-relaxed relative z-10">
                   Our support team is available 24/7 to help you with your deliveries and account management.
                </p>

                <div className="space-y-2.5 relative z-10">
                   <Link to="/support" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-standard group">
                      <div className="flex items-center gap-3">
                         <LifeBuoy className="w-4 h-4 text-white/30 group-hover:text-blue-400 transition-colors" />
                         <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Contact Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-standard" />
                   </Link>
                   <Link to="/profile" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-standard group">
                      <div className="flex items-center gap-3">
                         <Settings className="w-4 h-4 text-white/30 group-hover:text-blue-400 transition-colors" />
                         <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Account Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-standard" />
                   </Link>
                </div>
             </div>

             {/* Emergency Logoff */}
             <div className="enterprise-card p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Account Session</h4>
                <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Log out of your account here.</p>
                <button className="w-full py-4 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-standard shadow-sm flex items-center justify-center gap-2">
                   <LogOut className="w-4 h-4" />
                   Sign Out
                </button>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
