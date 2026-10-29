import React, { useState } from 'react';
import { Search, X, Check, Plus, Trash2, Download, AlertTriangle } from 'lucide-react';
import { MODES } from '../data/mockMinors';

export function SummaryDashboard({
  minors,
  activeRecords,
  currentMode,
  onToggleMinor,
  onResetSession,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'passed' | 'pending' | 'allergies'

  const registeredCount = Object.keys(activeRecords).length;
  const totalCount = minors.length;

  const filteredMinors = minors.filter((m) => {
    const isRegistered = !!activeRecords[m.id];

    // Filter type check
    if (filterType === 'passed' && !isRegistered) return false;
    if (filterType === 'pending' && isRegistered) return false;
    if (filterType === 'allergies' && !m.medical) return false;

    // Search query check
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.zone.toLowerCase().includes(q) ||
      m.monitor.toLowerCase().includes(q) ||
      (m.medical && m.medical.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col space-y-3">
      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, ID, habitación o alergia..."
            className="w-full bg-slate-950 border border-slate-700 text-sm rounded-xl pl-9 pr-9 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* SUMMARY STATS TILES */}
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          <button
            onClick={() => setFilterType('all')}
            className={`p-2 rounded-xl border text-center transition-all ${
              filterType === 'all'
                ? 'bg-slate-800 border-blue-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold block">Total</span>
            <p className="text-base font-black text-white">{totalCount}</p>
          </button>

          <button
            onClick={() => setFilterType('passed')}
            className={`p-2 rounded-xl border text-center transition-all ${
              filterType === 'passed'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold block">Fichados</span>
            <p className="text-base font-black text-emerald-400">{registeredCount}</p>
          </button>

          <button
            onClick={() => setFilterType('pending')}
            className={`p-2 rounded-xl border text-center transition-all ${
              filterType === 'pending'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold block">Pendientes</span>
            <p className="text-base font-black text-rose-300">{totalCount - registeredCount}</p>
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Filtro:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-full font-medium ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setFilterType('passed')}
            className={`px-2 py-0.5 rounded-full font-medium ${
              filterType === 'passed' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Fichados ({registeredCount})
          </button>
          <button
            onClick={() => setFilterType('pending')}
            className={`px-2 py-0.5 rounded-full font-medium ${
              filterType === 'pending' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Faltan ({totalCount - registeredCount})
          </button>
          <button
            onClick={() => setFilterType('allergies')}
            className={`px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
              filterType === 'allergies' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span>Con Alergias</span>
          </button>
        </div>
      </div>

      {/* LIST OF MINORS */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 max-h-[50vh]">
        {filteredMinors.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800">
            <p className="text-sm">No se encontraron menores con este criterio.</p>
          </div>
        ) : (
          filteredMinors.map((kid) => {
            const record = activeRecords[kid.id];
            const isRegistered = !!record;

            return (
              <div
                key={kid.id}
                className={`p-3 rounded-xl border transition-all ${
                  isRegistered
                    ? 'bg-slate-900/60 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl">{kid.avatar}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          {kid.id}
                        </span>
                        <h4 className="font-bold text-sm text-white">
                          {kid.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {kid.zone} · Mon: {kid.monitor}
                      </p>
                    </div>
                  </div>

                  {/* Status badge & toggle button */}
                  <button
                    onClick={() => onToggleMinor(kid.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 ${
                      isRegistered
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isRegistered ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isRegistered ? 'Fichado' : 'Fichar'}</span>
                  </button>
                </div>

                {/* Allergy badge if any */}
                {kid.medical && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 truncate">
                      {kid.medical.title}
                    </span>
                  </div>
                )}

                {isRegistered && record.timestamp && (
                  <div className="mt-1 text-[10px] font-mono text-emerald-400/90 text-right">
                    Registrado a las {record.timestamp}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* BOTTOM UTILITY ACTIONS */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={onResetSession}
          className="flex-1 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reiniciar {MODES.find((m) => m.id === currentMode)?.label}</span>
        </button>

        <button
          onClick={() => {
            alert(
              `Reporte exportado de ${MODES.find((m) => m.id === currentMode)?.label}:\n` +
              `Total: ${totalCount}\n` +
              `Presentes: ${registeredCount}\n` +
              `Pendientes: ${totalCount - registeredCount}`
            );
          }}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
}
