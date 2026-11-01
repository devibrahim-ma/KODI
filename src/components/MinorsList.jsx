import React, { useState } from 'react';

export function MinorsList({
  minors,
  onNavigateAdd,
  onDeleteMinor,
  onBack,
  onClearTestData,
  onLoadTestData,
  isOnline
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = minors.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.id && m.id.toLowerCase().includes(q)) ||
      (m.wristband && m.wristband.toLowerCase().includes(q)) ||
      (m.zone && m.zone.toLowerCase().includes(q))
    );
  });

  const handleDeleteClick = (minor) => {
    if (confirm(`¿Eliminar a "${minor.name}" de la base de datos?\nEsta acción no se puede deshacer.`)) {
      onDeleteMinor(minor.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3.5 py-3 shadow-md flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800"
        >
          ← Panel
        </button>
        <div className="text-center">
          <h2 className="font-extrabold text-sm text-white">Listado de Menores</h2>
          <span className="text-[10px] text-slate-400">
            {minors.length} {minors.length === 1 ? 'residente' : 'residentes'}
          </span>
        </div>
        <button
          type="button"
          onClick={onNavigateAdd}
          className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 active:scale-95 transition-all"
        >
          + Añadir
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3.5 py-3 overflow-y-auto space-y-3 pb-24">
        {/* Buscador en tiempo real */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o pulsera..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-white text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder:text-slate-500 pr-10 shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs p-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Barra de estado offline/online y acciones rápidas */}
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isOnline ? 'Base de datos sincronizada' : 'Modo Offline (Guardado local)'}</span>
          </div>
          {minors.length > 0 && onClearTestData && (
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Vaciar la lista para empezar con datos reales de cero?')) {
                  onClearTestData();
                }
              }}
              className="text-[10px] text-slate-500 hover:text-rose-400 underline"
            >
              Vaciar lista
            </button>
          )}
        </div>

        {/* Listado */}
        {minors.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-2xl mx-auto text-slate-400">
              👥
            </div>
            <h3 className="text-sm font-bold text-white">Sin menores registrados</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Empieza a añadir los datos reales de los menores con su fotografía desde la cámara o galería.
            </p>
            <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
              <button
                type="button"
                onClick={onNavigateAdd}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                + Añadir Primer Menor
              </button>
              {onLoadTestData && (
                <button
                  type="button"
                  onClick={onLoadTestData}
                  className="text-xs text-slate-500 hover:text-slate-300 py-1"
                >
                  Cargar datos demo de ejemplo
                </button>
              )}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-900/40 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">No se encontró ningún menor con "{searchTerm}".</p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-2 text-xs text-blue-400 hover:underline"
            >
              Borrar filtro
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((minor) => (
              <div
                key={minor.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 shadow-sm"
              >
                {/* Foto / Iniciales */}
                <div className="flex-shrink-0">
                  {minor.photo ? (
                    <img
                      src={minor.photo}
                      alt={minor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                      {minor.initials || 'KD'}
                    </div>
                  )}
                </div>

                {/* Info básica */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-white truncate">{minor.name}</h3>
                    {minor.age && (
                      <span className="text-[10px] text-slate-400">({minor.age} a)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 truncate">
                    <span className="font-mono text-slate-300 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 text-[10px]">
                      {minor.wristband || minor.id}
                    </span>
                    <span>·</span>
                    <span className="truncate">{minor.zone || 'Sin habitación'}</span>
                  </div>

                  {minor.medical && minor.medical.hasAlert && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate max-w-full">
                        ⚠️ {minor.medical.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón Eliminar */}
                <button
                  type="button"
                  onClick={() => handleDeleteClick(minor)}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/60 transition-colors flex-shrink-0"
                  title="Eliminar menor"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

