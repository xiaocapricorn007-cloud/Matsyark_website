import React, { useState, useEffect } from "react";
import { Compass, Menu, X, ArrowUpRight, BookOpen, Layers, Send, ChevronDown } from "lucide-react";
import { VESSEL_SECTIONS } from "../types";
import logoPng from "../logo.png";

interface EditorialHeaderProps {
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
}

export default function EditorialHeader({ activeSectionId, onNavigate }: EditorialHeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Editorial Masthead Bar */}
      <div className={`w-full bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-300 ${isScrolled ? "py-3 shadow-xs" : "py-4.5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          
          {/* Brand & Masthead */}
          <div 
            onClick={() => handleLinkClick("overview")} 
            className="cursor-pointer group flex items-center gap-3 select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xs bg-black flex items-center justify-center border border-black p-1 group-hover:border-[#ff5000] transition-all shadow-xs overflow-hidden">
              <img 
                src={logoPng} 
                alt="Matsyark Logo" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#191715] group-hover:text-[#ff5000] transition-colors leading-none">
                MATSYARK
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-stone-500 mt-0.5">
                Naval Design Studio
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {VESSEL_SECTIONS.map((sec) => {
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleLinkClick(sec.id)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#ff5000] text-white font-bold shadow-xs"
                      : "text-stone-600 hover:text-[#ff5000] hover:bg-stone-100"
                  }`}
                >
                  <span className="opacity-60 text-[9px] mr-1">{sec.number}</span>
                  {sec.title.split("&")[0].trim()}
                </button>
              );
            })}
            
            <button
              onClick={() => handleLinkClick("catalog")}
              className="px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider text-stone-600 hover:text-[#ff5000] hover:bg-stone-100 transition-all"
            >
              Capabilities
            </button>
            <button
              onClick={() => handleLinkClick("partnerships")}
              className="px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider text-stone-600 hover:text-[#ff5000] hover:bg-stone-100 transition-all"
            >
              Consulting
            </button>
          </nav>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick("inquire")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#ff5000] hover:bg-[#e04400] text-white rounded-sm font-mono text-[10.5px] uppercase tracking-widest font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <span>Commission Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 hover:text-[#ff5000] transition-colors border border-stone-300 rounded-sm"
              aria-label="Toggle Navigation Index"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Reading Progress Indicator Bar */}
      <div className="w-full h-[2.5px] bg-stone-200">
        <div
          className="h-full bg-[#ff5000] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-b border-stone-300 shadow-xl py-6 px-6 max-h-[85vh] overflow-y-auto">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#ff5000] font-bold mb-3">
            TABLE OF CONTENTS // MONOGRAPH PLATES
          </div>
          <div className="flex flex-col gap-2">
            {VESSEL_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleLinkClick(sec.id)}
                className={`flex items-center justify-between p-3 rounded-sm text-left border ${
                  activeSectionId === sec.id
                    ? "border-[#ff5000] bg-[#fff3eb] text-[#ff5000] font-bold"
                    : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#ff5000]">{sec.number}</span>
                  <span className="font-serif text-sm font-semibold">{sec.title}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </button>
            ))}

            <div className="h-px bg-stone-200 my-2" />

            <button
              onClick={() => handleLinkClick("catalog")}
              className="flex items-center justify-between p-3 rounded-sm text-left border border-stone-200 bg-white text-stone-800"
            >
              <span className="font-serif text-sm font-semibold">Technical Capabilities Catalog</span>
              <BookOpen className="w-4 h-4 text-[#ff5000]" />
            </button>
            <button
              onClick={() => handleLinkClick("partnerships")}
              className="flex items-center justify-between p-3 rounded-sm text-left border border-stone-200 bg-white text-stone-800"
            >
              <span className="font-serif text-sm font-semibold">Corporate & Academic Consulting</span>
              <Layers className="w-4 h-4 text-[#ff5000]" />
            </button>
            <button
              onClick={() => handleLinkClick("inquire")}
              className="mt-2 flex items-center justify-center gap-2 p-3.5 rounded-sm bg-[#ff5000] text-white font-mono text-xs uppercase tracking-widest font-bold"
            >
              <span>Transmit Project Inquiry</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
