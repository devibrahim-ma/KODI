import React from 'react';
import { MODES } from '../data/mockMinors';

export function Header({
  currentMode,
  onModeChange,
  registeredCount,
  totalCount,
  currentTimeStr,
}) {
  const percentage = Math.round((registeredCount / totalCount) * 100) || 0;

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 pt-3 pb-3 shadow-lg">
      {/* Top row: Brand + Live Clock */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-white font-extrabold text-sm tracking-wider">KD</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
              CampCheck <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">KODI</span>
            </h1>
            <p className="text-[11px] text-slate-400">Kontrol Dinámico Infantil</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {currentTimeStr || '12:00:00'}
          </div>
        </div>
      </div>

      {/* MODES SWITCHER TABS */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
        {MODES.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-slate-800 to-slate-800/90 text-white shadow-md border border-slate-700/80 ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span className="text-sm">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* REALTIME METRICS COUNTER BAR */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-slate-400">Registrados:</span>
          <span className="text-lg font-black text-emerald-400 tracking-tight">
            {registeredCount}
            <span className="text-xs text-slate-400 font-normal ml-1">/ {totalCount}</span>
          </span>
        </div>

        {/* Progress bar pill */}
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-[11px] font-bold text-slate-300 font-mono">{percentage}%</span>
        </div>
      </div>
    </header>
  );
}
