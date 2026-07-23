import { Patient, Appointment, SessionNote, Payment, ClinicalDocument } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Sofía Martínez',
    email: 'sofia.martinez@email.com',
    phone: '+54 9 11 4589-1234',
    dni: '38.452.910',
    birthDate: '1994-06-15',
    occupation: 'Diseñadora Gráfica',
    emergencyContact: 'Mamá - María (11-9876-5432)',
    healthInsurance: 'OSDE 310',
    status: 'activo',
    createdAt: '2026-01-10',
    sessionFee: 25000,
    initialDiagnosis: 'Trastorno de Ansiedad Generalizada (TAG) moderado',
    treatmentGoal: 'Desarrollar herramientas de afrontamiento cognitivo-conductual frente al estrés laboral.',
    notes: 'Prefiere consultas los martes por la tarde. Muy comprometida con los registros de autoregistro.'
  },
  {
    id: 'pat-2',
    fullName: 'Lucas Benítez',
    email: 'lucas.benitez@email.com',
    phone: '+54 9 11 5123-9876',
    dni: '35.120.482',
    birthDate: '1990-11-03',
    occupation: 'Ingeniero de Software',
    emergencyContact: 'Hermana - Laura (11-2345-6789)',
    healthInsurance: 'Swiss Medical',
    status: 'activo',
    createdAt: '2026-02-01',
    sessionFee: 28000,
    initialDiagnosis: 'Síndrome de Burnout e Insomnio de conciliación',
    treatmentGoal: 'Establecer límites sanos en el trabajo y reestructurar rutina del sueño.',
    notes: 'Atención online. Trabaja en modalidad remota.'
  },
  {
    id: 'pat-3',
    fullName: 'Valentina Rossi',
    email: 'v.rossi@email.com',
    phone: '+54 9 11 3344-5566',
    dni: '41.002.311',
    birthDate: '1998-03-22',
    occupation: 'Estudiante de Medicina',
    emergencyContact: 'Pareja - Mateo (11-3322-1100)',
    healthInsurance: 'Galeno 220',
    status: 'activo',
    createdAt: '2026-03-15',
    sessionFee: 22000,
    initialDiagnosis: 'Episodio Depresivo Leve asociado a duelo migratorio',
    treatmentGoal: 'Activación conductual y procesamiento emocional de pérdidas recientes.',
    notes: 'Asiste de manera presencial cada 15 días.'
  },
  {
    id: 'pat-4',
    fullName: 'Gonzalo Fernández',
    email: 'gonzalo.f@email.com',
    phone: '+54 9 11 6789-0123',
    dni: '32.890.112',
    birthDate: '1987-08-19',
    occupation: 'Arquitecto',
    emergencyContact: 'Esposa - Andrea (11-8899-0011)',
    healthInsurance: 'Particular',
    status: 'pausa',
    createdAt: '2025-09-12',
    sessionFee: 30000,
    initialDiagnosis: 'Crisis vital y reorientación profesional',
    treatmentGoal: 'Evaluación de valores personales y toma de decisiones.',
    notes: 'En pausa temporal por viaje de trabajo durante un mes.'
  },
  {
    id: 'pat-5',
    fullName: 'Mariana Gómez',
    email: 'mariana.gomez@email.com',
    phone: '+54 9 11 9988-7766',
    dni: '29.431.009',
    birthDate: '1982-12-01',
    occupation: 'Docente Universitaria',
    emergencyContact: 'Amiga - Paula (11-4455-6677)',
    healthInsurance: 'IOMA',
    status: 'alta',
    createdAt: '2025-03-01',
    sessionFee: 20000,
    initialDiagnosis: 'Fobia Social / Ansiedad de Ejecución',
    treatmentGoal: 'Exposición gradual a hablar en público e interacciones grupales.',
    notes: 'Alta terapéutica alcanzada con éxito en Diciembre 2025.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'pat-1',
    patientName: 'Sofía Martínez',
    dateTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // Hoy en 2hs
    durationMinutes: 50,
    modality: 'presencial',
    status: 'confirmada',
    cost: 25000,
    notes: 'Revisar registro de reestructuración cognitiva de la semana'
  },
  {
    id: 'app-2',
    patientId: 'pat-2',
    patientName: 'Lucas Benítez',
    dateTime: new Date(Date.now() + 26 * 3600 * 1000).toISOString(), // Mañana
    durationMinutes: 50,
    modality: 'online',
    status: 'confirmada',
    cost: 28000,
    notes: 'Evaluar avance en higiene del sueño y desconexión laboral'
  },
  {
    id: 'app-3',
    patientId: 'pat-3',
    patientName: 'Valentina Rossi',
    dateTime: new Date(Date.now() + 50 * 3600 * 1000).toISOString(), // Pasado mañana
    durationMinutes: 50,
    modality: 'presencial',
    status: 'confirmada',
    cost: 22000,
    notes: 'Sesión N° 6 - Evaluación de la red de apoyo'
  },
  {
    id: 'app-4',
    patientId: 'pat-1',
    patientName: 'Sofía Martínez',
    dateTime: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), // Hace 7 días
    durationMinutes: 50,
    modality: 'presencial',
    status: 'realizada',
    cost: 25000,
    notes: 'Sesión realizada en horario'
  },
  {
    id: 'app-5',
    patientId: 'pat-2',
    patientName: 'Lucas Benítez',
    dateTime: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    durationMinutes: 50,
    modality: 'online',
    status: 'realizada',
    cost: 28000,
    notes: 'Sesión online satisfactoria'
  }
];

export const INITIAL_SESSION_NOTES: SessionNote[] = [
  {
    id: 'note-1',
    patientId: 'pat-1',
    appointmentId: 'app-4',
    date: '2026-07-15',
    sessionNumber: 8,
    subjective: 'Sofía relata haber tenido un pico de ansiedad el jueves tras una reunión con su cliente principal. Refiere sensación de opresión en el pecho y pensamientos catastróficos ("voy a perder la cuenta").',
    objective: 'Paciente orientada en tiempo y espacio. Discurso fluido con momentos de aceleración motora. Aplica técnica de respiración diafragmática durante el encuentro.',
    assessment: 'Persisten distorsiones de catastrofización y filtro mental frente a demandas laborales. Sin embargo, demuestra mayor conciencia situacional que en fases iniciales.',
    plan: '1. Trabajo de reestructuración cognitiva enfocado en probabilidad real vs imaginada. 2. Continuar registro de pensamientos automáticos.',
    homework: 'Completar planilla A-B-C cuando detecte taquicardia o inquietud.',
    confidentialNotes: 'Menciona tensión vincular con su socio comercial. Evaluar en próximas sesiones si requiere derivación o abordaje de asertividad.',
    createdAt: '2026-07-15T18:00:00Z'
  },
  {
    id: 'note-2',
    patientId: 'pat-2',
    appointmentId: 'app-5',
    date: '2026-07-16',
    sessionNumber: 5,
    subjective: 'Lucas expresa sentirse físicamente agotado pero reporta haber podido apagar la computadora a las 19:00 hs dos días consecutivos esta semana.',
    objective: 'Afecto aplanado, tono de voz pausado. Buen insight sobre el impacto negativo del sobretrabajo.',
    assessment: 'Avance positivo en el establecimiento de límites temporales. Mejoría leve en la latencia de sueño (logró dormirse antes de la 1 AM).',
    plan: 'Consolidar el ritual de desconexión nocturna. Introducir pausa activa de 10 minutos a mitad de jornada laboral.',
    homework: 'Dejar el teléfono celular fuera del dormitorio durante la noche.',
    confidentialNotes: 'Sigue preocupado por las expectativas de su jefe inmediato.',
    createdAt: '2026-07-16T19:30:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    patientId: 'pat-1',
    patientName: 'Sofía Martínez',
    date: '2026-07-15',
    amount: 25000,
    method: 'transferencia',
    status: 'completado',
    invoiceNumber: 'FC-2026-0041',
    concept: 'Honorarios Sesión N° 8'
  },
  {
    id: 'pay-2',
    patientId: 'pat-2',
    patientName: 'Lucas Benítez',
    date: '2026-07-16',
    amount: 28000,
    method: 'transferencia',
    status: 'completado',
    invoiceNumber: 'FC-2026-0042',
    concept: 'Honorarios Sesión N° 5'
  },
  {
    id: 'pay-3',
    patientId: 'pat-3',
    patientName: 'Valentina Rossi',
    date: '2026-07-20',
    amount: 22000,
    method: 'efectivo',
    status: 'pendiente',
    concept: 'Honorarios Sesión N° 6 (Pendiente de cobro)'
  }
];

export const INITIAL_DOCUMENTS: ClinicalDocument[] = [
  {
    id: 'doc-1',
    patientId: 'pat-1',
    patientName: 'Sofía Martínez',
    title: 'Consentimiento Informado para Tratamiento Psicológico',
    type: 'consentimiento',
    content: 'Por medio del presente documento, Sofía Martínez presta su conformidad para iniciar tratamiento psicoterapéutico individual con modalidad presencial. Se acuerda la confidencialidad de las sesiones bajo el encuadre profesional correspondiente.',
    createdAt: '2026-01-10',
    signed: true
  },
  {
    id: 'doc-2',
    patientId: 'pat-5',
    patientName: 'Mariana Gómez',
    title: 'Informe Psicológico de Alta Terapéutica',
    type: 'informe_alta',
    content: 'Se certifica que Mariana Gómez ha completado el proceso terapéutico habiendo alcanzado satisfactoriamente los objetivos trazados respecto al manejo de la ansiedad social y exposición progresiva.',
    createdAt: '2025-12-18',
    signed: true
  }
];
