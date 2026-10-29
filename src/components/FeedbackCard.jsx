import React from 'react';

export function FeedbackCard({ feedback, currentMode, onDismiss }) {
  if (!feedback) return null;

  const isSuccess = feedback.status === 'success';
  const isDuplicate = feedback.status === 'duplicate';

  return (
    <div
      className={`rounded-xl border p-4 shadow-lg transition-all ${
        isSuccess
          ? 'bg-slate-900 border-emerald-500/80'
          : isDuplicate
          ? 'bg-slate-900 border-rose-500/80 ring-1 ring-rose-500/40'
          : 'bg-slate-900 border-amber-500/80'
      }`}
    >
      {/* STATUS BANNER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isSuccess
                ? 'bg-emerald-500 text-slate-950'
                : isDuplicate
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isSuccess ? '✓' : '!'}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isSuccess ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSuccess ? 'Validación Correcta' : 'Aviso de Acceso'}
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {feedback.message}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded bg-slate-800 text-xs"
        >
          ✕
        </button>
      </div>

      {/* DUPLICATE WARNING BOX */}
      {isDuplicate && feedback.previousTime && (
        <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/40 rounded-lg text-center">
          <p className="text-xs text-rose-200">
            Este menor ya fue registrado en el turno de <strong className="uppercase">{currentMode}</strong>:
          </p>
          <p className="text-xl font-black font-mono text-rose-400 mt-0.5">
            {feedback.previousTime}
          </p>
          <p className="text-[10px] text-rose-300/70 mt-0.5">
            Nuevo intento bloqueado a las {feedback.timestamp}
          </p>
        </div>
      )}

      {/* MINOR DETAILS CARD */}
      {feedback.minor && (
        <div className="mt-3 bg-slate-950 rounded-lg p-3 border border-slate-800">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold text-xs border border-slate-700">
              {feedback.minor.initials}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1 py-0.2 rounded border border-blue-500/20">
                  {feedback.minor.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {feedback.minor.wristband}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {feedback.minor.name}
              </h4>
              <p className="text-[11px] text-slate-400">
                {feedback.minor.age} años · {feedback.minor.zone}
              </p>
            </div>
          </div>

          {/* HIGH CONTRAST MEDICAL / ALLERGY WARNING CARD */}
          {feedback.minor.medical && (
            <div className="mt-2 p-2.5 rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-200">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-mono">
                  {feedback.minor.medical.type}
                </span>
              </div>
              <h5 className="font-bold text-xs text-amber-300">
                {feedback.minor.medical.title}
              </h5>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                {feedback.minor.medical.description}
              </p>
            </div>
          )}

          {/* INFO DETAILS ROW */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Monitor Asignado:</span>
              <span className="font-medium text-slate-300">{feedback.minor.monitor}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Hora de Registro:</span>
              <span className="font-mono font-bold text-emerald-400">{feedback.timestamp}</span>
            </div>
            {currentMode === 'moviles' && (
              <div className="col-span-2 bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Dispositivo Vinculado:</span>
                <span className="text-xs text-white font-mono">{feedback.minor.phoneModel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onDismiss}
        className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
      >
        Aceptar y continuar escaneo
      </button>
    </div>
  );
}
