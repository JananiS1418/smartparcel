import React from 'react';
import { LifeBuoy, Mail, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 text-center">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/20">
            <LifeBuoy className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Support Center</h1>
        <p className="text-slate-500 text-base mb-12 max-w-2xl mx-auto font-medium">
            How can we help you today? Check our resources below or contact our 24/7 support team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
           {[
             { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with our support agents instantly.' },
             { icon: Mail, title: 'Email Support', desc: 'Send us an email and we will reply within 24 hours.' },
             { icon: Phone, title: 'Call Support', desc: 'Directly speak to our representatives 24/7.' }
           ].map((item, i) => (
             <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-standard group cursor-pointer">
                 <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl flex items-center justify-center mb-6 transition-colors">
                     <item.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                 <p className="text-xs text-slate-500 font-medium mb-6">{item.desc}</p>
                 <button className="text-[10px] font-bold text-blue-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center">
                     Get Started <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
           ))}
        </div>
        
        <Link to="/dashboard" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center justify-center">
            Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Support;
