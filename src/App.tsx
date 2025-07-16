import React, { useState, useEffect } from 'react';
import { Truck, Calendar, FileText, Settings, Import, MessageSquare, Download, BarChart3 } from 'lucide-react';
import ImportBox from './components/ImportBox';
import StatusDaily from './components/StatusDaily';
import DailySchedule from './components/DailySchedule';
import PreRegistration from './components/PreRegistration';
import Dashboard from './components/Dashboard';
import { Transport, StatusEntry, PreRegistrationData, Schedule } from './types';
import { exportToWhatsApp, exportToExcel, exportStatusToExcel, exportSchedulesToExcel } from './utils/exportUtils';
import {
  getStatusEntries,
  addStatusEntry,
  updateStatusEntry,
  getSchedules,
  addSchedule,
  updateSchedule,
  getPreRegistrationData,
  updatePreRegistrationData,
  getTransports,
  addTransport
} from './services/firebaseService';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'import' | 'status' | 'schedule' | 'settings'>('dashboard');
  const [transports, setTransports] = useState<Transport[]>([]);
  const [statusEntries, setStatusEntries] = useState<StatusEntry[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [preRegistrationData, setPreRegistrationData] = useState<PreRegistrationData>({
    operations: [],
    numbers: [],
    industries: [],
    origins: [],
    destinations: [],
    plates: [],
    drivers: []
  });
  const [loading, setLoading] = useState(true);

  // Corrigir data para 15/07/2025
  const getCurrentDate = () => {
    return '2025-07-15';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, schedulesData, preRegData, transportsData] = await Promise.all([
        getStatusEntries(),
        getSchedules(),
        getPreRegistrationData(),
        getTransports()
      ]);

      setStatusEntries(statusData);
      setSchedules(schedulesData);
      setPreRegistrationData(preRegData);
      setTransports(transportsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async (importedTransports: Transport[]) => {
    try {
      // Save transports to Firebase
      const transportPromises = importedTransports.map(transport => 
        addTransport(transport)
      );
      await Promise.all(transportPromises);
      
      setTransports(importedTransports);
      
      // Sync with status entries
      const newStatusEntries = importedTransports.map(transport => ({
        id: transport.id,
        transportSap: transport.transportSap,
        route: transport.route,
        weight: transport.weight,
        boxes: transport.boxes,
        operation: '',
        number: '',
        industry: '',
        scheduledTime: '',
        plate: '',
        driver: '',
        origin: '',
        destination: '',
        transportDate: getCurrentDate(),
        responsible: '',
        start: '',
        end: '',
        refrigeratedPallets: 0,
        dryPallets: 0,
        separation: '',
        observation: '',
        palletTerm: '',
        cte: '',
        mdfe: '',
        ae: '',
        originDepartureTime: '',
        destinationArrivalTime: '',
        financialReportDoc: false,
        palletTermDoc: false,
        protocolsDoc: false,
        receiptsDoc: false,
        status: 'PENDENTE' as const
      }));

      // Save status entries to Firebase
      const statusPromises = newStatusEntries.map(entry => 
        addStatusEntry(entry)
      );
      await Promise.all(statusPromises);

      setStatusEntries(newStatusEntries);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Erro ao importar dados. Tente novamente.');
    }
  };

  const handleStatusUpdate = async (updatedEntries: StatusEntry[]) => {
    try {
      setStatusEntries(updatedEntries);
      // Update in Firebase would be handled by individual entry updates
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSchedulesUpdate = async (updatedSchedules: Schedule[]) => {
    try {
      setSchedules(updatedSchedules);
      // Update in Firebase would be handled by individual schedule updates
    } catch (error) {
      console.error('Error updating schedules:', error);
    }
  };

  const handlePreRegistrationUpdate = async (data: PreRegistrationData) => {
    try {
      await updatePreRegistrationData(data);
      setPreRegistrationData(data);
    } catch (error) {
      console.error('Error updating pre-registration data:', error);
      alert('Erro ao atualizar cadastros. Tente novamente.');
    }
  };

  const handleWhatsAppExport = () => {
    const message = exportToWhatsApp(statusEntries);
    navigator.clipboard.writeText(message);
    alert('Mensagem copiada para a área de transferência!');
  };

  const handleExcelExport = () => {
    exportToExcel(statusEntries, 'relatorio-transporte');
  };

  const handleStatusDailyExport = () => {
    exportStatusToExcel(statusEntries, 'status-diario');
  };

  const handleStatusMonthlyExport = () => {
    exportStatusToExcel(statusEntries, 'status-mensal', 'monthly');
  };

  const handleSchedulesDailyExport = () => {
    exportSchedulesToExcel(schedules, 'programacoes-diarias');
  };

  const handleSchedulesMonthlyExport = () => {
    exportSchedulesToExcel(schedules, 'programacoes-mensais', 'monthly');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'import', label: 'Importação', icon: Import },
    { id: 'status', label: 'Status Diário', icon: FileText },
    { id: 'schedule', label: 'Programação', icon: Calendar },
    { id: 'settings', label: 'Cadastros', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-bold">Sistema de Gestão de Rotas</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Relatórios</span>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-300 px-2 py-1">Status Diário</div>
                    <button
                      onClick={handleStatusDailyExport}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded"
                    >
                      Relatório Diário
                    </button>
                    <button
                      onClick={handleStatusMonthlyExport}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded"
                    >
                      Relatório Mensal
                    </button>
                    <div className="text-sm font-medium text-gray-300 px-2 py-1 mt-2">Programações</div>
                    <button
                      onClick={handleSchedulesDailyExport}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded"
                    >
                      Relatório Diário
                    </button>
                    <button
                      onClick={handleSchedulesMonthlyExport}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded"
                    >
                      Relatório Mensal
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleWhatsAppExport}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            statusEntries={statusEntries}
            schedules={schedules}
            onStatusUpdate={handleStatusUpdate}
            onScheduleUpdate={handleSchedulesUpdate}
            onNavigateToSchedule={() => setActiveTab('schedule')}
            getCurrentDate={getCurrentDate}
          />
        )}
        
        {activeTab === 'import' && (
          <ImportBox onImportData={handleImportData} />
        )}
        
        {activeTab === 'status' && (
          <StatusDaily 
            entries={statusEntries} 
            onUpdate={handleStatusUpdate}
            preRegistrationData={preRegistrationData}
            getCurrentDate={getCurrentDate}
          />
        )}
        
        {activeTab === 'schedule' && (
          <DailySchedule 
            schedules={schedules}
            onUpdate={handleSchedulesUpdate}
            preRegistrationData={preRegistrationData}
            getCurrentDate={getCurrentDate}
          />
        )}
        
        {activeTab === 'settings' && (
          <PreRegistration 
            data={preRegistrationData}
            onUpdate={handlePreRegistrationUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default App;