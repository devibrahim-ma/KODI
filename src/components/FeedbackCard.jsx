import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export function FeedbackCard({ feedback, currentMode, onDismiss }) {
  if (!feedback) return null;

  const isSuccess = feedback.status === 'success';
  const isDuplicate = feedback.status === 'duplicate';

  return (
    <div
      className={`rounded-2xl border-2 p-4 shadow-2xl transition-all duration-300 transform scale-100 ${
        isSuccess
          ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-500 shadow-emerald-950/50'
          : isDuplicate
          ? 'bg-gradient-to-b from-rose-950/95 to-slate-900 border-rose-500 shadow-rose-950/50 animate-bounce'
          : 'bg-gradient-to-b from-amber-950/90 to-slate-900 border-amber-500 shadow-amber-950/50'
      }`}
    >
      {/* STATUS BANNER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-lg ${
              isSuccess
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30'
                : isDuplicate
                ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : isDuplicate ? <AlertTriangle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <span
              className={`text-[11px] font-extrabold uppercase tracking-widest ${
                isSuccess ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSuccess ? 'Registro Correcto' : 'Aviso de Acceso'}
            </span>
            <h3 className="text-base font-black text-white leading-tight">
              {feedback.message}
            </h3>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* DUPLICATE WARNING BOX */}
      {isDuplicate && feedback.previousTime && (
        <div className="mt-3 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-center">
          <p className="text-xs text-rose-200 font-medium">
            Este menor ya realizó su fichaje para <span className="font-bold underline uppercase">{currentMode}</span> a las:
          </p>
          <p className="text-2xl font-black font-mono text-rose-300 mt-1">
            ⏰ {feedback.previousTime}
          </p>
          <p className="text-[10px] text-rose-300/80 mt-1">
            Intento duplicado bloqueado automáticamente a las {feedback.timestamp}
          </p>
        </div>
      )}

      {/* MINOR DETAILS CARD */}
      {feedback.minor && (
        <div className="mt-3 bg-slate-950/70 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center space-x-3 mb-2.5">
            <div className="text-3xl bg-slate-800 p-2 rounded-xl">
              {feedback.minor.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {feedback.minor.id}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {feedback.minor.wristband}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white leading-tight">
                {feedback.minor.name}
              </h4>
              <p className="text-xs text-slate-400">
                {feedback.minor.age} años · {feedback.minor.zone}
              </p>
            </div>
          </div>

          {/* HIGH CONTRAST MEDICAL / ALLERGY WARNING CARD */}
          {feedback.minor.medical && (
            <div
              className={`mt-2 p-3 rounded-xl border-2 flex items-start space-x-2.5 ${
                feedback.minor.medical.severity === 'high'
                  ? 'bg-amber-500/25 border-amber-500 text-amber-200'
                  : 'bg-amber-500/15 border-amber-500/60 text-amber-200'
              }`}
            >
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-mono">
                    {feedback.minor.medical.type}
                  </span>
                </div>
                <h5 className="font-black text-sm text-amber-300 mt-0.5 leading-snug">
                  {feedback.minor.medical.title}
                </h5>
                <p className="text-xs font-medium text-amber-100 mt-0.5">
                  {feedback.minor.medical.description}
                </p>
              </div>
            </div>
          )}

          {/* INFO DETAILS ROW */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Monitor Responsable:</span>
              <p className="font-semibold text-slate-200">{feedback.minor.monitor}</p>
            </div>
            <div>
              <span className="text-slate-400">Hora de Fichaje:</span>
              <p className="font-mono font-bold text-emerald-400">{feedback.timestamp}</p>
            </div>
            {currentMode === 'moviles' && (
              <div className="col-span-2 bg-indigo-950/40 p-2 rounded-lg border border-indigo-800/40">
                <span className="text-indigo-300 font-semibold">Dispositivo Asignado:</span>
                <p className="text-xs text-white font-mono">{feedback.minor.phoneModel}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOT FOUND HELPER */}
      {feedback.status === 'not_found' && (
        <div className="mt-2 text-center p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
          <p className="text-xs text-amber-200">
            Comprueba que el código de la pulsera esté registrado o busca al menor manualmente en la lista de resumen.
          </p>
        </div>
      )}

      {/* QUICK ACTION TO NEXT SCAN */}
      <button
        onClick={onDismiss}
        className="w-full mt-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
      >
        <span>Listo para siguiente escaneo</span>
        <span>➔</span>
      </button>
    </div>
  );
}
