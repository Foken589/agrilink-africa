'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Key, 
  ArrowRight, 
  Phone, 
  FileText 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatDateTime } from '@/lib/utils';
import { DeliveryJob } from '@/types';

export default function LogisticsDashboardPage() {
  const { deliveryJobs, transporters, updateDeliveryJobStatus } = useStore();
  const [selectedJobId, setSelectedJobId] = useState<string>(deliveryJobs[0]?.id || '');
  const [inputPickupOtp, setInputPickupOtp] = useState('');
  const [inputDeliveryOtp, setInputDeliveryOtp] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const transporter = transporters[0];
  const selectedJob = deliveryJobs.find((j) => j.id === selectedJobId) || deliveryJobs[0];

  const handleVerifyPickupOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (inputPickupOtp === selectedJob.pickupOtp) {
      updateDeliveryJobStatus(selectedJob.id, 'goods_loaded');
      setFeedbackMsg('Pickup OTP verified at farm gate! Goods loaded onto vehicle.');
      setInputPickupOtp('');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } else {
      setFeedbackMsg('Invalid Pickup OTP. Please request correct 4-digit code from farm supervisor.');
    }
  };

  const handleVerifyDeliveryOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (inputDeliveryOtp === selectedJob.deliveryOtp) {
      updateDeliveryJobStatus(selectedJob.id, 'confirmed');
      setFeedbackMsg('Delivery OTP confirmed by buyer! Waybill completed and signed off.');
      setInputDeliveryOtp('');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } else {
      setFeedbackMsg('Invalid Delivery OTP. Please request correct code from buyer receiving dock.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Agricultural Haulage & Logistics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Waybill tracking, live livestock transport, and two-way OTP delivery handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Fleet Hauler</span>
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
          feedbackMsg.includes('Invalid') ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Active Fleet Carrier</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{transporter.companyName}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Rating: {transporter.ratingAverage} ★ ({transporter.totalDeliveries} Completed Trips)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Specialized Haulage Types</div>
          <div className="text-xs font-bold text-slate-800 mt-2 space-y-1">
            <div>• Ventilated Poultry Crate Hauler (2,500 bird cap)</div>
            <div>• Aerated Live Catfish Water Vat (2,000 kg cap)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Authorized Operating Corridors</div>
          <div className="text-[11px] text-slate-600 mt-1.5 space-y-0.5">
            {transporter.activeOperatingRegions.map((reg, idx) => (
              <div key={idx} className="truncate">• {reg}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Jobs & Waybill Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jobs List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider px-1">
            Dispatch Waybills ({deliveryJobs.length})
          </h3>

          <div className="space-y-2">
            {deliveryJobs.map((job) => {
              const isSelected = job.id === selectedJobId;

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate-900 text-xs">{job.waybillNumber}</span>
                    <span className="capitalize px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      {job.dispatchStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-1">{job.commodityName}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>To: {job.destinationAddress}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Digital Waybill Manifest */}
        {selectedJob && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                  Official Digital Agricultural Waybill
                </span>
                <h2 className="text-xl font-mono font-black text-slate-900 mt-0.5">
                  {selectedJob.waybillNumber}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Cargo: <strong className="text-slate-800">{selectedJob.commodityName}</strong> ({selectedJob.quantity} {selectedJob.unitOfMeasure})
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                {selectedJob.dispatchStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Origin and Destination Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Origin & Loading Gate (Authorized)</span>
                </span>
                <p className="text-slate-700">{selectedJob.authorizedPickupDetails || 'Sunrise Agro-Pastoral Hub, Ogun State'}</p>
                <div className="text-slate-500 text-[11px]">Region: {selectedJob.originRegion}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Destination Dock</span>
                </span>
                <p className="text-slate-700">{selectedJob.destinationAddress}</p>
                <div className="text-slate-500 text-[11px]">Estimated Arrival: {formatDateTime(selectedJob.estimatedArrival || '')}</div>
              </div>
            </div>

            {/* OTP Handshake Verification Module */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  <span>Digital Handshake OTP Verification</span>
                </span>
                <span className="text-slate-400 text-[11px]">Protects Custody of Cargo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Pickup OTP */}
                <form onSubmit={handleVerifyPickupOtp} className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2 text-xs">
                  <span className="font-semibold text-slate-200 block">Step 1: Farm Gate Loading OTP</span>
                  <p className="text-[11px] text-slate-400">Request 4-digit OTP from farmer after counting crates.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 8492"
                      value={inputPickupOtp}
                      onChange={(e) => setInputPickupOtp(e.target.value)}
                      className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono font-bold text-center tracking-widest"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                    >
                      Confirm Loading
                    </button>
                  </div>
                </form>

                {/* Delivery OTP */}
                <form onSubmit={handleVerifyDeliveryOtp} className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2 text-xs">
                  <span className="font-semibold text-slate-200 block">Step 2: Buyer Receiving OTP</span>
                  <p className="text-[11px] text-slate-400">Obtain OTP from buyer after dock intake & scale sign-off.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 3190"
                      value={inputDeliveryOtp}
                      onChange={(e) => setInputDeliveryOtp(e.target.value)}
                      className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono font-bold text-center tracking-widest"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                    >
                      Sign-off Delivery
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
