import React, { useState, useEffect } from 'react';
import { Zap, ClipboardList } from 'lucide-react';
import { Header } from './components/Header';
import { ScannerView } from './components/ScannerView';
import { SummaryDashboard } from './components/SummaryDashboard';
import { INITIAL_MINORS, MODES } from './data/mockMinors';
import { playAudioFeedback, triggerHaptic } from './utils/audio';

export function App() {
  const [currentMode, setCurrentMode] = useState('comida');
  const [currentView, setCurrentView] = useState('scan'); // 'scan' | 'summary'
  const [minors] = useState(INITIAL_MINORS);

  // Registered logs per mode: { [modeId]: { [minorId]: { timestamp, mode } } }
  const [records, setRecords] = useState(() => {
    return {
      comida: {
        'ID-002': { timestamp: '13:45:10', mode: 'comida' },
        'ID-007': { timestamp: '13:50:22', mode: 'comida' }
      },
      merienda: {},
      moviles: {
        'ID-005': { timestamp: '10:15:00', mode: 'moviles' }
      }
    };
  });

  const [feedback, setFeedback] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null); // 'green' | 'red'
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Live digital clock
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
      triggerHaptic([150, 100, 150]);
      setScreenFlash('red');
      setFeedback({
        status: 'not_found',
        code,
        timestamp: timestampStr,
        message: `Código no reconocido: "${code}"`
      });
      setTimeout(() => setScreenFlash(null), 500);
      return;
    }

    const previousRecord = activeRecords[found.id];

    if (previousRecord) {
      // DUPLICATE RECORD DETECTED!
      playAudioFeedback('duplicate');
      triggerHaptic([300, 100, 300]);
      setScreenFlash('red');
      setFeedback({
        status: 'duplicate',
        minor: found,
        timestamp: timestampStr,
        previousTime: previousRecord.timestamp,
        message: '¡ALERTA: Este menor ya ha fichado!'
      });
      setTimeout(() => setScreenFlash(null), 600);
    } else {
      // SUCCESSFUL SCAN!
      playAudioFeedback('success');
      triggerHaptic([120]);
      setScreenFlash('green');

      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [found.id]: {
            timestamp: timestampStr,
            mode: currentMode
          }
        }
      }));

      setFeedback({
        status: 'success',
        minor: found,
        timestamp: timestampStr,
        message:
          currentMode === 'moviles'
            ? 'Móvil entregado / verificado'
            : 'Acceso registrado correctamente'
      });
      setTimeout(() => setScreenFlash(null), 600);
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
          [minorId]: { timestamp: timestampStr, mode: currentMode }
        }
      }));
      playAudioFeedback('success');
    }
  };

  const handleResetSession = () => {
    const modeObj = MODES.find((m) => m.id === currentMode);
    if (confirm(`¿Reiniciar registros de ${modeObj?.label}?`)) {
      setRecords((prev) => ({
        ...prev,
        [currentMode]: {}
      }));
      setFeedback(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between max-w-md mx-auto relative transition-colors duration-300 bg-slate-950 text-slate-100 ${
        screenFlash === 'green'
          ? 'ring-8 ring-emerald-500 bg-emerald-950/40'
          : screenFlash === 'red'
          ? 'ring-8 ring-rose-500 bg-rose-950/40'
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

      <main className="flex-1 px-4 py-3 flex flex-col space-y-3 pb-24">
        {currentView === 'scan' ? (
          <ScannerView
            minors={minors}
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

      {/* FIXED BOTTOM NAVIGATION BAR FOR MOBILE ERGONOMICS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2 z-50 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentView('scan')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              currentView === 'scan'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Escáner / Entrada</span>
          </button>

          <button
            onClick={() => setCurrentView('summary')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all relative ${
              currentView === 'summary'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Resumen ({registeredCount})</span>
            {registeredCount > 0 && (
              <span className="absolute top-1.5 right-6 w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
