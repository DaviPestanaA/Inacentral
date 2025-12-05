export type LeadStatus = 
  | 'todo'          // Sem Contato
  | 'c1'            // Contato 1
  | 'c2'            // Contato 2
  | 'c3'            // Contato 3
  | 'c4'            // Contato 4
  | 'interested'    // Demonstrou Interesse
  | 'not_interested'; // Não tem Interesse

export type TaskOwner = 'Davi' | 'Lucas' | 'Bia';

export interface Lead {
  id: string;
  name: string;
  company: string;
  status: LeadStatus;
  date: string; // The "Cohort" date (when the daily kanban was created)
  notes: string;
  value?: number;
}

export interface Task {
  id: string;
  title: string;
  date: string; // ISO Date string YYYY-MM-DD
  completed: boolean;
  type: 'follow_up' | 'meeting' | 'general';
  owner: TaskOwner;
}
