import React, { useState } from "react";
import { Briefcase, GraduationCap, ArrowUpRight, ShieldCheck, Cpu, Award } from "lucide-react";

interface PartnershipSpreadsProps {
  corporateItems: { title: string; text: string }[];
  consultingItems: { title: string; text: string }[];
  onInquire: () => void;
}

export default function PartnershipSpreads({
  corporateItems,
  consultingItems,
  onInquire,
}: PartnershipSpreadsProps) {
  const [activeTab, setActiveTab] = useState<"corporate" | "academic">("corporate");

  return (
    <section id="partnerships" className="relative w-full py-16 sm:py-24 bg-white border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 pb-8 mb-10 border-b-2 border-[#ff5000]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff5000] uppercase tracking-widest font-bold">
            <Briefcase className="w-4 h-4 text-[#ff5000]" />
            <span>SPECIALIZED COLLABORATION FRAMEWORKS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191715]">
                Corporate Engineering & Academic Incubator
              </h2>
              <p className="font-serif text-base sm:text-lg text-stone-700 max-w-2xl mt-2">
                Whether supporting major shipbuilders with on-demand drafting overflow or empowering student competition teams with competition-grade CFD, Matsyark delivers rigorous engineering rigor.
              </p>
            </div>

            {/* Toggle Tabs with Orange Focus */}
            <div className="flex items-center p-1 bg-[#fff3eb] border-2 border-orange-200 rounded-xs shrink-0">
              <button
                onClick={() => setActiveTab("corporate")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xs font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeTab === "corporate"
                    ? "bg-[#ff5000] text-white shadow-sm"
                    : "text-stone-700 hover:text-[#ff5000]"
                }`}
              >
                <Briefcase className={`w-3.5 h-3.5 ${activeTab === "corporate" ? "text-white" : "text-[#ff5000]"}`} />
                <span>Shipyard & B2B</span>
              </button>

              <button
                onClick={() => setActiveTab("academic")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xs font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeTab === "academic"
                    ? "bg-[#ff5000] text-white shadow-sm"
                    : "text-stone-700 hover:text-[#ff5000]"
                }`}
              >
                <GraduationCap className={`w-3.5 h-3.5 ${activeTab === "academic" ? "text-white" : "text-[#ff5000]"}`} />
                <span>Academic & Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Corporate & Shipyard Overflow */}
        {activeTab === "corporate" && (
          <div className="flex flex-col gap-8">
            <div className="p-6 bg-[#fff3eb] border-2 border-[#ff5000]/60 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
                  B2B COMMERCIAL CONTRACTS
                </span>
                <p className="font-serif text-base text-[#191715] font-bold">
                  White-labeled naval architecture, shipyard drafting overflow, and advanced CFD/FEA outsourced simulations.
                </p>
              </div>
              <div className="font-mono text-xs text-[#ff5000] bg-white px-3 py-1.5 border border-orange-300 rounded-xs font-bold shrink-0">
                NDA GUARANTEED // LLOYD'S / DNV / ABS READY
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {corporateItems.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white border-2 border-stone-200 hover:border-[#ff5000] rounded-xs transition-all flex flex-col justify-between group shadow-xs hover:shadow-md border-t-4 border-t-[#ff5000]"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white bg-[#ff5000] px-2 py-0.5 rounded-xs">
                        0{index + 1}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] bg-[#fff3eb] px-2 py-0.5 rounded-xs font-bold">
                        B2B ENTERPRISE
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#191715] group-hover:text-[#ff5000] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-stone-500 font-semibold">CLASS-APPROVED</span>
                    <button
                      onClick={onInquire}
                      className="font-mono text-[10px] uppercase font-bold text-[#ff5000] hover:text-[#e04400] flex items-center gap-1 cursor-pointer bg-[#fff3eb] px-2.5 py-1 rounded-xs border border-orange-200 group-hover:bg-[#ff5000] group-hover:text-white transition-colors"
                    >
                      <span>Inquire Scope</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Academic & Student Consulting */}
        {activeTab === "academic" && (
          <div className="flex flex-col gap-8">
            <div className="p-6 bg-[#fff3eb] border-2 border-[#ff5000]/60 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
                  STUDENT & RESEARCH ENGAGEMENTS
                </span>
                <p className="font-serif text-base text-[#191715] font-bold">
                  Bridging the gap between academic theory and industry-grade engineering with student rates and competition vessel support.
                </p>
              </div>
              <div className="font-mono text-xs text-[#ff5000] bg-white px-3 py-1.5 border border-orange-300 rounded-xs font-bold shrink-0">
                VALID UNIVERSITY ID REQUIRED FOR SUBSIDIES
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultingItems.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white border-2 border-stone-200 hover:border-[#ff5000] rounded-xs transition-all flex flex-col justify-between group shadow-xs hover:shadow-md border-t-4 border-t-[#ff5000]"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white bg-[#ff5000] px-2 py-0.5 rounded-xs">
                        ACAD // 0{index + 1}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5000] bg-[#fff3eb] px-2 py-0.5 rounded-xs font-bold">
                        STUDENT GRANTED
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#191715] group-hover:text-[#ff5000] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-stone-500 font-semibold">STUDENT PRICING</span>
                    <button
                      onClick={onInquire}
                      className="font-mono text-[10px] uppercase font-bold text-[#ff5000] hover:text-[#e04400] flex items-center gap-1 cursor-pointer bg-[#fff3eb] px-2.5 py-1 rounded-xs border border-orange-200 group-hover:bg-[#ff5000] group-hover:text-white transition-colors"
                    >
                      <span>Apply Rates</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
