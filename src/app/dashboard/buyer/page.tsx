'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  ShoppingBag, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Currency } from '@/types';

export default function BuyerDashboardPage() {
  const { rfqs, quotes, createRFQ, currentUser } = useStore();
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [commodityNeeded, setCommodityNeeded] = useState('');
  const [category, setCategory] = useState('Poultry');
  const [requiredQuantity, setRequiredQuantity] = useState('500');
  const [unitOfMeasure, setUnitOfMeasure] = useState('birds');
  const [maxBudget, setMaxBudget] = useState('6000');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [destination, setDestination] = useState('Central Warehouse, Ikeja, Lagos');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [rfqNotes, setRfqNotes] = useState('');

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityNeeded) return;

    createRFQ({
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      commodityNeeded,
      category,
      requiredQuantity: parseFloat(requiredQuantity) || 100,
      unitOfMeasure,
      maxBudgetUnit: parseFloat(maxBudget) || undefined,
      currency,
      deliveryDestination: destination,
      deadlineDate: deadline,
      notes: rfqNotes,
    });

    setCommodityNeeded('');
    setRfqNotes('');
    setShowRfqModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Buyer Procurement & RFQ Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish Requests for Quotes (RFQs), evaluate competitive supplier bids, and convert to escrow orders.
          </p>
        </div>

        <button
          onClick={() => setShowRfqModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New RFQ Tender</span>
        </button>
      </div>

      {/* Active RFQs Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
          Open RFQs ({rfqs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {rfq.category} Tender
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{rfq.commodityNeeded}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {rfq.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Required Volume</span>
                  <span className="font-bold text-slate-900">{rfq.requiredQuantity.toLocaleString()} {rfq.unitOfMeasure}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Unit Budget</span>
                  <span className="font-bold text-emerald-700">
                    {rfq.maxBudgetUnit ? formatCurrency(rfq.maxBudgetUnit, rfq.currency) : 'Market Rate'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div><strong>Destination:</strong> {rfq.deliveryDestination}</div>
                <div><strong>Delivery Deadline:</strong> {formatDate(rfq.deadlineDate)}</div>
                {rfq.notes && <div className="text-[11px] text-slate-500 italic mt-1">&quot;{rfq.notes}&quot;</div>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">{rfq.quotesCount} Quotes Received</span>
                <Link
                  href="/marketplace"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Explore Direct Listings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quotes Received Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Competitive Supplier Quotes</h3>
            <p className="text-[11px] text-slate-500">Binding prices submitted by verified farmers & cooperatives</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Offered Quantity</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total Quote</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {quote.sellerName}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {quote.offeredQuantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {formatCurrency(quote.unitPrice, quote.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-sm">
                    {formatCurrency(quote.totalAmount, quote.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {quote.deliveryLeadDays} business days
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(quote.validityDate)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/dashboard/orders"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition"
                    >
                      Accept & Fund Escrow
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create RFQ */}
      {showRfqModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Publish Request for Quotes (RFQ)</h3>
              <button onClick={() => setShowRfqModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commodity Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table Size Live Broilers (2.0kg+)"
                  value={commodityNeeded}
                  onChange={(e) => setCommodityNeeded(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option>Poultry</option>
                    <option>Aquaculture</option>
                    <option>Grains & Cereals</option>
                    <option>Roots & Tubers</option>
                    <option>Dairy & Cattle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="UGX">UGX (USh)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Volume</label>
                  <input
                    type="number"
                    required
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    placeholder="e.g. birds, kg, 90kg bags"
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Maximum Unit Budget</label>
                <input
                  type="number"
                  placeholder="6000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ikeja Distribution Center, Lagos"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quality Specs & Terms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Minimum 2.1kg average live weight. Deliver in clean ventilated crates."
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Publish Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
