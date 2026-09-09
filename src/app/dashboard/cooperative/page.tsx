'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Layers, 
  Scale, 
  DollarSign, 
  CheckCircle2, 
  Building2, 
  FileSpreadsheet, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CooperativeMember } from '@/types';

export default function CooperativeDashboardPage() {
  const { cooperatives, cooperativeMembers, addCooperativeMember } = useStore();
  const coop = cooperatives[0];

  // Add Member State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberNumber, setMemberNumber] = useState(`WGF-KE-${Math.floor(Math.random() * 900 + 100)}`);
  const [farmAcres, setFarmAcres] = useState('10.0');
  const [cropsLivestock, setCropsLivestock] = useState('White Maize & Soya');

  // Dividend Calculator State
  const [contractTotalAmount, setContractTotalAmount] = useState('3200000'); // 3.2M KES
  const [coopRetainedFeePct, setCoopRetainedFeePct] = useState('5'); // 5% cooperative levy

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName) return;

    addCooperativeMember({
      cooperativeId: coop.id,
      farmerId: `usr-mem-${Date.now()}`,
      farmerName: memberName,
      membershipNumber: memberNumber,
      farmSizeAcres: parseFloat(farmAcres) || 5.0,
      cropsOrLivestock: cropsLivestock,
      status: 'active',
    });

    setMemberName('');
    setShowMemberModal(false);
  };

  const contractTotal = parseFloat(contractTotalAmount) || 0;
  const retainedLevy = contractTotal * (parseFloat(coopRetainedFeePct) / 100);
  const netDistributable = contractTotal - retainedLevy;

  // Calculate proportional member share based on acres/contribution
  const totalAcreage = cooperativeMembers.reduce((sum, m) => sum + m.farmSizeAcres, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Cooperative Smallholder Aggregation Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing <strong className="text-slate-800">{coop.name}</strong> • Reg: {coop.registrationCode}
          </p>
        </div>

        <button
          onClick={() => setShowMemberModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Member Farmer</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Registered Smallholders</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{cooperativeMembers.length} Active Members</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Combined: {totalAcreage.toFixed(1)} Cultivated Acres</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Pooled Produce Volume</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">450 Bags (Clean Grain)</div>
          <div className="text-[11px] text-slate-500 mt-1">Certified Moisture &lt; 12%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Cooperative Bank Account</span>
          <div className="text-xs font-bold text-slate-800 mt-2">{coop.bankAccountName}</div>
          <div className="text-[10px] text-slate-400 mt-1">Multi-signatory custodial escrow linked</div>
        </div>
      </div>

      {/* Transparent Member Dividend Split Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Automated Institutional Dividend Split Calculator</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Allocates commercial contract revenue transparently to member bank/mobile money accounts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contract Revenue (KES / NGN)</label>
            <input
              type="number"
              value={contractTotalAmount}
              onChange={(e) => setContractTotalAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cooperative Admin / Storage Levy (%)</label>
            <input
              type="number"
              value={coopRetainedFeePct}
              onChange={(e) => setCoopRetainedFeePct(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-sm"
            />
          </div>
        </div>

        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex justify-between items-center text-xs font-semibold text-emerald-950">
          <span>Net Distributable to Members:</span>
          <span className="text-base font-black text-emerald-800">
            {formatCurrency(netDistributable, 'KES')}
          </span>
        </div>

        {/* Member Allocation Preview Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Member Name</th>
                <th className="py-2.5 px-3">Member ID</th>
                <th className="py-2.5 px-3">Farm Contribution</th>
                <th className="py-2.5 px-3 text-right">Acreage Share %</th>
                <th className="py-2.5 px-3 text-right">Allocated Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cooperativeMembers.map((mem) => {
                const sharePct = totalAcreage > 0 ? (mem.farmSizeAcres / totalAcreage) * 100 : 0;
                const payout = netDistributable * (sharePct / 100);

                return (
                  <tr key={mem.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{mem.farmerName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{mem.membershipNumber}</td>
                    <td className="py-3 px-3 text-slate-700">{mem.farmSizeAcres} Acres ({mem.cropsOrLivestock})</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600">{sharePct.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700">
                      {formatCurrency(Math.round(payout), 'KES')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Member */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Register Cooperative Member</h3>
              <button onClick={() => setShowMemberModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wanjiru Mwangi"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Membership Number</label>
                  <input
                    type="text"
                    required
                    value={memberNumber}
                    onChange={(e) => setMemberNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Farm Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={farmAcres}
                    onChange={(e) => setFarmAcres(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Crops or Livestock</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. White Maize, Dairy Friesian, Soya"
                  value={cropsLivestock}
                  onChange={(e) => setCropsLivestock(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
