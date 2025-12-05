import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ThumbsUp, ThumbsDown, DollarSign } from 'lucide-react';
import { MOCK_LEADS } from '../constants';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

export const Reports: React.FC = () => {
  // Mock Data Aggregation
  const leadsByStatus = [
    { name: 'Sem Contato', value: MOCK_LEADS.filter(l => l.status === 'todo').length },
    { name: 'Em Negociação', value: MOCK_LEADS.filter(l => l.status.startsWith('c')).length },
    { name: 'Convertidos', value: MOCK_LEADS.filter(l => l.status === 'interested').length },
    { name: 'Perdidos', value: MOCK_LEADS.filter(l => l.status === 'not_interested').length },
  ];

  const weeklyPerformance = [
    { day: 'Seg', calls: 12, interested: 2 },
    { day: 'Ter', calls: 15, interested: 4 },
    { day: 'Qua', calls: 10, interested: 1 },
    { day: 'Qui', calls: 18, interested: 5 },
    { day: 'Sex', calls: 14, interested: 3 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Relatórios & Performance</h1>
          <p className="text-slate-500 mt-1">Análise detalhada do desempenho comercial da Agência INA.</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-500">
                <option>Esta Semana</option>
                <option>Este Mês</option>
                <option>Este Ano</option>
            </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total de Leads</p>
                    <h3 className="text-2xl font-bold text-slate-800">{MOCK_LEADS.length}</h3>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                <TrendingUp size={14} /> +12% vs semana anterior
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ThumbsUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Conversão</p>
                    <h3 className="text-2xl font-bold text-slate-800">24.5%</h3>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                <TrendingUp size={14} /> +4.2% vs meta
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                    <ThumbsDown size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Taxa de Rejeição</p>
                    <h3 className="text-2xl font-bold text-slate-800">15.2%</h3>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                <TrendingUp size={14} rotate={180} /> -2% vs média
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Valor em Pipeline</p>
                    <h3 className="text-2xl font-bold text-slate-800">R$ 45.2k</h3>
                </div>
            </div>
             <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Semanal</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            cursor={{fill: '#f8fafc'}}
                        />
                        <Bar dataKey="calls" name="Abordagens" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                        <Bar dataKey="interested" name="Interessados" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Funnel Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição do Funil</h3>
            <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={leadsByStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {leadsByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {leadsByStatus.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-slate-600 font-medium">{entry.name} ({entry.value})</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};