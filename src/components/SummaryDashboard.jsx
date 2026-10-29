import React, { useState } from 'react';
import { MODES } from '../data/mockMinors';

export function SummaryDashboard({
  minors,
  activeRecords,
  currentMode,
  onToggleMinor,
  onResetSession,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryFilter, setSummaryFilter] = useState('all'); // 'all' | 'passed' | 'pending' | 'allergies'

  const registeredCount = Object.keys(activeRecords).length;
  const totalCount = minors.length;
  const pendingCount = totalCount - registeredCount;

  const filteredMinors = minors.filter((m) => {
    const isReg = !!activeRecords[m.id];
    if (summaryFilter === 'passed' && !isReg) return false;
    if (summaryFilter === 'pending' && isReg) return false;
    if (summaryFilter === 'allergies' && !m.medical) return false;

    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.zone.toLowerCase().includes(q) ||
      (m.medical && m.medical.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col space-y-3">
      {/* 3 KPIS INTERACTIVOS: AL CLICAR FILTRAN DIRECTAMENTE */}
      <div className="grid grid-cols-3 gap-2">
        {/* KPI: TOTAL */}
        <button
          type="button"
          onClick={() => setSummaryFilter('all')}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            summaryFilter === 'all'
              ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
          <p className="text-lg font-black text-white font-mono mt-0.5">{totalCount}</p>
          <span className="text-[9px] text-slate-500 block">Ver todos</span>
        </button>

        {/* KPI: PASADOS / FICHADOS */}
        <button
          type="button"
          onClick={() => setSummaryFilter('passed')}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            summaryFilter === 'passed'
              ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Fichados</span>
          <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">{registeredCount}</p>
          <span className="text-[9px] text-emerald-300/70 block">Solo pasados</span>
        </button>

        {/* KPI: PENDIENTES */}
        <button
          type="button"
          onClick={() => setSummaryFilter('pending')}
          className={`p-2.5 rounded-xl border text-center transition-all ${
            summaryFilter === 'pending'
              ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-rose-400 block">Pendientes</span>
          <p className="text-lg font-black text-rose-400 font-mono mt-0.5">{pendingCount}</p>
          <span className="text-[9px] text-rose-300/70 block">Faltan</span>
        </button>
      </div>

      {/* FILTROS ADICIONALES Y BUSCADOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, habitación o alergia..."
            className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Filtro activo:</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setSummaryFilter('allergies')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                summaryFilter === 'allergies'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-amber-300 border-amber-500/30'
              }`}
            >
              Dietas / Alergias
            </button>
          </div>
        </div>
      </div>

      {/* LISTADO DE RESIDENTES FILTRADO */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 max-h-[50vh]">
        {filteredMinors.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <p className="text-xs">No se encontraron residentes con este filtro.</p>
          </div>
        ) : (
          filteredMinors.map((kid) => {
            const record = activeRecords[kid.id];
            const isReg = !!record;

            return (
              <div
                key={kid.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  isReg
                    ? 'bg-slate-900/80 border-emerald-500/40'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <div className="w-8 h-8 rounded bg-slate-800 text-slate-200 flex-shrink-0 flex items-center justify-center font-mono font-bold text-[11px] border border-slate-700">
                      {kid.initials}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-800 px-1 py-0.2 rounded">
                          {kid.id}
                        </span>
                        <h4 className="font-bold text-xs text-white truncate">
                          {kid.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {kid.zone} · Mon: {kid.monitor}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleMinor(kid.id)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex-shrink-0 ${
                      isReg
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isReg ? '✓ Fichado' : '+ Fichar'}
                  </button>
                </div>

                {kid.medical && (
                  <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center space-x-1 text-[10px] font-semibold text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                    <span className="truncate">{kid.medical.title}</span>
                  </div>
                )}

                {isReg && record.timestamp && (
                  <div className="mt-1 text-[9px] font-mono text-emerald-400/80 text-right">
                    Registrado a las {record.timestamp}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ACCIONES DE CIERRE Y REINICIO */}
      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onResetSession}
          className="flex-1 py-2 px-3 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold border border-rose-800/40 transition-colors"
        >
          Reiniciar {MODES.find((m) => m.id === currentMode)?.label}
        </button>

        <button
          type="button"
          onClick={() => {
            alert(
              `Informe del turno ${MODES.find((m) => m.id === currentMode)?.label}:\n` +
              `Registrados: ${registeredCount}\n` +
              `Pendientes: ${pendingCount}\n` +
              `Total: ${totalCount}`
            );
          }}
          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
        >
          Exportar
        </button>
      </div>
    </div>
  );
}
