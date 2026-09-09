'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Tractor, 
  Layers, 
  ShoppingBag, 
  Scale, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { 
    allUsers, 
    farms, 
    livestockBatches, 
    orders, 
    disputes, 
    activityLogs, 
    marketPrices 
  } = useStore();

  const totalEscrowVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalLiveHeads = livestockBatches.reduce((sum, b) => sum + b.currentLiveQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Platform Governance & Telemetry</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
              Admin Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System-wide pan-African telemetry, verification auditing, and dispute arbitration.
          </p>
        </div>
      </div>

      {/* High Level Platform Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Registered Stakeholders</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{allUsers.length} Users</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">100% Identity Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Audited Live Livestock</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalLiveHeads.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {farms.length} Farm Holdings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Escrow GMV Processed</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalEscrowVolume, 'NGN')}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">T+0 Paystack Settlement</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Evidence Submissions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activityLogs.length} Photos</div>
          <div className="text-[11px] text-slate-500 mt-1">Worker GPS Tamper Scanned</div>
        </div>
      </div>

      {/* Stakeholder Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900">Platform Stakeholder Roster</span>
          <span className="text-slate-500">Multi-Role Governance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{user.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-emerald-800">
                    {user.role.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {user.stateRegion}, {user.country}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-max">
                      <ShieldCheck className="w-3 h-3" /> {user.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDateTime(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
