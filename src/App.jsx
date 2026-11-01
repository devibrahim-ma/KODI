import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MainMenu } from './components/MainMenu';
import { MinorsList } from './components/MinorsList';
import { AddMinorForm } from './components/AddMinorForm';
import { Header } from './components/Header';
import { ScannerView } from './components/ScannerView';
import { SummaryDashboard } from './components/SummaryDashboard';
import { INITIAL_MINORS, MODES } from './data/mockMinors';
import { playAudioFeedback, triggerHaptic } from './utils/audio';

const STORAGE_KEYS = {
  MINORS: 'kodi_minors_db',
  RECORDS: 'kodi_records_db',
  SYNC_QUEUE: 'kodi_sync_queue',
  LAST_SYNC: 'kodi_last_sync'
};

export function App() {
  const [currentUser, setCurrentUser] = useState({ role: 'educador', name: 'Laura Sánchez' });
  const [navScreen, setNavScreen] = useState('auth'); // 'auth' | 'menu' | 'minors_list' | 'add_minor' | 'recount'
  const [recountView, setRecountView] = useState('scan'); // 'scan' | 'summary'

  const [currentMode, setCurrentMode] = useState('comida');

  // Inicialización de menores desde localStorage (offline-first)
  const [minors, setMinors] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MINORS);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error al cargar menores locales:', e);
    }
    return INITIAL_MINORS;
  });

  // Inicialización de registros por turno desde localStorage
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error al cargar registros locales:', e);
    }
    return {
      desayuno: { 'ID-001': { timestamp: '08:42:10', registeredBy: 'Carlos Ruiz (Educador)' } },
      mediodia: {},
      comida: {
        'ID-002': { timestamp: '13:45:10', registeredBy: 'Laura Sánchez (Educador)' },
        'ID-007': { timestamp: '13:51:24', registeredBy: 'Laura Sánchez (Educador)' }
      },
      merienda: {},
      cena: {},
      moviles: { 'ID-005': { timestamp: '10:15:00', registeredBy: 'Ana Beltrán (ATE)' } }
    };
  });

  // Estado de conexión offline/online y cola de sincronización
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncQueue, setSyncQueue] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [feedback, setFeedback] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Persistir menores en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MINORS, JSON.stringify(minors));
    } catch (e) {
      console.error('Error al guardar menores en storage:', e);
    }
  }, [minors]);

  // Persistir registros en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Error al guardar registros en storage:', e);
    }
  }, [records]);

  // Persistir cola de sincronización
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(syncQueue));
    } catch (e) {
      console.error('Error al guardar syncQueue:', e);
    }
  }, [syncQueue]);

  // Detector de conectividad Online / Offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Al volver la red, procesamos la cola de sincronización con la BBDD
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reloj
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

  // Proceso de sincronización con la BBDD
  const syncPendingChanges = () => {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
    if (queue.length === 0) return;

    // Aquí se envían los cambios al endpoint de base de datos remoto cuando hay red
    console.log(`[KODI SYNC] Sincronizando ${queue.length} cambios pendientes con la BBDD...`, queue);
    
    // Marcamos sincronizado
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    setSyncQueue([]);
  };

  const queueChange = (action, payload) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      action,
      payload,
      timestamp: new Date().toISOString()
    };

    setSyncQueue((prev) => {
      const next = [...prev, item];
      // Si estamos en línea, intentamos sincronizar de inmediato
      if (navigator.onLine) {
        setTimeout(syncPendingChanges, 500);
      }
      return next;
    });
  };

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
        (m.wristband && m.wristband.toUpperCase() === code) ||
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

      const newRecord = { timestamp: timestampStr, registeredBy: operatorInfo };
      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [found.id]: newRecord
        }
      }));

      queueChange('RECORD_ATTENDANCE', {
        mode: currentMode,
        minorId: found.id,
        record: newRecord
      });

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
      queueChange('REMOVE_ATTENDANCE', { mode: currentMode, minorId });
    } else {
      const record = { timestamp: timestampStr, registeredBy: operatorInfo };
      setRecords((prev) => ({
        ...prev,
        [currentMode]: {
          ...prev[currentMode],
          [minorId]: record
        }
      }));
      queueChange('RECORD_ATTENDANCE', { mode: currentMode, minorId, record });
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
      queueChange('RESET_MODE', { mode: currentMode });
      setFeedback(null);
    }
  };

  // Guardar nuevo menor con fotografía desde cámara o galería
  const handleSaveMinor = (formData) => {
    const nextIndex = minors.length + 1;
    const generatedId = `ID-${String(nextIndex).padStart(3, '0')}`;
    const generatedWristband = `PUL-${Math.floor(1000 + Math.random() * 9000)}`;

    const nameParts = formData.name.trim().split(' ');
    const initials = (nameParts[0]?.[0] || 'X') + (nameParts[1]?.[0] || nameParts[0]?.[1] || 'M').toUpperCase();

    let medicalData = null;
    if (formData.medicalAlert && formData.medicalAlert !== 'none') {
      medicalData = {
        hasAlert: true,
        type: formData.medicalAlert === 'celiac' ? 'Alergia Alimentaria' :
              formData.medicalAlert === 'nuts' ? 'Alerta Crítica' :
              formData.medicalAlert === 'halal' ? 'Dieta Cultural' : 'Condición Médica',
        title: formData.medicalAlert === 'celiac' ? 'CELÍACO ESTRICTO' :
               formData.medicalAlert === 'nuts' ? 'ALERGIA A FRUTOS SECOS' :
               formData.medicalAlert === 'halal' ? 'MENÚ HALAL' : 'ALERTA / DIETA',
        description: formData.medicalDetails || 'Protocolo específico asignado.',
        severity: formData.medicalAlert === 'nuts' ? 'high' : 'medium'
      };
    }

    const newChild = {
      id: generatedId,
      wristband: generatedWristband,
      name: formData.name.trim(),
      photo: formData.photo || '',
      age: formData.birthDate ? Math.max(1, new Date().getFullYear() - new Date(formData.birthDate).getFullYear()) : 12,
      zone: formData.zone || 'Pabellón A · Hab. 101',
      monitor: currentUser.name,
      phoneModel: 'No asignado',
      initials,
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      birthPlace: formData.birthPlace || '',
      birthDate: formData.birthDate || '',
      originCountry: formData.originCountry || 'España',
      medical: medicalData
    };

    setMinors((prev) => [newChild, ...prev]);
    queueChange('ADD_MINOR', newChild);
    playAudioFeedback('success');
    return newChild;
  };

  // Eliminar menor de la BBDD
  const handleDeleteMinor = (minorId) => {
    setMinors((prev) => prev.filter((m) => m.id !== minorId));
    
    // Limpiar también posibles fichajes asociados
    setRecords((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((modeKey) => {
        if (updated[modeKey] && updated[modeKey][minorId]) {
          const modeCopy = { ...updated[modeKey] };
          delete modeCopy[minorId];
          updated[modeKey] = modeCopy;
        }
      });
      return updated;
    });

    queueChange('DELETE_MINOR', { id: minorId });
    playAudioFeedback('beep');
  };

  // Vaciar lista para comenzar desde cero con datos reales
  const handleClearTestData = () => {
    setMinors([]);
    setRecords({
      desayuno: {},
      mediodia: {},
      comida: {},
      merienda: {},
      cena: {},
      moviles: {}
    });
    queueChange('CLEAR_DATABASE', {});
  };

  // Cargar datos demo en caso de querer ver un ejemplo
  const handleLoadTestData = () => {
    setMinors(INITIAL_MINORS);
    queueChange('RESTORE_DEMO_DATA', INITIAL_MINORS);
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

      {/* 2. MAIN MENU (PANEL OPERATIVO) */}
      {navScreen === 'menu' && (
        <MainMenu
          currentUser={currentUser}
          currentMode={currentMode}
          registeredCount={registeredCount}
          totalCount={totalCount}
          currentTimeStr={currentTimeStr}
          isOnline={isOnline}
          onNavigate={(target) => setNavScreen(target)}
          onLogout={() => setNavScreen('auth')}
        />
      )}

      {/* 3. LISTADO DE MENORES */}
      {navScreen === 'minors_list' && (
        <MinorsList
          minors={minors}
          isOnline={isOnline}
          onNavigateAdd={() => setNavScreen('add_minor')}
          onDeleteMinor={handleDeleteMinor}
          onBack={() => setNavScreen('menu')}
          onClearTestData={handleClearTestData}
          onLoadTestData={handleLoadTestData}
        />
      )}

      {/* 4. AÑADIR MENOR (FORMULARIO CON CÁMARA Y GALERÍA) */}
      {navScreen === 'add_minor' && (
        <AddMinorForm
          onSave={handleSaveMinor}
          onBack={() => setNavScreen('minors_list')}
          minorsCount={minors.length}
        />
      )}

      {/* 5. RECUENTO Y ASISTENCIA */}
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
                minors={minors}
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
                Lector
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
