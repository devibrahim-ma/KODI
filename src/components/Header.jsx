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
  const currentModeObj = MODES.find((m) => m.id === currentMode);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3.5 pt-3 pb-2.5 shadow-sm">
      {/* Brand & live clock */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-wider text-white text-xs border border-blue-400/30 shadow-sm">
            KD
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">KODI</span>
              <span className="text-[10px] font-mono uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">v1.2</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Control Residencial de Accesos</p>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {currentTimeStr || '12:00:00'}
          </div>
        </div>
      </div>

      {/* 6 Modes horizontal switcher */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
        {MODES.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* KPI info row */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Turno:</span>
          <span className="font-bold text-slate-200 uppercase">{currentModeObj?.label}</span>
          <span className="text-[11px] text-slate-500 font-mono">({currentModeObj?.schedule})</span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
          <span className="text-emerald-400 font-bold">{registeredCount}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{totalCount}</span>
          <span className="text-slate-500">({percentage}%)</span>
        </div>
      </div>
    </header>
  );
}
