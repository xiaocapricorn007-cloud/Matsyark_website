import React, { useState, useEffect, useRef } from "react";
import logoSvg from "../logo.svg";
import logoPng from "../logo.png";
import { VesselSection, VESSEL_SECTIONS } from "../types";
import { 
  Compass, 
  Cpu, 
  Anchor, 
  Info, 
  Check, 
  Sparkles, 
  Sliders, 
  ShieldAlert, 
  Lock, 
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Mail,
  BookOpen,
  Briefcase,
  Layers,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { gsap } from "gsap";

interface SpecificationOverlayProps {
  currentSectionIndex: number;
  onSetSectionIndex: (index: number) => void;
  hullColor: string;
  setHullColor: (color: string) => void;
  deckColor: string;
  setDeckColor: (color: string) => void;
  glassColor: string;
  setGlassColor: (color: string) => void;
  selectedModelUrl: string | null;
  onModelSelect: (url: string | null) => void;
}

// Customizer Constants
const HULL_OPTIONS = [
  { name: "Alabaster Metallic", hex: "#f2f4f7" },
  { name: "Satin Titanium", hex: "#64748b" },
  { name: "Obsidian Onyx", hex: "#0c0a09" },
  { name: "Petrol Blue", hex: "#0a3a4c" }
];

const DECK_OPTIONS = [
  { name: "Bleached Baltic Teak", hex: "#f3ede2" },
  { name: "Sanded Slate Timber", hex: "#94a3b8" },
  { name: "Glorious Classic Honey", hex: "#b45309" }
];

const GLASS_OPTIONS = [
  { name: "Sapphire Deep Blue", hex: "#0f172a" },
  { name: "Marine Emerald Marine", hex: "#042f2e" },
  { name: "Ballistic Black Screen", hex: "#111827" }
];

// Configurator Constants
const EDITIONS = [
  { id: "amphitrite", name: "AMPHITRITE CLASS", sub: "Private Yacht Explorer", price: 98000000 },
  { id: "matsyark", name: "MATSYARK PRO DESIGN", sub: "Bespoke Charter Cruiser", price: 124000000 },
  { id: "sovereign", name: "SOVEREIGN EXTREME", sub: "Global Polar Explorer", price: 152000000 }
];

const ADDONS = [
  { id: "helipad", name: "Hydraulic Helipad Hangar", desc: "Retractable deck hangar with fuel line connections.", price: 5000000 },
  { id: "lab", name: "Marine Deep-Sea Laboratory", desc: "Wet/dry biosphere research labs for scientific cruises.", price: 12000000 },
  { id: "submarine", name: "Triton Submarine Deployment Gantry", desc: "Side-launch gantry supporting a 3-person submersible.", price: 8000000 },
  { id: "iceclass", name: "Polar Ice-Class Axe Prow", desc: "Reinforced PC6 steel frame with thermal heating arrays.", price: 6000000 }
];

const CONSULTING_ITEMS = [
  {
    title: "Thesis & Capstone Project Support",
    text: "We bridge the gap between academic theory and industry-grade engineering. Whether you are developing a conceptual linesplan for a final-year thesis or require complex CFD and FEA simulations that exceed standard university computing limits, our team acts as your dedicated technical partner to bring your most ambitious academic projects to life."
  },
  {
    title: "Custom Design & Prototyping",
    text: "Hand over your preliminary sketches or baseline calculations, and we will translate them into presentation-ready 3D CAD models and rigorous engineering analyses. We provide students with the exact same high-fidelity digital twins and photorealistic renders we deliver to commercial shipyards, ensuring your final submission stands out to professors, grading panels, and future employers."
  },
  {
    title: "Competition Vessel Engineering",
    text: "For university teams competing in solar boat challenges, autonomous marine vehicle races, or international design competitions, we offer specialized consulting and heavy-lifting design support. We help your team optimize hull resistance, validate structural integrity, and refine weight distribution, giving your vessel a critical, scientifically backed competitive edge."
  },
  {
    title: "Expert Mentorship & Feasibility Reviews",
    text: "Access the minds of elite naval architects. We offer targeted consulting sessions to review your academic designs, troubleshoot structural or stability flaws, and guide you through the real-world regulatory and fabrication constraints that textbooks often miss. Treat us as your professional sounding board."
  },
  {
    title: "Specialized Student Rates",
    text: "We believe in investing in the future of naval architecture. Reach out to our team with your valid university ID and project syllabus to unlock accessible, student-friendly pricing for our custom CAD, drafting, and simulation services. Let us handle the heavy computational rendering and drafting so you can focus on defending your engineering concepts."
  }
];

export default function SpecificationOverlay({
  currentSectionIndex,
  onSetSectionIndex,
  hullColor,
  setHullColor,
  deckColor,
  setDeckColor,
  glassColor,
  setGlassColor,
  selectedModelUrl,
  onModelSelect
}: SpecificationOverlayProps) {
  const currentSection = VESSEL_SECTIONS[currentSectionIndex];

  const consultingScrollRef = useRef<HTMLDivElement>(null);
  const scrollToConsultingSection = (idx: number) => {
    if (consultingScrollRef.current) {
      const child = consultingScrollRef.current.querySelector(`#consulting-sub-${idx}`);
      if (child) {
        child.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  // Custom translucent model selector states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Services/Partnership dropdown states
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pricing Configurator State
  const [selectedEdition, setSelectedEdition] = useState("matsyark");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Commission Submission State
  const [fullname, setFullname] = useState("");
  const [org, setOrg] = useState("");
  const [launchYear, setLaunchYear] = useState("2028");
  const [deliveryPort, setDeliveryPort] = useState("Monaco Port Hercule");
  const [customRequests, setCustomRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");

  // Dynamic Logo Fallback Swapper State
  const [logoPath, setLogoPath] = useState<string>(logoSvg);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const handleLogoError = () => {
    if (logoPath === logoSvg) {
      setLogoPath(logoPng);
    } else {
      setImgFailed(true);
    }
  };



  // Calculate live total price
  const basePrice = EDITIONS.find(e => e.id === selectedEdition)?.price || 124000000;
  const addonsPrice = selectedAddons.reduce((acc, currentId) => {
    const addonObj = ADDONS.find(a => a.id === currentId);
    return acc + (addonObj?.price || 0);
  }, 0);
  const totalPrice = basePrice + addonsPrice;

  // Format large monetary numerals elegantly
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value) + " USD";
  };

  // Subtle GSAP hover animations for SpecificationOverlay Left Panel card
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -6,
      scale: 1.015,
      borderColor: "rgba(255, 255, 255, 0.22)",
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      boxShadow: "0 35px 85px -10px rgba(0,0,0,0.85)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      boxShadow: "0 30px 70px -15px rgba(0,0,0,0.7)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  // Subtle GSAP hover animations for SpecificationOverlay Footer Tray card
  const handleTrayMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -4,
      scale: 1.02,
      borderColor: "rgba(255, 255, 255, 0.22)",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      boxShadow: "0 18px 50px rgba(0,0,0,0.65)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleTrayMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(0, 0, 0, 0.15)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleAddonToggle = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const submitCommissionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) return;

    setIsSubmitting(true);
    // Simulate secure satellite-link processing
    setTimeout(() => {
      const code = `AUR-${launchYear.substring(2)}-${Math.floor(Math.random() * 900000 + 100000)}`;
      setRefCode(code);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 p-6 md:p-10 select-none">
      {/* MATSYARK Logo Showcase at absolute bottom left of viewport */}
      <AnimatePresence>
        {currentSectionIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -45, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -45, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[16px] bottom-[16px] pointer-events-none z-20 w-[240px] h-[150px] sm:w-[350px] sm:h-[220px] md:w-[480px] md:h-[300px] flex items-end justify-start select-none"
          >
            {/* Dynamic Logo Image Load */}
            {!imgFailed ? (
              <img
                src={logoPath}
                onError={handleLogoError}
                className="w-full h-full object-contain object-left-bottom filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                alt="Matsyark Logo"
              />
            ) : (
              /* High-luxury fallback animated compass when image isn't loaded yet / fails */
              <div className="relative flex items-center justify-center w-28 h-28 ml-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                  className="absolute inset-0 w-full h-full border border-dashed border-creme/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute inset-6 border border-dotted border-stone-500/40 rounded-full"
                />
                <Compass className="w-12 h-12 text-creme animate-pulse" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-between pointer-events-none relative">
        
        {/* 1. TOP NAV BAR (Liquid Glass Capsule Style) */}
        {currentSectionIndex !== 6 && (
          <header className="w-full flex items-center justify-between pointer-events-auto bg-black/45 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-30">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => onSetSectionIndex(0)}
              id="nav-logo"
            >
              <Compass className="w-4 h-4 text-stone-200 group-hover:text-creme group-hover:rotate-45 transition-all duration-500" />
              <div className="text-xs font-bold tracking-[0.25em] text-stone-100 uppercase transition-colors group-hover:text-white">
                MATSYARK
              </div>
            </div>
            
            {/* Navigation links matching the liquid-glass design theme */}
            <div className="hidden lg:flex gap-4 text-[9px] uppercase tracking-[0.2em] font-semibold text-stone-400">
              {VESSEL_SECTIONS.map((sec, idx) => {
                const isActive = idx === currentSectionIndex;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onSetSectionIndex(idx)}
                    id={`nav-button-${sec.id}`}
                    className={`hover:text-white transition-all duration-300 cursor-pointer py-1 px-4 rounded-full ${
                      isActive 
                        ? "text-white font-bold bg-white/10 shadow-[0_2px_10px_rgba(255,255,255,0.02)] border border-white/10" 
                        : "hover:bg-white/5"
                    }`}
                  >
                    {sec.titleSecondary.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            {/* Symmetrical dropdown design selecting preset ship models */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Contact Inquiry Pointer */}
              <motion.button
                onClick={() => {
                  onSetSectionIndex(6);
                  setTimeout(() => {
                    const el = document.getElementById("inquire-partnership-flank");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 150);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[9px] font-semibold tracking-widest uppercase border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] outline-none cursor-pointer transition-all duration-300 select-none flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#ff5000]" />
                <span className="hidden sm:inline">Inquire</span>
              </motion.button>

              {/* Dropdown Pointer for Academic Services & Corporate Partnerships */}
              <div ref={servicesDropdownRef} className="relative pointer-events-auto flex items-center z-50">
                <motion.button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[9px] font-semibold tracking-widest uppercase border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] outline-none cursor-pointer transition-all duration-300 select-none flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Partnerships</span>
                  <span className="inline md:hidden">Partner</span>
                  <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-300 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute right-0 top-full mt-2 w-52 sm:w-56 bg-stone-900/90 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] p-1.5 flex flex-col gap-1 overflow-hidden"
                    >
                      {[
                        { 
                          label: "Academic Consulting", 
                          icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" />,
                          targetId: "academic-consulting-flank" 
                        },
                        { 
                          label: "Corporate Partnerships", 
                          icon: <Briefcase className="w-3.5 h-3.5 text-red-405" />,
                          targetId: "corporate-partnership-flank" 
                        },
                        { 
                          label: "Simulation & Analysis", 
                          icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
                          targetId: "analysis-we-offer-flank" 
                        }
                      ].map((opt) => (
                        <motion.button
                          key={opt.label}
                          whileHover={{ scale: 1.02, x: 2, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSetSectionIndex(6);
                            setServicesDropdownOpen(false);
                            setTimeout(() => {
                              const el = document.getElementById(opt.targetId);
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 150);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-[9px] font-semibold tracking-wider uppercase text-stone-300 hover:text-white bg-transparent border-0 outline-none transition-colors duration-200 select-none flex items-center gap-2.5 cursor-pointer"
                        >
                          {opt.icon}
                          <span>{opt.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div ref={dropdownRef} className="relative pointer-events-auto flex items-center z-50">
                {/* Trigger Button with subtle scale feedback */}
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white px-3.5 py-1.5 rounded-full text-[9px] font-semibold tracking-widest uppercase border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] outline-none cursor-pointer transition-all duration-300 select-none flex items-center gap-2"
                  id="model-selector-custom-button"
                >
                  <span>
                    {selectedModelUrl === "/assets/Containership.glb" 
                      ? "Container Ship" 
                      : (selectedModelUrl === "/assets/Warship.glb" 
                          ? "Warship" 
                          : "Luxury Yacht")}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                </motion.button>

                {/* Translucent Rounded Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-stone-900/85 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] p-1.5 flex flex-col gap-1 overflow-hidden"
                    >
                      {[
                        { value: "/assets/Luxuryyacht.glb", label: "Luxury Yacht" },
                        { value: "/assets/Containership.glb", label: "Container Ship" },
                        { value: "/assets/Warship.glb", label: "Warship" }
                      ].map((opt) => {
                        const isSelected = selectedModelUrl === opt.value || (!selectedModelUrl && opt.value === "/assets/Luxuryyacht.glb");
                        return (
                          <motion.button
                            key={opt.value}
                            whileHover={{ scale: 1.02, x: 2, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onModelSelect(opt.value);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left text-[9px] font-semibold tracking-wider uppercase transition-colors duration-200 select-none flex items-center justify-between ${
                              isSelected 
                                ? "bg-white/12 text-white border border-white/12" 
                                : "text-stone-300 hover:text-white bg-transparent"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-stone-100" />}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
        )}

        {/* 2. MIDDLE GRID: SPEC PANEL & VERTICAL LINE NAVIGATION */}
        <div className="w-full h-full flex flex-row items-center justify-between my-auto relative">
          
          {/* LEFT SPECIFICATION PANEL - Sleek Translucent Liquid Glass Card */}
          <div className="w-full max-w-[360px] md:max-w-[450px] pointer-events-auto mt-4 mb-4 z-20">
            <AnimatePresence mode="wait">
              {currentSectionIndex !== 0 && currentSection.id !== "academic_consulting" && (
                <motion.div
                  key={currentSection.id}
                  initial={{ opacity: 0, scale: 0.97, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex"
                >
                  <div
                    id={`overlay-card-${currentSection.id}`}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                    className="bg-black/25 backdrop-blur-2.5xl border border-white/12 p-5 md:p-6 rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-3.5 relative overflow-hidden text-left w-full cursor-default"
                  >
                  {/* Glossy corner ambient light effects */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-creme/5 blur-xl rounded-full" />

                  {/* Category indicator (Consistent styling) */}
                  <div className="flex items-center justify-between pb-0.5">
                    <span className="font-mono text-[7.5px] tracking-[0.2em] text-stone-400 font-bold uppercase">
                      {currentSection.number} // CAD FRAME
                    </span>
                    <span className="font-mono text-[8px] tracking-widest text-creme uppercase font-semibold">
                      {currentSection.titleSecondary}
                    </span>
                  </div>

                  {/* Title Header */}
                  <div className="flex flex-col gap-0.5">
                    <h2 className="font-serif text-lg md:text-xl text-stone-100 tracking-tight leading-tight font-semibold">
                      {currentSection.title}
                    </h2>
                  </div>

                  {/* Detailed Technical Description */}
                  <p className="font-sans text-[10.5px] text-stone-300 leading-relaxed font-normal">
                    {currentSection.description}
                  </p>

                  {/* INTERACTIVE RENDERING CHECK: SECTION 07 DESIGN STUDIO */}
                  {currentSection.id === "design-studio" ? (
                    <div className="flex flex-col gap-3.5 pt-3 border-t border-white/8">
                      {/* Option A: Hull Finish */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[7.5px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                            Hull Coating finish
                          </span>
                          <span className="font-sans text-[9px] text-creme font-medium">
                            {HULL_OPTIONS.find(h => h.hex === hullColor)?.name || "Custom"}
                          </span>
                        </div>
                        <div className="flex gap-2.5">
                          {HULL_OPTIONS.map((opt) => (
                            <button
                              key={opt.hex}
                              onClick={() => {
                                setHullColor(opt.hex);
                              }}
                              title={opt.name}
                              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-300 relative ${
                                hullColor === opt.hex 
                                  ? "border-creme scale-110 shadow-[0_0_10px_rgba(249,115,22,0.45)]" 
                                  : "border-white/10 hover:border-white/30 hover:scale-105"
                              }`}
                              style={{ backgroundColor: opt.hex }}
                            >
                              {hullColor === opt.hex && (
                                <Check className={`absolute inset-0 m-auto w-3.5 h-3.5 ${opt.hex === "#f2f4f7" ? "text-stone-900" : "text-stone-100"}`} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Option B: Teak Deck Finish */}
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[7.5px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                            Deck timber finish
                          </span>
                          <span className="font-sans text-[9px] text-creme font-medium">
                            {DECK_OPTIONS.find(d => d.hex === deckColor)?.name || "Custom"}
                          </span>
                        </div>
                        <div className="flex gap-2.5">
                          {DECK_OPTIONS.map((opt) => (
                            <button
                              key={opt.hex}
                              onClick={() => {
                                setDeckColor(opt.hex);
                              }}
                              title={opt.name}
                              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-300 relative ${
                                deckColor === opt.hex 
                                  ? "border-creme scale-110 shadow-[0_0_10px_rgba(249,115,22,0.45)]" 
                                  : "border-white/10 hover:border-white/30 hover:scale-105"
                              }`}
                              style={{ backgroundColor: opt.hex }}
                            >
                              {deckColor === opt.hex && (
                                <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-stone-900" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Option C: Window Tint Finish */}
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[7.5px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                            Double Glazed Glass Tint
                          </span>
                          <span className="font-sans text-[9px] text-creme font-medium">
                            {GLASS_OPTIONS.find(g => g.hex === glassColor)?.name || "Custom"}
                          </span>
                        </div>
                        <div className="flex gap-2.5">
                          {GLASS_OPTIONS.map((opt) => (
                            <button
                              key={opt.hex}
                              onClick={() => {
                                setGlassColor(opt.hex);
                              }}
                              title={opt.name}
                              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-300 relative ${
                                glassColor === opt.hex 
                                  ? "border-creme scale-110 shadow-[0_0_10px_rgba(249,115,22,0.45)]" 
                                  : "border-white/10 hover:border-white/30 hover:scale-105"
                              }`}
                              style={{ backgroundColor: opt.hex }}
                            >
                              {glassColor === opt.hex && (
                                <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-stone-100" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : currentSection.id === "pricing" ? (
                    /* INTERACTIVE RENDERING CHECK: SECTION 08 YACHT CONFIGURATOR */
                    <div className="flex flex-col gap-3.5 pt-3 border-t border-white/8">
                      {/* Edition Selection */}
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[7.5px] tracking-[0.16em] text-stone-400 uppercase font-bold mb-1">
                          Select Base Platform Vessel
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {EDITIONS.map((ed) => (
                            <button
                              key={ed.id}
                              onClick={() => setSelectedEdition(ed.id)}
                              className={`w-full py-2 px-3 text-left rounded-lg border text-stone-100 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                                selectedEdition === ed.id
                                  ? "bg-white/10 border-creme shadow-[rgba(249,115,22,0.2)_0_4px_16px]"
                                  : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-mono text-[8px] font-bold tracking-wider uppercase text-stone-100">
                                  {ed.name}
                                </span>
                                <span className="text-[10px] text-stone-400 font-light mt-0.5">
                                  {ed.sub}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] text-creme font-semibold pl-2">
                                {formatPrice(ed.price).split(".00")[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Addon Hardware */}
                      <div className="flex flex-col gap-1 pt-1">
                        <span className="font-mono text-[7.5px] tracking-[0.16em] text-stone-400 uppercase font-bold mb-1">
                          Luxury Auxiliary Systems
                        </span>
                        <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
                          {ADDONS.map((addon) => {
                            const isAdded = selectedAddons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                onClick={() => handleAddonToggle(addon.id)}
                                className={`p-2.5 text-left rounded-lg border cursor-pointer transition-all duration-300 flex items-start gap-2.5 ${
                                  isAdded
                                    ? "bg-white/8 border-creme"
                                    : "bg-white/5 border-white/5 hover:border-white/12"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                                  isAdded ? "bg-creme border-creme" : "border-white/20 bg-black/20"
                                }`}>
                                  {isAdded && <Check className="w-3 h-3 text-stone-950" />}
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-bold text-stone-100 leading-tight">
                                      {addon.name}
                                    </span>
                                  </div>
                                  <span className="text-[8.5px] text-stone-400 font-light leading-tight mt-0.5">
                                    {addon.desc}
                                  </span>
                                  <span className="font-mono text-[8.5px] text-creme font-bold mt-1">
                                    +{formatPrice(addon.price).split(".00")[0]}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Total Pricing Display */}
                      <div className="pt-3 border-t border-white/8 flex flex-col gap-1.5 bg-creme/5 p-3 rounded-lg border border-creme/15">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[7.5px] tracking-[0.2em] text-stone-400 uppercase font-bold">
                            Estimated Total Build
                          </span>
                          <span className="font-mono text-[11px] text-creme font-extrabold tracking-wide">
                            {formatPrice(totalPrice).split(".00")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : currentSection.id === "commission" ? (
                    /* INTERACTIVE RENDERING CHECK: SECTION 09 BESPOKE COMMISSION FORM */
                    <div className="flex flex-col gap-3.5 pt-3 border-t border-white/8">
                      {!submitted ? (
                        <form onSubmit={submitCommissionForm} className="flex flex-col gap-2.5">
                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[7px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                              Full Commissioning Principal *
                            </label>
                            <input
                              type="text"
                              required
                              value={fullname}
                              onChange={(e) => setFullname(e.target.value)}
                              placeholder="e.g. Captain Alexander Vance"
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10.5px] font-sans text-stone-100 focus:outline-none focus:border-creme focus:bg-white/10 transition-all font-light"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[7px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                              Registry / Yacht Corporation
                            </label>
                            <input
                              type="text"
                              value={org}
                              onChange={(e) => setOrg(e.target.value)}
                              placeholder="e.g. Blue Horizon Ventures Ltd"
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10.5px] font-sans text-stone-100 focus:outline-none focus:border-creme focus:bg-white/10 transition-all font-light"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-mono text-[7px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                                Launch Year
                              </label>
                              <select
                                value={launchYear}
                                onChange={(e) => setLaunchYear(e.target.value)}
                                className="w-full bg-stone-900 border border-white/10 px-2 py-1.5 rounded-lg text-[10.5px] font-sans text-stone-200 focus:outline-none focus:border-creme transition-all font-light select-none"
                              >
                                <option value="2027">2027 Slot</option>
                                <option value="2028">2028 Slot</option>
                                <option value="2029">2029 Slot</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-mono text-[7px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                                Handoff Port
                              </label>
                              <select
                                value={deliveryPort}
                                onChange={(e) => setDeliveryPort(e.target.value)}
                                className="w-full bg-stone-900 border border-white/10 px-2 py-1.5 rounded-lg text-[10.5px] font-sans text-stone-200 focus:outline-none focus:border-creme transition-all font-light select-none"
                              >
                                <option value="Monaco">Port Hercule</option>
                                <option value="Miami">Miami Marine</option>
                                <option value="Singapore">Singapore Keppel</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[7px] tracking-[0.16em] text-stone-400 uppercase font-bold">
                              Custom Architectural Demands
                            </label>
                            <textarea
                              rows={2}
                              value={customRequests}
                              onChange={(e) => setCustomRequests(e.target.value)}
                              placeholder="Bespoke layout or custom storage demands..."
                              className="w-full bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10.5px] font-sans text-stone-100 focus:outline-none focus:border-creme focus:bg-white/10 transition-all resize-none font-light"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-1 px-4 py-2 bg-stone-100 hover:bg-creme hover:text-stone-950 text-stone-950 font-sans text-[9px] uppercase tracking-widest font-extrabold rounded-lg shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="w-3 h-3 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                                SECURE LINK ENGAGING...
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                CONCLUDE COMMISSION BID
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center text-center py-4 gap-3"
                        >
                          <CheckCircle className="w-12 h-12 text-creme" />
                          <div className="flex flex-col">
                            <h3 className="font-serif text-base text-stone-100 font-semibold">
                              Commission Active
                            </h3>
                            <p className="font-sans text-[10px] text-stone-300 mt-1 leading-normal max-w-[240px]">
                              Secure orbital packet received. Lead Yacht Architect will initiate preliminary tank study files.
                            </p>
                          </div>
                          
                          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg w-full flex flex-col gap-1">
                            <span className="font-mono text-[7px] tracking-widest text-[#a8a29e] uppercase font-bold">
                              SECURE CODE CERTIFICATE
                            </span>
                            <span className="font-mono text-[11px] text-creme font-bold select-text">
                              {refCode}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSubmitted(false);
                              setFullname("");
                              setOrg("");
                              setCustomRequests("");
                            }}
                            className="text-[9px] font-mono tracking-widest text-stone-400 hover:text-stone-150 underline cursor-pointer mt-1"
                          >
                            RE-COMMISSION ANOTHER SLOT
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* STANDARD RENDERING: BULLETED LIST (SECTIONS 1 TO 6) */
                    <div className="flex flex-col gap-3 pt-3 border-t border-white/5 font-sans">
                      {currentSection.specs.map((spec, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-[10px] sm:text-[10.5px] leading-relaxed">
                          {/* Rich, glowing orange bullet point */}
                          <span className="text-[#ff5000] text-sm leading-none mt-0.5 shrink-0 select-none">•</span>
                          <div className="text-stone-200">
                            {/* Header in solid premium orange */}
                            <strong className="text-[#ff5000] font-bold">
                              {spec.label}
                            </strong>
                            {spec.value ? `: ${spec.value}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACADEMIC CONSULTING OVERLAY REMOVED TO RENDER NATIVELY IN MAIN PAGE FLOW */}

          {/* RIGHT SIDE VERTICAL RAIL INDICATORS (Liquid Glass Track style) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 z-10">
            <nav className="flex flex-col items-center gap-3.5 pointer-events-auto bg-black/45 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-lg">
              {VESSEL_SECTIONS.map((sec, idx) => {
                const isActive = idx === currentSectionIndex;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onSetSectionIndex(idx)}
                    className="relative flex items-center justify-center w-7 h-7 group cursor-pointer"
                    title={sec.title}
                  >
                    {/* Clean geometric glass puck dot */}
                    <div
                      className={`rounded-full transition-all duration-500 ${
                        isActive 
                           ? "w-2.5 h-2.5 bg-creme shadow-[0_0_10px_rgba(249,115,22,0.6)]" 
                          : "w-1.5 h-1.5 bg-stone-600 group-hover:w-2 group-hover:h-2 group-hover:bg-stone-300"
                      }`}
                    />
                    
                    {/* Caption expanding to left on hover (Aligned styles) */}
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-stone-900 border border-white/10 text-stone-100 text-[8px] tracking-[0.2em] uppercase py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none font-bold whitespace-nowrap shadow-md">
                      {sec.titleSecondary}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3. FOOTER SPECTACULAR DETAILS ROW (Liquid Glass Docks Style) */}
        {currentSectionIndex !== 6 && (
          <footer className="w-full flex justify-between items-center pt-6 pointer-events-auto z-25">
            
            {/* Dynamic specification tray on Left - floating glass capsule */}
            <AnimatePresence>
              {currentSectionIndex !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  <div
                    onMouseEnter={handleTrayMouseEnter}
                    onMouseLeave={handleTrayMouseLeave}
                    className="flex gap-6 md:gap-8 bg-black/15 backdrop-blur-xl border border-white/10 p-3 px-6 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all text-left"
                  >
                  {/* Active model label */}
                  <div className="flex items-center gap-2 pr-4 border-r border-[#ffffff]/8 shrink-0">
                    <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-stone-350 font-extrabold">
                      ACTIVE: {selectedModelUrl === "/assets/Luxuryyacht.glb" ? "YACHT" : selectedModelUrl === "/assets/Containership.glb" ? "CONTAINER" : "WARSHIP"}
                    </span>
                  </div>

                  {(currentSection.footerSpecs || currentSection.specs).slice(0, 3).map((spec, index) => (
                    <div key={index} className="hidden sm:flex flex-col border-r border-white/5 last:border-0 pr-6 md:pr-8 last:pr-0">
                      <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-0.5 font-bold">
                        {spec.label}
                      </span>
                      <span className="text-xs font-semibold text-stone-100 tracking-tight">
                        {spec.value.split(" (")[0]}
                      </span>
                    </div>
                  ))}
                  
                  {/* Fallback for ultra-mobile views */}
                  {(() => {
                    const displaySpecs = currentSection.footerSpecs || currentSection.specs;
                    const fallbackSpec = displaySpecs[0];
                    if (!fallbackSpec) return null;
                    return (
                      <div className="flex sm:hidden flex-col">
                        <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-stone-400 font-bold mb-0.5">
                          {fallbackSpec.label}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-100">
                          {fallbackSpec.value.split(" (")[0]}
                        </span>
                      </div>
                    );
                  })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Symmetrical placeholder balancing layout after footer indicators */}
            <div />
          </footer>
        )}
      </div>
    </div>
  );
}
