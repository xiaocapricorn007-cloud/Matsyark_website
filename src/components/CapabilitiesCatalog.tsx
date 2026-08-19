import React, { useState } from "react";
import { Search, Compass, BookOpen, Layers, CheckCircle, ArrowUpRight, Sparkles } from "lucide-react";

interface CapabilitiesCatalogProps {
  categories: {
    title: string;
    items: { title: string; text: string }[];
  }[];
  onInquire: () => void;
}

export default function CapabilitiesCatalog({ categories, onInquire }: CapabilitiesCatalogProps) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtering based on search
  const filteredCategories = categories.map((cat) => {
    const matchedItems = cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items: matchedItems };
  }).filter((cat) => cat.items.length > 0);

  const activeCategory = searchQuery.trim()
    ? filteredCategories[0] || categories[0]
    : categories[selectedCategoryIndex] || categories[0];

  return (
    <section id="catalog" className="relative w-full py-16 sm:py-24 bg-[#faf9f6] border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Masthead */}
        <div className="flex flex-col gap-3 pb-8 mb-10 border-b-2 border-[#ff5000]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff5000] uppercase tracking-widest font-bold">
            <BookOpen className="w-4 h-4 text-[#ff5000]" />
            <span>TECHNICAL CAPABILITIES REGISTER</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191715]">
                Complete Architectural & Engineering Suite
              </h2>
              <p className="font-serif text-base sm:text-lg text-stone-700 max-w-2xl mt-2">
                An exhaustive register of our marine computational services, hydrostatics modeling, classification society approvals, and bespoke shipyard deliverables.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="w-4 h-4 text-[#ff5000] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search capabilities, CFD, stability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 bg-white border-2 border-stone-300 focus:border-[#ff5000] rounded-xs font-sans text-xs text-[#191715] placeholder-stone-400 outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#ff5000] px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        {!searchQuery.trim() && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat, idx) => {
              const isSelected = idx === selectedCategoryIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategoryIndex(idx)}
                  className={`px-4 py-2.5 rounded-xs font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-2 ${
                    isSelected
                      ? "bg-[#ff5000] text-white border-[#ff5000] font-bold shadow-md scale-102"
                      : "bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:text-[#ff5000]"
                  }`}
                >
                  <span className={isSelected ? "text-white mr-1.5 font-black" : "text-[#ff5000] mr-1.5 font-bold"}>
                    0{idx + 1}
                  </span>
                  {cat.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery.trim() ? filteredCategories.flatMap((c) => c.items) : activeCategory.items).map(
            (item, index) => (
              <div
                key={index}
                className="p-6 bg-white border-2 border-stone-200 hover:border-[#ff5000] rounded-xs transition-all shadow-xs hover:shadow-md group flex flex-col justify-between border-t-4 border-t-[#ff5000] hover:bg-[#fffdfb]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="w-2 h-2 rounded-full bg-[#ff5000] group-hover:scale-125 transition-transform" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff5000] font-bold bg-[#fff3eb] px-2 py-0.5 rounded-xs border border-orange-200">
                      REG // #{index + 1 < 10 ? `0${index + 1}` : index + 1}
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
                  <span className="font-mono text-[9px] uppercase text-stone-500 font-semibold tracking-wider">
                    IMO / CLASS VERIFIED
                  </span>
                  <button
                    onClick={onInquire}
                    className="font-mono text-[10px] uppercase font-bold text-[#ff5000] hover:text-[#e04400] flex items-center gap-1 cursor-pointer bg-[#fff3eb] px-2.5 py-1 rounded-xs border border-orange-200 group-hover:bg-[#ff5000] group-hover:text-white transition-colors"
                  >
                    <span>Request Spec</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom Banner with Orange Accent */}
        <div className="mt-12 p-8 bg-[#191715] text-white rounded-xs border-2 border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-[#ff5000]"></div>
          <div className="flex flex-col gap-1.5 text-center md:text-left pl-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
              BESPOKE VESSEL COMMISSION
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Require customized stability books, hydrostatics, or finite element analysis?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-stone-300 max-w-xl">
              We provide end-to-end mathematical linesplans, intact/damage stability calculations, and production drawings ready for drydock execution.
            </p>
          </div>

          <button
            onClick={onInquire}
            className="shrink-0 px-7 py-3.5 bg-[#ff5000] hover:bg-[#e04400] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xs transition-all shadow-md cursor-pointer"
          >
            Request Engineering Review
          </button>
        </div>

      </div>
    </section>
  );
}
