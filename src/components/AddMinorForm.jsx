import React, { useState, useRef } from 'react';

export function AddMinorForm({ onSave, onBack, minorsCount }) {
  const [form, setForm] = useState({
    name: '',
    photo: '',
    birthDate: '',
    zone: 'Pabellón A · Hab. 101',
    medicalAlert: 'none',
    medicalDetails: '',
    fatherName: '',
    motherName: '',
    birthPlace: '',
    originCountry: 'España'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Compresión de imagen client-side a canvas JPEG ligero (~30KB)
  const processImageFile = (file) => {
    if (!file) return;
    setIsProcessingPhoto(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setForm((prev) => ({ ...prev, photo: compressedBase64 }));
        setIsProcessingPhoto(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Por favor, indica al menos el nombre y apellidos del menor.');
      return;
    }

    onSave(form);
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3.5 py-3 shadow-sm flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800"
        >
          ← Volver al Listado
        </button>
        <span className="font-bold text-sm text-white">Añadir Menor</span>
        <div className="w-10"></div>
      </header>

      {/* Inputs invisibles para Cámara y Galería */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <main className="flex-1 px-3.5 py-3 overflow-y-auto space-y-3 pb-24">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
          
          {/* SECCIÓN FOTO: CÁMARA O GALERÍA */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Fotografía del Menor
            </label>

            {form.photo ? (
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <img
                  src={form.photo}
                  alt="Previsualización"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-emerald-400 block">✓ Foto cargada</span>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="text-[11px] font-semibold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-700"
                    >
                      Repetir
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photo: '' }))}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="p-3 bg-slate-950 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-blue-500/60 rounded-xl flex flex-col items-center justify-center text-center transition-all group"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-xs font-bold text-slate-200">Hacer Foto</span>
                  <span className="text-[10px] text-slate-500">Cámara del móvil</span>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="p-3 bg-slate-950 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-emerald-500/60 rounded-xl flex flex-col items-center justify-center text-center transition-all group"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🖼️</span>
                  <span className="text-xs font-bold text-slate-200">Galería</span>
                  <span className="text-[10px] text-slate-500">Subir archivo</span>
                </button>
              </div>
            )}
          </div>

          {/* Nombre y Apellidos */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nombre y Apellidos *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Karim Ben Barek"
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-sm px-3.5 py-2.5 rounded-xl outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Fecha de Nacimiento y Habitación */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2.5 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Habitación / Pabellón
              </label>
              <input
                type="text"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                placeholder="Ej: Hab. 101"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Alergias / Protocolo */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Alergias / Dieta
            </label>
            <select
              value={form.medicalAlert}
              onChange={(e) => setForm({ ...form, medicalAlert: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 text-white text-xs px-3 py-2.5 rounded-xl outline-none mb-2"
            >
              <option value="none">Sin restricciones (Ordinario)</option>
              <option value="celiac">🌾 Celíaco (Sin gluten)</option>
              <option value="nuts">🥜 Alergia a frutos secos</option>
              <option value="halal">🥩 Menú Halal</option>
              <option value="other">⚠️ Otra alergia o condición</option>
            </select>

            {form.medicalAlert !== 'none' && (
              <input
                type="text"
                value={form.medicalDetails}
                onChange={(e) => setForm({ ...form, medicalDetails: e.target.value })}
                placeholder="Especifica los detalles de la dieta o alergia..."
                className="w-full bg-slate-950 border border-amber-500/60 text-amber-200 text-xs px-3 py-2 rounded-xl outline-none placeholder:text-slate-600"
              />
            )}
          </div>

          {/* Datos adicionales opcionales */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
            >
              <span>{showAdvanced ? '▼ Ocultar datos de filiación' : '▶ Más datos (padres, procedencia)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-2.5 space-y-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Padre</label>
                    <input
                      type="text"
                      value={form.fatherName}
                      onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                      placeholder="Nombre del padre"
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Madre</label>
                    <input
                      type="text"
                      value={form.motherName}
                      onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                      placeholder="Nombre de la madre"
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Lugar de Nacimiento</label>
                    <input
                      type="text"
                      value={form.birthPlace}
                      onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                      placeholder="Ciudad / Municipio"
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">País</label>
                    <input
                      type="text"
                      value={form.originCountry}
                      onChange={(e) => setForm({ ...form, originCountry: e.target.value })}
                      placeholder="España, Marruecos..."
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-98 mt-2"
          >
            Guardar Menor
          </button>
        </form>
      </main>
    </div>
  );
}
