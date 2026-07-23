import React, { useState } from 'react';
import { FileText, Search, Plus, ShieldCheck, User, Calendar, BookOpen } from 'lucide-react';
import { SessionNote, Patient } from '../types';

interface ClinicalNotesProps {
  sessionNotes: SessionNote[];
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddNote: (note: Omit<SessionNote, 'id' | 'createdAt'>) => void;
}

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({
  sessionNotes,
  patients,
  onSelectPatient,
  onAddNote,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = sessionNotes
    .filter((n) => selectedPatientId === 'todos' || n.patientId === selectedPatientId)
    .filter((n) => {
      const patient = patients.find((p) => p.id === n.patientId);
      const name = patient?.fullName.toLowerCase() || '';
      const text = `${n.subjective} ${n.assessment} ${n.plan}`.toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || text.includes(q) || n.date.includes(q);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Registro de Evolución Clínica (SOAP / DAP)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historial de observaciones clínicas, intervenciones y planes de tratamiento
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encriptado Ley 25.326 Secreto Profesional</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Filtrar por Paciente
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="todos">Todos los pacientes ({sessionNotes.length} evoluciones)</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            Buscar en Texto Clínico
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por síntoma, palabra clave o fecha..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notes Stream */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
            No se encontraron evoluciones registradas para los criterios seleccionados.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const patient = patients.find((p) => p.id === note.patientId);

            return (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onSelectPatient(note.patientId)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition text-left"
                    >
                      {patient ? patient.fullName : 'Paciente no encontrado'}
                    </button>

                    <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs rounded-lg">
                      Sesión N° {note.sessionNumber}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Fecha: {note.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {note.subjective && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="font-bold text-teal-700 dark:text-teal-400">S - Subjetivo (Relato)</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.subjective}</p>
                    </div>
                  )}

                  {note.objective && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">O - Objetivo (Conducta / Afecto)</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.objective}</p>
                    </div>
                  )}

                  {note.assessment && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="font-bold text-amber-700 dark:text-amber-400">A - Evaluación e Hipótesis</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.assessment}</p>
                    </div>
                  )}

                  {note.plan && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">P - Plan de Intervención</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.plan}</p>
                    </div>
                  )}
                </div>

                {note.homework && (
                  <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                    <span className="font-bold">Tarea / Ejercicio Inter-sesión: </span>
                    <span>{note.homework}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
