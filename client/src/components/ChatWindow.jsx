import React, { useState } from 'react';
import { Send, User, Truck, X, Maximize2, Paperclip, Smile, MoreHorizontal, CheckCheck, ShieldCheck, Activity } from 'lucide-react';

const ChatWindow = ({ recipient, role, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm carrying your parcel #SPD-992. I'm currently near the SF Hub.", sender: 'driver', time: '10:05 AM' },
    { id: 2, text: "Great! Let me know if there are any delays.", sender: 'user', time: '10:07 AM' },
    { id: 3, text: "Will do. Weather looks good, heading out now.", sender: 'driver', time: '10:10 AM' }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: role, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Chat Header */}
      <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-4">
            <div className="relative">
               <img src={`https://i.pravatar.cc/100?u=${recipient}`} className="w-10 h-10 rounded-xl border border-white/10 object-cover shadow-lg" alt="Profile" />
               <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none">Verified Session</p>
               </div>
               <h4 className="text-base font-bold text-white tracking-tight uppercase">{recipient}</h4>
            </div>
         </div>
         <div className="relative z-10 flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-standard"><MoreHorizontal className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-standard"><X className="w-4 h-4" /></button>
         </div>
         {/* Subtle Background Detail */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Message List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
         <div className="text-center mb-6">
            <span className="px-4 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">Communications Initialized</span>
         </div>
         
         {messages.map((msg, i) => (
           <div key={msg.id} className={`flex flex-col ${msg.sender === role ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm transition-standard ${
                msg.sender === role 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                 {msg.text}
              </div>
              <div className={`flex items-center mt-2 gap-1.5 ${msg.sender === role ? 'flex-row' : 'flex-row-reverse'}`}>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</span>
                 {msg.sender === role && <CheckCheck className="w-3 h-3 text-blue-500" />}
              </div>
           </div>
         ))}
         
         <div className="text-center py-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-slate-200" />
            <Activity className="w-3 h-3 text-slate-200" />
            <div className="h-px w-8 bg-slate-200" />
         </div>
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100">
         <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              placeholder="Enter message..." 
              className="w-full pl-5 pr-20 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl outline-none font-medium text-[13px] transition-standard"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
               <button type="button" className="p-2 text-slate-300 hover:text-blue-600 transition-standard"><Smile className="w-4 h-4" /></button>
               <button 
                 type="submit" 
                 className="bg-slate-900 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600 transition-standard active:scale-95"
               >
                  <Send className="w-4 h-4" />
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default ChatWindow;
