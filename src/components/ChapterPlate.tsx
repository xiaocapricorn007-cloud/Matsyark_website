import React from "react";
import { VesselSection } from "../types";
import TechnicalSchematics from "./TechnicalSchematics";
import { ArrowUpRight, CheckCircle2, Sliders, Shield, Zap } from "lucide-react";

interface ChapterPlateProps {
  key?: React.Key;
  section: VesselSection;
  index: number;
  onInquire: () => void;
}

export default function ChapterPlate({ section, index, onInquire }: ChapterPlateProps) {
  const isEven = index % 2 === 0;

  return (
    <article
      id={`section-${section.id}`}
      className="relative w-full py-16 sm:py-24 border-b-2 border-stone-200 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Plate Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b-2 border-stone-900">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-white bg-[#ff5000] px-3 py-1 tracking-widest uppercase rounded-xs shadow-xs">
              PLATE {section.number}
            </span>
            <span className="font-mono text-stone-400 text-xs">/ 07</span>
            <span className="hidden sm:inline font-mono text-xs text-[#191715] font-semibold uppercase tracking-wider">
              — {section.titleSecondary}
            </span>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[10.5px]">
            <span className="text-stone-500 uppercase font-semibold">DISCIPLINE CLASSIFICATION:</span>
            <span className="font-bold text-white bg-[#ff5000] px-3 py-0.5 rounded-xs shadow-2xs">
              APPROVED STANDARD
            </span>
          </div>
        </div>

        {/* Plate Content Layout (2-Column Editorial Spread) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Column 1: Title, Narrative & Specifications (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 border-l-4 border-[#ff5000] pl-6">
            
            {/* Title Block */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-[#ff5000]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
                  MATSYARK CORE PRACTICE
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191715] leading-tight">
                {section.title}
              </h2>
              <p className="font-mono text-xs text-[#ff5000] font-semibold uppercase tracking-widest mt-1">
                {section.titleSecondary}
              </p>
            </div>

            {/* Narrative text */}
            <p className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed">
              {section.description}
            </p>

            {/* Structured Specifications Grid */}
            <div className="flex flex-col gap-3 pt-4 border-t-2 border-orange-100">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-[#ff5000] font-bold mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>KEY TECHNICAL DELIVERABLES & METHODOLOGY:</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {section.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xs bg-[#fff8f3] border border-orange-200/80 hover:border-[#ff5000] transition-colors flex flex-col gap-1.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff5000] shrink-0" />
                      <span className="font-serif text-base font-bold text-[#191715]">
                        {spec.label}
                      </span>
                    </div>
                    {spec.value && (
                      <p className="font-sans text-xs sm:text-sm text-stone-700 pl-4 leading-relaxed font-normal">
                        {spec.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Architectural Vector Blueprint & Technical Badges (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            
            {/* Architectural Vector Schematic */}
            <TechnicalSchematics type={section.id} />

            {/* Technical Metadata Badge Capsule */}
            {section.footerSpecs && section.footerSpecs.length > 0 && (
              <div className="bg-[#191715] text-[#faf9f6] rounded-xs border-2 border-stone-800 shadow-md flex flex-col overflow-hidden">
                <div className="bg-[#ff5000] text-white px-5 py-2.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                    SPECIFICATION REGISTER
                  </span>
                  <span className="font-mono text-[9px] bg-black/20 px-2 py-0.5 rounded-xs font-bold">
                    CLASS REF 2026
                  </span>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {section.footerSpecs.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-orange-200">
                        {item.label}
                      </span>
                      <span className="font-serif text-sm font-bold text-white mt-0.5">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry Callout Card */}
            <div className="p-5 bg-[#fff3eb] border-2 border-[#ff5000]/60 rounded-xs flex items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-[#191715]">
                  Require this naval discipline?
                </span>
                <span className="font-mono text-[10px] text-stone-600">
                  Schedule direct feasibility review with our lead architects.
                </span>
              </div>
              <button
                onClick={onInquire}
                className="shrink-0 px-4 py-2.5 bg-[#ff5000] hover:bg-[#e04400] text-white font-mono text-[10.5px] uppercase tracking-wider font-bold rounded-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Engage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
}
