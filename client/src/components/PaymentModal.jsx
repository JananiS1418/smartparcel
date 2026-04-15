import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2, DollarSign, Activity, Zap, Check } from 'lucide-react';

const PaymentModal = ({ amount, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'processing', 'success'

  const handlePayment = () => {
    setLoading(true);
    setStep('processing');
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
         
         <div className="p-10 text-center">
            {step === 'input' && (
               <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Payment Authorization</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 italic">Review your shipment transaction details.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-left">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Amount</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                           <Check className="w-2.5 h-2.5" />
                           <span className="text-[8px] font-bold uppercase tracking-tighter">Verified</span>
                        </div>
                     </div>
                     <p className="text-4xl font-bold text-slate-900 tracking-tight mb-2">₹{amount}</p>
                     <p className="text-[10px] text-slate-400 font-medium italic">Includes logistics service & network insurance fees.</p>
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl mb-8 border border-blue-100/50">
                     <Lock className="w-4 h-4 text-blue-600" />
                     <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest leading-none">256-bit Secure Encryption Active</p>
                  </div>

                  <button 
                    onClick={handlePayment}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-standard active:scale-95 flex items-center justify-center uppercase tracking-widest"
                  >
                    Confirm & Pay
                  </button>
               </>
            )}

            {step === 'processing' && (
               <div className="py-16 flex flex-col items-center">
                  <div className="relative">
                     <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
                     <Activity className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Processing Transfer</h3>
                  <p className="text-slate-400 text-sm font-medium italic animate-pulse">Synchronizing with regional banking nodes...</p>
               </div>
            )}

            {step === 'success' && (
               <div className="py-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-8 animate-in zoom-in duration-500">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Transfer Complete</h3>
                  <p className="text-slate-400 text-sm font-medium italic mb-10">Your booking is authorized. Shipment scheduled.</p>
                  <div className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                     <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] italic">Reference: SPD-TX-90210-PRO</p>
                  </div>
               </div>
            )}
         </div>

         {/* Footer */}
         <div className="bg-slate-50 py-4 flex justify-center items-center gap-6 border-t border-slate-100">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Global Escrow</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Insured Pipeline</span>
         </div>
      </div>
    </div>
  );
};

export default PaymentModal;
