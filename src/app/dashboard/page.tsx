'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Tractor, 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Scale 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDate, formatDateTime, getOrderStateBadge } from '@/lib/utils';
import { VeterinaryDisclaimer } from '@/components/common/veterinary-disclaimer';

export default function DashboardPage() {
  const { 
    currentUser, 
    farms, 
    farmUnits, 
    livestockBatches, 
    mortalityRecords, 
    feedLogs, 
    feedInventory, 
    tasks, 
    activityLogs, 
    orders, 
    alerts, 
    cooperativeMembers,
    deliveryJobs 
  } = useStore();

  // Metrics Calculations
  const totalLiveHeads = livestockBatches.reduce((sum, b) => sum + b.currentLiveQuantity, 0);
  const totalOpeningHeads = livestockBatches.reduce((sum, b) => sum + b.openingQuantity, 0);
  const totalBiomassKg = livestockBatches.reduce((sum, b) => sum + b.biomassKg, 0);

  const totalDeathsRecorded = mortalityRecords.reduce((sum, m) => sum + m.numberDead, 0);
  const mortalityRatePct = totalOpeningHeads > 0 ? ((totalDeathsRecorded / totalOpeningHeads) * 100).toFixed(2) : '0.00';

  const totalFeedConsumedKg = feedLogs.reduce((sum, f) => sum + f.quantityKg, 0);
  const totalFeedCost = Math.round(totalFeedConsumedKg * 850); // Average NGN 850/kg

  const pendingEvidence = activityLogs.filter((a) => a.reviewStatus === 'pending_review');
  const issueReports = activityLogs.filter((a) => a.issueFlag);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const workerCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100;

  const unreadAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome back, {currentUser.fullName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold capitalize">
              {currentUser.role.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operating Site: <span className="font-semibold text-slate-700">{farms[0]?.name || 'Primary Farm'}</span> • {currentUser.stateRegion}, {currentUser.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentUser.role === 'worker' ? (
            <Link
              href="/dashboard/workers"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Submit Task Evidence</span>
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard/logs"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
              >
                + Log Feeding / Mortality
              </Link>
              <Link
                href="/dashboard/workers"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Review Worker Proof ({pendingEvidence.length})</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Primary KPI Grid (Farmer Core View) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Live Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Current Live Stock</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalLiveHeads.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">heads</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-emerald-700">{livestockBatches.length} active batches</span>
            <span>across {farmUnits.length} units</span>
          </div>
        </div>

        {/* Metric 2: Mortality Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Mortality (Cumulative)</span>
            <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {mortalityRatePct}%
            </span>
            <span className="text-xs text-rose-600 font-bold">({totalDeathsRecorded} dead)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Within acceptable industry baseline (&lt; 2.5%)
          </div>
        </div>

        {/* Metric 3: Total Biomass */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Estimated Live Biomass</span>
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalBiomassKg.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Calculated: Live count × sample weight
          </div>
        </div>

        {/* Metric 4: Worker Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Worker Task Completion</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {workerCompletionRate}%
            </span>
            <span className="text-xs text-slate-500">({completedTasks}/{tasks.length} done)</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{pendingEvidence.length} submissions awaiting review</span>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {unreadAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Biosecurity & Operational Alerts ({unreadAlerts.length})</span>
            </div>
            <Link href="/dashboard/alerts" className="font-semibold text-rose-700 hover:underline">
              View All Alerts →
            </Link>
          </div>

          <div className="divide-y divide-rose-100">
            {unreadAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="py-1.5 flex justify-between items-center">
                <span className="text-rose-800 font-medium">{alert.title}</span>
                <span className="text-[10px] text-rose-600 uppercase font-bold px-2 py-0.5 bg-rose-200/60 rounded">
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Worker Evidence & Activity Reports */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Worker Submissions with Submitted Evidence</h3>
                <p className="text-[11px] text-slate-500">Timestamped photos requiring supervisor approval before ledger audit lock</p>
              </div>
              <Link href="/dashboard/workers" className="text-xs font-bold text-emerald-700 hover:underline">
                Review Console →
              </Link>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 text-xs">
                  {log.evidence[0] ? (
                    <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={log.evidence[0].mediaUrl}
                        alt="Activity Evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-slate-900 truncate">{log.taskTitle}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.reviewStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.reviewStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.reviewStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                      {log.description}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Worker: <strong className="text-slate-600">{log.workerName}</strong></span>
                      <span>•</span>
                      <span>{formatDateTime(log.timestampRecorded)}</span>
                      {log.issueFlag && (
                        <span className="text-rose-600 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Issue Flagged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Production Units Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Farm Production Units Status</h3>
                <p className="text-[11px] text-slate-500">Live occupancy vs maximum carrying capacity</p>
              </div>
              <Link href="/dashboard/farms" className="text-xs font-bold text-emerald-700 hover:underline">
                Manage Units →
              </Link>
            </div>

            <div className="space-y-4">
              {farmUnits.slice(0, 4).map((unit) => {
                const pct = Math.min(100, Math.round((unit.currentOccupancy / unit.capacity) * 100));
                return (
                  <div key={unit.id} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{unit.name}</span>
                      <span className="text-slate-500">
                        <strong className="text-slate-900">{unit.currentOccupancy.toLocaleString()}</strong> / {unit.capacity.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct > 90 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Escrow Orders & Supply Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Active Orders (11-Stage Flow)</h3>
                <p className="text-[11px] text-slate-500">Escrow protected transactions in progress</p>
              </div>
              <Link href="/dashboard/orders" className="text-xs font-bold text-emerald-700 hover:underline">
                All Orders →
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const badge = getOrderStateBadge(order.currentState);
                return (
                  <div key={order.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                        <div className="text-[11px] text-slate-500">{order.commodityName}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.color} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <span>Volume: <strong className="text-slate-900">{order.quantity} {order.unitOfMeasure}</strong></span>
                      <span className="font-bold text-slate-900">{formatCurrency(order.totalAmount, order.currency)}</span>
                    </div>

                    {order.waybillNumber && (
                      <div className="p-1.5 rounded bg-emerald-50 text-[10px] text-emerald-800 font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3 text-emerald-600" />
                          Waybill: {order.waybillNumber}
                        </span>
                        <span>OTP: {order.deliveryOtp}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Task Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Field Tasks</h3>
              <span className="text-[11px] text-slate-500 font-medium">{tasks.length} total</span>
            </div>

            <div className="space-y-2 text-xs">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    task.status === 'completed' ? 'bg-emerald-600' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-slate-800 truncate ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Assigned to: {task.assignedWorkerName || 'Unassigned'} • Due {formatDate(task.dueDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Veterinary Disclaimer */}
      <VeterinaryDisclaimer />
    </div>
  );
}
