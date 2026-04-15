import React, { useState } from 'react';
import { 
  User, Mail, Shield, MapPin, Calendar, Settings, Lock, 
  ChevronRight, LogOut, Package, CreditCard, Activity, 
  ShieldCheck, Phone, Camera, Bell, Zap, Globe, 
  CheckCircle2, CreditCard as CardIcon
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const handleSave = async () => {
    const success = await updateUser(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CardIcon },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 selection:bg-blue-100">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-100%] left-[-10%] w-[120%] h-[200%] bg-gradient-to-b from-blue-50/80 via-slate-50/50 to-transparent transform -rotate-6" />
         <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl opacity-50" />
         <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <p className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-3">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
               Account Administration
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Profile Settings</h1>
          </div>
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 pl-4 rounded-full border border-slate-200/60 shadow-sm">
             <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Encrypted</span>
             </div>
             <button onClick={logout} className="p-2 bg-slate-900 hover:bg-red-500 text-white rounded-full transition-all duration-300 shadow-md flex items-center justify-center group">
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            
            {/* Identity Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
               <Activity className="absolute top-4 right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-[3000ms]" />
               
               <div className="relative mt-12 flex flex-col items-center">
                  <div className="relative mb-6 group/avatar">
                     <div className="w-32 h-32 rounded-full bg-white p-2 shadow-2xl relative z-10">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black overflow-hidden relative group-hover/avatar:shadow-inner transition-all duration-500">
                           {user?.name?.charAt(0) || 'U'}
                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                              <Camera className="w-6 h-6 text-white" />
                           </div>
                        </div>
                     </div>
                     <div className="absolute bottom-2 right-2 z-20 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                     </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{user?.name || 'Authorized User'}</h2>
                  <p className="text-sm font-medium text-slate-500 mb-6">{user?.email}</p>
                  
                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mb-8">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Access Level</p>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                           <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 
                           <span className="capitalize">{user?.role || 'Sender'} Account</span>
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ID Tag</p>
                        <p className="text-xs font-bold text-slate-900 uppercase">#{user?.id?.slice(-6) || 'A94X2B'}</p>
                     </div>
                  </div>

                  <div className="w-full space-y-2">
                     {tabs.map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                           <div className="flex items-center gap-3">
                              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`} />
                              {tab.label}
                           </div>
                           <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'text-white/50' : 'opacity-0 -translate-x-2'}`} />
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
               <Globe className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10" />
               <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-6">Profile Completion</p>
               <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black tracking-tighter">85</span>
                  <span className="text-xl font-bold text-blue-200 mb-1">%</span>
               </div>
               <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-4">
                  <div className="w-[85%] h-full bg-emerald-400 rounded-full" />
               </div>
               <p className="text-xs font-medium text-blue-100 italic">Add your contact number to reach 100% and unlock expedited support.</p>
            </div>

          </div>

          {/* Right Main Content - Tab Panels */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100 min-h-[600px]">
               
               {activeTab === 'general' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">General Information</h3>
                        <p className="text-sm font-medium text-slate-500">Manage your personal details and how we contact you.</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:bg-blue-50/50 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                 <User className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                           </div>
                           {isEditing ? (
                             <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Account Owner" />
                           ) : (
                             <p className="text-lg font-bold text-slate-900">{user?.name || 'Account Owner'}</p>
                           )}
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:bg-blue-50/50 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                 <Mail className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                           </div>
                           {isEditing ? (
                             <input type="email" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="admin@smartparcel.io" />
                           ) : (
                             <p className="text-lg font-bold text-slate-900 truncate">{user?.email || 'admin@smartparcel.io'}</p>
                           )}
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                 <Phone className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</p>
                           </div>
                           {isEditing ? (
                             <input type="tel" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Add Phone +" />
                           ) : (
                             <p className="text-lg font-bold text-slate-900">{user?.phone || 'Add Phone +'}</p>
                           )}
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                 <MapPin className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                           </div>
                           {isEditing ? (
                             <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Address not provided" />
                           ) : (
                             <p className="text-lg font-bold text-slate-900">{user?.location || 'Address not provided'}</p>
                           )}
                        </div>
                     </div>
                     
                     <div className="pt-6">
                        {isEditing ? (
                          <div className="flex gap-4">
                            <button onClick={handleSave} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                               Save Changes
                            </button>
                            <button onClick={() => setIsEditing(false)} className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95">
                               Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setIsEditing(true)} className="px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                             Edit Information
                          </button>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'security' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Security & Authentication</h3>
                        <p className="text-sm font-medium text-slate-500">Keep your account secure with advanced protection.</p>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-start justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-colors">
                           <div className="flex gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 group-hover:text-amber-500 transition-colors">
                                 <Lock className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 mb-1">Password Management</h4>
                                 <p className="text-xs font-medium text-slate-500">Last changed 45 days ago</p>
                              </div>
                           </div>
                           <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">Update</button>
                        </div>

                        <div className="flex items-start justify-between p-6 bg-blue-50/50 rounded-3xl border border-blue-100 group">
                           <div className="flex gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 text-blue-600">
                                 <Shield className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 mb-1">Two-Factor Authentication</h4>
                                 <p className="text-xs font-medium text-slate-500">Add an extra layer of security to your account.</p>
                              </div>
                           </div>
                           <button className="px-5 py-2.5 bg-blue-600 hover:bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md">Enable 2FA</button>
                        </div>
                     </div>
                     
                     <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden mt-8">
                        <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                        <h4 className="text-lg font-bold mb-2">Active Sessions</h4>
                        <p className="text-xs text-white/60 mb-6 max-w-md">Review devices that are currently logged into your account. Terminate any suspicious activity immediately.</p>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                              <div>
                                 <p className="text-sm font-bold">Windows PC - Chrome Browser</p>
                                 <p className="text-[10px] uppercase tracking-widest text-emerald-400">Current Session</p>
                              </div>
                           </div>
                           <p className="text-xs font-bold text-white/40">IP: 192.168.1.1</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'billing' && (
                  <div className="space-y-10 animate-in fade-in duration-500 text-center py-10">
                     <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center mx-auto mb-6">
                        <CardIcon className="w-10 h-10 text-slate-300" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-2">Billing & Invoices</h3>
                     <p className="text-sm font-medium text-slate-500 max-w-md mx-auto mb-8">Manage your payment methods, view transaction history, and download tax invoices.</p>
                     
                     <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                           <Zap className="w-5 h-5 text-blue-600" />
                           <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-bold rounded-full">Pro Tier</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">₹1,499<span className="text-sm font-bold text-slate-400">/mo</span></h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-8">Next billing: Apr 30, 2026</p>
                        <button className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-colors">Manage Plan</button>
                     </div>
                  </div>
               )}

               {activeTab === 'preferences' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">System Preferences</h3>
                        <p className="text-sm font-medium text-slate-500">Customize your notification alerts and application behavior.</p>
                     </div>
                     
                     <div className="space-y-4">
                        {[
                           { title: 'Email Notifications', desc: 'Receive daily summary of order statuses.', active: true },
                           { title: 'SMS Alerts', desc: 'Real-time text messages for critical tracking updates.', active: false },
                           { title: 'Marketing Communications', desc: 'Promotions and feature announcements.', active: false },
                           { title: 'Data Telemetry', desc: 'Share anonymous usage data to improve application.', active: true }
                        ].map((pref, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-100 transition-colors shadow-sm">
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 mb-1">{pref.title}</h4>
                                 <p className="text-xs font-medium text-slate-500">{pref.desc}</p>
                              </div>
                              {/* Custom Toggle Switch */}
                              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative ${pref.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${pref.active ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
