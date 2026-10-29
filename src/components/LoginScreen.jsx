import React from 'react';

export const STAFF_ROLES = [
  { id: 'educador', label: 'Educador/a', badge: 'EDU', color: 'bg-blue-600', desc: 'Equipo Educativo' },
  { id: 'ate', label: 'ATE', badge: 'ATE', color: 'bg-emerald-600', desc: 'Auxiliar Técnico Educativo' },
  { id: 'mediador', label: 'Mediador/a', badge: 'MED', color: 'bg-purple-600', desc: 'Mediación Social e Intercultural' }
];

export function LoginScreen({ currentUser, setCurrentUser, onLogin }) {
  return (
    <div className="flex-1 flex flex-col justify-between p-5">
      <div>
        <div className="text-center pt-8 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black tracking-wider text-white text-xl mx-auto shadow-lg shadow-blue-600/30 border border-blue-400/40 mb-3">
            KD
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">KODIME</h1>
          <p className="text-xs text-slate-400 mt-1">Control Residencial y Gestión de Menores</p>
        </div>

        <form onSubmit={onLogin} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              1. Selecciona tu perfil profesional:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STAFF_ROLES.map((r) => {
                const isSelected = currentUser.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setCurrentUser(prev => ({ ...prev, role: r.id }))}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase block opacity-80">{r.badge}</span>
                    <span className="text-xs font-bold block mt-0.5">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              2. Nombre del profesional en turno:
            </label>
            <input
              type="text"
              required
              value={currentUser.name}
              onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Laura Sánchez, Carlos Ruiz..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-sm px-3.5 py-2.5 rounded-xl outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase">Perfiles rápidos demo:</span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { role: 'educador', name: 'Laura Sánchez' },
                { role: 'ate', name: 'Carlos Ruiz' },
                { role: 'mediador', name: 'Youssef Alami' }
              ].map((demoUser, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentUser(demoUser)}
                  className="text-[10px] px-2 py-1 bg-slate-950 text-slate-300 rounded border border-slate-800 hover:border-blue-500/60"
                >
                  {demoUser.name} ({demoUser.role.toUpperCase()})
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 mt-2"
          >
            Iniciar Turno ➔
          </button>
        </form>
      </div>

      <div className="text-center py-4 text-[11px] text-slate-500">
        Sistema seguro para centros residenciales · Versión Demo
      </div>
    </div>
  );
}
