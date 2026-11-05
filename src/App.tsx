import React, { useState, useEffect, useRef } from 'react';
import { VEHICLE_CATALOG, VehicleAsset } from './data/vehicles';
import {
  compositeBatchVehicles,
  CompositeItemResult,
  downloadAllFourDirectly,
  downloadSingleImage,
} from './utils/plateCompositor';
import {
  Car,
  Truck,
  Sparkles,
  Download,
  Images,
  CheckCircle2,
  Layers,
  ZoomIn,
  ShieldCheck,
  RefreshCw,
  X,
  FileImage,
} from 'lucide-react';

export default function App() {
  // 1. Vehicle category: 'car' (Daihatsu Gran Max) or 'truck' (Isuzu Elf Boks)
  const [category, setCategory] = useState<'car' | 'truck'>('car');

  // 2. License plate text input: default to "M 4 M" as mentioned in user prompt
  const [plateInput, setPlateInput] = useState('M 4 M');
  const [plateExp, setPlateExp] = useState('04·28');

  // 3. Batch generated results for the 4 reference photos of active category
  const [results, setResults] = useState<CompositeItemResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4. Modal for inspecting a specific photo in detail (Before & After Slider)
  const [inspectItem, setInspectItem] = useState<CompositeItemResult | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter 4 reference vehicles for the active category
  const activeVehicles = VEHICLE_CATALOG.filter((v) => v.category === category);

  // Generate all 4 images whenever category, plateInput, or plateExp changes
  const runBatchGeneration = async (
    targetCat: 'car' | 'truck' = category,
    targetPlate: string = plateInput,
    targetExp: string = plateExp
  ) => {
    if (!targetPlate.trim()) {
      setErrorMessage('Silakan masukkan nomor plat terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const vehicles = VEHICLE_CATALOG.filter((v) => v.category === targetCat);
      const batchOutput = await compositeBatchVehicles(
        vehicles,
        targetPlate.trim(),
        targetExp.trim()
      );
      setResults(batchOutput);

      // If inspect modal is open, sync the inspected item
      if (inspectItem) {
        const updated = batchOutput.find((item) => item.vehicle.id === inspectItem.vehicle.id);
        if (updated) setInspectItem(updated);
      }
    } catch (err: any) {
      console.error('Batch generation error:', err);
      setErrorMessage(err?.message || 'Gagal memproses gambar referensi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial load: generate 4 Gran Max photos with plate "M 4 M"
  useEffect(() => {
    runBatchGeneration(category, plateInput, plateExp);
  }, [category]);

  // Handle category switch
  const handleSelectCategory = (newCat: 'car' | 'truck') => {
    setCategory(newCat);
  };

  // Handle form submit / Generate button click
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runBatchGeneration(category, plateInput, plateExp);
  };

  // DIRECT 4-IMAGE DOWNLOAD (NO ZIP! Directly saves {plat nomor}-1.png to 4.png)
  const handleDownloadAllFour = async () => {
    if (results.length === 0) return;
    setIsDownloadingAll(true);
    try {
      await downloadAllFourDirectly(results, plateInput);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Slider Mouse/Touch events for Inspect Modal
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };
    const onUp = () => setIsDraggingSlider(false);

    if (isDraggingSlider) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onTouch);
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingSlider]);

  const cleanDisplayPlate = plateInput.trim() || 'M 4 M';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header */}
      <header className="border-b border-slate-800/80 bg-[#0b1120]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Car className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-mono">
                  Vehicle Plate Editor
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                  Font Korlantas Polri Asli
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Huruf & angka persis standar plat asli. Download langsung 4 foto dengan nama format: <code className="text-cyan-300 font-mono">{cleanDisplayPlate}-1.png</code> s/d <code className="text-cyan-300 font-mono">{cleanDisplayPlate}-4.png</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">100% Foto Referensi Utuh (Bukan Tempelan)</span>
              <span className="sm:hidden">100% Asli</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6 w-full">
        {/* Top Input Control Card */}
        <section className="bg-[#0b1120] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 1. Pilih Jenis Kendaraan */}
              <div className="lg:col-span-5 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Pilih Jenis Kendaraan</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('car')}
                    className={`py-3 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                      category === 'car'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/20'
                        : 'bg-[#11192e] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Car className="h-4 w-4" />
                    <span>Daihatsu Gran Max (4 Foto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCategory('truck')}
                    className={`py-3 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                      category === 'truck'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/20'
                        : 'bg-[#11192e] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Truk Isuzu Elf (4 Foto)</span>
                  </button>
                </div>
              </div>

              {/* 2. Input Plat Nomor */}
              <div className="lg:col-span-4 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  2. Masukkan Nomor Plat Baru
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    placeholder="Contoh: M 4 M"
                    className="w-full bg-[#070b14] border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-lg font-black uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 uppercase">
                    Font Asli Samsat
                  </span>
                </div>
              </div>

              {/* 3. Masa Berlaku & Tombol Update */}
              <div className="lg:col-span-3 flex items-end gap-2">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Masa Berlaku
                  </label>
                  <input
                    type="text"
                    value={plateExp}
                    onChange={(e) => setPlateExp(e.target.value)}
                    placeholder="04·28"
                    className="w-full bg-[#070b14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-sm font-bold text-center focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !plateInput.trim()}
                  className={`py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg h-[46px] shrink-0 ${
                    isProcessing || !plateInput.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.98] border border-cyan-400 font-black'
                  }`}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-slate-950" />
                  )}
                  <span>Terapkan</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}
          </form>
        </section>

        {/* Output Section Header & DIRECT 4-IMAGE DOWNLOAD BUTTON (NO ZIP) */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-mono">
                Hasil 4 Foto Referensi ({category === 'car' ? 'Daihatsu Gran Max' : 'Truk Isuzu Elf'})
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                Plat: {cleanDisplayPlate}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Format file otomatis saat download: <span className="text-cyan-300">{cleanDisplayPlate}-1.png</span>, <span className="text-cyan-300">{cleanDisplayPlate}-2.png</span>, <span className="text-cyan-300">{cleanDisplayPlate}-3.png</span>, <span className="text-cyan-300">{cleanDisplayPlate}-4.png</span>
            </p>
          </div>

          {/* DIRECT DOWNLOAD ALL 4 IMAGES BUTTON (NO ZIP) */}
          <button
            onClick={handleDownloadAllFour}
            disabled={results.length === 0 || isProcessing || isDownloadingAll}
            className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-xl ${
              results.length === 0 || isProcessing || isDownloadingAll
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-98 border border-emerald-400 ring-2 ring-emerald-400/20'
            }`}
          >
            {isDownloadingAll ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>Mengunduh 4 Foto...</span>
              </>
            ) : (
              <>
                <Images className="h-4 w-4" />
                <span>Download Langsung 4 Gambar ({cleanDisplayPlate}-1 s/d 4)</span>
              </>
            )}
          </button>
        </section>

        {/* The 4 Reference Photographs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {activeVehicles.map((vehicle, idx) => {
            const itemResult = results.find((r) => r.vehicle.id === vehicle.id);
            const expectedFilename = `${cleanDisplayPlate}-${idx + 1}.png`;

            return (
              <div
                key={vehicle.id}
                className="bg-[#0b1120] rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl flex flex-col group hover:border-cyan-500/40 transition-all duration-200"
              >
                {/* Card Top Title Bar */}
                <div className="px-4 py-3 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                        {vehicle.viewTitle}
                      </h3>
                      <p className="text-[10px] text-cyan-400/90 font-mono font-semibold">
                        Nama File: {expectedFilename}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Inspect Before/After button */}
                    <button
                      onClick={() => {
                        if (itemResult) {
                          setInspectItem(itemResult);
                          setSliderPos(50);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors text-xs flex items-center gap-1 font-mono"
                      title="Buka perbandingan Before / After"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-[11px] hidden sm:inline">Bandingkan</span>
                    </button>

                    {/* Download single image: directly {plat nomor}-{index}.png */}
                    {itemResult && (
                      <button
                        onClick={() => downloadSingleImage(itemResult, plateInput, idx + 1)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm font-mono"
                        title={`Download ${expectedFilename}`}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Viewport */}
                <div
                  onClick={() => {
                    if (itemResult) {
                      setInspectItem(itemResult);
                      setSliderPos(50);
                    }
                  }}
                  className="relative h-[320px] sm:h-[380px] bg-[#070b14] flex items-center justify-center p-2 cursor-pointer overflow-hidden group/img"
                >
                  {itemResult ? (
                    <img
                      src={itemResult.dataUrl}
                      alt={vehicle.name}
                      className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover/img:scale-[1.01]"
                    />
                  ) : (
                    <img
                      src={vehicle.filename}
                      alt={vehicle.name}
                      className="max-h-full max-w-full object-contain rounded opacity-60"
                    />
                  )}

                  {/* Active Plate Tag overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>Plat: <b className="text-white font-black">{cleanDisplayPlate}</b></span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{expectedFilename}</span>
                  </div>

                  {/* Click to inspect overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3.5 py-2 rounded-xl bg-slate-900/95 text-cyan-400 border border-cyan-500/50 text-xs font-bold font-mono flex items-center gap-2 backdrop-blur shadow-2xl">
                      <ZoomIn className="h-4 w-4" />
                      <span>Klik Untuk Perbesar & Cek Detail Huruf</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer Telemetry */}
                <div className="px-4 py-2.5 bg-[#090e1a] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>100% Foto Referensi Utuh</span>
                  </span>
                  <span>{expectedFilename}</span>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Inspect / Before-After Comparison Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#0b1120] border border-cyan-500/50 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase font-mono flex items-center gap-2">
                  <span>{inspectItem.vehicle.viewTitle}</span>
                  <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 font-mono">
                    Plat: {cleanDisplayPlate}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Geser garis pembatas di tengah untuk membandingkan bentuk huruf & angka foto referensi asli vs hasil baru.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSingleImage(inspectItem, plateInput, inspectItem.index)}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow font-mono"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download {cleanDisplayPlate}-{inspectItem.index}.png</span>
                </button>
                <button
                  onClick={() => setInspectItem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Slider Viewport */}
            <div className="flex-1 p-4 bg-[#070b14] flex items-center justify-center overflow-hidden">
              <div
                ref={sliderRef}
                onMouseDown={() => setIsDraggingSlider(true)}
                onTouchStart={() => setIsDraggingSlider(true)}
                className="relative w-full h-[450px] sm:h-[540px] flex items-center justify-center cursor-ew-resize select-none overflow-hidden rounded-xl border border-slate-800"
              >
                {/* Edited image (Bottom layer) */}
                <img
                  src={inspectItem.dataUrl}
                  alt="Hasil Edit"
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />

                {/* Original reference photograph (Top clipped layer) */}
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                  }}
                >
                  <img
                    src={inspectItem.vehicle.filename}
                    alt="Foto Asli"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Draggable Divider Bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-2xl">
                    <span className="text-[11px] text-cyan-400 font-bold font-mono">◄►</span>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold text-slate-300 border border-slate-800 pointer-events-none">
                  Foto Asli (Plat: {inspectItem.vehicle.originalPlate})
                </div>
                <div className="absolute top-3 right-3 bg-cyan-950/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold text-cyan-300 border border-cyan-800 pointer-events-none">
                  Hasil Baru ({cleanDisplayPlate}-{inspectItem.index}.png)
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#0d1424] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Detail huruf & angka menggunakan geometri cetakan plat Korlantas Polri</span>
              </span>
              <span>Resolusi: {inspectItem.width} × {inspectItem.height} px</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
