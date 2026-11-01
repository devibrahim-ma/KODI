import React, { useState, useRef } from 'react';
import { FeedbackCard } from './FeedbackCard';

export function ScannerView({
  activeRecords,
  currentMode,
  feedback,
  setFeedback,
  onScan,
  minors = []
}) {
  const [inputCode, setInputCode] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    onScan(inputCode);
    setInputCode('');
  };

  const handleQuickTap = (id) => {
    onScan(id);
  };

  // 3 menores reales para selección rápida táctil
  const quickMinors = minors.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col space-y-3">
      {/* SCANNER INPUT FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Pistola Lectora o Teclado
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Lector activo</span>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Pasa la pulsera o escribe el nombre..."
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
            Fichar
          </button>
        </form>

        {/* ACCESOS RÁPIDOS CON MENORES REALES */}
        {quickMinors.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Fichado rápido táctil:
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              {quickMinors.map((km) => (
                <button
                  key={km.id}
                  type="button"
                  onClick={() => handleQuickTap(km.id)}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 text-left transition-all active:scale-95"
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400">{km.wristband || km.id}</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{km.name}</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">{km.zone}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FEEDBACK O ESTADO DE ESPERA */}
      {feedback ? (
        <FeedbackCard
          feedback={feedback}
          currentMode={currentMode}
          onDismiss={() => setFeedback(null)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-300 font-mono text-sm mb-2">
            RF
          </div>
          <h3 className="text-sm font-semibold text-slate-300">
            Listo para escanear
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pasa la pulsera por el lector o introduce el identificador.
          </p>
        </div>
      )}
    </div>
  );
}
