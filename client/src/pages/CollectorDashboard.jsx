import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, ArrowRight, User, Truck, Shield, Search, CheckCircle, ChevronRight, BarChart3, Bell, Map as MapIcon, Boxes, Activity, Database, Zap, ShieldCheck, TrendingUp, LayoutDashboard, CreditCard, Star, MessageSquare, Navigation, Phone, Info } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useParcelStore from '../store/parcelStore';
import toast from 'react-hot-toast';

const CollectorDashboard = () => {
  const { user } = useAuthStore();
  const { parcels, fetchAllParcels, updateParcelStatus, settlePayment, submitReview } = useParcelStore();
  const [activeTab, setActiveTab] = useState('manifest');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAllParcels();
  }, [fetchAllParcels]);

  // Sync routing to tab state
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['manifest', 'transit', 'settlements'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  // Filter parcels based on status
  const manifestParcels = parcels.filter(p => ['pending', 'confirmed'].includes(p.status?.toLowerCase()));
  const transitParcels = parcels.filter(p => ['collected', 'in_transit'].includes(p.status?.toLowerCase()));
  const settlementParcels = parcels.filter(p => p.paymentMethod === 'collector_pay' && p.paymentStatus === 'pending');

  const handleSettlePayment = async () => {
    const success = await settlePayment(selectedParcel._id);
    if (success) {
      toast.success('Payment settled successfully');
      setShowPaymentModal(false);
      setSelectedParcel(null);
    }
  };

  const handleSubmitReview = async () => {
    const success = await submitReview(selectedParcel._id, rating, feedback);
    if (success) {
      await updateParcelStatus(selectedParcel._id, 'delivered');
      toast.success('Review submitted and parcel marked as delivered');
      setShowReviewModal(false);
      setSelectedParcel(null);
      setRating(5);
      setFeedback('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Collector Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Hub Collector</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'manifest', label: 'Incoming Parcels', count: manifestParcels.length },
              { id: 'transit', label: 'In Transit', count: transitParcels.length },
              { id: 'settlements', label: 'Payments', count: settlementParcels.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Manifest Tab */}
          {activeTab === 'manifest' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Incoming Parcels</h2>
              {manifestParcels.length > 0 ? (
                <div className="grid gap-4">
                  {manifestParcels.map((parcel) => (
                    <div key={parcel._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Package className="w-8 h-8 text-blue-500" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{parcel.parcelType}</h3>
                              <p className="text-sm text-gray-500">ID: {parcel._id?.slice(-8)}</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Pickup Location</p>
                              <p className="text-sm text-gray-900">{parcel.pickupLocation}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Weight</p>
                              <p className="text-sm text-gray-900">{parcel.weight} kg</p>
                            </div>
                          </div>
                          {parcel.status?.toLowerCase() === 'confirmed' && parcel.carrier && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Truck className="w-5 h-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium text-green-900">Assigned Driver</p>
                                  <p className="text-sm text-green-700">{parcel.carrier?.name}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming parcels</h3>
                  <p className="text-gray-500">Parcels assigned to you will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Transit Tab */}
          {activeTab === 'transit' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Parcels In Transit</h2>
              {transitParcels.length > 0 ? (
                <div className="grid gap-4">
                  {transitParcels.map((parcel) => (
                    <div key={parcel._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Navigation className="w-8 h-8 text-orange-500" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{parcel.parcelType}</h3>
                              <p className="text-sm text-gray-500">ID: {parcel._id?.slice(-8)}</p>
                            </div>
                          </div>
                          {parcel.carrier && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="text-sm font-medium text-blue-900">Driver: {parcel.carrier?.name}</p>
                                  <p className="text-sm text-blue-700">Status: {parcel.status}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => { setSelectedParcel(parcel); setShowReviewModal(true); }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                          Receive Parcel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels in transit</h3>
                  <p className="text-gray-500">Parcels being delivered to you will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Settlements Tab */}
          {activeTab === 'settlements' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Payments</h2>
              {settlementParcels.length > 0 ? (
                <div className="grid gap-4">
                  {settlementParcels.map((parcel) => (
                    <div key={parcel._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-8 h-8 text-green-500" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">₹{parcel.price?.toFixed(2)}</h3>
                              <p className="text-sm text-gray-500">ID: {parcel._id?.slice(-8)}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedParcel(parcel); setShowPaymentModal(true); }}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
                  <p className="text-gray-500">Payments due will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedParcel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Amount due: ₹{selectedParcel.price?.toFixed(2)}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => { setShowPaymentModal(false); setSelectedParcel(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSettlePayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedParcel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Receive Parcel & Rate Driver</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="How was the delivery?"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { setShowReviewModal(false); setSelectedParcel(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentOption = ({ icon: Icon, label, active = false }) => (
   <div className={`p-5 flex items-center justify-between rounded-2xl border-2 transition-standard cursor-pointer ${
      active ? 'bg-emerald-50/50 border-emerald-500' : 'bg-transparent border-slate-100 hover:border-slate-300'
   }`}>
      <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-standard ${
            active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-500'
         }`}>
            <Icon className="w-5 h-5" />
         </div>
         <span className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-transparent'}`}>
         {active && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
   </div>
);

const EmptyState = ({ message }) => (
   <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-24 px-6 text-center flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl mb-6 shadow-sm border border-slate-100 text-slate-300">
         <Package className="w-10 h-10" />
      </div>
      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{message}</p>
   </div>
);

export default CollectorDashboard;
