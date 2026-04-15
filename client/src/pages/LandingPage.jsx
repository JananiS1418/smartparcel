import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Clock, Calculator, ArrowRight, Star, CheckCircle2, Package, Globe, Users, MapPin, Search, ChevronRight, BarChart3, Cloud, Anchor, Activity, Zap, Compass, ShieldCheck, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const [cityName, setCityName] = useState('');
  const [showDrivers, setShowDrivers] = useState(false);

  const mockDrivers = [
    { id: 1, name: "SwiftLogics Global", vehicle: "Scania R Series (Heavy)", rating: 4.9, image: "https://images.unsplash.com/photo-1591768793355-74d7c513c2c7?auto=format&fit=crop&q=80&w=150", capacity: "25k KG", price: "₹45.00" },
    { id: 2, name: "Metro Transit Co.", vehicle: "Electric Box Van", rating: 4.8, image: "https://images.unsplash.com/photo-1542362567-b055002b91f4?auto=format&fit=crop&q=80&w=150", capacity: "1.2k KG", price: "₹32.00" },
    { id: 3, name: "EcoBridge Logistics", vehicle: "Sprinter EV", rating: 5.0, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150", capacity: "800 KG", price: "₹28.00" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityName.trim()) {
      setShowDrivers(true);
      setTimeout(() => {
        document.getElementById('drivers-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex-grow bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2.5 bg-white px-4 py-1.5 rounded-full border border-slate-200 mb-8 shadow-sm transition-standard hover:shadow-md">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Nationwide Delivery</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-8">
                   Easy Shipping for <br />
                   <span className="text-blue-600">Everyone, Everywhere.</span>
                </h1>
                <p className="text-lg text-slate-500 mb-10 font-medium max-w-xl leading-relaxed">
                   We connect you with trusted local drivers who have extra space in their trucks. Ship your parcels safely, affordably, and faster than ever before.
                </p>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 max-w-xl mx-auto lg:mx-0 group focus-within:border-blue-600 transition-standard">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex-grow flex items-center px-4 py-3 sm:border-r border-slate-100 w-full">
                      <MapPin className="text-blue-600 w-5 h-5 mr-3" />
                      <input 
                         type="text" 
                         placeholder="Where do you want to send?" 
                         className="w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300 uppercase tracking-wider bg-transparent"
                         value={cityName}
                         onChange={(e) => setCityName(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-standard active:scale-95 flex items-center justify-center gap-2 group"
                    >
                      Find Drivers
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>

                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 opacity-60">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Secure & Verified</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Available 24/7</span>
                   </div>
                </div>
             </div>

             <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                   <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200" className="w-full h-[540px] object-cover group-hover:scale-105 transition-transform duration-[4000ms]" alt="Logistics Hub" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                   <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80 italic">Safe Delivery</p>
                      <h4 className="text-xl font-bold tracking-tight">Professional Local Drivers</h4>
                   </div>
                </div>
                
                {/* Status Card */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 flex items-center gap-4 animate-in slide-in-from-left-4">
                   <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <Activity className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">99.9%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Delivery Success</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 text-white relative">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 { label: "Happy Drivers", val: "12.4k", icon: Truck },
                 { label: "CO2 Saved", val: "1.2M", icon: Cloud },
                 { label: "Local Hubs", val: "1.4k", icon: Globe },
                 { label: "Cost Savings", val: "45%", icon: TrendingUp }
               ].map((stat, i) => (
                 <div key={i} className="text-center md:text-left group">
                    <stat.icon className="w-6 h-6 text-blue-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-standard" />
                    <p className="text-3xl font-bold tracking-tight mb-1">{stat.val}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Driver Results */}
      {showDrivers && (
        <section id="drivers-section" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
             <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-4 block">Drivers Near You</span>
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Available Drivers in: {cityName}</h2>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
             {mockDrivers.map((driver) => (
               <div key={driver.id} className="enterprise-card p-10 group relative border-l-4 border-l-slate-100 hover:border-l-blue-600 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden p-1">
                        <img src={driver.image} className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-standard" alt={driver.name} />
                     </div>
                     <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-bold border border-blue-100 flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-current" />
                        {driver.rating} Score
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{driver.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">{driver.vehicle}</p>
                  
                  <div className="space-y-4 mb-10">
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Capacity</p>
                              <p className="text-lg font-bold text-slate-900 tracking-tight">{driver.capacity}</p>
                           </div>
                           <Package className="w-5 h-5 text-blue-600 opacity-30 group-hover:opacity-100 transition-opacity" />
                        </div>
                     </div>
                     <div className="bg-blue-50/20 p-6 rounded-2xl border border-blue-50">
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Price</p>
                              <p className="text-lg font-bold text-blue-700 tracking-tight">{driver.price}</p>
                           </div>
                           <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                     </div>
                  </div>

                  <Link to="/login" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-standard flex items-center justify-center gap-2 group/btn shadow-md">
                     Authorize Booking
                     <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Key Infrastructure */}
      <section className="py-32 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-4 block">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8">
               How It Works.
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
               Our infrastructure orchestrates a decentralized network of active trucking assets to maximize transit density.
            </p>
         </div>

         <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Users, title: "For Senders", desc: "Easily book parcels and track them in real-time until they reach their destination." },
              { icon: Truck, title: "For Drivers", desc: "Pick up parcels on your existing routes and earn extra income effortlessly." },
              { icon: MapPin, title: "For Hubs", desc: "Manage incoming parcels, coordinate with drivers, and handle local payouts." }
            ].map((feature, i) => (
              <div key={i} className="enterprise-card p-10 group hover:bg-white border-b-4 border-b-transparent hover:border-b-blue-600 transition-standard">
                 <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-900/10 transition-standard group-hover:bg-blue-600 group-hover:scale-105">
                    <feature.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
         <div className="bg-slate-900 rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10">
               <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-8 block font-mono tracking-[0.2em] italic">Ready to start?</span>
               <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight leading-tight">Ship Smarter <span className="text-blue-600">Today</span></h2>
               <p className="text-lg text-slate-400 mb-14 max-w-xl mx-auto font-medium italic">Join 12,000+ carriers already optimizing the global logistics grid with precision engineering.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link to="/login" className="bg-white text-slate-900 px-10 py-4.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 hover:text-white transition-standard active:scale-95 flex items-center justify-center">Open Enterprise Terminal</Link>
                  <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-4.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-standard active:scale-95 italic">Schedule Network Demo</button>
               </div>
            </div>
            
            {/* Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
