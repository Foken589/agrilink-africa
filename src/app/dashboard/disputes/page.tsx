'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function DisputesDashboardPage() {
  const { disputes } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Trust & Dispute Resolution Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Impartial arbitration for weight discrepancies, transit mortality, and grading disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>24h Arbitration SLA</span>
          </span>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((disp) => (
          <div key={disp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{disp.orderNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">{disp.disputeReason}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Opened by: <strong className="text-slate-700">{disp.openedByName}</strong> against <strong className="text-slate-700">{disp.respondentName}</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase block sm:inline-block">
                  {disp.status.replace(/_/g, ' ')}
                </span>
                <div className="text-sm font-black text-rose-600 mt-1">
                  Claim: {formatCurrency(disp.claimAmount, disp.currency)}
                </div>
              </div>
            </div>

            {disp.resolutionNotes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Arbitrator Findings & Evidence Assessment:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{disp.resolutionNotes}</p>
              </div>
            )}

            {disp.evidenceAttachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Submitted Evidence Attachments:</span>
                <div className="flex gap-3">
                  {disp.evidenceAttachments.map((imgUrl, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg bg-slate-200 overflow-hidden border border-slate-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="Dispute evidence" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Opened on {formatDateTime(disp.createdAt)}</span>
              <span className="font-semibold text-emerald-700">Arbitration Session Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
