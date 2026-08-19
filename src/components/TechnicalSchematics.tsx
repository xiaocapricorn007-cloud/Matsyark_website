import React from "react";

interface SchematicProps {
  type: string;
  className?: string;
}

export default function TechnicalSchematics({ type, className = "" }: SchematicProps) {
  switch (type) {
    case "linesplan_hull":
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 02.1 // WATERLINES & BUTTOCK LINES (FAIRING)</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full text-stone-800" fill="none">
            {/* Grid coordinate rules */}
            <defs>
              <pattern id="grid-lines" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#grid-lines)" />
            
            {/* Centerline & Baseline */}
            <line x1="20" y1="100" x2="380" y2="100" stroke="#ff5000" strokeWidth="0.75" strokeDasharray="4 2" />
            <line x1="20" y1="160" x2="380" y2="160" stroke="#1c1917" strokeWidth="1" />
            <line x1="60" y1="30" x2="60" y2="170" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="200" y1="30" x2="200" y2="170" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="340" y1="30" x2="340" y2="170" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* Hull Waterline curves */}
            <path d="M 40 100 Q 140 100 240 115 T 370 155" stroke="#ff5000" strokeWidth="1.75" />
            <path d="M 40 115 Q 150 118 250 130 T 365 158" stroke="#1c1917" strokeWidth="1.25" opacity="0.8" />
            <path d="M 40 130 Q 160 132 260 142 T 360 160" stroke="#1c1917" strokeWidth="1" opacity="0.6" />
            <path d="M 40 145 Q 180 146 280 152 T 350 160" stroke="#1c1917" strokeWidth="0.75" opacity="0.4" />
            
            {/* Station Ribs */}
            <path d="M 120 60 Q 110 110 115 160" stroke="#ff5000" strokeWidth="0.75" opacity="0.7" />
            <path d="M 180 50 Q 165 110 175 160" stroke="#1c1917" strokeWidth="0.75" opacity="0.5" />
            <path d="M 240 45 Q 220 110 235 160" stroke="#1c1917" strokeWidth="0.75" opacity="0.5" />
            <path d="M 300 50 Q 285 110 295 160" stroke="#1c1917" strokeWidth="0.75" opacity="0.5" />
            
            {/* Bow / Transom callouts */}
            <circle cx="40" cy="100" r="2.5" fill="#ff5000" />
            <circle cx="370" cy="155" r="2.5" fill="#1c1917" />
            <text x="35" y="90" fill="#ff5000" className="font-mono text-[8px] font-bold">FP // BOW NOSE</text>
            <text x="320" y="175" fill="#1c1917" className="font-mono text-[8px]">AP // TRANSOM</text>
            <text x="185" y="25" fill="#78716c" className="font-mono text-[7.5px]">MIDSHIP SECTION (⊗)</text>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">TOLERANCE: ±0.001m // FARED NURBS</div>
        </div>
      );

    case "drafting_drawings":
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 03.1 // GENERAL ARRANGEMENT & BULKHEADS</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            {/* Main Deck Outline */}
            <path d="M 30 100 C 60 50, 160 40, 360 45 L 370 155 C 160 160, 60 150, 30 100 Z" stroke="#1c1917" strokeWidth="1.5" fill="rgba(0,0,0,0.015)" />
            {/* Internal Compartments */}
            <line x1="110" y1="52" x2="110" y2="148" stroke="#ff5000" strokeWidth="1.2" strokeDasharray="3 1" />
            <line x1="180" y1="46" x2="180" y2="154" stroke="#ff5000" strokeWidth="1.2" strokeDasharray="3 1" />
            <line x1="260" y1="44" x2="260" y2="156" stroke="#1c1917" strokeWidth="1" strokeDasharray="3 1" />
            <line x1="320" y1="44" x2="320" y2="156" stroke="#1c1917" strokeWidth="1" strokeDasharray="3 1" />
            
            {/* Longitudinal Center Corridor & Engine Room */}
            <rect x="180" y="80" width="80" height="40" fill="rgba(255,80,0,0.06)" stroke="#ff5000" strokeWidth="0.8" />
            <text x="188" y="103" fill="#ff5000" className="font-mono text-[7px] font-bold">PROPULSION // AUX</text>
            
            {/* Master Stateroom */}
            <rect x="110" y="65" width="70" height="70" fill="rgba(0,0,0,0.03)" stroke="#1c1917" strokeWidth="0.6" />
            <text x="120" y="103" fill="#44403c" className="font-mono text-[7px]">OWNER SALOON</text>

            {/* Crew quarters / Forepeak */}
            <text x="45" y="103" fill="#78716c" className="font-mono text-[6.5px]">FOREPEAK</text>
            
            {/* Dimension Lines */}
            <line x1="30" y1="180" x2="370" y2="180" stroke="#78716c" strokeWidth="0.75" />
            <line x1="30" y1="175" x2="30" y2="185" stroke="#78716c" strokeWidth="0.75" />
            <line x1="370" y1="175" x2="370" y2="185" stroke="#78716c" strokeWidth="0.75" />
            <text x="180" y="192" fill="#1c1917" className="font-mono text-[8px] font-bold">LOA = 54.80 M // BEAM = 9.60 M</text>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">CLASS: DNV ✠ 1A1 PASSENGER SHIP</div>
        </div>
      );

    case "cad_modelling":
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 04.1 // ISOMETRIC NURBS SURFACE TOPOLOGY</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            {/* Wireframe Hull Isometric Mesh */}
            <g transform="translate(40, 20)">
              {/* Primary Isometric Wireframe lines */}
              <path d="M 40 110 L 160 40 L 320 70 L 200 140 Z" stroke="#1c1917" strokeWidth="1.2" fill="rgba(255,80,0,0.02)" />
              <path d="M 40 110 L 60 135 L 210 155 L 200 140" stroke="#ff5000" strokeWidth="1.2" />
              <path d="M 210 155 L 330 85 L 320 70" stroke="#ff5000" strokeWidth="1.2" />
              
              {/* Superstructure decks */}
              <path d="M 120 75 L 180 45 L 260 60 L 200 90 Z" stroke="#ff5000" strokeWidth="1.5" fill="rgba(255,80,0,0.08)" />
              <path d="M 145 60 L 185 40 L 235 50 L 195 70 Z" stroke="#1c1917" strokeWidth="1" fill="rgba(0,0,0,0.03)" />
              
              {/* Spline control vertices */}
              <circle cx="120" cy="75" r="2.5" fill="#ff5000" />
              <circle cx="180" cy="45" r="2.5" fill="#ff5000" />
              <circle cx="260" cy="60" r="2.5" fill="#ff5000" />
              <circle cx="200" cy="90" r="2.5" fill="#ff5000" />
              <circle cx="40" cy="110" r="3" fill="#1c1917" />
              
              {/* Grid ribs overlay */}
              <line x1="80" y1="88" x2="100" y2="144" stroke="#ff5000" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="140" y1="75" x2="160" y2="149" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="220" y1="80" x2="240" y2="135" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="280" y1="75" x2="295" y2="105" stroke="#1c1917" strokeWidth="0.5" strokeDasharray="2 2" />
            </g>
            <text x="30" y="185" fill="#ff5000" className="font-mono text-[8px] font-bold">1:1 DIGITAL TWIN // ZERO SURFACE CLASHES</text>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">RHINOCEROS / ALIAS NURBS CLASS-A</div>
        </div>
      );

    case "structural_analysis":
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 05.1 // FEA VON MISES STRESS CONTOURS (MPa)</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            {/* Stress gradient bar */}
            <g transform="translate(320, 45)">
              <rect x="0" y="0" width="12" height="100" rx="2" fill="url(#fea-gradient)" stroke="#1c1917" strokeWidth="0.5" />
              <text x="18" y="10" fill="#ea580c" className="font-mono text-[7px] font-bold">285 MPa (MAX)</text>
              <text x="18" y="55" fill="#f59e0b" className="font-mono text-[7px]">140 MPa</text>
              <text x="18" y="100" fill="#0284c7" className="font-mono text-[7px]">15 MPa (MIN)</text>
            </g>
            <defs>
              <linearGradient id="fea-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* FEA Mesh Elements with simulated high stress at keelson & midship bulkhead */}
            <g transform="translate(30, 30)">
              {/* Hull section FEA mesh */}
              <polygon points="20,110 80,105 140,110 140,140 80,145 20,140" fill="#0284c7" fillOpacity="0.3" stroke="#1c1917" strokeWidth="0.6" />
              <polygon points="80,105 140,110 200,105 200,140 140,140 80,145" fill="#10b981" fillOpacity="0.3" stroke="#1c1917" strokeWidth="0.6" />
              <polygon points="140,110 200,105 260,110 260,140 200,140 140,140" fill="#ea580c" fillOpacity="0.4" stroke="#ff5000" strokeWidth="1" />
              
              {/* Load Vectors */}
              <g stroke="#ff5000" strokeWidth="1.2">
                <line x1="200" y1="70" x2="200" y2="95" markerEnd="url(#arrow)" />
                <line x1="170" y1="75" x2="170" y2="95" />
                <line x1="230" y1="75" x2="230" y2="95" />
              </g>
              <text x="145" y="65" fill="#ff5000" className="font-mono text-[7.5px] font-bold">WAVE SLAMMING LOAD (Fz)</text>
              <text x="30" y="160" fill="#1c1917" className="font-mono text-[7.5px]">SAFETY FACTOR: η = 2.45 // YIELD CRITERIA SATISFIED</text>
            </g>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">ANSYS / NASTRAN FEM SOLVER</div>
        </div>
      );

    case "final_renderings":
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 06.1 // PHOTOREALISTIC LIGHT RAY TRACE & PBR TEXTURE STACK</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            {/* Cinematic Camera Cone */}
            <path d="M 40 100 L 140 40 L 140 160 Z" fill="rgba(255,80,0,0.04)" stroke="#ff5000" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="40" cy="100" r="4" fill="#ff5000" />
            <text x="25" y="118" fill="#ff5000" className="font-mono text-[7.5px] font-bold">8K CAMERA</text>

            {/* Vessel Silhouette */}
            <path d="M 160 120 C 180 80, 240 70, 350 75 L 360 140 C 240 145, 180 140, 160 120 Z" fill="#1c1917" stroke="#1c1917" strokeWidth="1.2" />
            <path d="M 210 75 L 250 50 L 300 55 L 280 75 Z" fill="#ff5000" fillOpacity="0.2" stroke="#ff5000" strokeWidth="1" />

            {/* Ray tracing lines */}
            <line x1="300" y1="20" x2="250" y2="50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="320" y1="20" x2="300" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="310" cy="15" r="5" fill="#f59e0b" />
            <text x="325" y="20" fill="#d97706" className="font-mono text-[7px] font-bold">SUN RADIANCE // HDRI SKY</text>
            
            <text x="160" y="165" fill="#1c1917" className="font-mono text-[7.5px]">TEAK GRAIN PBR // SUB-SURFACE SCATTERING 8K</text>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">UNREAL 5.4 / V-RAY RAYTRACED</div>
        </div>
      );

    default: // overview or academic
      return (
        <div className={`relative w-full aspect-[16/9] bg-white border border-stone-200 rounded-lg p-4 overflow-hidden shadow-xs ${className}`}>
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">FIG 01.1 // NAVAL ARCHITECTURE INTEGRATED SUITE</span>
          </div>
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            {/* Concentric Design Cycles */}
            <circle cx="200" cy="100" r="70" stroke="#1c1917" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="200" cy="100" r="45" stroke="#ff5000" strokeWidth="1.2" />
            <circle cx="200" cy="100" r="20" fill="rgba(255,80,0,0.06)" stroke="#ff5000" strokeWidth="1.5" />
            
            <text x="175" y="103" fill="#ff5000" className="font-mono text-[8px] font-bold">MATSYARK</text>
            <text x="155" y="112" fill="#78716c" className="font-mono text-[6.5px]">CORE GEOMETRY</text>

            {/* Orbiting nodal capabilities */}
            <circle cx="200" cy="30" r="4" fill="#1c1917" />
            <text x="175" y="22" fill="#1c1917" className="font-mono text-[7px] font-bold">HYDRODYNAMICS</text>

            <circle cx="270" cy="100" r="4" fill="#ff5000" />
            <text x="280" y="103" fill="#ff5000" className="font-mono text-[7px] font-bold">FEA & CFD</text>

            <circle cx="200" cy="170" r="4" fill="#1c1917" />
            <text x="170" y="185" fill="#1c1917" className="font-mono text-[7px] font-bold">2D PRODUCTION GA</text>

            <circle cx="130" cy="100" r="4" fill="#1c1917" />
            <text x="65" y="103" fill="#1c1917" className="font-mono text-[7px] font-bold">CLASS-A NURBS</text>
          </svg>
          <div className="absolute bottom-2 right-3 font-mono text-[8px] text-stone-400">LLOYD'S / ABS / DNV GL VALIDATED</div>
        </div>
      );
  }
}
