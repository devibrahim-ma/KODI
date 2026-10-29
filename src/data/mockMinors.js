export const MODES = [
  { id: 'desayuno', label: 'Desayuno', schedule: '08:00 - 09:30' },
  { id: 'mediodia', label: 'Medio Día', schedule: '11:30 - 12:30' },
  { id: 'comida', label: 'Comida', schedule: '13:30 - 15:30' },
  { id: 'merienda', label: 'Merienda', schedule: '17:30 - 18:30' },
  { id: 'cena', label: 'Cena', schedule: '20:30 - 22:00' },
  { id: 'moviles', label: 'Móviles', schedule: 'Control y Custodia' }
];

export const INITIAL_MINORS = [
  {
    id: 'ID-001',
    wristband: 'PUL-8491',
    name: 'Juan Pérez Morales',
    age: 12,
    zone: 'Pabellón A · Hab. 101',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Xiaomi Redmi Note 11',
    initials: 'JP',
    medical: {
      hasAlert: true,
      type: 'Alergia Alimentaria',
      title: 'CELÍACO ESTRICTO (SIN GLUTEN)',
      description: 'Control estricto de trazas y contaminación cruzada.',
      severity: 'high'
    }
  },
  {
    id: 'ID-002',
    wristband: 'PUL-3920',
    name: 'Sofía Gómez Ruiz',
    age: 14,
    zone: 'Pabellón B · Hab. 204',
    monitor: 'Laura Sánchez',
    phoneModel: 'iPhone 12',
    initials: 'SG',
    medical: null
  },
  {
    id: 'ID-003',
    wristband: 'PUL-5512',
    name: 'Mohamed Amine Dahbi',
    age: 13,
    zone: 'Pabellón A · Hab. 103',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Samsung Galaxy A33',
    initials: 'MA',
    medical: {
      hasAlert: true,
      type: 'Dieta Cultural',
      title: 'MENÚ HALAL CERTIFICADO',
      description: 'Sin carne de cerdo ni derivados no certificados.',
      severity: 'medium'
    }
  },
  {
    id: 'ID-004',
    wristband: 'PUL-1092',
    name: 'Lucas Silva Da Costa',
    age: 11,
    zone: 'Pabellón A · Hab. 101',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Motorola Moto G52',
    initials: 'LS',
    medical: {
      hasAlert: true,
      type: 'Alerta Crítica',
      title: 'ALERGIA SEVERA A FRUTOS SECOS',
      description: 'Riesgo de anafilaxia. Dispone de auto-inyector EpiPen en enfermería.',
      severity: 'high'
    }
  },
  {
    id: 'ID-005',
    wristband: 'PUL-7734',
    name: 'Elena Vega Navarro',
    age: 15,
    zone: 'Pabellón B · Hab. 201',
    monitor: 'Ana Beltrán',
    phoneModel: 'Samsung S20 FE',
    initials: 'EV',
    medical: null
  },
  {
    id: 'ID-006',
    wristband: 'PUL-4481',
    name: 'Mateo Romero Castro',
    age: 10,
    zone: 'Pabellón A · Hab. 105',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Realme C55',
    initials: 'MR',
    medical: {
      hasAlert: true,
      type: 'Intolerancia Severa',
      title: 'INTOLERANCIA A LA LACTOSA',
      description: 'Suministrar bebidas vegetales y menús sin derivados lácteos.',
      severity: 'medium'
    }
  },
  {
    id: 'ID-007',
    wristband: 'PUL-2299',
    name: 'Lucía Santos Blanco',
    age: 13,
    zone: 'Pabellón B · Hab. 203',
    monitor: 'Laura Sánchez',
    phoneModel: 'iPhone 11',
    initials: 'LS',
    medical: null
  },
  {
    id: 'ID-008',
    wristband: 'PUL-9811',
    name: 'Daniel Martínez Soler',
    age: 12,
    zone: 'Pabellón A · Hab. 104',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Oppo A78',
    initials: 'DM',
    medical: {
      hasAlert: true,
      type: 'Alergia Alimentaria',
      title: 'ALERGIA A PESCADO Y MARISCO',
      description: 'Sustituir por proteínas alternativas verificadas.',
      severity: 'high'
    }
  },
  {
    id: 'ID-009',
    wristband: 'PUL-6632',
    name: 'Ainhoa García Ibáñez',
    age: 14,
    zone: 'Pabellón B · Hab. 204',
    monitor: 'Ana Beltrán',
    phoneModel: 'Xiaomi 12 Lite',
    initials: 'AG',
    medical: {
      hasAlert: true,
      type: 'Control Clínico',
      title: 'DIABETES TIPO 1 (CONTROL PREVIO)',
      description: 'Revisión obligatoria de glucemia previa con monitor antes de la ingesta.',
      severity: 'high'
    }
  },
  {
    id: 'ID-010',
    wristband: 'PUL-3145',
    name: 'Youssef Benali',
    age: 11,
    zone: 'Pabellón A · Hab. 102',
    monitor: 'Laura Sánchez',
    phoneModel: 'Redmi 10C',
    initials: 'YB',
    medical: {
      hasAlert: true,
      type: 'Dieta Cultural',
      title: 'MENÚ HALAL CERTIFICADO',
      description: 'Carne y productos conformes a normativa Halal.',
      severity: 'medium'
    }
  },
  {
    id: 'ID-011',
    wristband: 'PUL-8821',
    name: 'Martina Fernández Díaz',
    age: 16,
    zone: 'Pabellón B · Hab. 202',
    monitor: 'Ana Beltrán',
    phoneModel: 'iPhone 13',
    initials: 'MF',
    medical: {
      hasAlert: true,
      type: 'Régimen Dietético',
      title: 'DIETA VEGETARIANA',
      description: 'Menú ovo-lacto-vegetariano estricto.',
      severity: 'medium'
    }
  },
  {
    id: 'ID-012',
    wristband: 'PUL-5003',
    name: 'Pau Costa Rovira',
    age: 12,
    zone: 'Pabellón A · Hab. 105',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Poco X5 Pro',
    initials: 'PC',
    medical: null
  },
  {
    id: 'ID-013',
    wristband: 'PUL-1944',
    name: 'Carmen Delgado Ortiz',
    age: 13,
    zone: 'Pabellón B · Hab. 205',
    monitor: 'Laura Sánchez',
    phoneModel: 'Samsung Galaxy A14',
    initials: 'CD',
    medical: {
      hasAlert: true,
      type: 'Alergia Alimentaria',
      title: 'ALERGIA AL HUEVO',
      description: 'Prohibición de alimentos con huevo o trazas de ovoproductos.',
      severity: 'high'
    }
  },
  {
    id: 'ID-014',
    wristband: 'PUL-7210',
    name: 'Alejandro Moreno Gil',
    age: 15,
    zone: 'Pabellón A · Hab. 103',
    monitor: 'Carlos Ruiz',
    phoneModel: 'Xiaomi Redmi 12',
    initials: 'AM',
    medical: null
  },
  {
    id: 'ID-015',
    wristband: 'PUL-6091',
    name: 'Salma Khattabi',
    age: 10,
    zone: 'Pabellón B · Hab. 201',
    monitor: 'Ana Beltrán',
    phoneModel: 'Motorola E22',
    initials: 'SK',
    medical: {
      hasAlert: true,
      type: 'Dieta Combinada',
      title: 'HALAL + EXENTO DE LACTOSA',
      description: 'Doble restricción: Halal estricto y sin derivados lácteos.',
      severity: 'high'
    }
  }
];
