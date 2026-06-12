import React, { useRef, useState } from "react";
import { Upload, X, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface ModelUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  isCustomLoaded: boolean;
  uploadedFileName: string;
}

export default function ModelUploader({
  isOpen,
  onClose,
  onFileSelected,
  isCustomLoaded,
  uploadedFileName
}: ModelUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".glb")) {
        onFileSelected(file);
      } else {
        alert("Incorrect file type. Please upload a .glb binary format mesh file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".glb")) {
        onFileSelected(file);
      } else {
        alert("Incorrect file type. Please upload a .glb binary format mesh file.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-6 relative rounded-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white/40 transition-all duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-2 pr-8">
          <h3 className="font-serif text-lg md:text-xl text-stone-900 tracking-tight font-medium uppercase">
            Load Digital Twin (.GLB)
          </h3>
          <p className="font-sans text-[11px] text-stone-600 leading-relaxed font-light">
            Inject your professional CAD models directly into the Real-Time rendering pipeline. It will substitute the active hull architecture and adapt to ambient lighting instantly.
          </p>
        </div>

        {/* Drag and Drop Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`w-full py-12 px-6 border border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-350 cursor-pointer select-none rounded-xl ${
            dragActive
              ? "border-stone-900 bg-white/50"
              : "border-stone-350 hover:border-stone-600 hover:bg-white/30"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".glb"
            className="hidden"
          />

          <div className="w-10 h-10 bg-white/40 backdrop-blur-sm flex items-center justify-center text-stone-600 border border-white/60 rounded-full shadow-sm">
            <Upload className="w-4 h-4 text-stone-700" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-stone-800">
              Drag and drop .glb model here
            </span>
            <span className="font-sans text-[9px] text-stone-400 uppercase tracking-widest">
              or click to expand local files
            </span>
          </div>
        </div>

        {/* Active Custom file badge */}
        {isCustomLoaded ? (
          <div className="flex items-center gap-3 p-4 bg-white/40 border border-white/50 text-stone-800 rounded-xl shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-stone-850 shrink-0" />
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-400 font-semibold leading-none">
                ACTIVE CAD ASSET
              </span>
              <span className="font-sans text-[11px] font-medium truncate text-stone-900 pt-1">
                {uploadedFileName}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 p-4 bg-white/30 border border-white/40 text-stone-500 rounded-xl shadow-sm">
            <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[9px] uppercase tracking-wider font-semibold text-stone-700 leading-tight">
                WORKSPACE DESIGN GUIDELINE
              </span>
              <span className="font-sans text-[10px] leading-relaxed text-stone-550">
                To bind this model permanently for all devices, name the asset <code className="bg-stone-200/50 px-1 font-mono text-[9px] rounded-none">ship.glb</code> and write it directly into the public <code className="bg-stone-200/50 px-1 font-mono text-[9px] rounded-none">/assets</code> folder.
              </span>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="border border-white/60 hover:bg-stone-900 hover:text-white hover:border-stone-900 px-6 py-2 text-[9px] uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer font-semibold bg-white/50 rounded-full shadow-sm"
          >
            DISMISS PANEL
          </button>
        </div>
      </motion.div>
    </div>
  );
}
