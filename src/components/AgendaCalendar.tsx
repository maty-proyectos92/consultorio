import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Plus, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Patient, Appointment, AppointmentStatus, AppointmentModality } from '../types';

interface AgendaCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onUpdateStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'todas'>('todas');

  // Form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('16:00');
  const [duration, setDuration] = useState(50);
  const [modality, setModality] = useState<AppointmentModality>('presencial');
  const [cost, setCost] = useState(25000);
  const [notes, setNotes] = useState('');

  const sortedAppointments = appointments
    .filter((a) => filterStatus === 'todas' || a.status === filterStatus)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (!selectedPatient) return;

    const dateTimeISO = new Date(`${date}T${time}:00`).toISOString();

    onAddAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      dateTime: dateTimeISO,
      durationMinutes: duration,
      modality,
      status: 'confirmada',
      cost: Number(cost) || selectedPatient.sessionFee || 25000,
      notes,
    });

    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Agenda de Citas & Turnos</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control de consultas agendadas, modalidades presenciales/online y estado
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {(['todas', 'confirmada', 'realizada', 'reprogramada', 'cancelada', 'ausente'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {st === 'todas' ? 'Todas las citas' : st}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="space-y-3">
        {sortedAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
            No se encontraron citas con el filtro seleccionado.
          </div>
        ) : (
          sortedAppointments.map((app) => {
            const dt = new Date(app.dateTime);
            const isOnline = app.modality === 'online';

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-indigo-400 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-center min-w-[70px]">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      {dt.toLocaleDateString('es-AR', { weekday: 'short' })}
                    </p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white">
                      {dt.getDate()} {dt.toLocaleDateString('es-AR', { month: 'short' })}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {app.patientName}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOnline ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {isOnline ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                        {app.modality}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Duración: {app.durationMinutes} minutos • Honorario: ${(app.cost || 0).toLocaleString('es-AR')}
                    </p>

                    {app.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 inline-block">
                        Nota: {app.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Switcher Actions */}
                <div className="flex items-center space-x-2 self-end md:self-center">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                    app.status === 'confirmada'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : app.status === 'realizada'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : app.status === 'cancelada'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {app.status}
                  </span>

                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as AppointmentStatus)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold cursor-pointer"
                  >
                    <option value="confirmada">Confirmada</option>
                    <option value="realizada">Realizada</option>
                    <option value="reprogramada">Reprogramada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="ausente">Ausente sin aviso</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Agendar Nueva Cita
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Seleccionar Paciente *
                </label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = patients.find((p) => p.id === e.target.value);
                    if (p) setCost(p.sessionFee);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Modalidad
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as AppointmentModality)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="presencial">Presencial (Consultorio)</option>
                    <option value="online">Online (Video-sesión)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Honorario ($)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Notas de Encuadre o Recordatorio
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Revisar tarea de autoregistro, solicitar comprobante"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Confirmar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
