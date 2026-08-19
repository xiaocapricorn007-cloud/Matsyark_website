import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Compass, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function InquirySection() {
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryCompany, setInquiryCompany] = useState<string>("");
  const [inquiryScope, setInquiryScope] = useState<string>("");
  const [inquiryDiscipline, setInquiryDiscipline] = useState<string>("Linesplan & Hull Optimization");
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryScope.trim()) return;

    setInquiryStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inquiryName,
          company: inquiryCompany,
          discipline: inquiryDiscipline,
          scope: inquiryScope,
          localTimestamp: new Date().toLocaleString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Inquiry transmission error.");
      }

      setInquiryStatus("submitted");
    } catch (error: any) {
      console.error("Inquiry transmission failed:", error);
      setErrorMessage(error.message || "Failed to transmit inquiry to engineering desk.");
      setInquiryStatus("idle");
    }
  };

  const handleReset = () => {
    setInquiryName("");
    setInquiryCompany("");
    setInquiryScope("");
    setInquiryStatus("idle");
    setErrorMessage(null);
  };

  return (
    <section id="inquire" className="relative w-full py-16 sm:py-24 bg-[#faf9f6] border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col gap-3 pb-8 mb-10 border-b-2 border-[#ff5000]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff5000] uppercase tracking-widest font-bold">
            <Mail className="w-4 h-4 text-[#ff5000]" />
            <span>COMMISSION & FEASIBILITY DESK</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191715]">
            Transmit Vessel Specification & Request Feasibility
          </h2>
          <p className="font-serif text-base sm:text-lg text-stone-700 max-w-2xl mt-1">
            Submit your project parameters, preliminary CAD, or academic research requirements directly to Matsyark's principal naval architects.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xs border-2 border-stone-200 border-t-4 border-t-[#ff5000] shadow-md">
            {inquiryStatus === "submitted" ? (
              <div className="py-12 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#fff3eb] text-[#ff5000] flex items-center justify-center border-2 border-[#ff5000] shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ff5000] font-bold">
                    TRANSMISSION SUCCESSFUL
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#191715]">
                    Inquiry Logged into Engineering Desk
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-stone-700 max-w-md mt-2">
                    Thank you, <span className="font-bold text-[#191715]">{inquiryName}</span>. Our naval architectural team will review your specifications and reply within 24 business hours.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 px-7 py-3 bg-[#ff5000] hover:bg-[#e04400] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xs transition-colors cursor-pointer shadow-sm"
                >
                  Submit Another Specification
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2 rounded-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
                      <span>Lead Contact Name</span>
                      <span className="text-[#ff5000]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Capt. Julian Vance"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="px-4 py-3 bg-[#fffaf7] border-2 border-stone-200 focus:border-[#ff5000] focus:bg-white rounded-xs font-sans text-sm text-[#191715] outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800">
                      Shipyard / Studio / University
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oceanco / Riva / Delft Tech"
                      value={inquiryCompany}
                      onChange={(e) => setInquiryCompany(e.target.value)}
                      className="px-4 py-3 bg-[#fffaf7] border-2 border-stone-200 focus:border-[#ff5000] focus:bg-white rounded-xs font-sans text-sm text-[#191715] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800">
                    Primary Maritime Discipline
                  </label>
                  <select
                    value={inquiryDiscipline}
                    onChange={(e) => setInquiryDiscipline(e.target.value)}
                    className="px-4 py-3 bg-[#fffaf7] border-2 border-stone-200 focus:border-[#ff5000] focus:bg-white rounded-xs font-sans text-sm text-[#191715] outline-none transition-all cursor-pointer font-medium"
                  >
                    <option>Linesplan & Hull Form Optimization</option>
                    <option>2D Production Drawings & General Arrangement</option>
                    <option>3D Parametric CAD & Digital Twin Construction</option>
                    <option>FEA Structural Stress & Navier-Stokes CFD Analysis</option>
                    <option>High-Resolution Photorealistic 3D Renderings</option>
                    <option>Comprehensive Stability & Hydrostatics Manuals</option>
                    <option>Academic Capstone & Student Racing Support</option>
                    <option>Shipyard Overflow Drafting & B2B Partnership</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
                    <span>Project Scope & Vessel Specifications</span>
                    <span className="text-[#ff5000]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide LOA, beam, draft target, operational velocity, displacement, classification society (e.g. DNV/Lloyd's/ABS), or required modeling outputs..."
                    value={inquiryScope}
                    onChange={(e) => setInquiryScope(e.target.value)}
                    className="px-4 py-3 bg-[#fffaf7] border-2 border-stone-200 focus:border-[#ff5000] focus:bg-white rounded-xs font-sans text-sm text-[#191715] outline-none transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryStatus === "submitting"}
                  className="w-full py-4 bg-[#ff5000] hover:bg-[#e04400] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-99"
                >
                  {inquiryStatus === "submitting" ? (
                    <span>Transmitting to Engineering Desk...</span>
                  ) : (
                    <>
                      <span>Transmit Official Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Right Column: Protocols & Guarantees (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-white border-2 border-stone-200 rounded-xs flex flex-col overflow-hidden shadow-xs">
              <div className="bg-[#ff5000] text-white px-5 py-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  STUDIO PROTOCOLS & SECURITY
                </span>
              </div>

              <div className="p-6 flex flex-col gap-3 font-sans text-xs text-stone-700 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#ff5000] font-bold text-sm">•</span>
                  <span><strong>Strict Non-Disclosure:</strong> All initial linesplans, sketch geometries, and proprietary specifications are protected under our standardized mutual NDA.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#ff5000] font-bold text-sm">•</span>
                  <span><strong>Class Society Compliance:</strong> All engineering drawings and hydrostatics packets are drafted strictly to Lloyd's Register, ABS, DNV GL, and IMO SOLAS regulations.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#ff5000] font-bold text-sm">•</span>
                  <span><strong>Turnaround Guarantees:</strong> Feasibility reviews and preliminary resistance estimates are generated within 48 to 72 hours of complete geometry receipt.</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#191715] text-[#faf9f6] rounded-xs border-2 border-stone-800 flex flex-col gap-3 relative overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#ff5000]"></div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff5000] font-bold pl-2">
                MATSYARK ENGINEERING DESK
              </span>
              <p className="font-serif text-sm font-semibold pl-2">
                Direct Marine Architectural Desk & Commissioning
              </p>
              <div className="font-mono text-xs text-stone-300 flex flex-col gap-1 pt-1 pl-2">
                <span>CHENNAI, TAMIL NADU, INDIA</span>
                <span>STUDIO HEADQUARTERS // CHENNAI</span>
                <a 
                  href="mailto:matsyarkdesign@gmail.com" 
                  className="text-[#ff5000] font-bold pt-2 hover:underline transition-all block"
                >
                  MATSYARKDESIGN@GMAIL.COM
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
