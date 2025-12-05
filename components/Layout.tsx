import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings, Menu, TrendingUp, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any; label: string; to: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="text-xl font-bold text-slate-900">Agência INA</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <SidebarItem icon={LayoutDashboard} label="Visão Geral" to="/" active={isActive('/')} />
            <SidebarItem icon={Users} label="CRM & Prospecção" to="/crm" active={isActive('/crm')} />
            <SidebarItem icon={Calendar} label="Agenda & Tarefas" to="/calendar" active={isActive('/calendar')} />
            <SidebarItem icon={TrendingUp} label="Relatórios" to="/reports" active={isActive('/reports')} />
          </nav>

          <div className="p-4 border-t border-slate-100">
             <SidebarItem icon={Settings} label="Configurações" to="/settings" active={isActive('/settings')} />
             <div className="mt-4 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status da Equipe</p>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-sm text-slate-700 font-medium">Online</span>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Olá, Equipe INA</p>
                <p className="text-xs text-slate-500">Admin</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
                EI
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};