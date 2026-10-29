import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MainMenu } from './components/MainMenu';
import { AddMinorForm } from './components/AddMinorForm';
import { Header } from './components/Header';
import { ScannerView } from './components/ScannerView';
import { SummaryDashboard } from './components/SummaryDashboard';
import { INITIAL_MINORS, MODES } from './data/mockMinors';
import { playAudioFeedback, triggerHaptic } from './utils/audio';

export function App() {
  const [currentUser, setCurrentUser] = useState({ role: 'educador', name: 'Laura Sánchez' });
  const [navScreen, setNavScreen] = useState('auth'); // 'auth' | 'menu' | 'recount' | 'add_minor'
  const [recountView, setRecountView] = useState('scan'); // 'scan' | 'summary'

  const [currentMode, setCurrentMode] = useState('comida');
  const [minors, setMinors] = useState(INITIAL_MINORS);

  const [records, setRecords] = useState({
    desayuno: { 'ID-001': { timestamp: '08:42:10', registeredBy: 'Carlos Ruiz (Educador)' } },
    mediodia: {},
    comida: {
      'ID-002': { timestamp: '13:45:10', registeredBy: 'Laura Sánchez (Educador)' },
      'ID-007': { timestamp: '13:51:24', registeredBy: 'Laura Sánchez (Educador)' }
    },
    merienda: {},
    cena: {},
    moviles: { 'ID-005': { timestamp: '10:15:00', registeredBy: 'Ana Beltrán (ATE)' } }
  });

  const [feedback, setFeedback] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null);
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
    const operatorInfo = `${currentUser.name} (${currentUser.role.toUpperCase()})`;

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
      playAudioFeedback('duplicate');
      triggerHaptic([250, 100, 250]);
      setScreenFlash('red');
      setFeedback({
        status: 'duplicate',
        minor: found,
        timestamp: timestampStr,
        previousTime: previousRecord.timestamp,
        registeredBy: previousRecord.registeredBy,
        message: 'REGISTRO PREVIO EXISTENTE'
      });
      setTimeout(() => setScreenFlash(null), 500);
    } else {
      playAudioFeedback('success');
      triggerHaptic([90]);
      setScreenFlash('green');

      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [found.id]: { timestamp: timestampStr, registeredBy: operatorInfo }
        }
      }));

      setFeedback({
        status: 'success',
        minor: found,
        timestamp: timestampStr,
        registeredBy: operatorInfo,
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
    const operatorInfo = `${currentUser.name} (${currentUser.role.toUpperCase()})`;

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
          [minorId]: { timestamp: timestampStr, registeredBy: operatorInfo }
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

  const handleSaveMinor = (formData) => {
    const nextIndex = minors.length + 1;
    const generatedId = `ID-${String(nextIndex).padStart(3, '0')}`;
    const generatedWristband = `PUL-${Math.floor(1000 + Math.random() * 9000)}`;

    const nameParts = formData.name.trim().split(' ');
    const initials = (nameParts[0]?.[0] || 'X') + (nameParts[1]?.[0] || nameParts[0]?.[1] || 'M').toUpperCase();

    let medicalData = null;
    if (formData.medicalAlert !== 'none') {
      medicalData = {
        hasAlert: true,
        type: formData.medicalAlert === 'celiac' ? 'Alergia Alimentaria' :
              formData.medicalAlert === 'nuts' ? 'Alerta Crítica' :
              formData.medicalAlert === 'halal' ? 'Dieta Cultural' : 'Condición Médica',
        title: formData.medicalAlert === 'celiac' ? 'CELÍACO ESTRICTO' :
               formData.medicalAlert === 'nuts' ? 'ALERGIA SEVERA A FRUTOS SECOS' :
               formData.medicalAlert === 'halal' ? 'MENÚ HALAL CERTIFICADO' : 'NOTIFICACIÓN MÉDICA',
        description: formData.medicalDetails || 'Protocolo específico asignado.',
        severity: formData.medicalAlert === 'nuts' ? 'high' : 'medium'
      };
    }

    const newChild = {
      id: generatedId,
      wristband: generatedWristband,
      name: formData.name.trim(),
      age: formData.birthDate ? Math.max(8, new Date().getFullYear() - new Date(formData.birthDate).getFullYear()) : 12,
      zone: formData.zone || 'Pabellón A · Hab. 106',
      monitor: currentUser.name,
      phoneModel: 'Pendiente de asignación',
      initials,
      fatherName: formData.fatherName || 'No consta',
      motherName: formData.motherName || 'No consta',
      birthPlace: formData.birthPlace || 'No indicado',
      birthDate: formData.birthDate || '2014-01-01',
      originCountry: formData.originCountry || 'España',
      medical: medicalData
    };

    setMinors((prev) => [newChild, ...prev]);
    playAudioFeedback('success');
    return newChild;
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
      {/* 1. LOGIN */}
      {navScreen === 'auth' && (
        <LoginScreen
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLogin={(e) => {
            e.preventDefault();
            if (currentUser.name.trim()) setNavScreen('menu');
          }}
        />
      )}

      {/* 2. MAIN MENU */}
      {navScreen === 'menu' && (
        <MainMenu
          currentUser={currentUser}
          currentMode={currentMode}
          registeredCount={registeredCount}
          totalCount={totalCount}
          currentTimeStr={currentTimeStr}
          onNavigate={(target) => setNavScreen(target)}
          onLogout={() => setNavScreen('auth')}
        />
      )}

      {/* 3. ADD MINOR FORM */}
      {navScreen === 'add_minor' && (
        <AddMinorForm
          onSave={handleSaveMinor}
          onBack={() => setNavScreen('menu')}
          minorsCount={minors.length}
        />
      )}

      {/* 4. RECOUNT & ATTENDANCE */}
      {navScreen === 'recount' && (
        <div className="flex-1 flex flex-col justify-between">
          <Header
            currentMode={currentMode}
            onModeChange={(mode) => {
              setCurrentMode(mode);
              setFeedback(null);
            }}
            registeredCount={registeredCount}
            totalCount={totalCount}
            currentTimeStr={currentTimeStr}
            onBackToMenu={() => setNavScreen('menu')}
            operatorName={currentUser.name}
          />

          <main className="flex-1 px-3.5 py-3 flex flex-col space-y-3 pb-24">
            {recountView === 'scan' ? (
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

          <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2 z-50 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRecountView('scan')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  recountView === 'scan'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                }`}
              >
                Lector / Entrada
              </button>

              <button
                type="button"
                onClick={() => setRecountView('summary')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center relative ${
                  recountView === 'summary'
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
      )}
    </div>
  );
}

export default App;
