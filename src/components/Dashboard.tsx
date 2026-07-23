import React from 'react';
import { Users, Calendar, DollarSign, AlertCircle, Clock, Video, MapPin, ArrowRight, UserPlus, FilePlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Patient, Appointment, Payment } from '../types';
import { NavTab } from './Sidebar';

interface DashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  payments: Payment[];
  setActiveTab: (tab: NavTab) => void;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewPayment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  appointments,
  payments,
  setActiveTab,
  onSelectPatient,
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewPayment,
}) => {
  const activePatients = patients.filter((p) => p.status === 'activo');
  
  // Upcoming appointments
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'confirmada' || a.status === 'reprogramada')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5);

  // Pending payments
  const pendingPayments = payments.filter((p) => p.status === 'pendiente');
  const pendingAmountTotal = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  // Total collected this month
  const totalCollectedThisMonth = payments
    .filter((p) => p.status === 'completado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner / Header Welcome */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 bg-white/10 text-teal-100 text-xs font-semibold rounded-full border border-white/20 backdrop-blur-sm">
            Consultorio Abierto • Lic. Psicología
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
            Bienvenido al Panel de Control Clínico
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90">
            Resumen diario de agenda, pacientes en seguimiento activo y estado contable del consultorio.
          </p>
          
          <div className="pt-3 flex flex-wrap gap-2">
            <button
              onClick={onOpenNewAppointment}
              className="px-4 py-2 bg-white text-teal-900 font-semibold rounded-xl text-xs hover:bg-teal-50 transition shadow-sm flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Nueva Cita</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-4 py-2 bg-teal-600/80 hover:bg-teal-600 text-white font-medium rounded-xl text-xs border border-teal-400/30 backdrop-blur-sm transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Asistente IA para Evoluciones</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Patients */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              {activePatients.length} activos
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {patients.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Pacientes totales registrados
          </p>
        </div>

        {/* Metric 2: Today / Next Appointments */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
              Próximas
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {upcomingAppointments.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Citas agendadas esta semana
          </p>
        </div>

        {/* Metric 3: Total Collected */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Cobrado
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ${totalCollectedThisMonth.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Ingresos confirmados este mes
          </p>
        </div>

        {/* Metric 4: Pending Balances */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
              {pendingPayments.length} pendientes
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ${pendingAmountTotal.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Por cobrar en honorarios
          </p>
        </div>

      </div>

      {/* Main Grid: Upcoming Agenda & Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Próximas Citas en Agenda
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('agenda')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center space-x-1"
            >
              <span>Ver agenda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No hay citas confirmadas pendientes para los próximos días.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingAppointments.map((app) => {
                const dt = new Date(app.dateTime);
                const isOnline = app.modality === 'online';
                
                return (
                  <div
                    key={app.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2 rounded-xl transition"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-center min-w-[64px]">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          {dt.toLocaleDateString('es-AR', { weekday: 'short' })}
                        </p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {dt.getDate()} {dt.toLocaleDateString('es-AR', { month: 'short' })}
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => onSelectPatient(app.patientId)}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 text-left transition"
                        >
                          {app.patientName}
                        </button>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            {dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isOnline ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                          }`}>
                            {isOnline ? <Video className="w-2.5 h-2.5 mr-1" /> : <MapPin className="w-2.5 h-2.5 mr-1" />}
                            {app.modality}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-2">
                        ${app.cost.toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={() => onSelectPatient(app.patientId)}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Pending Balances */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
              Acciones Rápidas
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={onOpenNewPatient}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-900 dark:text-teal-200 transition text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <UserPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-semibold">Nuevo Paciente</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
              </button>

              <button
                onClick={onOpenNewAppointment}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 transition text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-semibold">Agendar Cita</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <FilePlus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-semibold">Registrar Evolución SOAP</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Pending Payments Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                Cobros Pendientes
              </h3>
              <button
                onClick={() => setActiveTab('payments')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                Ver todos
              </button>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Todos los honorarios al día</span>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {p.patientName}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {p.concept} • {p.date}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      ${p.amount.toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
