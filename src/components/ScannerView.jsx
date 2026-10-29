import React, { useState, useRef } from 'react';
import { FeedbackCard } from './FeedbackCard';

export function ScannerView({
  activeRecords,
  currentMode,
  feedback,
  setFeedback,
  onScan,
}) {
  const [inputCode, setInputCode] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    onScan(inputCode);
    setInputCode('');
  };

  const handleDemoTap = (id) => {
    onScan(id);
    // IMPORTANTE: NO llamamos a inputRef.current.focus() para evitar que salte el teclado en el móvil
  };

  return (
    <div className="flex-1 flex flex-col space-y-3">
      {/* SCANNER INPUT FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Lector de Pulsera o Identificador
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Pistola HID / Teclado</span>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Pasa la pulsera o pulsa un menor abajo..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white font-mono text-sm px-3.5 py-3 rounded-lg outline-none placeholder:text-slate-500 transition-all pr-24"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
          />

          {inputCode && (
            <button
              type="button"
              onClick={() => setInputCode('')}
              className="absolute right-20 top-2.5 text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-3 rounded-md transition-colors"
          >
            Validar
          </button>
        </form>

        {/* QUICK TEST CHIPS */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">
              Prueba rápida táctil:
            </span>
            <span className="text-[10px] text-slate-500">Toca para registrar</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoTap('ID-001')}
              className="p-2 rounded-lg bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-left transition-all active:scale-95"
            >
              <div className="text-[10px] font-mono font-bold text-amber-400">ID-001 (Celíaco)</div>
              <div className="text-xs font-semibold text-slate-200 truncate">Juan Pérez</div>
              <div className="text-[9px] text-amber-300 font-mono mt-0.5">Sin gluten</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoTap('ID-002')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-700/80 hover:border-slate-500 text-left transition-all active:scale-95"
            >
              <div className="text-[10px] font-mono font-bold text-slate-400">ID-002 (Ordinario)</div>
              <div className="text-xs font-semibold text-slate-200 truncate">Sofía Gómez</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Estándar</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoTap('ID-004')}
              className="p-2 rounded-lg bg-slate-950 border border-rose-500/40 hover:border-rose-400 text-left transition-all active:scale-95"
            >
              <div className="text-[10px] font-mono font-bold text-rose-400">ID-004 (Crítico)</div>
              <div className="text-xs font-semibold text-slate-200 truncate">Lucas Silva</div>
              <div className="text-[9px] text-rose-300 font-mono mt-0.5">Frutos secos</div>
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK O ESTADO DE ESPERA */}
      {feedback ? (
        <FeedbackCard
          feedback={feedback}
          currentMode={currentMode}
          onDismiss={() => setFeedback(null)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-300 font-mono text-sm mb-2.5">
            RF
          </div>
          <h3 className="text-sm font-semibold text-slate-200">
            Dispositivo listo para lectura
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Acerca el lector a la pulsera del residente o usa los accesos de prueba táctil de arriba.
          </p>
        </div>
      )}
    </div>
  );
}
