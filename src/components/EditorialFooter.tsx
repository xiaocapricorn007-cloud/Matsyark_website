import React from "react";
import { ArrowUp, Compass, Anchor, ShieldCheck } from "lucide-react";
import { VESSEL_SECTIONS } from "../types";
import logoPng from "../logo.png";

interface EditorialFooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function EditorialFooter({ onNavigate }: EditorialFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#191715] text-[#faf9f6] border-t-4 border-[#ff5000] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-stone-800">
          
          {/* Brand Colophon (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xs bg-black border border-black p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img 
                  src={logoPng} 
                  alt="Matsyark Logo" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  MATSYARK
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ff5000] font-bold">
                  Naval Architecture & Marine CFD Studio
                </span>
              </div>
            </div>

            <p className="font-serif text-sm text-stone-300 leading-relaxed max-w-md">
              Matsyark is an elite naval architecture and marine design house, specializing in high-fidelity 3D design, CAD development, structural linesplans, and aerodynamic flow simulations.
            </p>

            <div className="flex items-center gap-3 text-stone-300 font-mono text-[10.5px]">
              <ShieldCheck className="w-4 h-4 text-[#ff5000]" />
              <span className="text-[#ff5000] font-semibold">IMO SOLAS • LLOYD'S • ABS • DNV GL COMPLIANT</span>
            </div>
          </div>

          {/* Chapters Navigation & Big Logo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold block mb-3">
                MONOGRAPH CHAPTERS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VESSEL_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => onNavigate(sec.id)}
                    className="font-mono text-xs text-stone-400 hover:text-[#ff5000] transition-colors text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[#ff5000] text-[10px] font-bold">{sec.number}</span>
                    <span className="truncate">{sec.title.split("&")[0]}</span>
                  </button>
                ))}
                <button
                  onClick={() => onNavigate("catalog")}
                  className="font-mono text-xs text-stone-400 hover:text-[#ff5000] transition-colors text-left cursor-pointer"
                >
                  Capabilities Catalog
                </button>
                <button
                  onClick={() => onNavigate("partnerships")}
                  className="font-mono text-xs text-stone-400 hover:text-[#ff5000] transition-colors text-left cursor-pointer"
                >
                  Consulting Services
                </button>
              </div>
            </div>

            {/* Bigger Logo Display below Monograph Chapters, beside the Studio Location */}
            <div className="mt-2 p-4 bg-black border border-black rounded-xs flex items-center gap-4.5 shadow-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black p-1 rounded-xs flex items-center justify-center shrink-0 border border-black">
                <img 
                  src={logoPng} 
                  alt="Matsyark Official Logo" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff5000] font-bold">
                  STUDIO INSIGNIA
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                  MATSYARK
                </span>
                <span className="font-mono text-[10px] text-stone-400 leading-snug">
                  High-Fidelity Marine CAD & CFD Simulation House
                </span>
              </div>
            </div>
          </div>

          {/* Studio Operations (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
              STUDIO LOCATION
            </span>
            <div className="font-mono text-xs text-stone-300 flex flex-col gap-3">
              <div>
                <strong className="text-white block flex items-center gap-1.5 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#ff5000]"></span>
                  CHENNAI, INDIA
                </strong>
                <span className="text-stone-300 text-xs pl-3.5 block mt-1">
                  Chennai, Tamil Nadu
                </span>
                <span className="text-stone-400 text-[11px] pl-3.5 block">
                  India
                </span>
              </div>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 pl-3.5">
                <span>Direct Inquiries: </span>
                <a 
                  href="mailto:matsyarkdesign@gmail.com" 
                  className="text-[#ff5000] font-bold hover:underline transition-all block mt-0.5"
                >
                  matsyarkdesign@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-bold">MATSYARK NAVAL DESIGN HOUSE</span>. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-stone-300 hover:text-[#ff5000] transition-colors cursor-pointer group"
          >
            <span className="font-bold">BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-[#ff5000]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
