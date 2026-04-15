import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Package } from 'lucide-react';
import PublicHome from './pages/PublicHome';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import Dashboard from './pages/Dashboard';
import TrackingWorkspace from './pages/TrackingWorkspace';
import History from './pages/History';
import Trips from './pages/Trips';
import ProfileWorkspace from './pages/ProfileWorkspace';
import Support from './pages/Support';
import Earnings from './pages/Earnings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

const AppContent = () => {
  const location = useLocation();
  const hideNavFooter = ['/login', '/register'].includes(location.pathname);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-primary-100 selection:text-primary-700 font-sans">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route path="/tracking" element={
            <ProtectedRoute>
              <TrackingWorkspace />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          
          <Route path="/trips" element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          } />

          <Route path="/earnings" element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/transit" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/settlements" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileWorkspace />
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {!hideNavFooter && (
        <footer className="bg-white border-t border-slate-100 py-16 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
               <div className="max-w-xs">
                  <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Smart<span className="text-blue-600">Parcel</span>
                  </span>
                  <p className="text-xs text-slate-400 font-medium mt-4 leading-relaxed">
                    © 2026 Smart Parcel Delivery. Simple parcel handoff for senders, drivers, and collectors.
                  </p>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Platform</h5>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Shippers</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Carriers</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Enterprise</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Company</h5>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">About Us</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Careers</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Blog</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Legal</h5>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Terms</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Safety</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Support</h5>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Help Center</li>
                      <li className="hover:text-blue-600 cursor-pointer transition-colors">Contact</li>
                    </ul>
                  </div>
               </div>
            </div>
            <div className="h-px bg-slate-50 w-full mb-8" />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
               <span>Global Delivery Network</span>
               <div className="flex items-center space-x-4">
                 <span>v4.2.2</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                 <span>Kinetic Node Active</span>
               </div>
            </div>
          </div>
        </footer>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
