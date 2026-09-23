import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import { SupportTicket, AppView } from '../types';
import { MessageSquare, Send, CheckCircle2, ShieldCheck, Clock, User, Sparkles } from 'lucide-react';

interface SupportViewProps {
  onNavigate: (view: AppView) => void;
}

export const SupportView: React.FC<SupportViewProps> = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useRealtime();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.getSupportTickets(user.id).then((t) => {
        setTickets(t);
        if (t.length > 0 && !activeTicket) {
          setActiveTicket(t[0]);
        }
      }).catch(console.error);
    }
  }, [user, refreshKey]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createSupportTicket({
        userId: user?.id || 'guest',
        customerName: user?.name || 'Valued Customer',
        customerEmail: user?.email || 'guest@houseofpops.ae',
        subject: newSubject.trim(),
        initialMessage: newMessage.trim(),
      });
      setTickets([created, ...tickets]);
      setActiveTicket(created);
      setNewSubject('');
      setNewMessage('');
      triggerRefresh();
    } catch (e: any) {
      alert(e.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !chatInput.trim()) return;

    const text = chatInput.trim();
    setChatInput('');

    try {
      const updated = await api.addSupportMessage(
        activeTicket.id,
        user?.role === 'admin' ? 'agent' : 'customer',
        user?.name || 'Customer',
        text
      );
      setActiveTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      triggerRefresh();
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-12 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4B942]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Concierge Care</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit']">
            Real-Time Customer Concierge
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Have questions about an ongoing sub-zero delivery, custom flavors, or dietary certificates? Our team is live and ready to assist you.
          </p>
        </div>

        {/* 2-Column Chat & Support Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tickets List or New Ticket Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Create New Inquiry Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Start a New Ticket
              </h3>

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Question about Al Quoz delivery window"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe how we can make your pops experience perfect..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#1B4332] text-white font-bold hover:bg-[#133024] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Opening Ticket...' : 'Send to Concierge'}
                </button>
              </form>
            </div>

            {/* My Active Tickets */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Inquiry History ({tickets.length})
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      activeTicket?.id === t.id
                        ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{t.ticketNumber}</span>
                      <span className="text-[10px] uppercase font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-0.5 rounded-full">
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-slate-600 line-clamp-1 mt-1 font-medium">{t.subject}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Conversation (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col h-[540px]">
            {activeTicket ? (
              <>
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#1B4332] uppercase">
                      Ticket {activeTicket.ticketNumber}
                    </span>
                    <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                      {activeTicket.subject}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {activeTicket.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                  {activeTicket.messages.map((m) => {
                    const isMe =
                      (user?.role === 'admin' && m.sender === 'agent') ||
                      (user?.role !== 'admin' && m.sender === 'customer');

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-0.5 font-medium">
                          {m.senderName}
                        </span>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#1B4332] text-white rounded-tr-xs'
                              : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          {m.message}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message to concierge..."
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#133024] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">
                Select an inquiry on the left or create a new ticket to chat live.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
