import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Tasks } from './pages/Tasks';
import { Reports } from './pages/Reports';
import { MOCK_LEADS } from './constants';
import { Lead } from './types';

const App: React.FC = () => {
  // Lifted state to ensure Dashboard reflects CRM changes immediately
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('ina_leads');
    return saved ? JSON.parse(saved) : MOCK_LEADS;
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem('ina_leads', JSON.stringify(leads));
  }, [leads]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard leads={leads} />} />
          <Route 
            path="/crm" 
            element={<CRM leads={leads} setLeads={setLeads} />} 
          />
          <Route path="/calendar" element={<Tasks />} />
          {/* Reports now redirects to Dashboard as requested to replace it with the real dashboard */}
          <Route path="/reports" element={<Navigate to="/" replace />} />
          <Route path="/settings" element={<div className="p-8 text-center text-slate-500">Configurações em desenvolvimento...</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;