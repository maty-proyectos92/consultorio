export type PatientStatus = 'activo' | 'pausa' | 'alta';

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  birthDate: string;
  occupation: string;
  emergencyContact: string;
  healthInsurance: string; // Obra Social o Prepaga
  status: PatientStatus;
  createdAt: string;
  sessionFee: number;
  initialDiagnosis?: string;
  treatmentGoal?: string;
  notes?: string;
}

export type AppointmentStatus = 'confirmada' | 'realizada' | 'cancelada' | 'reprogramada' | 'ausente';
export type AppointmentModality = 'presencial' | 'online';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string; // ISO string
  durationMinutes: number;
  modality: AppointmentModality;
  status: AppointmentStatus;
  cost: number;
  notes?: string;
}

export interface SessionNote {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string; // YYYY-MM-DD
  sessionNumber: number;
  subjective: string; // S: Subjetivo (Lo que refiere el paciente)
  objective: string;  // O: Objetivo (Observaciones del profesional)
  assessment: string; // A: Análisis/Evaluación clínica
  plan: string;       // P: Plan terapéutico
  homework?: string;  // Tareas asignadas
  confidentialNotes?: string;
  createdAt: string;
}

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'obra_social';
export type PaymentStatus = 'completado' | 'pendiente';

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  invoiceNumber?: string;
  concept: string; // Ej: "Sesión N° 5 - Psicología"
}

export type DocumentType = 'consentimiento' | 'informe_alta' | 'anamnesis' | 'certificado' | 'otro';

export interface ClinicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  type: DocumentType;
  content: string;
  createdAt: string;
  signed: boolean;
}

export interface QuickStats {
  activePatientsCount: number;
  monthlySessionsCount: number;
  monthlyRevenue: number;
  pendingPaymentsCount: number;
  pendingAmount: number;
}
