'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Tractor, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Building, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { FarmUnitType } from '@/types';

export default function FarmsManagementDashboard() {
  const { farms, farmUnits, addFarm, addFarmUnit, currentUser } = useStore();

  // Modal States
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || '');

  // New Farm State
  const [farmName, setFarmName] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [stateProvince, setStateProvince] = useState('Ogun State');
  const [lgaDistrict, setLgaDistrict] = useState('Obafemi Owode');
  const [sizeHectares, setSizeHectares] = useState('5.0');
  const [primaryActivity, setPrimaryActivity] = useState('Poultry & Fish');

  // New Unit State
  const [unitName, setUnitName] = useState('');
  const [unitType, setUnitType] = useState<FarmUnitType>('poultry_house');
  const [unitCapacity, setUnitCapacity] = useState('1000');
  const [dimensionsSpecs, setDimensionsSpecs] = useState('');

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName) return;

    addFarm({
      ownerId: currentUser.id,
      name: farmName,
      country,
      stateProvince,
      lgaDistrict,
      sizeHectares: parseFloat(sizeHectares) || 1.0,
      primaryActivity,
      biosecurityLevel: 'Strict Biosecurity — Disinfection Bath Required',
      status: 'active',
    });

    setFarmName('');
    setShowFarmModal(false);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName || !selectedFarmId) return;

    addFarmUnit({
      farmId: selectedFarmId,
      name: unitName,
      unitType,
      capacity: parseInt(unitCapacity) || 500,
      currentOccupancy: 0,
      dimensionsSpecs: dimensionsSpecs || 'Standard production unit specifications',
      status: 'active',
    });

    setUnitName('');
    setDimensionsSpecs('');
    setShowUnitModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Farm Sites & Production Units</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure physical sites, deep-litter poultry houses, earthen ponds, cattle paddocks, and crop plots.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowUnitModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Production Unit</span>
          </button>

          <button
            onClick={() => setShowFarmModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Farm</span>
          </button>
        </div>
      </div>

      {/* Farms List */}
      <div className="space-y-8">
        {farms.map((farm) => {
          const unitsForThisFarm = farmUnits.filter((u) => u.farmId === farm.id);

          return (
            <div key={farm.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Farm Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{farm.name}</h2>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {farm.lgaDistrict}, {farm.stateProvince}, {farm.country}
                      </span>
                      <span>•</span>
                      <span>{farm.sizeHectares} Hectares</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {farm.biosecurityLevel}
                  </span>
                </div>
              </div>

              {/* Units Grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Production Units ({unitsForThisFarm.length})
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedFarmId(farm.id);
                      setShowUnitModal(true);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Unit to this Farm
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unitsForThisFarm.map((unit) => {
                    const occPct = Math.min(100, Math.round((unit.currentOccupancy / unit.capacity) * 100));

                    return (
                      <div
                        key={unit.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-sm">{unit.name}</h4>
                            <span className="capitalize px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-semibold border border-slate-200">
                              {unit.unitType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {unit.dimensionsSpecs || 'Standard environmental layout'}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Live Occupancy:</span>
                            <span className="font-bold text-slate-900">
                              {unit.currentOccupancy.toLocaleString()} / {unit.capacity.toLocaleString()} ({occPct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                occPct > 90 ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${occPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center text-[11px]">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Sanitized & Active
                          </span>
                          <Link
                            href="/dashboard/livestock"
                            className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                          >
                            <span>Batches</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register New Farm */}
      {showFarmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Register New Farm Site</h3>
              <button onClick={() => setShowFarmModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Pastures Poultry Hub"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option>Nigeria</option>
                    <option>Kenya</option>
                    <option>Ghana</option>
                    <option>Uganda</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LGA / District</label>
                  <input
                    type="text"
                    required
                    value={lgaDistrict}
                    onChange={(e) => setLgaDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Size (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={sizeHectares}
                    onChange={(e) => setSizeHectares(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Activity</label>
                <input
                  type="text"
                  placeholder="e.g. Intensive Broiler Production & Catfish Hatchery"
                  value={primaryActivity}
                  onChange={(e) => setPrimaryActivity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFarmModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Save Farm Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Production Unit */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Production Unit</h3>
              <button onClick={() => setShowUnitModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Farm Site</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.stateProvince})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broiler Pen 2, Earthen Pond 3, Dairy Paddock 1"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Type</label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as FarmUnitType)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="poultry_house">Poultry House</option>
                    <option value="fish_pond">Fish Pond / Tank</option>
                    <option value="cattle_herd">Cattle Stall / Herd</option>
                    <option value="goat_sheep_pen">Goat & Sheep Pen</option>
                    <option value="piggery">Piggery</option>
                    <option value="rabbitry">Rabbitry</option>
                    <option value="apiary">Apiary / Hives</option>
                    <option value="crop_field">Crop Field</option>
                    <option value="mixed">Mixed Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maximum Capacity</label>
                  <input
                    type="number"
                    required
                    value={unitCapacity}
                    onChange={(e) => setUnitCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dimensions & Ventilation Specs</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 25m x 8m deep litter floor, automatic nipple drinker lines, 4 exhaust fans"
                  value={dimensionsSpecs}
                  onChange={(e) => setDimensionsSpecs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnitModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
