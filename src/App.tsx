import React, { useEffect, useState, useRef } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import SpecificationOverlay from "./components/SpecificationOverlay";
import { VESSEL_SECTIONS } from "./types";
import { Compass, ArrowUpRight, ChevronDown, BookOpen, Briefcase, Layers, Activity, Mail, Send, CheckCircle, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { gsap } from "gsap";

export default function App() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  // Predefined selected model URL (defaulting to the exquisite Luxury Yacht .glb)
  const [selectedModelUrl, setSelectedModelUrl] = useState<string | null>("/assets/Luxuryyacht.glb");

  // Customization States
  const [hullColor, setHullColor] = useState<string>("#f2f4f7");
  const [deckColor, setDeckColor] = useState<string>("#f3ede2");
  const [glassColor, setGlassColor] = useState<string>("#0f172a");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);

  // High-performance direct cursor projection listener for ambient light backplates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Back to Top button states & refs for the Section 6 scrollable page
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const consultingPageRef = useRef<HTMLDivElement>(null);

  // Inquiry Form States
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryCompany, setInquiryCompany] = useState<string>("");
  const [inquiryScope, setInquiryScope] = useState<string>("");
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryScope.trim()) return;

    setInquiryStatus("submitting");
    setTimeout(() => {
      setInquiryStatus("submitted");
    }, 1500);
  };

  const handleInquiryReset = () => {
    setInquiryName("");
    setInquiryCompany("");
    setInquiryScope("");
    setInquiryStatus("idle");
  };

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

  const CORPORATE_ITEMS = [
    {
      title: "From Concept to Class-Approved Reality",
      text: "You have the vision; we provide the mathematical foundation. For independent yacht designers and styling studios, we serve as your unseen, highly specialized engineering backbone. Hand over your conceptual surface models or initial sketches, and we will execute the rigorous hydrostatics, structural analysis, and systems routing required to transform pure aesthetics into a safe, class-compliant, and fully buildable vessel."
    },
    {
      title: "Shipyard Production & Overflow Drafting",
      text: "Keep your fabrication teams moving without the bottleneck of back-office drafting. We act as an on-demand extension of your in-house engineering department, stepping in to handle project overflow, complex 3D parametric modeling, and the generation of millimeter-perfect 2D production drawings. We deliver fabrication-ready blueprints tailored exactly to your specific shop-floor tolerances and manufacturing processes."
    },
    {
      title: "Advanced Computational Outsourcing",
      text: "Avoid the massive overhead of specialized software licenses and specialized training. Partner with us to outsource your heavy computational lifting. We provide rigorous Computational Fluid Dynamics (CFD) and Finite Element Analysis (FEA) on a per-project basis, delivering comprehensive, white-labeled reports that validate your structural integrity and hydrodynamic performance for your clients and classification surveyors."
    },
    {
      title: "Reverse Engineering & Refit Feasibility",
      text: "When major refits or conversions hit your drydock, we provide the rapid, precise digital infrastructure you need to proceed safely. We partner with commercial fleets and repair yards to conduct accurate reverse engineering of existing hull structures, performing the critical stability assessments and weight-tracking necessary before a single piece of steel is cut."
    },
    {
      title: "White-Labeled Visualization & Pitch Assets",
      text: "Arm your sales teams, brokers, and lead designers with visual collateral that closes the deal. We take your raw CAD data and produce hyper-realistic, physically based renderings and immersive 3D walkthroughs. Delivered entirely under your brand, these high-impact marketing assets are engineered to captivate investors, yacht owners, and stakeholders at the highest levels of the maritime industry."
    }
  ];

  const ANALYSIS_CATEGORIES = [
    {
      title: "Naval Architecture & Hydrodynamics",
      items: [
        { title: "Custom Linesplan Generation", text: "Mathematically faired hull geometries tailored for specific operational profiles." },
        { title: "Comprehensive Stability Calculations", text: "Rigorous intact and damage stability assessments to ensure absolute safety and regulatory compliance." },
        { title: "Hull Optimization", text: "Refining hull shapes to minimize resistance, optimize wake flow, and maximize fuel efficiency." },
        { title: "Weight Management", text: "Live tracking of mass properties and center of gravity throughout the design lifecycle." }
      ]
    },
    {
      title: "Engineering & Structural Analysis",
      items: [
        { title: "Finite Element Analysis (FEA)", text: "Advanced structural stress-testing to validate material thickness and joint integrity." },
        { title: "Computational Fluid Dynamics (CFD)", text: "Virtual towing tank simulations for accurate fluid flow and propulsion analysis." },
        { title: "Vibration & Acoustic Profiling", text: "Engineering specialized dampening solutions for maximum onboard comfort." },
        { title: "Retrofit & Conversion Engineering", text: "Feasibility studies and reverse engineering for major vessel lengthenings and modifications." }
      ]
    },
    {
      title: "3D CAD Modeling & Digital Twins",
      items: [
        { title: "High-Fidelity 3D Modeling", text: "Fully parametric, 1:1 scale digital twins of commercial vessels and luxury yachts." },
        { title: "Class-A Surface Sculpting", text: "Flawless, continuous exterior surface modeling for high-end aesthetic profiles." },
        { title: "Proactive Clash Detection", text: "Identifying and resolving spatial interferences between structural components and complex marine systems." },
        { title: "Marine Systems Routing (MEP)", text: "Precise 3D mapping of mechanical, electrical, and piping networks." }
      ]
    },
    {
      title: "2D Drafting & Production Blueprints",
      items: [
        { title: "General Arrangements (GA)", text: "Space-optimized, ergonomic layouts for crew operations and passenger luxury." },
        { title: "Fabrication & Structural Drawings", text: "Millimeter-perfect material specifications, scantlings, and welding details." },
        { title: "As-Built Documentation", text: "Exact, updated drafting for existing fleets undergoing modernization." },
        { title: "Class Society Documentation", text: "Generating the exact drawing packets required for rapid approval by Lloyd’s, DNV, ABS, etc." }
      ]
    },
    {
      title: "Visualization & Interactive Media",
      items: [
        { title: "Photorealistic Renderings", text: "Transforming raw CAD data into lifelike, physically based visual assets with dynamic lighting." },
        { title: "Interactive WebGL Viewers", text: "Embedding highly responsive, custom 3D model viewers directly into web browsers for client presentations." },
        { title: "Immersive 3D Walkthroughs", text: "Animated spatial tours showcasing interior layouts and sightlines." },
        { title: "Bespoke Material Simulation", text: "Accurate visual representation of teak, carbon fiber, polished metals, and luxury fabrics." }
      ]
    },
    {
      title: "B2B & Academic Consulting",
      items: [
        { title: "Shipyard Overflow Drafting", text: "Acting as an on-demand extension for in-house engineering and production teams." },
        { title: "Design Studio Support", text: "Providing the underlying mathematics, hydrostatics, and structural validation for independent yacht stylists." },
        { title: "Academic Project Engineering", text: "Dedicated CAD and simulation support for university theses, capstone projects, and solar/autonomous boat competitions." }
      ]
    },
    {
      title: "Comprehensive Stability & Hydrostatics",
      items: [
        { title: "Intact Stability Assessments", text: "Rigorous testing against international criteria to guarantee safe operational limits in all sea states and weather conditions." },
        { title: "Damage Stability Analysis", text: "Deterministic and probabilistic modeling to ensure vessel survivability and regulatory compliance post-collision or grounding." },
        { title: "Inclining Experiment Support", text: "Generating accurate test procedures and final reports to establish the true lightweight and center of gravity." },
        { title: "Class-Approved Stability Booklets", text: "Compiling complete, audit-ready stability manuals (Trim & Stability books) for crew operation and classification society approval." },
        { title: "Longitudinal Strength Calculations", text: "Analyzing shear forces and bending moments to prevent structural failure under extreme loading and ballasting conditions." },
        { title: "Dynamic Load Condition Modeling", text: "Simulating varying cargo, fuel, and passenger states to ensure optimal draft, trim, and safety at all times." }
      ]
    }
  ];

  // IntersectionObserver to sync standard page scrolls with active slide specs
  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: "-45% 0px -45% 0px", // Strict center focus to handle extremely tall section heights beautifully
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace("section-", "");
          const index = VESSEL_SECTIONS.findIndex((s) => s.id === sectionId);
          if (index !== -1 && !isScrollingRef.current) {
            setCurrentSectionIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Only observe the 3D Showcase sections (0 to 5)
    VESSEL_SECTIONS.slice(0, 6).forEach((section) => {
      const el = document.getElementById(`section-${section.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Automated snap alignment when returning to/switching 3D sections
  useEffect(() => {
    if (currentSectionIndex !== 6) {
      const targetSection = VESSEL_SECTIONS[currentSectionIndex];
      const timer = setTimeout(() => {
        const el = targetSection ? document.getElementById(`section-${targetSection.id}`) : null;
        if (el) {
          el.scrollIntoView({
            behavior: "auto",
            block: "start"
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentSectionIndex]);

  // Intersection Observer for scroll-based fade-in & slide-up of consulting page flanks
  useEffect(() => {
    if (currentSectionIndex !== 6) return;

    const sections = [
      { id: "academic-consulting-flank", selector: ".consulting-card", stagger: 0.1 },
      { id: "corporate-partnership-flank", selector: ".corporate-card", stagger: 0.1 },
      { id: "analysis-we-offer-flank", selector: ".analysis-category-card", stagger: 0.08 },
      { id: "inquire-partnership-flank", selector: ".inquiry-form-card", stagger: 0 }
    ];

    const observerOptions = {
      root: null, // browser viewport
      rootMargin: "0px 0px -8% 0px", // triggers slightly before scrolling fully into view
      threshold: 0.05 // triggers when 5% is visible
    };

    const animatedMap = new Set<string>();

    const observerCallback = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.id;
          if (animatedMap.has(targetId)) return;

          animatedMap.add(targetId);
          obs.unobserve(entry.target); // Animates once per view

          const config = sections.find((s) => s.id === targetId);
          if (config) {
            const targets = entry.target.querySelectorAll(config.selector);
            if (targets.length > 0) {
              gsap.killTweensOf(targets);
              gsap.fromTo(
                targets,
                { opacity: 0, y: 50 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: config.stagger,
                  ease: "power3.out",
                  clearProps: "transform"
                }
              );
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Give a brief moment for the page to render and elements to be available in the DOM
    const timer = setTimeout(() => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) {
          observer.observe(el);
        }
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentSectionIndex]);

  // Programmatic snap scroll to a specific index
  const handleSetSectionIndex = (index: number) => {
    if (index === currentSectionIndex) return;

    if (index === 6) {
      setCurrentSectionIndex(6);
      return;
    }
    
    const targetSection = VESSEL_SECTIONS[index];
    const el = targetSection ? document.getElementById(`section-${targetSection.id}`) : null;
    
    if (el) {
      isScrollingRef.current = true;
      setCurrentSectionIndex(index);
      
      el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Release scroll block lock after smooth scrolling completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); 
    }
  };

  // Keyboard navigation support using arrow keys and PageUp/PageDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside academic consulting section so user can navigate webpage organically
      if (currentSectionIndex === 6) return;

      // Ignore when typing in form controls
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (isScrollingRef.current) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        const nextIndex = currentSectionIndex + 1;
        if (nextIndex < VESSEL_SECTIONS.length) {
          e.preventDefault();
          handleSetSectionIndex(nextIndex);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        const prevIndex = currentSectionIndex - 1;
        if (prevIndex >= 0) {
          e.preventDefault();
          handleSetSectionIndex(prevIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSectionIndex]);

  const handleModelChange = (url: string | null) => {
    setSelectedModelUrl(url);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-stone-100 overflow-hidden font-sans antialiased">
      {/* Luxury dynamic spotlight background trail behind visual menus */}
      {currentSectionIndex !== 6 && <div className="cursor-glow-spotlight" />}
      
      {/* 3D CANVAS COMPONENT - Runs as fixed cinematic backplate, fully unmounted on academic consulting webpage */}
      <AnimatePresence>
        {currentSectionIndex !== 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <ThreeCanvas
              currentSectionIndex={currentSectionIndex}
              customModelFile={null}
              onModelLoadedStatus={() => {}}
              hullColor={hullColor}
              deckColor={deckColor}
              glassColor={glassColor}
              selectedModelUrl={selectedModelUrl}
              lightingTheme="sunset"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE EXPERIENCE HUD OVERLAY */}
      <AnimatePresence>
        {currentSectionIndex !== 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          >
            <SpecificationOverlay
              currentSectionIndex={currentSectionIndex}
              onSetSectionIndex={handleSetSectionIndex}
              hullColor={hullColor}
              setHullColor={setHullColor}
              deckColor={deckColor}
              setDeckColor={setDeckColor}
              glassColor={glassColor}
              setGlassColor={setGlassColor}
              selectedModelUrl={selectedModelUrl}
              onModelSelect={handleModelChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINI DECORATIVE GRID LINES FOR ARCHITECTURAL DEPTH (Floating Glass Frame Border) - Hidden on consulting webpage */}
      <div 
        className={`absolute inset-0 w-full h-full pointer-events-none border-[12px] border-[#060606]/90 z-20 flex flex-col justify-between shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] transition-all duration-700 ${
          currentSectionIndex === 6 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-full flex justify-between px-6 pt-3">
          <div className="w-[1px] h-3 bg-stone-700/40" />
          <div className="w-[1px] h-3 bg-stone-700/40" />
        </div>
        <div className="w-full flex justify-between px-6 pb-3">
          <div className="w-[1px] h-3 bg-stone-700/40" />
          <div className="w-[1px] h-3 bg-stone-700/40" />
        </div>
      </div>

      {/* TRANSPARENT GHOST TOUCH CONTAINER (Captures device scroll and maps snap sections) */}
      <div
        id="vessel-scroll-track"
        ref={scrollContainerRef}
        onWheel={(e) => {
          if (isScrollingRef.current) return;
          // Seamless kinetic transition: scroll down from section 6 (index 5) triggers academic consulting
          if (currentSectionIndex === 5 && e.deltaY > 35) {
            e.preventDefault();
            handleSetSectionIndex(6);
          }
        }}
        className={`absolute inset-0 w-full h-full overflow-y-scroll scroll-smooth z-15 pointer-events-auto snap-y snap-mandatory ${
          currentSectionIndex === 6 ? "hidden pointer-events-none" : ""
        }`}
        style={{ scrollbarWidth: "none" }} // Hides default browser scrollbar
      >
        {VESSEL_SECTIONS.slice(0, 6).map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="w-full h-screen snap-start flex items-center p-6 md:p-10 pointer-events-none relative"
          >
            {/* Ambient Watermark Section Number behind card */}
            <div className="absolute right-[12%] bottom-[12%] select-none pointer-events-none opacity-[0.015] text-[24vw] font-serif font-bold leading-none text-stone-200">
              {section.number}
            </div>
          </div>
        ))}
      </div>

      {/* ACADEMIC CONSULTING FULL-PAGE NORMAL WEBSITE */}
      <AnimatePresence>
        {currentSectionIndex === 6 && (
          <motion.div
            key="academic-consulting-page"
            ref={consultingPageRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full bg-[#050505] text-stone-100 overflow-y-auto pointer-events-auto select-text z-40"
            style={{ scrollbarWidth: "thin" }}
            onScroll={(e) => {
              if (e.currentTarget.scrollTop > 350) {
                setShowBackToTop(true);
              } else {
                setShowBackToTop(false);
              }
            }}
          >
            {/* Stunning Ambient Radial Orange Rays Backdrop */}
            <div className="absolute -top-[10%] left-1/4 w-[450px] h-[450px] bg-gradient-to-r from-[#ff5000]/12 to-red-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-[35%] right-[10%] w-[400px] h-[400px] bg-gradient-to-r from-amber-600/8 to-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-[5%] left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/10 via-amber-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
            
            {/* Thin, elegant architectural top divider */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff5000]/25 to-transparent" />
            
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center gap-10 md:gap-14 py-12 md:py-20 px-6 md:px-12">
              
              {/* Top modern website navigation header row */}
              <div className="w-full flex justify-between items-center pb-6 border-b border-white/5">
                <div className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-stone-100 font-bold uppercase select-none">
                  <Compass className="w-4 h-4 text-[#ff5000]" />
                  MATSYARK DESIGN
                </div>
                
                <button
                  onClick={() => handleSetSectionIndex(5)}
                  className="px-4 py-2 border border-white/10 hover:border-[#ff5000]/50 rounded-full text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-stone-300 hover:text-white cursor-pointer transition-all duration-300 bg-white/5 active:scale-95 hover:shadow-[0_0_15px_rgba(255,80,0,0.15)] select-none"
                >
                  ← Return to 3D Showcase
                </button>
              </div>

              {/* Hero Title and Subtitle Block */}
              <div className="flex flex-col items-center gap-4 max-w-2xl">
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[8.5px] md:text-[9.5px] tracking-[0.3em] text-[#ff5000] font-bold uppercase bg-[#ff5000]/10 px-3 py-1 rounded-full border border-[#ff5000]/20">
                    07 // PARTNERSHIPS & CONSULTING
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#ff5000] shadow-[0_0_12px_#ff5000] animate-pulse" />
                </div>
                
                <h1 className="font-serif text-3xl md:text-5xl lg:text-3.5xl text-white font-black tracking-tight leading-none mt-2">
                  Specialized Partnerships: <span className="block md:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 font-extrabold">Bridging Talents & Heavy Industry</span>
                </h1>
                
                <p className="font-sans text-stone-400 text-xs md:text-sm lg:text-[15px] leading-relaxed mt-4 max-w-xl">
                  Bridging the gap between academic theory, design styling, and heavy maritime fabrication. Treat our elite design studio as your professional architecture and simulation partner.
                </p>

                {/* Interactive Flank Jump Pointers */}
                <div className="flex flex-wrap gap-4 items-center justify-center mt-6 w-full max-w-4xl select-none">
                  <button
                    onClick={() => {
                      const el = document.getElementById("academic-consulting-flank");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full sm:w-auto shrink-0 group px-5 py-3.5 bg-neutral-950 hover:bg-neutral-900/40 border border-stone-900 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(255,80,0,0.1)] hover:animate-border-pulse rounded-2xl flex items-center justify-between sm:justify-start gap-4 transition-all duration-500 ease-out active:scale-95 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-mono tracking-[0.15em] text-[#ff5000] font-bold uppercase">FLANK A</span>
                        <span className="text-xs font-bold tracking-tight text-stone-200 group-hover:text-white transition-colors">Academic Consulting</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#ff5000] group-hover:translate-y-0.5 transition-all ml-4" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("corporate-partnership-flank");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full sm:w-auto shrink-0 group px-5 py-3.5 bg-neutral-950 hover:bg-neutral-900/40 border border-stone-900 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(255,80,0,0.1)] hover:animate-border-pulse rounded-2xl flex items-center justify-between sm:justify-start gap-4 transition-all duration-500 ease-out active:scale-95 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono">
                        <Briefcase className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-mono tracking-[0.15em] text-[#ff5000] font-bold uppercase">FLANK B</span>
                        <span className="text-xs font-bold tracking-tight text-stone-200 group-hover:text-white transition-colors">Corporate Enterprise</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#ff5000] group-hover:translate-y-0.5 transition-all ml-4" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("analysis-we-offer-flank");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full sm:w-auto shrink-0 group px-5 py-3.5 bg-neutral-950 hover:bg-neutral-900/40 border border-stone-900 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(255,80,0,0.1)] hover:animate-border-pulse rounded-2xl flex items-center justify-between sm:justify-start gap-4 transition-all duration-500 ease-out active:scale-95 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono">
                        <Layers className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-mono tracking-[0.15em] text-[#ff5000] font-bold uppercase">FLANK C</span>
                        <span className="text-xs font-bold tracking-tight text-stone-200 group-hover:text-white transition-colors">Analysis We Offer</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#ff5000] group-hover:translate-y-0.5 transition-all ml-4" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("inquire-partnership-flank");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full sm:w-auto shrink-0 group px-5 py-3.5 bg-neutral-950 hover:bg-neutral-900/40 border border-stone-900 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(255,80,0,0.1)] hover:animate-border-pulse rounded-2xl flex items-center justify-between sm:justify-start gap-4 transition-all duration-500 ease-out active:scale-95 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-mono">
                        <Mail className="w-4 h-4 text-[#ff5000]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-mono tracking-[0.15em] text-[#ff5000] font-bold uppercase">FLANK D</span>
                        <span className="text-xs font-bold tracking-tight text-stone-200 group-hover:text-white transition-colors">Inquire for Partnership</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#ff5000] group-hover:translate-y-0.5 transition-all ml-4" />
                  </button>
                </div>
              </div>

              {/* SECTION A: ACADEMIC & STUDENT CONSULTING */}
              <div id="academic-consulting-flank" className="w-full flex flex-col items-center gap-6 mt-12 border-t border-white/5 pt-12 scroll-mt-24">
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[7.5px] md:text-[8.5px] tracking-[0.2em] text-[#ff5000] font-bold uppercase bg-[#ff5000]/5 px-2.5 py-0.5 rounded-full border border-[#ff5000]/10">
                    FLANK A // ACADEMIC CONSULTING
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3.5xl text-stone-100 font-extrabold tracking-tight">
                  Academic & Student Consulting: Empowering the Next Generation
                </h2>

                {/* Section above details containing headers in beautifully rounded boxes */}
                <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl pt-2">
                  {CONSULTING_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const target = document.getElementById(`consulting-detail-${idx}`);
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-stone-800 hover:border-[#ff5000]/80 rounded-full text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-stone-300 hover:text-white transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:scale-95 select-none hover:shadow-[0_0_12px_rgba(255,80,0,0.1)] hover:bg-[#ff5000]/5"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* Detailed Paragraph Sections in high-contrast legible layout */}
                <div className="w-full flex flex-col gap-6 text-left max-w-3xl pt-4">
                  {CONSULTING_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      id={`consulting-detail-${idx}`}
                      className="consulting-card opacity-0 group relative bg-[#090909]/95 border border-stone-900 hover:border-[#ff5000]/25 p-7 md:p-8 rounded-3xl transition-all duration-500 shadow-2xl flex flex-col md:flex-row gap-6 items-start overflow-hidden hover:shadow-[0_20px_60px_rgba(255,80,0,0.03)]"
                    >
                      {/* Interactive inner corner accent flame */}
                      <div className="absolute top-0 right-0 w-[160px] h-[160px] bg-gradient-to-bl from-[#ff5000]/8 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Elite orange numeric badge */}
                      <div className="w-10 h-10 rounded-full bg-neutral-950 border border-stone-800 group-hover:border-[#ff5000]/30 flex items-center justify-center font-mono text-[11px] text-[#ff5000] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0 transition-all duration-300 select-none">
                        A{idx + 1}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2.5">
                        <h3 className="font-serif text-[17px] md:text-[21px] text-stone-100 font-extrabold tracking-tight group-hover:text-amber-500 transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="font-sans text-[12px] md:text-[13.5px] lg:text-[14px] text-stone-300 leading-relaxed font-normal">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: CORPORATE PARTNERSHIPS & STUDIO SUPPORT */}
              <div id="corporate-partnership-flank" className="w-full flex flex-col items-center gap-6 mt-12 border-t border-white/5 pt-12 scroll-mt-24">
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[7.5px] md:text-[8.5px] tracking-[0.2em] text-[#ff5000] font-bold uppercase bg-[#ff5000]/5 px-2.5 py-0.5 rounded-full border border-[#ff5000]/10">
                    FLANK B // CORPORATE ENTERPRISE
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3.5xl text-stone-100 font-extrabold tracking-tight">
                  Corporate Partnerships & Studio Support: Your Extended Engineering Arm
                </h2>

                {/* Section above details containing headers in beautifully rounded boxes */}
                <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl pt-2">
                  {CORPORATE_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const target = document.getElementById(`corporate-detail-${idx}`);
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-stone-800 hover:border-[#ff5000]/80 rounded-full text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-stone-300 hover:text-white transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:scale-95 select-none hover:shadow-[0_0_12px_rgba(255,80,0,0.1)] hover:bg-[#ff5000]/5"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* Detailed Paragraph Sections in high-contrast legible layout */}
                <div className="w-full flex flex-col gap-6 text-left max-w-3xl pt-4">
                  {CORPORATE_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      id={`corporate-detail-${idx}`}
                      className="corporate-card opacity-0 group relative bg-[#090909]/95 border border-stone-900 hover:border-[#ff5000]/25 p-7 md:p-8 rounded-3xl transition-all duration-500 shadow-2xl flex flex-col md:flex-row gap-6 items-start overflow-hidden hover:shadow-[0_20px_60px_rgba(255,80,0,0.03)]"
                    >
                      {/* Interactive inner corner accent flame */}
                      <div className="absolute top-0 right-0 w-[160px] h-[160px] bg-gradient-to-bl from-[#ff5000]/8 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Elite orange numeric badge */}
                      <div className="w-10 h-10 rounded-full bg-neutral-950 border border-stone-800 group-hover:border-[#ff5000]/30 flex items-center justify-center font-mono text-[11px] text-[#ff5000] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0 transition-all duration-300 select-none">
                        B{idx + 1}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2.5">
                        <h3 className="font-serif text-[17px] md:text-[21px] text-stone-100 font-extrabold tracking-tight group-hover:text-amber-500 transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="font-sans text-[12px] md:text-[13.5px] lg:text-[14px] text-stone-300 leading-relaxed font-normal">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: ANALYSIS WE OFFER */}
              <div id="analysis-we-offer-flank" className="w-full flex flex-col items-center gap-6 mt-16 border-t border-white/5 pt-16 scroll-mt-24">
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[7.5px] md:text-[8.5px] tracking-[0.2em] text-[#ff5000] font-bold uppercase bg-[#ff5000]/5 px-2.5 py-0.5 rounded-full border border-[#ff5000]/10">
                    FLANK C // COMPREHENSIVE SIMULATION & ANALYSIS
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3.5xl text-stone-100 font-extrabold tracking-tight">
                  Analysis We Offer: Industry-Grade Marine Engineering
                </h2>
                
                <p className="font-sans text-stone-400 text-xs md:text-sm lg:text-[14px] leading-relaxed max-w-xl text-center">
                  Supercharge your vessel projects with advanced fluid computations, structural stress modeling, parametric twin simulations, and class-ready drawing packets.
                </p>

                {/* Grid of Analytical Service Categories */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl pt-6 text-left">
                  {ANALYSIS_CATEGORIES.map((category, catIdx) => (
                    <div
                      key={catIdx}
                      className="analysis-category-card opacity-0 group relative bg-[#090909]/90 border border-stone-900 hover:border-[#ff5000]/20 p-6 md:p-8 rounded-3xl transition-all duration-500 shadow-2xl overflow-hidden hover:shadow-[0_15px_45px_rgba(255,80,0,0.02)] flex flex-col gap-5"
                    >
                      {/* Subtle floating glow in the cards */}
                      <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-[#ff5000]/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <span className="font-mono text-[10px] text-[#ff5000] font-bold">C{catIdx + 1}</span>
                        <h3 className="font-serif text-base md:text-lg text-stone-100 font-extrabold tracking-tight">
                          {category.title}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-4">
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex flex-col gap-1 pl-3 border-l border-[#ff5000]/20 hover:border-[#ff5000]/60 transition-colors duration-300">
                            <h4 className="font-serif text-sm text-stone-200 font-extrabold transition-colors duration-300">
                              {item.title}
                            </h4>
                            <p className="font-sans text-[11.5px] md:text-xs text-stone-400 leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION D: INQUIRE FOR PARTNERSHIP */}
              <div id="inquire-partnership-flank" className="w-full flex flex-col items-center gap-6 mt-16 border-t border-white/5 pt-16 scroll-mt-24">
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[7.5px] md:text-[8.5px] tracking-[0.2em] text-[#ff5000] font-bold uppercase bg-[#ff5000]/5 px-2.5 py-0.5 rounded-full border border-[#ff5000]/10">
                    FLANK D // SECURE PARTNERSHIP INQUIRY
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3.5xl text-stone-100 font-extrabold tracking-tight">
                  Inquire for Partnership
                </h2>
                
                <p className="font-sans text-stone-400 text-xs md:text-sm lg:text-[14px] leading-relaxed max-w-xl text-center">
                  Initiate a secure channel with our lead naval architects and simulation engineers. Specify your concepts, timeline constraints, or experimental parameters.
                </p>

                {/* Styled Contact/Partnership Form Card */}
                <div className="inquiry-form-card opacity-0 w-full max-w-2xl bg-[#090909]/90 border border-stone-900 focus-within:border-[#ff5000]/25 rounded-3xl p-6 md:p-10 transition-all duration-500 shadow-2xl relative overflow-hidden mt-6 text-left">
                  {/* Glowing micro-flame corner design */}
                  <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-gradient-to-bl from-[#ff5000]/5 via-amber-500/0 to-transparent blur-3xl pointer-events-none" />
                  
                  {inquiryStatus === "submitted" ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <CheckCircle className="w-8 h-8 text-emerald-500 animate-pulse" />
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-stone-100 font-extrabold tracking-tight mt-2">
                        Inquiry Securely Transmitted
                      </h3>
                      <p className="font-sans text-stone-400 text-xs md:text-sm leading-relaxed max-w-md">
                        Thank you for reaching out, <span className="text-stone-200 font-semibold">{inquiryName}</span>. Your inquiry for <span className="text-stone-200 font-semibold">{inquiryCompany || "your independent project"}</span> has been logged. Our lead naval engineer will review your specifications and reach out within 24 standard hours.
                      </p>
                      
                      <button
                        onClick={handleInquiryReset}
                        className="mt-6 px-5 py-2.5 bg-neutral-900 border border-stone-800 hover:border-[#ff5000]/60 rounded-full text-[10px] font-mono tracking-wider uppercase text-stone-300 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-md select-none"
                      >
                        Transmit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="flex flex-col gap-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Name Field */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-stone-400 font-bold flex items-center gap-1.5 select-none">
                            <span>Your Name *</span>
                          </label>
                          <input
                            type="text"
                            required
                            disabled={inquiryStatus === "submitting"}
                            placeholder="e.g. Elena Rostova"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-950 border border-stone-850 focus:border-[#ff5000]/60 rounded-xl font-sans text-xs md:text-sm text-stone-100 placeholder-stone-650 outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,80,0,0.05)] disabled:opacity-50"
                          />
                        </div>

                        {/* Company Field */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-stone-400 font-bold select-none">
                            <span>Company / Studio</span>
                          </label>
                          <input
                            type="text"
                            disabled={inquiryStatus === "submitting"}
                            placeholder="e.g. Horizon Marine Labs"
                            value={inquiryCompany}
                            onChange={(e) => setInquiryCompany(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-950 border border-stone-850 focus:border-[#ff5000]/60 rounded-xl font-sans text-xs md:text-sm text-stone-100 placeholder-stone-650 outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,80,0,0.05)] disabled:opacity-50"
                          />
                        </div>

                      </div>

                      {/* Project Scope TextArea Field */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-stone-400 font-bold select-none">
                          <span>Project Scope & Specifications *</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          disabled={inquiryStatus === "submitting"}
                          placeholder="Please provide a brief summary of your vessel concepts, hydrodynamic constraints, or requested structural simulations."
                          value={inquiryScope}
                          onChange={(e) => setInquiryScope(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-950 border border-stone-850 focus:border-[#ff5000]/60 rounded-xl font-sans text-xs md:text-sm text-stone-100 placeholder-stone-650 outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,80,0,0.05)] resize-none disabled:opacity-50 leading-relaxed"
                        />
                      </div>

                      {/* Submit Trigger Action block */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={inquiryStatus === "submitting" || !inquiryName.trim() || !inquiryScope.trim()}
                          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-stone-850 hover:border-[#ff5000]/60 text-stone-300 hover:text-white rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 select-none font-bold active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-[0_5px_15px_rgba(255,80,0,0.05)]"
                        >
                          {inquiryStatus === "submitting" ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-[#ff5000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Transmitting specifications...
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 text-[#ff5000]" />
                              Transmit Secure Inquiry
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}
                </div>

                {/* Direct Email Address Block */}
                <div className="mt-8 flex flex-col items-center gap-2 select-none">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-stone-500 uppercase font-semibold">or email us directly</span>
                  <a
                    href="mailto:matsyarkdesign@gmail.com"
                    className="group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#090909] hover:bg-neutral-950 border border-stone-850 hover:border-[#ff5000]/40 transition-all duration-300 shadow-xl"
                  >
                    <Mail className="w-4 h-4 text-[#ff5000] group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-mono text-xs sm:text-sm text-stone-300 group-hover:text-white transition-colors duration-300 tracking-wide font-medium">
                      matsyarkdesign@gmail.com
                    </span>
                  </a>
                </div>
              </div>

              {/* Clean footer action row returning back to top overview */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pb-12 border-t border-white/5 pt-12">
                <button
                  onClick={() => handleSetSectionIndex(5)}
                  className="px-6 py-3.5 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-stone-850 hover:border-[#ff5000]/40 text-stone-300 hover:text-white rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-2 select-none font-bold active:scale-95 cursor-pointer shadow-xl hover:shadow-[0_8px_24px_rgba(255,80,0,0.06)]"
                >
                  <Compass className="w-3.5 h-3.5 text-[#ff5000]/90 rotate-45" />
                  Back to 3D Presentation
                </button>
              </div>
              
            </div>

            {/* FLOATING BACK TO TOP BUTTON WITH GSAP ANIMATION AND SCALE FEEDBACK */}
            <AnimatePresence>
              {showBackToTop && (
                <motion.button
                  key="back-to-top-hud"
                  initial={{ opacity: 0, scale: 0.7, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => {
                    if (consultingPageRef.current) {
                      gsap.to(consultingPageRef.current, {
                        scrollTop: 0,
                        duration: 1.1,
                        ease: "power3.inOut"
                      });
                    }
                  }}
                  whileHover={{ scale: 1.12, backgroundColor: "rgba(10, 10, 10, 0.95)" }}
                  whileTap={{ scale: 0.93 }}
                  className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-4 rounded-full bg-neutral-950/95 border border-stone-800 hover:border-[#ff5000]/80 text-stone-300 hover:text-white backdrop-blur-xl shadow-[0_12px_40px_rgba(255,80,0,0.18)] focus:outline-none cursor-pointer transition-colors duration-300 flex items-center justify-center"
                  style={{ touchAction: "manipulation" }}
                  title="Scroll to Top"
                >
                  <ArrowUp className="w-4 h-4 text-[#ff5000] animate-bounce" />
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
