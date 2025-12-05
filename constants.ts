import { Lead, Task } from './types';

// Helper to get today's date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Ricardo Silva', company: 'Tech Solutions', status: 'interested', date: '2023-12-01', notes: 'Gostou da proposta de tráfego.' },
  { id: '2', name: 'Ana Souza', company: 'Boutique Flor', status: 'not_interested', date: '2023-12-01', notes: 'Orçamento muito alto.' },
  { id: '3', name: 'Carlos Mendes', company: 'Barbearia Club', status: 'c2', date: today, notes: 'Esperando resposta do sócio.' },
  { id: '4', name: 'Fernanda Lima', company: 'Café & Aroma', status: 'todo', date: today, notes: 'Enviar apresentação institucional.' },
  { id: '5', name: 'Grupo Varejo', company: 'GV Holdings', status: 'c1', date: today, notes: 'Ligação agendada.' },
  { id: '6', name: 'Roberto Campos', company: 'Advocacia RC', status: 'c4', date: today, notes: 'Quer fechar contrato mensal.' },
  { id: '7', name: 'Juliana Paes', company: 'Estética JP', status: 'c3', date: today, notes: 'Última tentativa antes de descartar.' },
  { id: '8', name: 'Mario Bros', company: 'Encanamentos', status: 'todo', date: '2023-12-02', notes: 'Lead frio.' },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Reunião com Ricardo', date: today, completed: false, type: 'meeting', owner: 'Davi' },
  { id: '2', title: 'Montar relatório mensal', date: today, completed: true, type: 'general', owner: 'Bia' },
  { id: '3', title: 'Follow-up Ana Souza', date: '2023-12-02', completed: false, type: 'follow_up', owner: 'Lucas' },
  { id: '4', title: 'Alinhamento Estratégico', date: today, completed: false, type: 'general', owner: 'Davi' },
  { id: '5', title: 'Cobrar Briefing', date: today, completed: false, type: 'follow_up', owner: 'Bia' },
];

export const STATUS_LABELS: Record<string, string> = {
  todo: 'Sem Contato',
  c1: 'C1',
  c2: 'C2',
  c3: 'C3',
  c4: 'C4',
  interested: 'Demonstrou Interesse',
  not_interested: 'Não Tem Interesse',
};

export const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-slate-100 border-slate-200 text-slate-600',
  c1: 'bg-blue-50 border-blue-200 text-blue-700',
  c2: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  c3: 'bg-purple-50 border-purple-200 text-purple-700',
  c4: 'bg-violet-50 border-violet-200 text-violet-700',
  interested: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  not_interested: 'bg-rose-50 border-rose-200 text-rose-700',
};

export const OWNERS = ['Davi', 'Lucas', 'Bia'] as const;