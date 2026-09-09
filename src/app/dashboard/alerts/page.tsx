'use client';

import React from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  Bell 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatDateTime } from '@/lib/utils';

export default function AlertsDashboardPage() {
  const { alerts, dismissAlert } = useStore();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-rose-50 border-rose-200 text-rose-900 ring-1 ring-rose-300';
      case 'medium':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Biosecurity & Operational Alerts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time triggers for mortality spikes, inventory depletion, unreviewed evidence, and withdrawal warnings.
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-6 shadow-sm transition space-y-3 ${getSeverityStyle(alert.severity)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                }`} />
                <h3 className="font-bold text-sm sm:text-base">{alert.title}</h3>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/80 border border-current">
                {alert.severity}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-700">
              {alert.message}
            </p>

            <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                Triggered {formatDateTime(alert.createdAt)}
              </span>

              {alert.resolved ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolved / Acknowledged
                </span>
              ) : (
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 shadow-xs transition"
                >
                  Acknowledge & Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
