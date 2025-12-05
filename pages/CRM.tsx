import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit2,
  ArrowRightCircle
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { STATUS_LABELS } from '../constants';
import { Modal } from '../components/Modal';

// --- Helpers ---

const SEQUENCE: LeadStatus[] = ['todo', 'c1', 'c2', 'c3', 'c4'];

interface CRMProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const KanbanColumn = ({ 
  title, 
  status, 
  leads, 
  onMoveLead,
  onDeleteLead,
  onEditLead,
  onAdvanceAll,
  onDropLead
}: { 
  title: string; 
  status: LeadStatus; 
  leads: Lead[]; 
  onMoveLead: (id: string, newStatus: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onEditLead: (lead: Lead) => void;
  onAdvanceAll?: (ids: string[], nextStatus: LeadStatus) => void;
  onDropLead: (e: React.DragEvent, targetStatus: LeadStatus) => void;
}) => {
  const isTerminal = status === 'interested' || status === 'not_interested';
  // Correct Sequence Logic:
  const currentIndex = SEQUENCE.indexOf(status);
  const nextStatus = currentIndex !== -1 && currentIndex < SEQUENCE.length - 1 ? SEQUENCE[currentIndex + 1] : null;
  const canAdvanceAll = !isTerminal && nextStatus && leads.length > 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-slate-200/50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-slate-200/50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-200/50');
    onDropLead(e, status);
  };

  return (
    <div 
        className="flex-shrink-0 w-[280px] bg-slate-100/50 rounded-xl flex flex-col h-full border border-slate-200/60 transition-colors"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`p-3 border-b border-slate-200/60 flex flex-col gap-2 rounded-t-xl ${
        status === 'interested' ? 'bg-emerald-50 text-emerald-900' : 
        status === 'not_interested' ? 'bg-rose-50 text-rose-900' : 'bg-slate-50 text-slate-700'
      }`}>
        <div className="flex justify-between items-center">
            <span className="font-bold text-sm truncate">{title}</span>
            <span className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full border border-black/5">
            {leads.length}
            </span>
        </div>
        
        {/* Advance All Button */}
        {canAdvanceAll && onAdvanceAll && nextStatus && (
            <button 
                onClick={() => onAdvanceAll(leads.map(l => l.id), nextStatus)}
                className="w-full text-[10px] flex items-center justify-center gap-1 bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-500 py-2 rounded transition-all shadow-sm font-bold uppercase tracking-wide"
                title={`Avançar todos para ${STATUS_LABELS[nextStatus]}`}
            >
                <ArrowRightCircle size={12} />
                Avançar Todos
            </button>
        )}
      </div>

      {/* Leads List */}
      <div className="p-2 space-y-2 overflow-y-auto kanban-scroll flex-1 min-h-[100px]">
        {leads.map(lead => (
          <div 
            key={lead.id} 
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('leadId', lead.id);
                e.dataTransfer.effectAllowed = 'move';
            }}
            className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing"
          >
            
            {/* Header: Company + Actions */}
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-slate-800 text-sm truncate w-[75%]">
                {lead.company || "Sem Empresa"}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditLead(lead);
                    }}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Editar Lead"
                >
                    <Edit2 size={14} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLead(lead.id);
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Excluir Lead"
                >
                    <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mb-2 font-medium">{lead.name || "Sem Nome"}</p>
            
            {lead.notes && (
              <div className="bg-slate-50 p-1.5 rounded text-[11px] text-slate-600 mb-2 border border-slate-100 whitespace-pre-wrap">
                {lead.notes}
              </div>
            )}

            {/* Actions Footer */}
            {!isTerminal && (
              <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-50">
                {/* Advance Button */}
                {status !== 'c4' && (
                    <button 
                        onClick={() => {
                            const idx = SEQUENCE.indexOf(status);
                            if (idx !== -1 && idx < SEQUENCE.length - 1) {
                                onMoveLead(lead.id, SEQUENCE[idx + 1]);
                            }
                        }}
                        className="flex-1 py-1 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-100 font-bold uppercase transition-colors"
                    >
                        Avançar
                    </button>
                )}
                
                {/* Result Buttons */}
                <div className="flex gap-1">
                    <button 
                        onClick={() => onMoveLead(lead.id, 'interested')}
                        className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded transition-colors"
                        title="Demonstrou Interesse"
                    >
                        <ThumbsUp size={12} />
                    </button>
                    <button 
                        onClick={() => onMoveLead(lead.id, 'not_interested')}
                        className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded transition-colors"
                        title="Não tem Interesse"
                    >
                        <ThumbsDown size={12} />
                    </button>
                </div>
              </div>
            )}
            
            {/* If terminal, allow moving back to C4 just in case of mistake */}
            {isTerminal && (
                <button 
                    onClick={() => onMoveLead(lead.id, 'c4')}
                    className="w-full mt-2 text-[10px] text-slate-400 hover:text-indigo-600 hover:underline text-center"
                >
                    Retornar para o fluxo
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main CRM Component ---

export const CRM: React.FC<CRMProps> = ({ leads, setLeads }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Weekly Navigation State
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day; // adjust when day is sunday
    return new Date(today.setDate(diff));
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDateForAdd, setTargetDateForAdd] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Stats for the "Overview"
  const totalInterested = useMemo(() => leads.filter(l => l.status === 'interested').length, [leads]);
  const totalNotInterested = useMemo(() => leads.filter(l => l.status === 'not_interested').length, [leads]);

  // --- Date Helpers ---

  const getWeekDays = (startDate: Date) => {
    const days = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // --- Filter Logic ---
  const getLeadsForDate = (viewDateStr: string) => {
    const viewDate = new Date(viewDateStr + 'T00:00:00');
    const day = viewDate.getDay();
    const diff = viewDate.getDate() - day;
    const weekStart = new Date(viewDate);
    weekStart.setDate(diff);
    weekStart.setHours(0,0,0,0);
    
    return leads.filter(l => {
        if (l.date === viewDateStr) return true;

        if (l.date < viewDateStr) {
             const leadDate = new Date(l.date + 'T00:00:00');
             if (leadDate >= weekStart) {
                 if (l.status === 'interested' || l.status === 'not_interested') {
                     return false; 
                 }
                 return true;
             }
        }
        return false;
    });
  };

  // --- Handlers ---

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleDeleteLead = (id: string) => {
      // Deleting immediately as requested ("Apagar leads ao clicar em lixeira")
      setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleMoveLead = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };
  
  const handleAdvanceAll = (ids: string[], nextStatus: LeadStatus) => {
      // Updating all matching IDs to the next status
      setLeads(prev => prev.map(l => {
          if (ids.includes(l.id)) {
              return { ...l, status: nextStatus };
          }
          return l;
      }));
  };

  const handleDropLead = (e: React.DragEvent, targetStatus: LeadStatus) => {
      const leadId = e.dataTransfer.getData('leadId');
      if (leadId) {
          handleMoveLead(leadId, targetStatus);
      }
  };

  const openAddLeadModal = (date: string) => {
    setTargetDateForAdd(date);
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditLeadModal = (lead: Lead) => {
      setEditingLead(lead);
      setIsModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const notes = formData.get('notes') as string;

    if (editingLead) {
        setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, name, company, notes } : l));
    } else if (targetDateForAdd) {
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            company,
            status: 'todo',
            date: targetDateForAdd,
            notes
        };
        setLeads([...leads, newLead]);
    }
    setIsModalOpen(false);
    setEditingLead(null);
    setTargetDateForAdd(null);
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Central de Prospecção</h1>
                <p className="text-slate-500 mt-1">Gerencie a prospecção semanal da Agência INA.</p>
            </div>
            
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm p-1">
                <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="px-6 flex flex-col items-center min-w-[180px]">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Semana de</span>
                    <span className="font-semibold text-slate-800">
                        {currentWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} 
                        {' - '} 
                        {weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                </div>
                <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-8 rounded-2xl shadow-sm flex items-center gap-6">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <ThumbsUp size={40} />
                </div>
                <div>
                    <p className="text-emerald-900 font-semibold mb-1 text-lg">Demonstrou Interesse</p>
                    <p className="text-5xl font-bold text-emerald-700 tracking-tight">{totalInterested}</p>
                    <p className="text-sm text-emerald-600/70 mt-2 font-medium">Total Acumulado</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-8 rounded-2xl shadow-sm flex items-center gap-6">
                <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
                    <ThumbsDown size={40} />
                </div>
                <div>
                    <p className="text-rose-900 font-semibold mb-1 text-lg">Não Tem Interesse</p>
                    <p className="text-5xl font-bold text-rose-700 tracking-tight">{totalNotInterested}</p>
                    <p className="text-sm text-rose-600/70 mt-2 font-medium">Total Acumulado</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <CalendarIcon size={20} className="text-indigo-600"/>
                Dias da Semana
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {weekDays.map((dateStr) => {
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                    const dayNum = dateObj.getDate();
                    
                    const dayLeads = getLeadsForDate(dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const interestedCount = dayLeads.filter(l => l.status === 'interested').length;
                    const notInterestedCount = dayLeads.filter(l => l.status === 'not_interested').length;
                    const newLeadsCreatedToday = leads.filter(l => l.date === dateStr).length;

                    return (
                        <div 
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`relative rounded-xl border transition-all cursor-pointer group hover:shadow-lg overflow-hidden flex flex-col ${
                                isToday 
                                ? 'bg-white border-indigo-500 ring-2 ring-indigo-100' 
                                : 'bg-white border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${isToday ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{dayName.split('-')[0]}</p>
                                    <p className={`text-xl font-bold ${isToday ? 'text-indigo-700' : 'text-slate-800'}`}>{dayNum}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    newLeadsCreatedToday > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                }`} title="Novas abordagens criadas neste dia">
                                    {newLeadsCreatedToday}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col gap-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Interessados</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{interestedCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Sem Interesse</span>
                                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{notInterestedCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                                        <span className="text-slate-400 font-medium">Em andamento</span>
                                        <span className="font-bold text-slate-600">{dayLeads.length - interestedCount - notInterestedCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );

  const renderDailyKanban = () => {
    if (!selectedDate) return null;
    
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const dayLeads = getLeadsForDate(selectedDate);
    const createdTodayCount = leads.filter(l => l.date === selectedDate).length;

    return (
        <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedDate(null)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Voltar para Calendário"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                             Kanban do Dia 
                             <span className="text-indigo-600">{dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' })}</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                            Mostrando leads ativos da semana até esta data.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="font-medium">Novas Abordagens Hoje:</span>
                        <span className="text-indigo-600 font-bold">
                            {createdTodayCount}
                        </span>
                    </div>

                    <button 
                        onClick={() => openAddLeadModal(selectedDate)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white text-sm transition-all shadow-sm bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
                    >
                        <Plus size={18} />
                        Adicionar Lead
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 p-6">
                <div className="flex h-full gap-4 min-w-max">
                    <KanbanColumn 
                        title="Sem Contato" 
                        status="todo" 
                        leads={dayLeads.filter(l => l.status === 'todo')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onAdvanceAll={handleAdvanceAll}
                        onDropLead={handleDropLead}
                    />
                    <KanbanColumn 
                        title="C1 - Primeiro Contato" 
                        status="c1" 
                        leads={dayLeads.filter(l => l.status === 'c1')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onAdvanceAll={handleAdvanceAll}
                        onDropLead={handleDropLead}
                    />
                    <KanbanColumn 
                        title="C2 - Segundo Contato" 
                        status="c2" 
                        leads={dayLeads.filter(l => l.status === 'c2')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onAdvanceAll={handleAdvanceAll}
                        onDropLead={handleDropLead}
                    />
                    <KanbanColumn 
                        title="C3 - Terceiro Contato" 
                        status="c3" 
                        leads={dayLeads.filter(l => l.status === 'c3')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onAdvanceAll={handleAdvanceAll}
                        onDropLead={handleDropLead}
                    />
                     <KanbanColumn 
                        title="C4 - Quarto Contato" 
                        status="c4" 
                        leads={dayLeads.filter(l => l.status === 'c4')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onAdvanceAll={handleAdvanceAll}
                        onDropLead={handleDropLead}
                    />
                    
                    <div className="w-px bg-slate-300 my-8 mx-2 border-r border-dashed border-slate-300 opacity-50"></div>

                    <KanbanColumn 
                        title="Demonstrou Interesse" 
                        status="interested" 
                        leads={dayLeads.filter(l => l.status === 'interested')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onDropLead={handleDropLead}
                    />
                    <KanbanColumn 
                        title="Não tem Interesse" 
                        status="not_interested" 
                        leads={dayLeads.filter(l => l.status === 'not_interested')} 
                        onMoveLead={handleMoveLead}
                        onDeleteLead={handleDeleteLead}
                        onEditLead={openEditLeadModal}
                        onDropLead={handleDropLead}
                    />
                </div>
            </div>
        </div>
    );
  };

  return (
    <>
      {selectedDate ? renderDailyKanban() : renderOverview()}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingLead(null);
            setTargetDateForAdd(null);
        }}
        title={editingLead ? "Editar Lead" : "Novo Lead para Prospecção"}
        footer={
            <div className="flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={() => {
                        setIsModalOpen(false);
                        setEditingLead(null);
                        setTargetDateForAdd(null);
                    }}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    form="lead-form"
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    {editingLead ? "Salvar Alterações" : "Adicionar Lead"}
                </button>
            </div>
        }
      >
        <form id="lead-form" onSubmit={handleSaveLead} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
                <input 
                    name="company" 
                    type="text" 
                    defaultValue={editingLead?.company}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ex: Tech Solutions Ltda"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Contato</label>
                <input 
                    name="name" 
                    type="text" 
                    defaultValue={editingLead?.name}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ex: João Silva"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas Iniciais</label>
                <textarea 
                    name="notes" 
                    rows={3}
                    defaultValue={editingLead?.notes}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="Observações importantes..."
                />
            </div>
        </form>
      </Modal>
    </>
  );
};