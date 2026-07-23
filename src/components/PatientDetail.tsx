import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, FileText, CreditCard, FolderArchive, Plus, ShieldAlert, Phone, Mail, FileSignature, Edit3, Save } from 'lucide-react';
import { Patient, Appointment, SessionNote, Payment, ClinicalDocument, PatientStatus } from '../types';

interface PatientDetailProps {
  patient: Patient;
  appointments: Appointment[];
  sessionNotes: SessionNote[];
  payments: Payment[];
  documents: ClinicalDocument[];
  onBack: () => void;
  onUpdatePatient: (updated: Patient) => void;
  onAddNote: (note: Omit<SessionNote, 'id' | 'createdAt'>) => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  appointments,
  sessionNotes,
  payments,
  documents,
  onBack,
  onUpdatePatient,
  onAddNote,
  onAddPayment,
  onAddAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'appointments' | 'payments' | 'documents'>('notes');
  const [isEditing, setIsEditing] = useState(false);

  // Edit Patient fields
  const [fullName, setFullName] = useState(patient.fullName);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [status, setStatus] = useState<PatientStatus>(patient.status);
  const [sessionFee, setSessionFee] = useState(patient.sessionFee);
  const [initialDiagnosis, setInitialDiagnosis] = useState(patient.initialDiagnosis || '');
  const [treatmentGoal, setTreatmentGoal] = useState(patient.treatmentGoal || '');
  const [notes, setNotes] = useState(patient.notes || '');

  // Add Note Modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [homework, setHomework] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');

  const patientNotes = sessionNotes
    .filter((n) => n.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const patientAppointments = appointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const patientPayments = payments
    .filter((p) => p.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const patientDocuments = documents.filter((d) => d.patientId === patient.id);

  const handleSavePatientInfo = () => {
    onUpdatePatient({
      ...patient,
      fullName,
      phone,
      email,
      status,
      sessionFee,
      initialDiagnosis,
      treatmentGoal,
      notes,
    });
    setIsEditing(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjective.trim() && !assessment.trim()) return;

    onAddNote({
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      sessionNumber: patientNotes.length + 1,
      subjective,
      objective,
      assessment,
      plan,
      homework,
      confidentialNotes,
    });

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setHomework('');
    setConfidentialNotes('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al listado de pacientes</span>
      </button>

      {/* Patient Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl">
              <User className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                  {patient.fullName}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  patient.status === 'activo'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : patient.status === 'pausa'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {patient.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                DNI: {patient.dni} • Nacimiento: {patient.birthDate} • Ocupación: {patient.occupation}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 text-slate-400 mr-1" /> {patient.phone}
                </span>
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" /> {patient.email}
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                                Co-pago: ${(patient.sessionFee || 0).toLocaleString('es-AR')} / sesión
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            {isEditing ? (
              <button
                onClick={handleSavePatientInfo}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Ficha</span>
              </button>
            )}
          </div>
        </div>

        {/* Clinical History Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
            <span className="font-bold text-teal-700 dark:text-teal-400 uppercase text-[10px] tracking-wider block">
              Diagnóstico Inicial & Motivo de Consulta
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              {patient.initialDiagnosis || 'En evaluación inicial.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-wider block">
              Objetivo Terapéutico Principal
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              {patient.treatmentGoal || 'No especificado.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition ${
              activeTab === 'notes'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Evoluciones SOAP ({patientNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition ${
              activeTab === 'appointments'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Citas ({patientAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition ${
              activeTab === 'payments'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pagos ({patientPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition ${
              activeTab === 'documents'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Documentos ({patientDocuments.length})</span>
          </button>
        </div>

        {activeTab === 'notes' && (
          <button
            onClick={() => setShowNoteModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Evolución</span>
          </button>
        )}
      </div>

      {/* Tab Content 1: SOAP Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {patientNotes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-xs">
              Aún no se registraron evoluciones clínicas para este paciente.
            </div>
          ) : (
            patientNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs rounded-lg">
                      Sesión N° {note.sessionNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Fecha: {note.date}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">SOAP Format</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {note.subjective && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5">
                      <span className="font-bold text-teal-700 dark:text-teal-400">S - Subjetivo (Relato del Paciente)</span>
                      <p className="text-slate-700 dark:text-slate-300">{note.subjective}</p>
                    </div>
                  )}

                  {note.objective && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">O - Objetivo (Observaciones)</span>
                      <p className="text-slate-700 dark:text-slate-300">{note.objective}</p>
                    </div>
                  )}

                  {note.assessment && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5">
                      <span className="font-bold text-amber-700 dark:text-amber-400">A - Análisis / Evaluación</span>
                      <p className="text-slate-700 dark:text-slate-300">{note.assessment}</p>
                    </div>
                  )}

                  {note.plan && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">P - Plan Terapéutico</span>
                      <p className="text-slate-700 dark:text-slate-300">{note.plan}</p>
                    </div>
                  )}
                </div>

                {note.homework && (
                  <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/40 text-xs">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200">Tarea Inter-Sesión: </span>
                    <span className="text-indigo-800 dark:text-indigo-300">{note.homework}</span>
                  </div>
                )}

                {note.confidentialNotes && (
                  <div className="p-2.5 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/40 text-xs text-rose-900 dark:text-rose-200 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Nota Confidencial Profesional: </span>
                      <span>{note.confidentialNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No hay registro de citas para este paciente.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {patientAppointments.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(app.dateTime).toLocaleString('es-AR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })} hs
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 capitalize">
                      Modalidad: {app.modality} • {app.notes}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          {patientPayments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Sin registros de cobros para este paciente.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {patientPayments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{p.concept}</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {p.date} • Método: {p.method} • Comprobante: {p.invoiceNumber || 'S/N'}
                    </p>
                  </div>
                  <span className={`font-bold text-sm ${p.status === 'completado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        ${(p.amount || 0).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          {patientDocuments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Sin documentos adjuntos.</p>
          ) : (
            <div className="space-y-2">
              {patientDocuments.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <FileSignature className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                      <p className="text-slate-500 text-[10px]">{doc.createdAt} • {doc.signed ? 'Firmado' : 'Pendiente Firma'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New SOAP Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Nueva Evolución Clínica SOAP - {patient.fullName}
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-teal-700 dark:text-teal-400 font-bold mb-1">
                  S - Subjetivo (Lo que relata el paciente)
                </label>
                <textarea
                  rows={2}
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  placeholder="Relato, motivos expresados, vivencias de la semana..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-indigo-700 dark:text-indigo-400 font-bold mb-1">
                  O - Objetivo (Observaciones directas del profesional)
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Lenguaje no verbal, nivel de afecto, tono vocal, postura..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-700 dark:text-amber-400 font-bold mb-1">
                  A - Análisis / Evaluación Clínica
                </label>
                <textarea
                  rows={2}
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  placeholder="Hipótesis de trabajo, mecanismos de defensa, avances..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                  P - Plan Terapéutico
                </label>
                <textarea
                  rows={2}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="Intervenciones diseñadas para la próxima sesión..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Tarea o Registro Inter-Sesión (Opcional)
                </label>
                <input
                  type="text"
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="Ej: Registro diario de pensamientos automáticos"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-rose-600 font-bold mb-1">
                  Notas Confidenciales del Profesional (Sólo para el terapeuta)
                </label>
                <input
                  type="text"
                  value={confidentialNotes}
                  onChange={(e) => setConfidentialNotes(e.target.value)}
                  placeholder="Observaciones privadas no visibles en informes compartidos..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition"
                >
                  Registrar Evolución
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
