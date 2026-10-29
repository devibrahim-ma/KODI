import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScannerView } from './components/ScannerView';
import { SummaryDashboard } from './components/SummaryDashboard';
import { INITIAL_MINORS, MODES } from './data/mockMinors';
import { playAudioFeedback, triggerHaptic } from './utils/audio';

export function App() {
  const [currentMode, setCurrentMode] = useState('comida');
  const [currentView, setCurrentView] = useState('scan'); // 'scan' | 'summary'
  const [minors] = useState(INITIAL_MINORS);

  // Registro para los 6 turnos
  const [records, setRecords] = useState({
    desayuno: { 'ID-001': { timestamp: '08:42:10' } },
    mediodia: {},
    comida: {
      'ID-002': { timestamp: '13:45:10' },
      'ID-007': { timestamp: '13:51:24' }
    },
    merienda: {},
    cena: {},
    moviles: { 'ID-005': { timestamp: '10:15:00' } }
  });

  const [feedback, setFeedback] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null); // 'green' | 'red'
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeRecords = records[currentMode] || {};
  const registeredCount = Object.keys(activeRecords).length;
  const totalCount = minors.length;

  const handleScan = (rawCode) => {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) return;

    playAudioFeedback('beep');

    const found = minors.find(
      (m) =>
        m.id.toUpperCase() === code ||
        m.wristband.toUpperCase() === code ||
        m.name.toUpperCase().includes(code)
    );

    const now = new Date();
    const timestampStr = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (!found) {
      playAudioFeedback('error');
      triggerHaptic([150, 80, 150]);
      setScreenFlash('red');
      setFeedback({
        status: 'not_found',
        code,
        timestamp: timestampStr,
        message: `Código no registrado: "${code}"`
      });
      setTimeout(() => setScreenFlash(null), 400);
      return;
    }

    const previousRecord = activeRecords[found.id];

    if (previousRecord) {
      // DUPLICADO
      playAudioFeedback('duplicate');
      triggerHaptic([250, 100, 250]);
      setScreenFlash('red');
      setFeedback({
        status: 'duplicate',
        minor: found,
        timestamp: timestampStr,
        previousTime: previousRecord.timestamp,
        message: 'REGISTRO PREVIO EXISTENTE'
      });
      setTimeout(() => setScreenFlash(null), 500);
    } else {
      // REGISTRO CORRECTO
      playAudioFeedback('success');
      triggerHaptic([90]);
      setScreenFlash('green');

      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [found.id]: { timestamp: timestampStr }
        }
      }));

      setFeedback({
        status: 'success',
        minor: found,
        timestamp: timestampStr,
        message:
          currentMode === 'moviles'
            ? 'Dispositivo verificado y registrado'
            : 'Acceso validado y registrado'
      });
      setTimeout(() => setScreenFlash(null), 500);
    }
  };

  const handleToggleMinor = (minorId) => {
    const isRegistered = !!activeRecords[minorId];
    const now = new Date();
    const timestampStr = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (isRegistered) {
      setRecords((prev) => {
        const copy = { ...prev[currentMode] };
        delete copy[minorId];
        return { ...prev, [currentMode]: copy };
      });
    } else {
      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [minorId]: { timestamp: timestampStr }
        }
      }));
      playAudioFeedback('success');
    }
  };

  const handleResetSession = () => {
    const currentModeObj = MODES.find((m) => m.id === currentMode);
    if (confirm(`¿Reiniciar los registros de "${currentModeObj?.label}"?`)) {
      setRecords((prev) => ({
        ...prev,
        [currentMode]: {}
      }));
      setFeedback(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between max-w-md mx-auto relative transition-colors duration-200 bg-slate-950 text-slate-100 ${
        screenFlash === 'green'
          ? 'bg-emerald-950/20'
          : screenFlash === 'red'
          ? 'bg-rose-950/20'
          : ''
      }`}
    >
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => {
          setCurrentMode(mode);
          setFeedback(null);
        }}
        registeredCount={registeredCount}
        totalCount={totalCount}
        currentTimeStr={currentTimeStr}
      />

      <main className="flex-1 px-3.5 py-3 flex flex-col space-y-3 pb-24">
        {currentView === 'scan' ? (
          <ScannerView
            activeRecords={activeRecords}
            currentMode={currentMode}
            feedback={feedback}
            setFeedback={setFeedback}
            onScan={handleScan}
          />
        ) : (
          <SummaryDashboard
            minors={minors}
            activeRecords={activeRecords}
            currentMode={currentMode}
            onToggleMinor={handleToggleMinor}
            onResetSession={handleResetSession}
          />
        )}
      </main>

      {/* BARRA INFERIOR DE NAVEGACIÓN */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2 z-50 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('scan')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              currentView === 'scan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            Lector / Entrada
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('summary')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center relative ${
              currentView === 'summary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <span>Resumen ({registeredCount})</span>
            {registeredCount > 0 && (
              <span className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
