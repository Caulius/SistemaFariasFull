import React, { useState } from 'react';
import { Calendar, Filter, Search, Plus, Edit2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusEntry, PreRegistrationData } from '../types';
import AutocompleteInput from './AutocompleteInput';

interface StatusDailyProps {
  entries: StatusEntry[];
  onUpdate: (entries: StatusEntry[]) => void;
  preRegistrationData: PreRegistrationData;
  getCurrentDate: () => string;
}

type SortField = keyof StatusEntry;
type SortDirection = 'asc' | 'desc';

const StatusDaily: React.FC<StatusDailyProps> = ({ entries, onUpdate, preRegistrationData, getCurrentDate }) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<StatusEntry>>({});
  const [sortField, setSortField] = useState<SortField>('transportSap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const filteredEntries = sortedEntries.filter(entry => {
    const matchesDate = entry.transportDate === selectedDate;
    const matchesSearch = searchTerm === '' || 
      entry.transportSap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesSearch;
  });

  const handleEdit = (entry: StatusEntry) => {
    setEditingId(entry.id);
    setEditData(entry);
  };

  const handleSave = () => {
    if (editingId && editData) {
      const updatedEntries = entries.map(entry => 
        entry.id === editingId ? { ...entry, ...editData } : entry
      );
      onUpdate(updatedEntries);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof StatusEntry, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalPallets = (refrigerated: number, dry: number) => {
    return refrigerated + dry;
  };

  const addNewEntry = () => {
    const newEntry: StatusEntry = {
      id: `new-${Date.now()}`,
      operation: '',
      number: '',
      industry: '',
      scheduledTime: '',
      plate: '',
      driver: '',
      origin: '',
      destination: '',
      transportDate: selectedDate,
      transportSap: '',
      route: '',
      weight: 0,
      boxes: 0,
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
      status: 'PENDENTE'
    };
    
    onUpdate([...entries, newEntry]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="text-left p-2 cursor-pointer hover:bg-gray-600 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  const renderCell = (entry: StatusEntry, field: keyof StatusEntry) => {
    const isEditing = editingId === entry.id;
    const value = isEditing ? editData[field] : entry[field];

    if (field === 'status') {
      return (
        <select
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          <option value="PENDENTE">PENDENTE</option>
          <option value="FINALIZADO">FINALIZADO</option>
        </select>
      );
    }

    if (field === 'operation') {
      return (
        <AutocompleteInput
          value={value as string}
          onChange={(val) => handleInputChange(field, val)}
          suggestions={preRegistrationData.operations}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (field === 'origin') {
      return (
        <AutocompleteInput
          value={value as string}
          onChange={(val) => handleInputChange(field, val)}
          suggestions={preRegistrationData.origins}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (field === 'destination') {
      return (
        <AutocompleteInput
          value={value as string}
          onChange={(val) => handleInputChange(field, val)}
          suggestions={preRegistrationData.destinations}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (field === 'industry') {
      return (
        <AutocompleteInput
          value={value as string}
          onChange={(val) => handleInputChange(field, val)}
          suggestions={preRegistrationData.industries}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handleInputChange(field, e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
      );
    }

    if (field === 'observation') {
      return (
        <textarea
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50 resize-none"
          rows={2}
        />
      );
    }

    return (
      <input
        type="text"
        value={value as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isEditing}
        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Status Diário - {formatDate(selectedDate)}</h2>
          <button
            onClick={addNewEntry}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Transporte</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por SAP, rota ou destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        
        {/* Container com barra de rolagem sempre visível */}
        <div className="relative">
          <div 
            className="overflow-x-auto overflow-y-auto max-h-96"
            style={{ 
              overflowX: 'scroll',
              scrollbarWidth: 'auto',
              msOverflowStyle: 'auto'
            }}
          >
            <table className="w-full text-sm min-w-max">
              <thead className="sticky top-0 bg-gray-800 z-10">
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2 sticky left-0 bg-gray-800 z-20">Ações</th>
                  <SortableHeader field="operation">Operação</SortableHeader>
                  <SortableHeader field="number">Nº</SortableHeader>
                  <SortableHeader field="industry">Indústria</SortableHeader>
                  <SortableHeader field="scheduledTime">Horário Prev.</SortableHeader>
                  <SortableHeader field="plate">Placa</SortableHeader>
                  <SortableHeader field="driver">Motorista</SortableHeader>
                  <SortableHeader field="origin">Origem</SortableHeader>
                  <SortableHeader field="destination">Destino</SortableHeader>
                  <SortableHeader field="transportSap">SAP</SortableHeader>
                  <SortableHeader field="route">Rota</SortableHeader>
                  <SortableHeader field="weight">Peso</SortableHeader>
                  <SortableHeader field="boxes">Caixas</SortableHeader>
                  <SortableHeader field="responsible">Responsável</SortableHeader>
                  <SortableHeader field="start">Início</SortableHeader>
                  <SortableHeader field="end">Fim</SortableHeader>
                  <SortableHeader field="refrigeratedPallets">Pallets Refrig.</SortableHeader>
                  <SortableHeader field="dryPallets">Pallets Secos</SortableHeader>
                  <th className="text-left p-2">Qtd Total</th>
                  <SortableHeader field="separation">Separação</SortableHeader>
                  <SortableHeader field="observation">Observação</SortableHeader>
                  <th className="text-left p-2">Rel. Financeiro</th>
                  <th className="text-left p-2">Termo Pallets</th>
                  <th className="text-left p-2">Protocolos</th>
                  <th className="text-left p-2">Canhotos</th>
                  <SortableHeader field="status">Status</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-2 sticky left-0 bg-gray-800">
                      {editingId === entry.id ? (
                        <div className="flex space-x-1">
                          <button
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-400 p-1"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-500 hover:text-red-400 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-orange-500 hover:text-orange-400 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'operation')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'number')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'industry')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'scheduledTime')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'plate')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'driver')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'origin')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'destination')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'transportSap')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'route')}</td>
                    <td className="p-2 min-w-20">{renderCell(entry, 'weight')}</td>
                    <td className="p-2 min-w-20">{renderCell(entry, 'boxes')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'responsible')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'start')}</td>
                    <td className="p-2 min-w-24">{renderCell(entry, 'end')}</td>
                    <td className="p-2 min-w-20">{renderCell(entry, 'refrigeratedPallets')}</td>
                    <td className="p-2 min-w-20">{renderCell(entry, 'dryPallets')}</td>
                    <td className="p-2 min-w-20 font-bold text-orange-400">
                      {calculateTotalPallets(entry.refrigeratedPallets, entry.dryPallets)}
                    </td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'separation')}</td>
                    <td className="p-2 min-w-40">{renderCell(entry, 'observation')}</td>
                    <td className="p-2 text-center">{renderCell(entry, 'financialReportDoc')}</td>
                    <td className="p-2 text-center">{renderCell(entry, 'palletTermDoc')}</td>
                    <td className="p-2 text-center">{renderCell(entry, 'protocolsDoc')}</td>
                    <td className="p-2 text-center">{renderCell(entry, 'receiptsDoc')}</td>
                    <td className="p-2 min-w-32">{renderCell(entry, 'status')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Força a barra de rolagem a aparecer sempre */}
          <style jsx>{`
            .overflow-x-auto::-webkit-scrollbar {
              height: 12px;
              display: block !important;
            }
            .overflow-x-auto::-webkit-scrollbar-track {
              background: #374151;
              border-radius: 6px;
            }
            .overflow-x-auto::-webkit-scrollbar-thumb {
              background: #6B7280;
              border-radius: 6px;
            }
            .overflow-x-auto::-webkit-scrollbar-thumb:hover {
              background: #9CA3AF;
            }
          `}</style>
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum transporte encontrado para a data selecionada.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDaily;