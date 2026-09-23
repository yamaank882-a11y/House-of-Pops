import React, { useState } from 'react';
import { api } from '../services/api';
import { AppView } from '../types';
import { Building2, Calendar, Users, Sparkles, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface CorporateViewProps {
  onNavigate: (view: AppView) => void;
}

export const CorporateView: React.FC<CorporateViewProps> = ({ onNavigate }) => {
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [quantity, setQuantity] = useState('100-300 Pops');
  const [location, setLocation] = useState('Dubai');
  const [requirements, setRequirements] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createCorporateLead({
        company,
        contactName,
        email,
        phone,
        eventDate,
        quantity,
        location,
        requirements,
      });
      setIsSuccess(true);
    } catch (e: any) {
      alert(e.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-[#18231C] text-white rounded-3xl p-8 sm:p-14 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4B942]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Wellness & Luxury Events</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit']">
            Artisanal Pop Carts & Corporate Freezers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Elevate your corporate events, office wellness weeks, luxury brand activations, and weddings across the UAE with our signature branded wooden carts and 100% natural, dairy-free pops.
          </p>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Branded Wooden Pop Cart</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eye-catching vintage wooden freezer carts with dry-ice display, server attendant, and customized flavor menus.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Office Wellness Freezers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equip your corporate headquarters in DIFC, Media City, or Abu Dhabi with a dedicated House of Pops freezer restocked weekly.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Custom Logo Sticks</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Laser-engrave your corporate logo or bride & groom names onto our certified biodegradable FSC wooden pop sticks.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-3xl mx-auto">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#52B788]/20 text-[#1B4332] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                Inquiry Received!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{contactName}</strong>. Our B2B Corporate Events Director has received your lead for <strong>{company}</strong> and will follow up with custom catering pricing within 2 business hours.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024]"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Request Corporate & Event Catering Proposal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your event details and our events team will tailor a package with refrigerated carts and attendant service.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google UAE, Emaar, Private Wedding"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UAE Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="50-100 Pops">50 - 100 Pops</option>
                    <option value="100-300 Pops">100 - 300 Pops</option>
                    <option value="300-500 Pops">300 - 500 Pops</option>
                    <option value="500+ Pops">500+ Pops (Large Festival)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event City / Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dubai DIFC"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Requirements / Brand Cart Setup</label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Need cart attendant? Custom flavor branding? Vegan/keto dietary breakdown?"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#1B4332] text-white font-bold text-xs hover:bg-[#133024] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting to Corporate Concierge...' : 'Submit B2B Catering Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
