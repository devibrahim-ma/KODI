import React, { useState, useRef, useEffect } from 'react';
import { Zap, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { FeedbackCard } from './FeedbackCard';
import { MODES } from '../data/mockMinors';

export function ScannerView({
  minors,
  activeRecords,
  currentMode,
  feedback,
  setFeedback,
  onScan,
}) {
  const [inputCode, setInputCode] = useState('');
  const [autoFocusEnabled, setAutoFocusEnabled] = useState(true);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const inputRef = useRef(null);

  // Auto focus management for Bluetooth barcode scanner
  useEffect(() => {
    if (autoFocusEnabled && !feedback) {
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [autoFocusEnabled, feedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    onScan(inputCode);
    setInputCode('');
  };

  const handleDemoTap = (id) => {
    onScan(id);
  };

  return (
    <div className="flex-1 flex flex-col space-y-3">
      {/* SCANNER INPUT FORM */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Lector / Entrada Rápida
          </label>
          <button
            onClick={() => setAutoFocusEnabled(!autoFocusEnabled)}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border transition-colors ${
              autoFocusEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoFocusEnabled ? '● Auto-foco ON (Pistola)' : '○ Foco Manual'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Escanear pulsera o teclear ID..."
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white font-mono text-base px-4 py-3.5 rounded-xl outline-none placeholder:text-slate-500 transition-all tracking-wide"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
            />

            {inputCode && (
              <button
                type="button"
                onClick={() => setInputCode('')}
                className="absolute right-24 text-slate-400 hover:text-white p-1 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Escanear</span>
              <span>➔</span>
            </button>
          </div>
        </form>

        {/* QUICK DEMO KIDS SELECTOR */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Menores de prueba para demo táctil:
            </span>
            <button
              type="button"
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 py-0.5 px-2 rounded bg-slate-800/80 flex items-center gap-0.5"
            >
              <span>{showDemoSelector ? 'Ocultar' : 'Ver todos (15)'}</span>
              {showDemoSelector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Quick tap chips (3 high-impact samples: Celiac, Standard, Severe allergy) */}
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => handleDemoTap('ID-001')}
              className="p-2 rounded-xl bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 text-left transition-all active:scale-95 group"
            >
              <div className="text-[10px] font-mono font-bold text-amber-400 truncate">ID-001 (🌾 Celíaco)</div>
              <div className="text-xs font-bold text-slate-200 truncate">Juan Pérez</div>
              <div className="text-[9px] text-slate-400 mt-0.5">🌾 Sin gluten</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoTap('ID-002')}
              className="p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 hover:border-slate-500 text-left transition-all active:scale-95"
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 truncate">ID-002 (Sin Alergia)</div>
              <div className="text-xs font-bold text-slate-200 truncate">Sofía Gómez</div>
              <div className="text-[9px] text-emerald-400 mt-0.5">✓ Menú estándar</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoTap('ID-004')}
              className="p-2 rounded-xl bg-slate-950/90 border border-rose-500/40 hover:border-rose-400 text-left transition-all active:scale-95"
            >
              <div className="text-[10px] font-mono font-bold text-rose-400 truncate">ID-004 (🥜 Crítico)</div>
              <div className="text-xs font-bold text-slate-200 truncate">Lucas Silva</div>
              <div className="text-[9px] text-rose-400 mt-0.5">⚠️ EpiPen</div>
            </button>
          </div>

          {/* Extended list when expanded */}
          {showDemoSelector && (
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1 pr-1 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              {minors.map((kid) => {
                const isAlready = !!activeRecords[kid.id];
                return (
                  <button
                    key={kid.id}
                    type="button"
                    onClick={() => handleDemoTap(kid.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      isAlready
                        ? 'bg-slate-900/40 text-slate-500 hover:bg-slate-800'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span>{kid.avatar}</span>
                      <div className="truncate">
                        <span className="font-mono font-bold text-blue-300 text-[11px] mr-1.5">{kid.id}</span>
                        <span className="font-semibold">{kid.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {kid.medical && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {kid.medical.title.split(' ')[0]}
                        </span>
                      )}
                      {isAlready ? (
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Fichado</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Tocar ➔</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC FEEDBACK OR IDLE WAITING STATE */}
      {feedback ? (
        <FeedbackCard
          feedback={feedback}
          currentMode={currentMode}
          onDismiss={() => {
            setFeedback(null);
            if (inputRef.current) inputRef.current.focus();
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {MODES.find((m) => m.id === currentMode)?.icon || '📡'}
          </div>
          <h3 className="text-base font-bold text-slate-200">
            Esperando Lectura de Pulsera
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Apunta la pistola lectora Bluetooth a la pulsera del menor o pulsa directamente en uno de los menores de prueba.
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Modo activo: <strong className="text-white uppercase">{currentMode}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
