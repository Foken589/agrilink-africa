'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    role: 'Farmer / Producer',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: 'Nigeria',
        role: 'Farmer / Producer',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Contact AgriLink Africa</h1>
          <p className="text-sm text-slate-600 mt-2">
            Reach out to our regional agricultural support desks or request an onboarding specialist for your farm or cooperative.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Direct Channels */}
          <div className="lg:col-span-5 bg-emerald-900 text-white rounded-2xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">Regional Agricultural Desks</h3>
                <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                  Support available in English, Swahili, Yoruba, Hausa, Igbo, and Twi.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-bold">West Africa Hotline</div>
                    <div className="text-emerald-200">+234 (0) 800-AGRILINK</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-bold">East Africa Hotline</div>
                    <div className="text-emerald-200">+254 (0) 700-AGRILINK</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-bold">Official Inquiries & Escrow Desk</div>
                    <div className="text-emerald-200">operations@agrilink.africa</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-emerald-800 text-[11px] text-emerald-300">
              Escrow and dispute investigations operating 24/7.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500">
                  Our regional agricultural field liaison will reach back out within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Adebayo Ogunlesi"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="adebayo@example.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 803 123 4567"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Primary Stakeholder Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Farmer / Producer</option>
                      <option>Livestock Specialist</option>
                      <option>Cooperative Executive</option>
                      <option>Supermarket / Institutional Buyer</option>
                      <option>Transporter / Haulage Fleet</option>
                      <option>Veterinary Service Provider</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry / Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your production capacity, procurement volume or integration question..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiries to Regional Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
