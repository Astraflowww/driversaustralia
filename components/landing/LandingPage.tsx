'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Check, 
  ChevronRight,
  Sparkles,
  FileCheck,
  Building2,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('role', 'buyer');
    if (vehicleFilter && vehicleFilter !== 'Any vehicle type') params.set('category', vehicleFilter);
    if (locationFilter) params.set('location', locationFilter);
    router.push(`/register?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#f2efe6] text-[#15170f] flex flex-col font-sans selection:bg-[#ffb81c] selection:text-[#15170f]">
      
      {/* ---------- HERO SECTION: GANTRY SIGN ---------- */}
      <section className="relative bg-[#17191a] text-[#f2efe6] pt-16 pb-0 overflow-hidden">
        {/* Radial highway gradient glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background: `radial-gradient(circle at 15% 20%, rgba(255,184,28,0.1), transparent 40%), radial-gradient(circle at 85% 60%, rgba(11,93,56,0.35), transparent 45%)`
          }}
        />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0b5d38] text-[#f2efe6] font-mono text-xs font-bold tracking-widest px-3 py-1.5 rounded-[3px] border border-[#f2efe6]">
              <span className="bg-[#f2efe6] text-[#073c25] font-extrabold px-1.5 py-0.5 rounded-[2px]">M1</span>
              AUSTRALIA&apos;S DRIVER JOB NETWORK
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.05]">
              Your next run<br />starts <span className="text-[#ffb81c]">here.</span>
            </h1>

            <p className="text-[#b9bcb2] text-base sm:text-lg max-w-xl leading-relaxed">
              From B-doubles on the Hume to last-mile vans in the suburbs — see verified driving jobs across Australia, straight from the companies hiring. No agencies, no guesswork.
            </p>

            {/* Quick Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/register?role=seller">
                <button className="w-full sm:w-auto bg-[#ffb81c] hover:bg-[#d99400] text-[#15170f] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[4px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                  Hire Heavy Drivers
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/register?role=buyer">
                <button className="w-full sm:w-auto border-2 border-[#f2efe6] text-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#15170f] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[4px] flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Apply For Truck Runs
                </button>
              </Link>
            </div>

            {/* Route Planner / Search Form */}
            <form onSubmit={handleSearch} className="bg-[#f2efe6] rounded-[8px] p-2 flex flex-col sm:flex-row gap-2 shadow-2xl border border-white/20 text-[#15170f] mt-4">
              <div className="flex-1 flex flex-col px-3.5 py-2 border-b sm:border-b-0 sm:border-r border-[#ddd8ca]">
                <label className="text-[11px] uppercase tracking-wider text-[#7b8079] font-bold mb-1">
                  Vehicle / Licence
                </label>
                <select 
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="bg-transparent font-sans text-sm font-semibold text-[#15170f] outline-none cursor-pointer"
                >
                  <option value="">Any vehicle type</option>
                  <option value="B-Double">B-Double / Road Train (MC)</option>
                  <option value="Semi Trailer">Semi / Prime Mover (HC)</option>
                  <option value="Rigid Truck">Rigid Truck (HR)</option>
                  <option value="Delivery Van">Delivery Van (LR)</option>
                  <option value="Courier">Courier & Last-Mile</option>
                  <option value="Bus">Bus & Coach</option>
                  <option value="Tanker">Tanker / Dangerous Goods</option>
                  <option value="Forklift">Forklift / Warehouse</option>
                  <option value="Mining">Mining Haul Truck</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col px-3.5 py-2 border-b sm:border-b-0 border-[#ddd8ca]">
                <label className="text-[11px] uppercase tracking-wider text-[#7b8079] font-bold mb-1">
                  Location
                </label>
                <input 
                  type="text" 
                  placeholder="Suburb, region or state"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="bg-transparent font-sans text-sm font-semibold text-[#15170f] outline-none placeholder-[#7b8079]"
                />
              </div>

              <button type="submit" className="bg-[#0b5d38] hover:bg-[#147a4a] text-[#f2efe6] font-bold text-sm uppercase tracking-wide px-6 py-3.5 rounded-[4px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md self-center w-full sm:w-auto">
                <Search className="w-4 h-4 stroke-[2.5]" />
                Find Jobs
              </button>
            </form>
          </div>

          {/* Right Side Gantry Sign */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b5d38] border-3 border-[#f2efe6] rounded-[8px] p-6 shadow-[0_18px_0_#073c25,0_18px_30px_rgba(0,0,0,0.4)]">
              <div className="font-display space-y-0">
                <Link href="/register?role=buyer&category=B-Double" className="flex justify-between items-center py-3 border-b-1.5 border-dashed border-[#f2efe6]/35 hover:opacity-90 transition-opacity cursor-pointer group">
                  <span className="text-lg tracking-wide font-semibold text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">B-DOUBLE & ROAD TRAIN</span>
                  <span className="font-mono text-xs bg-[#f2efe6] text-[#073c25] px-2.5 py-1 rounded-[3px] font-extrabold">412 LIVE</span>
                </Link>
                <Link href="/register?role=buyer&category=Rigid+Truck" className="flex justify-between items-center py-3 border-b-1.5 border-dashed border-[#f2efe6]/35 hover:opacity-90 transition-opacity cursor-pointer group">
                  <span className="text-lg tracking-wide font-semibold text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">RIGID & LOCAL DELIVERY</span>
                  <span className="font-mono text-xs bg-[#f2efe6] text-[#073c25] px-2.5 py-1 rounded-[3px] font-extrabold">896 LIVE</span>
                </Link>
                <Link href="/register?role=buyer&category=Mining" className="flex justify-between items-center py-3 border-b-1.5 border-dashed border-[#f2efe6]/35 hover:opacity-90 transition-opacity cursor-pointer group">
                  <span className="text-lg tracking-wide font-semibold text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">FIFO & MINING</span>
                  <span className="font-mono text-xs bg-[#f2efe6] text-[#073c25] px-2.5 py-1 rounded-[3px] font-extrabold">203 LIVE</span>
                </Link>
                <Link href="/register?role=buyer&category=Courier" className="flex justify-between items-center py-3 hover:opacity-90 transition-opacity cursor-pointer group">
                  <span className="text-lg tracking-wide font-semibold text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">COURIER & LAST-MILE</span>
                  <span className="font-mono text-xs bg-[#f2efe6] text-[#073c25] px-2.5 py-1 rounded-[3px] font-extrabold">571 LIVE</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Ticker Strip */}
        <div className="bg-[#232624] py-4 border-t border-[#2f322f]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex flex-wrap justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-[#ffb81c]">2,480+</span>
              <span className="text-xs uppercase tracking-wider text-[#b9bcb2]">Jobs live now</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-[#ffb81c]">1,140</span>
              <span className="text-xs uppercase tracking-wider text-[#b9bcb2]">Companies hiring</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-[#ffb81c]">$38/hr</span>
              <span className="text-xs uppercase tracking-wider text-[#b9bcb2]">Avg. HR rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-[#ffb81c]">0%</span>
              <span className="text-xs uppercase tracking-wider text-[#b9bcb2]">Commission for drivers</span>
            </div>
          </div>
        </div>
      </section>
      
      <div className="lane dark" />

      {/* ---------- VEHICLE CATEGORIES SECTION ---------- */}
      <section id="vehicles" className="py-20 bg-[#f2efe6]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7">
          
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-xs tracking-widest uppercase text-[#073c25] font-bold mb-2 flex items-center gap-2.5">
              <span className="w-6 h-0.5 bg-[#d99400]"></span>
              VEHICLE TYPES
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#15170f] leading-none mb-3">
              Every rig on the road.
            </h2>
            <p className="text-[#7b8079] text-base">
              Jobs are sorted by the vehicle and licence class you actually hold — so you only see runs you&apos;re qualified for.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Category 1 */}
            <Link href="/register?role=buyer&category=B-Double" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="20" width="14" height="10" rx="1" />
                  <path d="M16 20h8v10h-8z" />
                  <rect x="24" y="16" width="20" height="14" rx="1" />
                  <circle cx="9" cy="34" r="3.4" />
                  <circle cx="20" cy="34" r="3.4" />
                  <circle cx="30" cy="34" r="3.4" />
                  <circle cx="39" cy="34" r="3.4" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">MC LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">B-Double & Road Train</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Interstate linehaul, multi-trailer combinations.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  412 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 2 */}
            <Link href="/register?role=buyer&category=Semi+Trailer" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="18" width="14" height="12" rx="1" />
                  <rect x="18" y="14" width="24" height="16" rx="1" />
                  <circle cx="12" cy="34" r="3.4" />
                  <circle cx="34" cy="34" r="3.4" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">HC LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Semi & Prime Mover</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Single trailer linehaul and regional freight.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  305 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 3 */}
            <Link href="/register?role=buyer&category=Rigid+Truck" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="12" width="30" height="18" rx="2" />
                  <path d="M36 18h6l4 6v6h-10z" />
                  <circle cx="14" cy="34" r="3.6" />
                  <circle cx="38" cy="34" r="3.6" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">HR LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Rigid Truck</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Local and regional freight, tautliners & tippers.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  896 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 4 */}
            <Link href="/register?role=buyer&category=Delivery+Van" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20c0-3 2-5 5-5h18c3 0 5 2 5 5v10H4z" />
                  <path d="M32 22h8l4 4v4h-12z" />
                  <rect x="10" y="12" width="10" height="6" rx="1" />
                  <circle cx="13" cy="34" r="3.4" />
                  <circle cx="38" cy="34" r="3.4" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">LR LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Delivery Van</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Metro courier runs, parcels & retail delivery.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  571 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 5 */}
            <Link href="/register?role=buyer&category=Courier" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="32" r="8" />
                  <circle cx="36" cy="32" r="8" />
                  <path d="M12 32l8-16h8l8 16M20 16h8" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">CAR / BIKE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Courier & Last-Mile</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Food, parcels and same-day city delivery.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  248 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 6 */}
            <Link href="/register?role=buyer&category=Bus" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="14" width="38" height="16" rx="3" />
                  <path d="M11 14v16M20 14v16M29 14v16" strokeWidth="1.6" />
                  <circle cx="12" cy="34" r="3.4" />
                  <circle cx="34" cy="34" r="3.4" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">HR / BUS LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Bus & Coach</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">School runs, charter and route services.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  94 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 7 */}
            <Link href="/register?role=buyer&category=Tanker" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="16" width="16" height="14" rx="2" />
                  <ellipse cx="32" cy="23" rx="12" ry="7" />
                  <path d="M20 27h4" strokeWidth="1.6" />
                  <circle cx="12" cy="34" r="3.4" />
                  <circle cx="34" cy="34" r="3.4" />
                  <path d="M40 15l2 4h-4z" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">DG LICENCE</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Tanker / Dangerous Goods</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Fuel, chemical and bulk liquid transport.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  61 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 8 */}
            <Link href="/register?role=buyer&category=Forklift" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="24" width="12" height="10" rx="1" />
                  <path d="M18 34V16l10 8v10" />
                  <path d="M8 24V14M14 24V14" strokeWidth="1.6" />
                  <circle cx="10" cy="38" r="3" />
                  <circle cx="24" cy="38" r="3" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">FORKLIFT TICKET</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Forklift & Warehouse</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">Pick, pack and yard operations.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  183 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Category 9 */}
            <Link href="/register?role=buyer&category=Mining" className="bg-white border border-[#e3ded0] rounded-[8px] p-5.5 flex gap-4 items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#ffb81c] group cursor-pointer">
              <div className="w-[52px] h-[52px] rounded-[8px] bg-[#17191a] flex items-center justify-center shrink-0 border-2 border-[#ffb81c]">
                <svg className="w-7 h-7 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 26l6-10h20l8 10" />
                  <rect x="30" y="16" width="12" height="10" rx="1" />
                  <circle cx="12" cy="36" r="6" />
                  <circle cx="34" cy="36" r="6" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#073c25] bg-[#e7f0e9] px-1.5 py-0.5 rounded-[3px] inline-block mb-1.5">MC / HR + FIFO</span>
                <h3 className="font-bold text-base text-[#15170f] group-hover:text-[#0b5d38] transition-colors">Mining & Haul Truck</h3>
                <p className="text-xs text-[#7b8079] mt-0.5">FIFO & DIDO site haulage roles.</p>
                <div className="text-xs font-bold text-[#d99400] mt-2 flex items-center gap-1">
                  203 jobs open
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ---------- THE ROUTE / HOW IT WORKS ---------- */}
      <section id="how" className="py-20 bg-[#232624] text-[#f2efe6]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7">
          
          <div className="max-w-2xl mb-14">
            <div className="font-mono text-xs tracking-widest uppercase text-[#ffb81c] font-bold mb-2 flex items-center gap-2.5">
              <span className="w-6 h-0.5 bg-[#d99400]"></span>
              THE ROUTE
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#f2efe6] leading-none">
              Sign up to steering wheel, in three stops.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed connecting line across steps on desktop */}
            <div className="hidden md:block absolute top-[26px] left-[10%] right-[10%] h-[3px] bg-[repeating-linear-gradient(90deg,#ffb81c_0_18px,transparent_18px_30px)] pointer-events-none" />

            {/* Step 1 */}
            <div className="relative px-2">
              <div className="w-[54px] h-[54px] rounded-full bg-[#0b5d38] border-3 border-[#f2efe6] outline-3 outline-[#0b5d38] flex items-center justify-center mb-5 relative z-10">
                <svg className="w-6 h-6 stroke-[#f2efe6]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M15 15l4.1 4.1M2 12h6M16 12h6M4.9 19.1l4.2-4.2M15 9l4.1-4.1" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold uppercase text-[#f2efe6] mb-2">Set your route</h3>
              <p className="text-sm text-[#b9bcb2] leading-relaxed max-w-[280px]">
                Add your licence class, tickets and experience once — HR, HC, MC, forklift, dangerous goods, whatever you hold.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative px-2">
              <div className="w-[54px] h-[54px] rounded-full bg-[#0b5d38] border-3 border-[#f2efe6] outline-3 outline-[#0b5d38] flex items-center justify-center mb-5 relative z-10">
                <svg className="w-6 h-6 stroke-[#f2efe6]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M9 21H5a2 2 0 01-2-2v-4M15 21h4a2 2 0 002-2v-4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold uppercase text-[#f2efe6] mb-2">Get matched</h3>
              <p className="text-sm text-[#b9bcb2] leading-relaxed max-w-[280px]">
                See verified job requests that match your vehicle type, licence and location — nothing else clutters your feed.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative px-2">
              <div className="w-[54px] h-[54px] rounded-full bg-[#0b5d38] border-3 border-[#f2efe6] outline-3 outline-[#0b5d38] flex items-center justify-center mb-5 relative z-10">
                <svg className="w-6 h-6 stroke-[#f2efe6]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold uppercase text-[#f2efe6] mb-2">Start your run</h3>
              <p className="text-sm text-[#b9bcb2] leading-relaxed max-w-[280px]">
                Apply directly to the company, no middleman fees. Most drivers hear back within 48 hours.
              </p>
            </div>

          </div>
        </div>
      </section>

      <div className="lane" />

      {/* ---------- DEPARTURES BOARD / LIVE JOBS ---------- */}
      <section id="jobs" className="py-20 bg-[#f2efe6]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7">
          
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-xs tracking-widest uppercase text-[#073c25] font-bold mb-2 flex items-center gap-2.5">
              <span className="w-6 h-0.5 bg-[#d99400]"></span>
              DEPARTURES
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#15170f] leading-none mb-3">
              Jobs posted today.
            </h2>
            <p className="text-[#7b8079] text-base">
              A live board of driving roles across the country — updated as companies post them.
            </p>
          </div>

          {/* Departures Board Box */}
          <div className="bg-[#17191a] border border-[#2f322f] rounded-[10px] overflow-hidden shadow-2xl">
            
            {/* Board Header */}
            <div className="hidden lg:grid grid-cols-[90px_1.6fr_1.3fr_1fr_90px_110px_120px] px-6 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[#b9bcb2] border-b border-[#2f322f]">
              <span>Posted</span>
              <span>Role</span>
              <span>Company</span>
              <span>Location</span>
              <span>Vehicle</span>
              <span>Pay</span>
              <span>Status</span>
            </div>

            {/* Board Job Row 1 */}
            <Link href="/register?role=buyer&category=B-Double" className="grid grid-cols-1 lg:grid-cols-[90px_1.6fr_1.3fr_1fr_90px_110px_120px] items-center px-6 py-4 border-b border-[#2f322f] hover:bg-[#232624] transition-colors gap-2 lg:gap-0 cursor-pointer group">
              <div className="font-mono text-xs text-[#b9bcb2]">7 min</div>
              <div>
                <div className="font-bold text-base text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">B-Double Driver — Linehaul</div>
                <div className="text-xs text-[#b9bcb2] mt-0.5">MC licence · Night shift</div>
              </div>
              <div className="text-xs text-[#b9bcb2]">Southern Freight Co.</div>
              <div className="text-xs text-[#b9bcb2]">Melbourne → Sydney</div>
              <div>
                <svg className="w-6 h-6 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="20" width="14" height="10" rx="1" />
                  <path d="M16 20h8v10h-8z" />
                  <rect x="24" y="16" width="20" height="14" rx="1" />
                  <circle cx="9" cy="34" r="3.4" />
                  <circle cx="20" cy="34" r="3.4" />
                  <circle cx="30" cy="34" r="3.4" />
                  <circle cx="39" cy="34" r="3.4" />
                </svg>
              </div>
              <div className="font-mono text-sm font-bold text-[#ffb81c]">$42/hr</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#ffb81c] text-[#15170f] px-2.5 py-1 rounded-[3px]">Urgent</span>
              </div>
            </Link>

            {/* Board Job Row 2 */}
            <Link href="/register?role=buyer&category=Rigid+Truck" className="grid grid-cols-1 lg:grid-cols-[90px_1.6fr_1.3fr_1fr_90px_110px_120px] items-center px-6 py-4 border-b border-[#2f322f] hover:bg-[#232624] transition-colors gap-2 lg:gap-0 cursor-pointer group">
              <div className="font-mono text-xs text-[#b9bcb2]">22 min</div>
              <div>
                <div className="font-bold text-base text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">HR Delivery Driver</div>
                <div className="text-xs text-[#b9bcb2] mt-0.5">HR licence · Mon–Fri</div>
              </div>
              <div className="text-xs text-[#b9bcb2]">Metro Fresh Logistics</div>
              <div className="text-xs text-[#b9bcb2]">Parramatta, NSW</div>
              <div>
                <svg className="w-6 h-6 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="12" width="30" height="18" rx="2" />
                  <path d="M36 18h6l4 6v6h-10z" />
                  <circle cx="14" cy="34" r="3.6" />
                  <circle cx="38" cy="34" r="3.6" />
                </svg>
              </div>
              <div className="font-mono text-sm font-bold text-[#ffb81c]">$36/hr</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#0b5d38] text-[#f2efe6] px-2.5 py-1 rounded-[3px]">Immediate Start</span>
              </div>
            </Link>

            {/* Board Job Row 3 */}
            <Link href="/register?role=buyer&category=Mining" className="grid grid-cols-1 lg:grid-cols-[90px_1.6fr_1.3fr_1fr_90px_110px_120px] items-center px-6 py-4 border-b border-[#2f322f] hover:bg-[#232624] transition-colors gap-2 lg:gap-0 cursor-pointer group">
              <div className="font-mono text-xs text-[#b9bcb2]">1 hr</div>
              <div>
                <div className="font-bold text-base text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">Haul Truck Operator — FIFO</div>
                <div className="text-xs text-[#b9bcb2] mt-0.5">MC + site induction</div>
              </div>
              <div className="text-xs text-[#b9bcb2]">Pilbara Mineral Group</div>
              <div className="text-xs text-[#b9bcb2]">Perth (FIFO), WA</div>
              <div>
                <svg className="w-6 h-6 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 26l6-10h20l8 10" />
                  <rect x="30" y="16" width="12" height="10" rx="1" />
                  <circle cx="12" cy="36" r="6" />
                  <circle cx="34" cy="36" r="6" />
                </svg>
              </div>
              <div className="font-mono text-sm font-bold text-[#ffb81c]">$58/hr</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#3a3d38] text-[#f2efe6] border border-[#b9bcb2] px-2.5 py-1 rounded-[3px]">FIFO 8/6</span>
              </div>
            </Link>

            {/* Board Job Row 4 */}
            <Link href="/register?role=buyer&category=Courier" className="grid grid-cols-1 lg:grid-cols-[90px_1.6fr_1.3fr_1fr_90px_110px_120px] items-center px-6 py-4 border-b border-[#2f322f] hover:bg-[#232624] transition-colors gap-2 lg:gap-0 cursor-pointer group">
              <div className="font-mono text-xs text-[#b9bcb2]">2 hr</div>
              <div>
                <div className="font-bold text-base text-[#f2efe6] group-hover:text-[#ffb81c] transition-colors">Courier Driver — Own Vehicle</div>
                <div className="text-xs text-[#b9bcb2] mt-0.5">Car licence · Flexible hours</div>
              </div>
              <div className="text-xs text-[#b9bcb2]">CityDash Delivery</div>
              <div className="text-xs text-[#b9bcb2]">Brisbane, QLD</div>
              <div>
                <svg className="w-6 h-6 stroke-[#ffb81c]" viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="32" r="8" />
                  <circle cx="36" cy="32" r="8" />
                  <path d="M12 32l8-16h8l8 16M20 16h8" />
                </svg>
              </div>
              <div className="font-mono text-sm font-bold text-[#ffb81c]">$32/hr</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider border border-[#b9bcb2] text-[#b9bcb2] px-2.5 py-1 rounded-[3px]">Casual</span>
              </div>
            </Link>

            {/* Board Footer */}
            <div className="p-5 text-center bg-[#17191a]">
              <Link href="/register?role=buyer">
                <button className="bg-[#0b5d38] hover:bg-[#147a4a] text-[#f2efe6] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-[4px] transition-all cursor-pointer shadow-md">
                  View All 2,480 Jobs
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ---------- EMPLOYER CALLOUT BAND ---------- */}
      <section id="employers" className="bg-[#ffb81c] py-14">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#15170f] leading-tight mb-1">
              Hiring drivers? Get in front of them today.
            </h2>
            <p className="text-[#4a3a0e] text-sm sm:text-base max-w-xl font-medium">
              Post a verified job in minutes and reach licenced drivers across Australia — no recruitment agency fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/register?role=seller">
              <button className="bg-[#17191a] hover:bg-[#232624] text-[#f2efe6] font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-[4px] transition-all cursor-pointer shadow-md">
                Post a Job Free
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border-2 border-[#15170f] text-[#15170f] hover:bg-[#15170f] hover:text-[#f2efe6] font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-[4px] transition-all cursor-pointer">
                See Employer Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- TRUST STRIP ---------- */}
      <section className="py-10 bg-[#f2efe6]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex flex-wrap justify-center gap-10 sm:gap-16 text-center">
          
          <div className="flex flex-col items-center gap-2 max-w-[180px]">
            <svg className="w-7 h-7 stroke-[#073c25]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-xs font-semibold text-[#7b8079]">Licence & ticket verified</span>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-[180px]">
            <svg className="w-7 h-7 stroke-[#073c25]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a4 4 0 018 0v2" />
            </svg>
            <span className="text-xs font-semibold text-[#7b8079]">ABN-checked employers</span>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-[180px]">
            <svg className="w-7 h-7 stroke-[#073c25]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M12 20V10M18 20V4M6 20v-6" />
            </svg>
            <span className="text-xs font-semibold text-[#7b8079]">Real pay rates, no guessing</span>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-[180px]">
            <svg className="w-7 h-7 stroke-[#073c25]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span className="text-xs font-semibold text-[#7b8079]">New jobs, every hour</span>
          </div>

        </div>
      </section>

      <div className="lane dark" />
    </div>
  );
}
