import React from 'react';
import { LayoutDashboard, Users, Calendar, FileText, CreditCard, FolderArchive, Sparkles, LogOut } from 'lucide-react';

export type NavTab = 'dashboard' | 'patients' | 'agenda' | 'notes' | 'payments' | 'documents' | 'ai-assistant';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingPaymentsCount: number;
  upcomingAppointmentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingPaymentsCount,
  upcomingAppointmentsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients' as NavTab,
      label: 'Pacientes',
      icon: Users,
      badge: null,
    },
    {
      id: 'agenda' as NavTab,
      label: 'Agenda y Citas',
      icon: Calendar,
      badge: upcomingAppointmentsCount > 0 ? upcomingAppointmentsCount : null,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'notes' as NavTab,
      label: 'Evolución Clínica (SOAP)',
      icon: FileText,
      badge: null,
    },
    {
      id: 'payments' as NavTab,
      label: 'Pagos y Honorarios',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} pend.` : null,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'documents' as NavTab,
      label: 'Documentos e Informes',
      icon: FolderArchive,
      badge: null,
    },
    {
      id: 'ai-assistant' as NavTab,
      label: 'Asistente IA Clínico',
      icon: Sparkles,
      badge: 'IA',
      badgeColor: 'bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
            Profesional Titular
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Lic. Psicología Clínica
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            M.P. 48.912 / M.N. 12.044
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Consultorio Particular
          </p>
          <p>Sincronización en la nube activa</p>
          <div className="flex items-center space-x-1.5 text-[10px] text-teal-600 dark:text-teal-400 font-medium pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>Sistema Protegido Ley Salud Mental</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
