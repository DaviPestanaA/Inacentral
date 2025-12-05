import React, { useState, useEffect } from 'react';
import { Check, Calendar as CalendarIcon, Trash2, Plus, X, Edit2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { MOCK_TASKS } from '../constants';
import { Task } from '../types';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Note State: persistent mapping of date -> note content
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ina_daily_notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ina_daily_notes', JSON.stringify(notes));
  }, [notes]);

  const updateNote = (date: string, content: string) => {
    setNotes(prev => ({ ...prev, [date]: content }));
  };

  // --- CRUD Operations ---

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(tasks.filter(t => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
    }
  };

  const saveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const type = formData.get('type') as any;

    if (!title || !selectedDate) return;

    if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title, type } : t));
        setEditingTask(null);
    } else {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            date: selectedDate,
            completed: false,
            type,
            owner: 'Davi'
        };
        setTasks([...tasks, newTask]);
    }

    (e.target as HTMLFormElement).reset();
  };

  const startEditing = (task: Task) => {
      setEditingTask(task);
  };

  // --- Filter Logic ---

  const getTasksForDate = (date: string) => tasks.filter(t => t.date === date);

  // --- Calendar Grid Generation ---
  
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty slots for days before start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(year, month, i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getCalendarDays();
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-indigo-600" />
            Agenda da Equipe
          </h1>
          <p className="text-slate-500">Gerencie tarefas e anotações diárias.</p>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold capitalize text-slate-800 flex items-center gap-2">
                {monthName}
            </h2>
            <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <button 
                    onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} 
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                    title="Mês Anterior"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => setViewDate(new Date())} 
                    className="px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded"
                >
                    Hoje
                </button>
                <button 
                    onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} 
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                    title="Próximo Mês"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-7 gap-4 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
                {days.map((dateStr, idx) => {
                    if (!dateStr) return <div key={`empty-${idx}`} className="bg-transparent" />;
                    
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const dayTasks = getTasksForDate(dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const hasNote = notes[dateStr] && notes[dateStr].trim().length > 0;

                    return (
                        <div 
                            key={dateStr}
                            onClick={() => {
                                setSelectedDate(dateStr);
                                setEditingTask(null);
                            }}
                            className={`min-h-[100px] border rounded-xl p-2 cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 relative group flex flex-col ${
                                isToday ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white border-slate-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
                                }`}>
                                    {dateObj.getDate()}
                                </span>
                                <div className="flex gap-1">
                                    {hasNote && <FileText size={14} className="text-amber-500" />}
                                    {dayTasks.length > 0 && (
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {dayTasks.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-1">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div key={task.id} className={`text-[10px] px-1.5 py-1 rounded truncate border-l-2 ${
                                        task.completed 
                                            ? 'opacity-50 line-through bg-slate-50 border-slate-300' 
                                            : 'bg-indigo-50 border-indigo-400 text-indigo-800'
                                    }`}>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Hover Add Button */}
                            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl backdrop-blur-[1px]">
                                <Plus className="text-indigo-600" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h3>
                        <p className="text-sm text-slate-500">Gerenciar dia</p>
                    </div>
                    <button 
                        onClick={() => setSelectedDate(null)}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {/* Notepad Section */}
                    <div className="mb-8">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                            <FileText size={16} className="text-amber-500" />
                            Bloco de Notas do Dia
                        </label>
                        <textarea
                            className="w-full h-32 p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none placeholder-slate-400"
                            placeholder="Anotações importantes para este dia..."
                            value={notes[selectedDate] || ''}
                            onChange={(e) => updateNote(selectedDate, e.target.value)}
                        />
                    </div>

                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Check size={16} className="text-indigo-600" />
                        Tarefas ({getTasksForDate(selectedDate).length})
                    </h4>
                    
                    <div className="space-y-3">
                        {getTasksForDate(selectedDate).map(task => (
                            <div 
                                key={task.id} 
                                className={`flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm transition-colors group relative ${
                                    editingTask?.id === task.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100 hover:border-indigo-100'
                                }`}
                            >
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        task.completed 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'border-slate-300 hover:border-indigo-500'
                                    }`}
                                >
                                    {task.completed && <Check size={12} strokeWidth={3} />}
                                </button>
                                
                                <div className="flex-1 cursor-pointer" onClick={() => startEditing(task)}>
                                    <p className={`font-medium text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
                                            {task.type === 'meeting' ? 'Reunião' : task.type === 'follow_up' ? 'Follow-up' : 'Geral'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEditing(task)}
                                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {getTasksForDate(selectedDate).length === 0 && (
                            <div className="text-center py-4 text-slate-400 italic text-xs border-2 border-dashed border-slate-100 rounded-xl">
                                Nenhuma tarefa agendada.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <form onSubmit={saveTask} className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                             <span className="text-xs font-bold uppercase text-slate-400">
                                 {editingTask ? 'Editando Tarefa' : 'Nova Tarefa'}
                             </span>
                             {editingTask && (
                                 <button type="button" onClick={() => setEditingTask(null)} className="text-xs text-red-500 hover:underline">
                                     Cancelar Edição
                                 </button>
                             )}
                        </div>
                        <input 
                            name="title"
                            type="text" 
                            placeholder="Descreva a tarefa..." 
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                            required
                            autoFocus
                            defaultValue={editingTask?.title || ''}
                            key={editingTask?.id || 'new'} 
                        />
                        <div className="flex gap-2">
                            <select 
                                name="type" 
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-indigo-500" 
                                defaultValue={editingTask?.type || 'general'}
                                key={`type-${editingTask?.id || 'new'}`}
                            >
                                <option value="general">Geral</option>
                                <option value="meeting">Reunião</option>
                                <option value="follow_up">Follow-up</option>
                            </select>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors">
                                {editingTask ? 'Salvar' : 'Adicionar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};