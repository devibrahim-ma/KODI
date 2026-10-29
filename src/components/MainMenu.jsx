import React from 'react';
import { STAFF_ROLES } from './LoginScreen';
import { MODES } from '../data/mockMinors';

export function MainMenu({
  currentUser,
  currentMode,
  registeredCount,
  totalCount,
  currentTimeStr,
  onNavigate,
  onLogout
}) {
  return (
    <div className="flex-1 flex flex-col justify-between p-4">
      <div>
        {/* Cabecera del Menú */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs border border-blue-400/30">
                KD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm text-white">KODIME</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">v1.2</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Operador: <strong className="text-slate-200">{currentUser.name}</strong> ({STAFF_ROLES.find(r => r.id === currentUser.role)?.label})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 bg-slate-950 rounded border border-slate-800"
            >
              Salir
            </button>
          </div>
        </header>

        <div className="mb-3 px-1">
          <h2 className="text-base font-black text-white">Panel de Gestión</h2>
          <p className="text-xs text-slate-400">Selecciona el módulo para iniciar la operativa:</p>
        </div>

        {/* 2 GRANDES APARTADOS */}
        <div className="grid grid-cols-1 gap-3.5">
          
          {/* BOTÓN 1: RECUENTO */}
          <button
            type="button"
            onClick={() => onNavigate('recount')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border-2 border-blue-500/50 hover:border-blue-400 text-left transition-all active:scale-98 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                📋
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {registeredCount} / {totalCount} Fichados
              </span>
            </div>

            <div className="mt-3 relative z-10">
              <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                Recuento y Control de Accesos
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                Control por turnos (comidas, meriendas, móviles) con pistola lectora o selección táctil.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span>Turno activo: <strong className="text-slate-200 uppercase">{MODES.find(m => m.id === currentMode)?.label}</strong></span>
              <span className="text-blue-400 font-bold">Abrir recuento ➔</span>
            </div>
          </button>

          {/* BOTÓN 2: AÑADIR MENOR */}
          <button
            type="button"
            onClick={() => onNavigate('add_minor')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 hover:border-emerald-500/60 text-left transition-all active:scale-98 shadow-xl relative overflow-hidden group"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                ➕
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Alta Rápida
              </span>
            </div>

            <div className="mt-3 relative z-10">
              <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                Añadir Nuevo Menor
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                Formulario de filiación completa: progenitores, lugar y fecha de nacimiento, procedencia y asignación de pulsera.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span>Asignación automática de pulsera nominal</span>
              <span className="text-emerald-400 font-bold">Nuevo registro ➔</span>
            </div>
          </button>

        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center justify-between">
        <span>Total residentes dados de alta: <strong className="text-white font-mono">{totalCount}</strong></span>
        <span className="font-mono text-emerald-400">{currentTimeStr}</span>
      </div>
    </div>
  );
}
