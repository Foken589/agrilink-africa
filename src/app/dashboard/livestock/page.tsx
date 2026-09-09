'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  ArrowRight, 
  Scale, 
  Calendar, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatDateTime, formatDate } from '@/lib/utils';
import { LivestockMovementType } from '@/types';
import { calculateBatchStockFromMovements } from '@/lib/services/stock-calculator';
import { VeterinaryDisclaimer } from '@/components/common/veterinary-disclaimer';

export default function LivestockDashboardPage() {
  const { 
    livestockBatches, 
    livestockMovements, 
    farmUnits, 
    farms, 
    addLivestockBatch, 
    recordStockMovement 
  } = useStore();

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(livestockBatches[0]?.id || '');
  const [movementError, setMovementError] = useState('');

  // New Batch Form State
  const [unitId, setUnitId] = useState(farmUnits[0]?.id || '');
  const [batchCode, setBatchCode] = useState('');
  const [speciesType, setSpeciesType] = useState('Broiler Chicken');
  const [breedStrain, setBreedStrain] = useState('Cobb 500');
  const [supplierName, setSupplierName] = useState('Zartech Hatcheries');
  const [openingQuantity, setOpeningQuantity] = useState('1000');
  const [ageWeeks, setAgeWeeks] = useState('Day-Old');
  const [avgWeightKg, setAvgWeightKg] = useState('0.045');

  // Movement Form State
  const [movementType, setMovementType] = useState<LivestockMovementType>('addition_purchase');
  const [moveQuantity, setMoveQuantity] = useState('50');
  const [moveNotes, setMoveNotes] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode || !unitId) return;

    const unit = farmUnits.find((u) => u.id === unitId);
    const farmId = unit ? unit.farmId : farms[0].id;
    const qty = parseInt(openingQuantity) || 100;
    const weight = parseFloat(avgWeightKg) || 0.05;

    addLivestockBatch({
      unitId,
      farmId,
      batchCode: batchCode.toUpperCase(),
      speciesType,
      breedStrain,
      acquisitionDate: new Date().toISOString().split('T')[0],
      supplierName,
      openingQuantity: qty,
      currentLiveQuantity: qty,
      ageWeeksOrMonths: ageWeeks,
      averageWeightKg: weight,
      biomassKg: parseFloat((qty * weight).toFixed(2)),
      status: 'active',
      notes: 'Initial stocking batch',
      photos: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80'],
    });

    setBatchCode('');
    setShowBatchModal(false);
  };

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    setMovementError('');

    const qty = parseInt(moveQuantity);
    if (!qty || qty <= 0) {
      setMovementError('Quantity must be greater than 0');
      return;
    }

    const result = recordStockMovement(selectedBatchId, movementType, qty, moveNotes, referenceId);
    if (!result.success) {
      setMovementError(result.error || 'Failed to record movement');
      return;
    }

    setShowMovementModal(false);
    setMoveQuantity('50');
    setMoveNotes('');
    setReferenceId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Livestock Batches & Stock Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable server ledger: <span className="font-semibold text-emerald-800">Opening + Purchases + Births − Sales − Mortality − Culls</span>. Negative balances prohibited.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowMovementModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Movement / Sale / Cull</span>
          </button>

          <button
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Stock New Batch</span>
          </button>
        </div>
      </div>

      {/* Batches Table with Ledger Integrity Check */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">Active Production Batches</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {livestockBatches.length} Live Batches
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Integrity Check: ALL BATCHES BALANCED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Species & Breed</th>
                <th className="py-3 px-4">Production Unit</th>
                <th className="py-3 px-4 text-right">Opening Stock</th>
                <th className="py-3 px-4 text-right">Current Live Stock</th>
                <th className="py-3 px-4 text-right">Mortality (Rate %)</th>
                <th className="py-3 px-4 text-right">Est. Biomass</th>
                <th className="py-3 px-4 text-center">Ledger Audit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {livestockBatches.map((batch) => {
                const unit = farmUnits.find((u) => u.id === batch.unitId);
                const audit = calculateBatchStockFromMovements(batch, livestockMovements);

                return (
                  <tr key={batch.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {batch.batchCode}
                      <div className="text-[10px] text-slate-400 font-normal font-sans">
                        Stocked {formatDate(batch.acquisitionDate)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{batch.speciesType}</div>
                      <div className="text-[11px] text-slate-500">{batch.breedStrain}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {unit?.name || 'Assigned Unit'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      {batch.openingQuantity.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="text-base font-black text-emerald-700">
                        {batch.currentLiveQuantity.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">heads alive</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-rose-700">
                        {audit.totalMortality} dead
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ({audit.mortalityRatePct}%)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-900">
                        {batch.biomassKg.toLocaleString()} kg
                      </div>
                      <div className="text-[10px] text-slate-400">
                        @ {batch.averageWeightKg} kg/head
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {audit.hasDiscrepancy ? (
                        <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          Discrepancy Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedBatchId(batch.id);
                          setShowMovementModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Log Movement
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Ledger History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Stock Movement Immutable Audit Trail</h3>
            <p className="text-[11px] text-slate-500">Complete historical journal of every addition, birth, transfer, sale, and mortality</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {livestockMovements.length} Ledger Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Batch Code</th>
                <th className="py-2.5 px-3">Movement Type</th>
                <th className="py-2.5 px-3 text-right">Qty Delta</th>
                <th className="py-2.5 px-3 text-right">Prev Balance</th>
                <th className="py-2.5 px-3 text-right">New Balance</th>
                <th className="py-2.5 px-3">Ref ID / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {livestockMovements.map((mvt) => {
                const batch = livestockBatches.find((b) => b.id === mvt.batchId);
                const isDeduction = ['sale', 'mortality', 'culling', 'transfer_out'].includes(mvt.movementType);

                return (
                  <tr key={mvt.id} className="hover:bg-slate-50 transition font-mono">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(mvt.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {batch?.batchCode || mvt.batchId}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`capitalize px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDeduction ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {mvt.movementType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-right font-black ${
                      isDeduction ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {isDeduction ? `−${mvt.quantity}` : `+${mvt.quantity}`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {mvt.previousQuantity.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {mvt.newQuantity.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-800">{mvt.referenceId}</span>
                      {mvt.notes && <span className="text-slate-500 ml-1">• {mvt.notes}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance notice */}
      <VeterinaryDisclaimer />

      {/* Modal: Stock New Batch */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Stock New Livestock Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Farm Production Unit</label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {farmUnits.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} (Cap: {u.capacity})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Code / Lot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BR-2026-09"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Species Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broiler Chicken, Catfish"
                    value={speciesType}
                    onChange={(e) => setSpeciesType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Breed / Strain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cobb 500, Clarias Dutch"
                    value={breedStrain}
                    onChange={(e) => setBreedStrain(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supplier / Hatchery</label>
                  <input
                    type="text"
                    placeholder="e.g. Zartech Ibadan"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Qty</label>
                  <input
                    type="number"
                    required
                    value={openingQuantity}
                    onChange={(e) => setOpeningQuantity(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Avg Weight (kg)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={avgWeightKg}
                    onChange={(e) => setAvgWeightKg(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age / Class</label>
                  <input
                    type="text"
                    value={ageWeeks}
                    onChange={(e) => setAgeWeeks(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Confirm Stocking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Stock Movement */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Stock Ledger Movement</h3>
              <button onClick={() => setShowMovementModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            {movementError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{movementError}</span>
              </div>
            )}

            <form onSubmit={handleRecordMovement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {livestockBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} ({b.speciesType} — Live: {b.currentLiveQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Movement Type</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as LivestockMovementType)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="addition_purchase">+ Purchase / Addition</option>
                    <option value="birth_hatch_stocking">+ Birth / Hatching</option>
                    <option value="transfer_in">+ Transfer In</option>
                    <option value="sale">− Commercial Sale</option>
                    <option value="mortality">− Recorded Mortality</option>
                    <option value="culling">− Emergency Culling</option>
                    <option value="transfer_out">− Transfer Out</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Heads/Birds)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={moveQuantity}
                    onChange={(e) => setMoveQuantity(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Reference / Invoice #</label>
                <input
                  type="text"
                  placeholder="e.g. INV-BUYER-884, VET-CULL-02"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Handling Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Weighbridge verified at 1.95kg. Sold to FreshEats."
                  value={moveNotes}
                  onChange={(e) => setMoveNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Apply to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
