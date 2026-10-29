import React, { useState } from 'react';

export function AddMinorForm({ onSave, onBack, minorsCount }) {
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    birthPlace: '',
    birthDate: '',
    originCountry: 'España',
    zone: 'Pabellón A · Hab. 106',
    medicalAlert: 'none',
    medicalDetails: ''
  });
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Por favor, indica al menos el nombre y apellidos del menor.');
      return;
    }

    const created = onSave(form);
    setSuccess(created);
    setForm({
      name: '',
      fatherName: '',
      motherName: '',
      birthPlace: '',
      birthDate: '',
      originCountry: 'España',
      zone: 'Pabellón A · Hab. 106',
      medicalAlert: 'none',
      medicalDetails: ''
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3.5 py-3 shadow-sm flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
        >
          ← Menú Principal
        </button>
        <span className="font-bold text-sm text-white">Alta de Residente</span>
        <span className="text-[10px] text-slate-400 font-mono">KODIME</span>
      </header>

      <main className="flex-1 px-3.5 py-3 overflow-y-auto space-y-3.5 pb-20">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 shadow-lg text-center animate-bounce">
            <span className="text-2xl">✓</span>
            <h4 className="font-black text-sm text-white mt-1">¡Menor Registrado con Éxito!</h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              <strong>{success.name}</strong> vinculado con código:
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 font-mono">
              <span className="px-2 py-1 rounded bg-slate-900 text-blue-400 font-bold text-xs border border-blue-500/40">{success.id}</span>
              <span className="px-2 py-1 rounded bg-slate-900 text-emerald-400 font-bold text-xs border border-emerald-500/40">{success.wristband}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Volver al Menú ➔
              </button>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="py-2 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Añadir Otro
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
          {/* Foto de Perfil */}
          <div className="flex items-center space-x-3 p-2 bg-slate-950 rounded-lg border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
              📷
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block">Fotografía del Menor</span>
              <span className="text-[10px] text-slate-400 block">Identificación visual nominal para el expediente</span>
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nombres y Apellidos *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Karim Ben Barek"
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2.5 rounded-lg outline-none"
            />
          </div>

          {/* Nombre Padre y Madre */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Nombre del Padre
              </label>
              <input
                type="text"
                value={form.fatherName}
                onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                placeholder="Nombre completo"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Nombre de la Madre
              </label>
              <input
                type="text"
                value={form.motherName}
                onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                placeholder="Nombre completo"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Lugar y Fecha de Nacimiento */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Lugar de Nacimiento
              </label>
              <input
                type="text"
                value={form.birthPlace}
                onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                placeholder="Ej: Tetuán / Madrid"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* País de Procedencia y Ubicación */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                País de Procedencia
              </label>
              <select
                value={form.originCountry}
                onChange={(e) => setForm({ ...form, originCountry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              >
                <option value="España">España</option>
                <option value="Marruecos">Marruecos</option>
                <option value="Argelia">Argelia</option>
                <option value="Senegal">Senegal</option>
                <option value="Colombia">Colombia</option>
                <option value="Otro">Otro país</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Pabellón / Habitación
              </label>
              <input
                type="text"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                placeholder="Ej: Pabellón A · Hab. 106"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Alergias / Protocolo */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Protocolo Dietético / Médico
            </label>
            <select
              value={form.medicalAlert}
              onChange={(e) => setForm({ ...form, medicalAlert: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2 rounded-lg outline-none mb-1.5"
            >
              <option value="none">Sin restricciones (Menú Ordinario)</option>
              <option value="celiac">🌾 Celíaco (Menú Sin Gluten)</option>
              <option value="halal">🥩 Menú Halal Certificado</option>
              <option value="nuts">🥜 Alergia a Frutos Secos (EpiPen)</option>
              <option value="other">⚠️ Otra patología o alergia</option>
            </select>

            {form.medicalAlert !== 'none' && (
              <input
                type="text"
                value={form.medicalDetails}
                onChange={(e) => setForm({ ...form, medicalDetails: e.target.value })}
                placeholder="Detalles médicos adicionales..."
                className="w-full bg-slate-950 border border-amber-500/50 text-amber-200 text-xs px-3 py-2 rounded-lg outline-none placeholder:text-slate-600"
              />
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 text-[11px] text-blue-200 flex items-center justify-between font-mono">
            <span>ID sugerido: <strong>ID-{String(minorsCount + 1).padStart(3, '0')}</strong></span>
            <span>Pulsera: <strong>Asignación Automática</strong></span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
          >
            Guardar Menor y Asignar Pulsera
          </button>
        </form>
      </main>
    </div>
  );
}
