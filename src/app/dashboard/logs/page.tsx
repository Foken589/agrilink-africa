'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ClipboardList, 
  Plus, 
  Utensils, 
  AlertTriangle, 
  ShieldCheck, 
  Pill, 
  Scale, 
  Egg, 
  Droplet, 
  Calendar, 
  Clock, 
  Camera, 
  CheckCircle2 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatDateTime, formatDate } from '@/lib/utils';
import { VeterinaryDisclaimer } from '@/components/common/veterinary-disclaimer';

export default function DailyFarmLogsPage() {
  const { 
    feedLogs, 
    mortalityRecords, 
    treatmentRecords, 
    farmUnits, 
    livestockBatches, 
    feedTypes, 
    recordFeedLog, 
    recordMortality, 
    recordTreatment, 
    currentUser 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'feeding' | 'mortality' | 'treatments'>('feeding');

  // Feeding Modal
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [feedUnitId, setFeedUnitId] = useState(farmUnits[0]?.id || '');
  const [feedTypeId, setFeedTypeId] = useState(feedTypes[0]?.id || '');
  const [feedQuantityKg, setFeedQuantityKg] = useState('50');
  const [feedingSession, setFeedingSession] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [feedNotes, setFeedNotes] = useState('');
  const [feedPhoto, setFeedPhoto] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80');

  // Mortality Modal
  const [showMortModal, setShowMortModal] = useState(false);
  const [mortBatchId, setMortBatchId] = useState(livestockBatches[0]?.id || '');
  const [numberDead, setNumberDead] = useState('2');
  const [suspectedCause, setSuspectedCause] = useState('Heat Stress');
  const [handlingMethod, setHandlingMethod] = useState('Buried in deep lime pit');
  const [mortNotes, setMortNotes] = useState('');
  const [mortPhoto, setMortPhoto] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80');
  const [mortError, setMortError] = useState('');

  // Treatment Modal
  const [showTreatModal, setShowTreatModal] = useState(false);
  const [treatBatchId, setTreatBatchId] = useState(livestockBatches[0]?.id || '');
  const [treatmentType, setTreatmentType] = useState<'vaccine' | 'antibiotic' | 'dewormer' | 'vitamin' | 'water_treatment'>('vaccine');
  const [drugName, setDrugName] = useState('Gumboro Vaccine (IBD)');
  const [dosage, setDosage] = useState('1 dose per bird via drinking water');
  const [route, setRoute] = useState('water');
  const [withdrawalDays, setWithdrawalDays] = useState('0');
  const [treatNotes, setTreatNotes] = useState('');

  const handleSaveFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = livestockBatches.find((b) => b.unitId === feedUnitId) || livestockBatches[0];
    recordFeedLog({
      unitId: feedUnitId,
      batchId: batch.id,
      feedTypeId,
      quantityKg: parseFloat(feedQuantityKg) || 25,
      feedingSession,
      workerId: currentUser.id,
      photoUrl: feedPhoto,
      notes: feedNotes,
    });
    setShowFeedModal(false);
    setFeedNotes('');
  };

  const handleSaveMortality = (e: React.FormEvent) => {
    e.preventDefault();
    setMortError('');

    const batch = livestockBatches.find((b) => b.id === mortBatchId);
    if (!batch) return;

    const count = parseInt(numberDead) || 1;
    const result = recordMortality(
      batch.id,
      batch.unitId,
      count,
      suspectedCause,
      handlingMethod,
      mortNotes,
      mortPhoto
    );

    if (!result.success) {
      setMortError(result.error || 'Failed to record mortality.');
      return;
    }

    setShowMortModal(false);
    setMortNotes('');
    setNumberDead('2');
  };

  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = livestockBatches.find((b) => b.id === treatBatchId) || livestockBatches[0];
    const days = parseInt(withdrawalDays) || 0;
    const endDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

    recordTreatment({
      unitId: batch.unitId,
      batchId: batch.id,
      treatmentType,
      drugName,
      dosage,
      administrationRoute: route,
      administeredBy: currentUser.fullName,
      withdrawalPeriodDays: days,
      withdrawalEndDate: days > 0 ? endDate : undefined,
      notes: treatNotes,
    });
    setShowTreatModal(false);
    setTreatNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Daily Farm Operations Log</h1>
          <p className="text-xs text-slate-500 mt-1">
            Feeding sessions, mortality with proof, vaccination schedules, and withdrawal countdowns.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFeedModal(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4" />
            <span>+ Log Feeding</span>
          </button>

          <button
            onClick={() => setShowMortModal(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>+ Log Mortality</span>
          </button>

          <button
            onClick={() => setShowTreatModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Pill className="w-4 h-4" />
            <span>+ Log Treatment</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('feeding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'feeding' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Feeding Sessions ({feedLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mortality')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'mortality' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Mortality Records ({mortalityRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('treatments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'treatments' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Vaccines & Medication ({treatmentRecords.length})</span>
        </button>
      </div>

      {/* Tab 1: Feeding Logs */}
      {activeTab === 'feeding' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Recorded Feeding Sessions</span>
            <span className="text-slate-500">Auto-deducted from inventory</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Time Recorded</th>
                  <th className="py-3 px-4">Unit / Batch</th>
                  <th className="py-3 px-4">Feed Type</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4 text-right">Quantity Consumed</th>
                  <th className="py-3 px-4">Attendant & Notes</th>
                  <th className="py-3 px-4 text-center">Photo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedLogs.map((log) => {
                  const unit = farmUnits.find((u) => u.id === log.unitId);
                  const feed = feedTypes.find((f) => f.id === log.feedTypeId);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatDateTime(log.timeRecorded)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {unit?.name || 'Unit'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {feed?.name || 'Standard Pellets'}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          {log.feedingSession}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                        {log.quantityKg} kg
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {log.notes || 'Normal feeding intake'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {log.photoUrl ? (
                          <a href={log.photoUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-8 h-8 rounded bg-slate-200 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={log.photoUrl} alt="Feeding proof" className="w-full h-full object-cover" />
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Mortality Records */}
      {activeTab === 'mortality' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Recorded Mortality Events</span>
              <span className="text-rose-600 font-bold">Direct Ledger Deduction</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Batch / Unit</th>
                    <th className="py-3 px-4 text-right">Dead Count</th>
                    <th className="py-3 px-4">Suspected Cause</th>
                    <th className="py-3 px-4">Disposal / Handling</th>
                    <th className="py-3 px-4">Attendant Notes</th>
                    <th className="py-3 px-4 text-center">Evidence Photo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mortalityRecords.map((rec) => {
                    const batch = livestockBatches.find((b) => b.id === rec.batchId);

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {formatDateTime(rec.recordedAt)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {batch?.batchCode || 'Batch'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-rose-700 text-sm">
                          {rec.numberDead} dead
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {rec.suspectedCause}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {rec.handlingMethod}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {rec.notes || 'Routine disposal confirmed.'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {rec.evidencePhotoUrl ? (
                            <a href={rec.evidencePhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-8 h-8 rounded bg-slate-200 overflow-hidden border border-slate-300">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={rec.evidencePhotoUrl} alt="Mortality evidence" className="w-full h-full object-cover" />
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <VeterinaryDisclaimer />
        </div>
      )}

      {/* Tab 3: Treatments & Vaccines */}
      {activeTab === 'treatments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Vaccination & Veterinary Medication Schedule</span>
            <span className="text-slate-500">Withdrawal Period Monitoring</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Administered Date</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Drug / Vaccine Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dosage & Route</th>
                  <th className="py-3 px-4">Administered By</th>
                  <th className="py-3 px-4">Withdrawal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {treatmentRecords.map((tr) => {
                  const batch = livestockBatches.find((b) => b.id === tr.batchId);

                  return (
                    <tr key={tr.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tr.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {batch?.batchCode || 'Batch'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {tr.drugName}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[10px]">
                          {tr.treatmentType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {tr.dosage} ({tr.administrationRoute})
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {tr.administeredBy || 'Farm Manager'}
                      </td>
                      <td className="py-3.5 px-4">
                        {tr.withdrawalPeriodDays > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            {tr.withdrawalPeriodDays} Days (Ends {tr.withdrawalEndDate})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            0 Days (No Residual)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log Feeding */}
      {showFeedModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Feeding Session</h3>
              <button onClick={() => setShowFeedModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveFeed} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Production Unit</label>
                <select
                  value={feedUnitId}
                  onChange={(e) => setFeedUnitId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {farmUnits.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feed Type</label>
                  <select
                    value={feedTypeId}
                    onChange={(e) => setFeedTypeId(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    {feedTypes.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feeding Session</label>
                  <select
                    value={feedingSession}
                    onChange={(e) => setFeedingSession(e.target.value as 'morning' | 'afternoon' | 'evening' | 'night')}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="morning">Morning (06:00 - 09:00)</option>
                    <option value="afternoon">Afternoon (12:00 - 14:00)</option>
                    <option value="evening">Evening (16:00 - 18:00)</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Consumed (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={feedQuantityKg}
                  onChange={(e) => setFeedQuantityKg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observation Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Good appetite, all feeders emptied within 30 minutes."
                  value={feedNotes}
                  onChange={(e) => setFeedNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Save Feeding Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Mortality */}
      {showMortModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Livestock Mortality</h3>
              <button onClick={() => setShowMortModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            {mortError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-bold">
                {mortError}
              </div>
            )}

            <form onSubmit={handleSaveMortality} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affected Batch</label>
                <select
                  value={mortBatchId}
                  onChange={(e) => setMortBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {livestockBatches.map((b) => (
                    <option key={b.id} value={b.id}>{b.batchCode} ({b.speciesType} — Live: {b.currentLiveQuantity})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number Dead</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={numberDead}
                    onChange={(e) => setNumberDead(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-black text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suspected Cause</label>
                  <select
                    value={suspectedCause}
                    onChange={(e) => setSuspectedCause(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                  >
                    <option>Heat Stress</option>
                    <option>Smothering / Piling</option>
                    <option>Suspected Newcastle</option>
                    <option>Suspected Gumboro</option>
                    <option>Low Dissolved Oxygen (Fish)</option>
                    <option>Predator Attack (Snake/Rodent)</option>
                    <option>Natural Brooding Culling</option>
                    <option>Unknown / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Handling & Disposal Method</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buried in farm lime pit / incinerated"
                  value={handlingMethod}
                  onChange={(e) => setHandlingMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Worker Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birds found near rear wall louvers."
                  value={mortNotes}
                  onChange={(e) => setMortNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="p-2 rounded bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                Notice: Mortality records are operational accounting data and not formal veterinary diagnoses.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMortModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow"
                >
                  Confirm & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Treatment */}
      {showTreatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Log Vaccine or Medication</h3>
              <button onClick={() => setShowTreatModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Batch</label>
                <select
                  value={treatBatchId}
                  onChange={(e) => setTreatBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {livestockBatches.map((b) => (
                    <option key={b.id} value={b.id}>{b.batchCode} ({b.speciesType})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Type</label>
                  <select
                    value={treatmentType}
                    onChange={(e) => setTreatmentType(e.target.value as 'vaccine' | 'antibiotic' | 'dewormer' | 'vitamin' | 'water_treatment')}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="vaccine">Vaccine</option>
                    <option value="antibiotic">Antibiotic</option>
                    <option value="dewormer">Dewormer</option>
                    <option value="vitamin">Vitamin / Supplement</option>
                    <option value="water_treatment">Water Sanitizer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Administration Route</label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="water">Drinking Water</option>
                    <option value="feed">Feed Premix</option>
                    <option value="injection">Subcutaneous Injection</option>
                    <option value="spray">Coarse Spray / Eye Drop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drug / Vaccine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LaSota Newcastle Vaccine"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1000 doses in 20L water"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Withdrawal Days</label>
                  <input
                    type="number"
                    min="0"
                    value={withdrawalDays}
                    onChange={(e) => setWithdrawalDays(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Veterinary Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stabilized with non-fat milk powder. Administered at 07:00 AM."
                  value={treatNotes}
                  onChange={(e) => setTreatNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTreatModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold shadow"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
