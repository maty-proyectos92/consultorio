import React from 'react';
import { Brain, Bell, Search, ShieldCheck, Wifi, WifiOff, Calendar, UserPlus, CreditCard } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewPayment: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewPayment,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & Clinic Info */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl shadow-md shadow-teal-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-tight">
                PsychoCRM
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Consultorio Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestión Clínica & Historial Psicológico
            </p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 sm:gap-3">
          {/* Global Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar paciente, DNI o fecha..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Realtime Status Indicator */}
          <div className="flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" title={isOnline ? "Conectado en tiempo real con Firebase" : "Modo Local / Offline"}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500 mr-1.5 animate-pulse" />
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Firebase Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                <span className="hidden sm:inline text-amber-600 dark:text-amber-400">Modo Local</span>
              </>
            )}
          </div>

          {/* Confidentiality Badge */}
          <div className="hidden lg:flex items-center text-xs text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mr-1" />
            <span>Ley 25.326 Encriptado</span>
          </div>

          {/* Quick Creation Buttons */}
          <button
            onClick={onOpenNewPatient}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Paciente</span>
          </button>

          <button
            onClick={onOpenNewAppointment}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">+ Cita</span>
          </button>

          <button
            onClick={onOpenNewPayment}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">+ Cobro</span>
          </button>
        </div>

      </div>
    </header>
  );
};
