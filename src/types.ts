export interface VesselSection {
  id: string;
  number: string;
  title: string;
  titleSecondary: string;
  description: string;
  specs: { label: string; value: string; detail?: string }[];
  footerSpecs?: { label: string; value: string }[];
  cameraPos?: { x: number; y: number; z: number };
  cameraLookAt?: { x: number; y: number; z: number };
}

export const VESSEL_SECTIONS: VesselSection[] = [
  {
    id: "overview",
    number: "01",
    title: "STUDIO OVERVIEW",
    titleSecondary: "Naval Design Studio",
    description: "Matsyark is an elite naval architecture and marine design house, specializing in high-fidelity 3D design, CAD development, structural linesplans, and aerodynamic flow simulations.",
    specs: [
      { label: "Comprehensive Expertise", value: "Naval architecture, structural engineering, high-fidelity 3D modeling and hydrodynamic design." },
      { label: "Industry Standards", value: "Structural validation aligned with Lloyd's Register, ABS, and DNV GL regulations." },
      { label: "Advanced Simulation", value: "Advanced Navier-Stokes CFD analyses and finite element analysis (FEA)." },
      { label: "Studio Operations", value: "Operating from Chennai, India, collaborating with shipbuilders, drydocks, and academic research teams worldwide." }
    ],
    footerSpecs: [
      { label: "Location", value: "India, Chennai" },
      { label: "Core Expertise", value: "Naval Engineering" },
      { label: "Class Rules", value: "Lloyd's, ABS, DNV" }
    ],
    cameraPos: { x: 29, y: 9, z: 19 },
    cameraLookAt: { x: 4.5, y: -0.5, z: -1.5 }
  },
  {
    id: "linesplan_hull",
    number: "02",
    title: "LINESPLAN & HULL OPTIMIZATION",
    titleSecondary: "Hydrodynamics & Vessel Architecture",
    description: "Comprehensive naval architectural services ranging from hull form optimization of displacement hulls to strict stability analysis, buoyancy assessments, and sea-handling engineering.",
    specs: [
      { label: "Custom Hull Development", value: "We generate mathematically faired lines tailored to optimize your vessel's hydrodynamics." },
      { label: "Resistance Optimization", value: "We refine your hull shape to minimize drag, boosting top speed and fuel efficiency." },
      { label: "Stability Calculations", value: "We establish the exact geometric baseline to guarantee safe load, draft, and trim." },
      { label: "Regulatory Verification", value: "We ensure your foundational design meets IMO and SOLAS standards from day one." },
      { label: "CAD-Ready Handoffs", value: "We deliver flawless 2D blueprints ready for direct import into your 3D environments." }
    ],
    footerSpecs: [
      { label: "Hull Form", value: "Mathematically Faired" },
      { label: "CFD Solver", value: "Navier-Stokes" },
      { label: "Optimization", value: "Resistance / Drag" }
    ],
    cameraPos: { x: -18, y: -2, z: 20 }, // Zoomed on front hull / bow
    cameraLookAt: { x: 10, y: -2, z: 0 }
  },
  {
    id: "drafting_drawings",
    number: "03",
    title: "2D DRAFTING & PRODUCTION DRAWINGS",
    titleSecondary: "Engineering Blueprints",
    description: "Self-sustaining, optimized general arrangements and ship systems diagrams supporting marine electrical banks, biological water processors, and hybrid auxiliary powerplants.",
    specs: [
      { label: "General Arrangements (GA)", value: "We design space-optimized layouts to maximize your crew efficiency and passenger comfort." },
      { label: "Fabrication Blueprints", value: "We deliver the exact material specs, scantlings, and welding details your shipyard needs to build." },
      { label: "Systems Routing (MEP)", value: "We map out precise, clash-free mechanical, electrical, and piping schematics." },
      { label: "Reverse Engineering", value: "We draft accurate, updated as-built documentation for your existing vessel refits." },
      { label: "Manufacturing Tolerances", value: "We provide millimeter-perfect outputs so physical construction flawlessly matches the digital design." }
    ],
    footerSpecs: [
      { label: "GA Spec", value: "Space-Optimized" },
      { label: "Standards", value: "IMO / SOLAS Rules" },
      { label: "Tolerance", value: "Millimeter-Perfect" }
    ],
    cameraPos: { x: 0, y: 18, z: 32 }, // Dynamic high blueprint overview
    cameraLookAt: { x: 0, y: 0, z: 0 }
  },
  {
    id: "cad_modelling",
    number: "04",
    title: "3D CAD MODELLING",
    titleSecondary: "Bespoke Parametric Modeling",
    description: "WATERTIGHT NURBS Modeling: Tailored development of customized CAD ship models, capturing hulls, superstructures, decks, layout compartments, and high-precision marine fittings.",
    specs: [
      { label: "Digital Twin Construction", value: "We build fully parametric, 1:1 scale 3D models of your vessel for total spatial awareness." },
      { label: "Class-A Surface Sculpting", value: "We design flawless, continuous exterior surfaces essential for your luxury yacht profiles." },
      { label: "Proactive Clash Detection", value: "We identify and resolve structural and systems interferences before construction begins." },
      { label: "Live Weight Tracking", value: "We automate mass and center-of-gravity updates to guarantee your real-world stability matches the design." },
      { label: "Parametric Flexibility", value: "We build adaptable models, allowing you to request rapid design iterations without starting over." }
    ],
    footerSpecs: [
      { label: "CAD Engine", value: "Parametric NURBS" },
      { label: "Scale", value: "1:1 Digital Twin" },
      { label: "Clash Detect", value: "Proactive Automated" }
    ],
    cameraPos: { x: 0, y: 12, z: 20 }, // Pitch down, looking at mid deck
    cameraLookAt: { x: -2, y: 2, z: 0 }
  },
  {
    id: "structural_analysis",
    number: "05",
    title: "ENGINEERING & STRUCTURAL ANALYSIS",
    titleSecondary: "Hydrodynamics & Shearing Schematics",
    description: "Exhaustive marine engineering analyses paired with precise naval linesplan development. Features computerized Navier-Stokes CFD drag calculations and FEM stress projections.",
    specs: [
      { label: "FEA Load Testing", value: "We simulate extreme environmental loads to validate your structural integrity and optimize material usage." },
      { label: "CFD Fluid Simulations", value: "We run virtual tank tests to analyze fluid flow, propulsion interaction, and drag on your hull." },
      { label: "Lifecycle Fatigue Assessment", value: "We predict long-term wear and tear so you can reinforce high-stress areas and extend lifespan." },
      { label: "Retrofit Feasibility Studies", value: "We analyze the structural and stability impacts before you commit to major refits or lengthenings." },
      { label: "Acoustic & Vibration Profiling", value: "We engineer advanced dampening solutions to guarantee maximum onboard comfort for your passengers." }
    ],
    footerSpecs: [
      { label: "Testing", value: "FEA Load Simulation" },
      { label: "Fluid Tank", value: "CFD Virtual Run" },
      { label: "Comfort", value: "Vibration Dampener" }
    ],
    cameraPos: { x: 8, y: 7, z: 12 }, // Zoomed on the command cabins / pilot house
    cameraLookAt: { x: -4, y: 4, z: 0 }
  },
  {
    id: "final_renderings",
    number: "06",
    title: "HIGH-QUALITY FINAL RENDERINGS",
    titleSecondary: "High-Fidelity Visual Masterpieces",
    description: "Ultra-realistic, cinematic visual representations and high-quality renderings of the final ship design, delivering rich PBR marine wood and steel textures under dramatic atmospheric lighting.",
    specs: [
      { label: "Photorealistic Visualizations", value: "We transform your complex CAD data into stunning, lifelike imagery that sells the vision." },
      { label: "Dynamic Lighting Simulation", value: "We place your vessel in realistic maritime environments, from mid-day sun to cinematic sunsets." },
      { label: "Bespoke Material Application", value: "We accurately visually simulate your exact teak decks, metals, carbon fiber, and luxury fabrics." },
      { label: "Immersive 3D Walkthroughs", value: "We animate guided tours to help your clients and investors truly feel the spatial flow." },
      { label: "Marketing Asset Delivery", value: "We supply you with high-resolution visual collateral optimized for pitch decks and boat shows." }
    ],
    footerSpecs: [
      { label: "Engine", value: "PBR Cinematic" },
      { label: "Resolution", value: "8K UHD Stills" },
      { label: "Lighting", value: "Dynamic solar/sunset" }
    ],
    cameraPos: { x: 24, y: -4, z: 12 }, // Stern view, focus on propeller area
    cameraLookAt: { x: 18, y: -3, z: 0 }
  },
  {
    id: "academic_consulting",
    number: "07",
    title: "ACADEMIC & STUDENT CONSULTING",
    titleSecondary: "Empowering the Next Generation",
    description: "We bridge the gap between academic theory and industry-grade engineering, offering student-friendly rates and custom CAD/CFD simulations.",
    specs: [
      { label: "Thesis & Capstone Project Support", value: "" },
      { label: "Custom Design & Prototyping", value: "" },
      { label: "Competition Vessel Engineering", value: "" },
      { label: "Expert Mentorship & Feasibility Reviews", value: "" },
      { label: "Specialized Student Rates", value: "" }
    ],
    footerSpecs: [
      { label: "Target", value: "Students & Academia" },
      { label: "Benefits", value: "High-Fidelity Twins" },
      { label: "Pricing", value: "Special Student Rates" }
    ],
    cameraPos: { x: -28, y: 15, z: 25 },
    cameraLookAt: { x: 1, y: 1, z: 0 }
  }
];
