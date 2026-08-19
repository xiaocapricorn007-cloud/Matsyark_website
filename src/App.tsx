import React, { useState, useEffect } from "react";
import EditorialHeader from "./components/EditorialHeader";
import EditorialHero from "./components/EditorialHero";
import ChapterPlate from "./components/ChapterPlate";
import CapabilitiesCatalog from "./components/CapabilitiesCatalog";
import PartnershipSpreads from "./components/PartnershipSpreads";
import InquirySection from "./components/InquirySection";
import EditorialFooter from "./components/EditorialFooter";
import { VESSEL_SECTIONS } from "./types";

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string>("overview");

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
        { title: "Interactive Technical Viewers", text: "Delivering responsive vector schematics and architectural layout packets for client presentations." },
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

  // Active section scroll sync with IntersectionObserver
  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("section-", "");
          setActiveSectionId(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    const elementsToObserve = [
      document.getElementById("overview"),
      ...VESSEL_SECTIONS.map((sec) => document.getElementById(`section-${sec.id}`)),
      document.getElementById("catalog"),
      document.getElementById("partnerships"),
      document.getElementById("inquire"),
    ].filter(Boolean) as HTMLElement[];

    elementsToObserve.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    let targetEl: HTMLElement | null = null;
    if (sectionId === "overview") {
      targetEl = document.getElementById("overview");
    } else if (sectionId === "catalog" || sectionId === "partnerships" || sectionId === "inquire") {
      targetEl = document.getElementById(sectionId);
    } else {
      targetEl = document.getElementById(`section-${sectionId}`);
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#191715] flex flex-col selection:bg-[#ff5000] selection:text-white">
      {/* Sticky Editorial Masthead Header */}
      <EditorialHeader
        activeSectionId={activeSectionId}
        onNavigate={handleNavigate}
      />

      {/* Main Content Flow */}
      <main className="flex-1 w-full">
        {/* Monograph Prolegomenon / Cover Spread */}
        <EditorialHero onNavigate={handleNavigate} />

        {/* Chapter Plates 01 through 07 */}
        <div className="w-full">
          {VESSEL_SECTIONS.map((section, idx) => (
            <ChapterPlate
              key={section.id}
              section={section}
              index={idx}
              onInquire={() => handleNavigate("inquire")}
            />
          ))}
        </div>

        {/* Comprehensive Capabilities Catalog */}
        <CapabilitiesCatalog
          categories={ANALYSIS_CATEGORIES}
          onInquire={() => handleNavigate("inquire")}
        />

        {/* Corporate & Academic Consulting Spreads */}
        <PartnershipSpreads
          corporateItems={CORPORATE_ITEMS}
          consultingItems={CONSULTING_ITEMS}
          onInquire={() => handleNavigate("inquire")}
        />

        {/* Commission & Inquiry Section */}
        <InquirySection />
      </main>

      {/* Monograph Colophon & Footer */}
      <EditorialFooter onNavigate={handleNavigate} />
    </div>
  );
}
