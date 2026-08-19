import React from "react";
import { ArrowDown, Compass, Award, ShieldCheck, Cpu, ArrowUpRight, Anchor } from "lucide-react";
import { VESSEL_SECTIONS } from "../types";

interface EditorialHeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function EditorialHero({ onNavigate }: EditorialHeroProps) {
  return (
    <section id="overview" className="relative w-full bg-[#faf9f6] border-b border-stone-300 pt-8 sm:pt-14 pb-14 sm:pb-20 editorial-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Monograph Top Meta Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-[#ff5000]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#ff5000] text-white font-mono text-[10.5px] font-bold tracking-widest uppercase rounded-xs shadow-xs">
              MONOGRAPH № 01
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#191715] font-semibold">
              NAVAL ARCHITECTURE // HIGH-FIDELITY MARINE CFD
            </span>
          </div>
          <div className="font-mono text-xs text-stone-600 flex items-center gap-2">
            <span className="text-[#ff5000] font-bold">CLASS VALIDATION:</span>
            <span className="font-bold text-[#191715] bg-[#fff3eb] px-2 py-0.5 border border-orange-200 rounded-xs">
              LLOYD'S • ABS • DNV GL
            </span>
          </div>
        </div>

        {/* Hero Editorial Spread Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Title & Editorial Statement (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff5000] rounded-xs"></span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#ff5000] font-bold">
                  MATSYARK DESIGN HOUSE — OFFICIAL MONOGRAPH
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#191715] leading-[1.05]">
                The Architecture of <span className="italic font-normal text-[#ff5000] underline decoration-[#ff5000]/30 underline-offset-8">Hydrodynamics</span> & Marine Form.
              </h1>
            </div>

            <p className="editorial-dropcap font-serif text-lg sm:text-xl text-stone-800 leading-relaxed max-w-3xl pt-2">
              Matsyark is an elite naval architecture and marine design house, specializing in high-fidelity 3D design, CAD development, structural linesplans, and aerodynamic flow simulations. From custom megayacht hull fairing to class-approved commercial shipbuilding, we bridge the gap between pure artistic elegance and uncompromising maritime physics.
            </p>

            {/* Editorial Quick Specs Bar with Rich Orange Accents */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#fff3eb] border border-orange-200 rounded-xs mt-2">
              <div className="flex flex-col border-l-2 border-[#ff5000] pl-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] font-bold">Core Practice</span>
                <span className="font-serif text-base font-bold text-[#191715]">Naval Architecture</span>
              </div>
              <div className="flex flex-col border-l-2 border-[#ff5000] pl-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] font-bold">Class Standards</span>
                <span className="font-serif text-base font-bold text-[#191715]">Lloyd's, ABS, DNV</span>
              </div>
              <div className="flex flex-col border-l-2 border-[#ff5000] pl-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] font-bold">CFD Engine</span>
                <span className="font-serif text-base font-bold text-[#191715]">Navier-Stokes</span>
              </div>
              <div className="flex flex-col border-l-2 border-[#ff5000] pl-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] font-bold">Studio Location</span>
                <span className="font-serif text-base font-bold text-[#191715]">India, Chennai</span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate("linesplan_hull")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#ff5000] hover:bg-[#e04400] text-white font-mono text-xs uppercase tracking-widest font-bold transition-all rounded-xs shadow-md active:scale-98 cursor-pointer group"
              >
                <span>Explore Disciplines</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate("inquire")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-[#fff3eb] text-[#191715] border-2 border-[#ff5000] font-mono text-xs uppercase tracking-widest font-bold transition-all rounded-xs shadow-xs cursor-pointer"
              >
                <span>Commission Studio</span>
                <ArrowUpRight className="w-4 h-4 text-[#ff5000]" />
              </button>
            </div>
          </div>

          {/* Right Monograph Index & Plate Directory (4 cols) with Orange Header */}
          <div className="lg:col-span-4 bg-white border-2 border-stone-800 rounded-sm shadow-md flex flex-col overflow-hidden">
            <div className="bg-[#ff5000] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-white" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  CATALOGUE OF PLATES
                </span>
              </div>
              <span className="font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded-xs font-bold">
                01 — 07
              </span>
            </div>

            <div className="p-4 flex flex-col gap-1.5 bg-white">
              {VESSEL_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className="group flex items-start justify-between p-2.5 rounded-xs hover:bg-[#fff3eb] border border-transparent hover:border-orange-200 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white bg-[#ff5000] px-1.5 py-0.5 rounded-xs">
                      {section.number}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-bold text-[#191715] group-hover:text-[#ff5000] transition-colors leading-tight">
                        {section.title}
                      </span>
                      <span className="font-mono text-[9px] text-stone-500">
                        {section.titleSecondary}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#ff5000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" />
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#faf9f6] border-t border-stone-200 flex items-center justify-between font-mono text-[10px] text-stone-600">
              <span className="font-bold text-[#ff5000]">EDITION: 2026 // MONOGRAPH</span>
              <span className="text-[#ff5000] font-bold">ALL SPECS FARED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
