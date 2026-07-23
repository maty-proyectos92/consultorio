import React, { useState } from 'react';
import { Users, Search, Plus, Filter, Phone, Mail, FileText, ChevronRight, CheckCircle2, PauseCircle, UserCheck } from 'lucide-react';
import { Patient, PatientStatus } from '../types';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (patientData: Omit<Patient, 'id' | 'createdAt'>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onSelectPatient,
  onAddPatient,
  searchQuery,
  setSearchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'todos'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [occupation, setOccupation] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('Particular');
  const [sessionFee, setSessionFee] = useState<number>(25000);
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [treatmentGoal, setTreatmentGoal] = useState('');
  const [notes, setNotes] = useState('');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dni.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onAddPatient({
      fullName: fullName.trim(),
      email: email.trim() || 'sin.email@consultorio.com',
      phone: phone.trim() || '+54 9 11 0000-0000',
      dni: dni.trim() || '00.000.000',
      birthDate: birthDate || '1995-01-01',
      occupation: occupation.trim() || 'No especificada',
      emergencyContact: emergencyContact.trim() || 'No indicado',
      healthInsurance: healthInsurance.trim() || 'Particular',
      status: 'activo',
      sessionFee: Number(sessionFee) || 25000,
      initialDiagnosis: initialDiagnosis.trim() || 'En evaluación inicial',
      treatmentGoal: treatmentGoal.trim() || 'Establecer encuadre y objetivos terapéuticos',
      notes: notes.trim(),
    });

    // Reset form
    setFullName('');
    setEmail('');
    setPhone('');
    setDni('');
    setBirthDate('');
    setOccupation('');
    setEmergencyContact('');
    setHealthInsurance('Particular');
    setSessionFee(25000);
    setInitialDiagnosis('');
    setTreatmentGoal('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Directorio de Pacientes</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredPatients.length} pacientes encontrados en el registro
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-md shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {(['todos', 'activo', 'pausa', 'alta'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              statusFilter === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab === 'todos' ? 'Todos los pacientes' : tab === 'activo' ? 'En Tratamiento (Activo)' : tab === 'pausa' ? 'En Pausa' : 'Alta Terapéutica'}
          </button>
        ))}
      </div>

      {/* Patients List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const isActivo = patient.status === 'activo';
          const isPausa = patient.status === 'pausa';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 transition shadow-sm cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                      {patient.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      DNI: {patient.dni} • {patient.occupation}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize inline-flex items-center ${
                      isActivo
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : isPausa
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {isActivo ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                    ) : isPausa ? (
                      <PauseCircle className="w-3 h-3 mr-1 text-amber-500" />
                    ) : (
                      <UserCheck className="w-3 h-3 mr-1 text-blue-500" />
                    )}
                    {patient.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="pt-2">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[11px] font-medium">
                      Obra Social: {patient.healthInsurance}
                    </span>
                  </div>
                </div>

                {patient.initialDiagnosis && (
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                      Diagnóstico Inicial:
                    </p>
                    <p className="line-clamp-2 font-medium">
                      {patient.initialDiagnosis}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Honorario: ${patient.sessionFee.toLocaleString('es-AR')}</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-1 transition flex items-center">
                  Ver Ficha <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Ficha de Alta de Nuevo Paciente
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Laura Pérez"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    DNI / Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej: 36.412.890"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Teléfono Móvil
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Ocupación / Profesión
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Ej: Abogado, Estudiante"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Obra Social / Prepaga
                  </label>
                  <input
                    type="text"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                    placeholder="OSDE, Swiss Medical, Particular"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Honorario Acordado por Sesión ($)
                  </label>
                  <input
                    type="number"
                    value={sessionFee}
                    onChange={(e) => setSessionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Nombre, Vínculo y Teléfono"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Motivo de Consulta / Diagnóstico Presuntivo
                </label>
                <textarea
                  rows={2}
                  value={initialDiagnosis}
                  onChange={(e) => setInitialDiagnosis(e.target.value)}
                  placeholder="Síntomas principales expresados en primera entrevista..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Objetivo Terapéutico Principal
                </label>
                <input
                  type="text"
                  value={treatmentGoal}
                  onChange={(e) => setTreatmentGoal(e.target.value)}
                  placeholder="Ej: Reducción de sintomatología ansiosa..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
