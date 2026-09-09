'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Tractor, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Droplet, 
  Sun, 
  Wind, 
  AlertTriangle 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { VeterinaryDisclaimer } from '@/components/common/veterinary-disclaimer';

export default function FarmManagementPage() {
  const [activeUnitType, setActiveUnitType] = useState('poultry');

  const unitTypes = [
    {
      id: 'poultry',
      name: 'Poultry House / Brooder',
      icon: '🐔',
      summary: 'Deep litter & cage systems for broilers, layers, cockerels and turkeys.',
      specs: 'Tracks ventilation louvers, drinker lines, ambient heat, daily mortality, and egg production logs.',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'aquaculture',
      name: 'Earthen Fish Pond & Tanks',
      icon: '🐟',
      summary: 'Earthen ponds, concrete vats, and recirculating aquaculture systems (RAS).',
      specs: 'Tracks water volume (m³), dissolved oxygen levels, flow-through inlets, pellet size (2mm–9mm), and biomass sampling.',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'cattle',
      name: 'Cattle Herd & Free Stalls',
      icon: '🐄',
      summary: 'Dairy paddocks, rotational zero-grazing, and beef cattle fattening lots.',
      specs: 'Tracks lactation curves, ear tag IDs, daily milk litres, silage/concentrate intake, and tick dip schedules.',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'goats',
      name: 'Goat & Sheep Pens',
      icon: '🐐',
      summary: 'Raised slatted wooden floor pens for Boer goats, West African Dwarfs, and Red Sokoto.',
      specs: 'Tracks kid kidding rates, deworming rotations, mineral salt lick replenishment, and live weight milestones.',
      image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'piggery',
      name: 'Piggery & Farrowing Unit',
      icon: '🐖',
      summary: 'Clean farrowing pens with heating pads and automated nipple drinkers.',
      specs: 'Tracks litter size, piglet weaning weights, sow gestation calendar, and biosecurity footbath compliance.',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rabbitry',
      name: 'Commercial Rabbitry',
      icon: '🐇',
      summary: 'Multi-tier wire hutch batteries with automated dropping collection.',
      specs: 'Tracks kindle dates, doe breeding intervals, kit weaning counts, and forage supplementation.',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'crops',
      name: 'Crop Fields & Greenhouses',
      icon: '🌱',
      summary: 'Open-field grain plots, drip-irrigated cassava fields, and horticulture shade tunnels.',
      specs: 'Tracks planting seed rates, fertilizer top-dressing (NPK / Urea), harvest yield in tonnes, and moisture tests.',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const currentSelected = unitTypes.find((u) => u.id === activeUnitType) || unitTypes[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-emerald-950 text-white py-16 lg:py-20 border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                Precision Operational Intelligence
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Manage multiple farm sites and production units with total accountability.
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-4 leading-relaxed">
                Whether you operate a 50,000-bird poultry facility in Ogun, an intensive recirculating catfish hatchery in Epe, a dairy herd in Nakuru, or a grain plot in Kitale — AgriLink Africa gives you granular control from your mobile phone.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/farms"
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Configure Your Farm Units</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Production Units Showcase */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Specialized Production Units
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select a production unit below to see how AgriLink Africa configures specialized sensors, feeding schedules, and biosecurity rules.
            </p>
          </div>

          {/* Unit selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start md:justify-center mb-8">
            {unitTypes.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setActiveUnitType(unit.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
                  activeUnitType === unit.id
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{unit.icon}</span>
                <span>{unit.name}</span>
              </button>
            ))}
          </div>

          {/* Unit Detail Display */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentSelected.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentSelected.name}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">Standard African Operating Architecture</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                  {currentSelected.summary}
                </p>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tracked Operational Metrics:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentSelected.specs}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Includes offline daily logs & supervisor reviews</span>
                <Link
                  href="/dashboard/farms"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Open in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="h-72 lg:h-auto bg-slate-100 relative min-h-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSelected.image}
                alt={currentSelected.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-medium backdrop-blur-xs px-2 py-1 bg-black/40 rounded">
                  Live Farm Production Unit Profile
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Logs & Verification */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Daily Operations</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Complete Daily Farm Operations Log
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Replace unorganized paper notebooks and WhatsApp messages with standardized, auditable logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Feeding Sessions', desc: 'Log morning, afternoon, and evening feed by bag & kg with automated inventory deductions.' },
                { title: 'Water & Maintenance', desc: 'Record water flushing, borehole meter checks, filter cleaning, and heater generator uptime.' },
                { title: 'Mortality & Culls', desc: 'Document deaths, suspected causes, disposal method, and photo proof (with strict non-diagnosis disclaimer).' },
                { title: 'Health & Vaccines', desc: 'Schedule and confirm Gumboro, LaSota, Marek, dewormers, and track drug withdrawal countdowns.' },
                { title: 'Weight Sampling', desc: 'Log 50-bird or 30-fish random sample weighings to compute exact daily biomass and Feed Conversion Ratio.' },
                { title: 'Egg & Milk Yields', desc: 'Track daily crates of table eggs, cracked egg rates, or morning and evening dairy milk bulk litres.' },
                { title: 'Pond & Tank Cleaning', desc: 'Track water changes, sludge purging, aerator maintenance, and turbidity checks.' },
                { title: 'Equipment & Power', desc: 'Monitor diesel generator run hours, solar battery voltages, and cold-room thermostat logs.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Notice */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VeterinaryDisclaimer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
