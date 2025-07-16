import React, { useState } from 'react';
import { Calendar, Clock, User, Truck, MapPin, MessageSquare, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Schedule, Destination, PreRegistrationData, Vehicle } from '../types';
import AutocompleteInput from './AutocompleteInput';

interface DailyScheduleProps {
  schedules: Schedule[];
  onUpdate: (schedules: Schedule[]) => void;
  preRegistrationData: PreRegistrationData;
  getCurrentDate: () => string;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ schedules, onUpdate, preRegistrationData, getCurrentDate }) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [showPreview, setShowPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    date: getCurrentDate(),
    vehicles: [{ 
      id: '1', 
      plate: '', 
      driver: '', 
      origin: '',
      destinations: [{ id: '1', name: '', time: '', observation: '' }] as Destination[],
      status: 'EM_TRANSITO' as const
    }] as Vehicle[]
  });

  const todaySchedules = schedules.filter(schedule => schedule.date === selectedDate);

  const handleAddVehicle = () => {
    setNewSchedule(prev => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        { 
          id: Date.now().toString(), 
          plate: '', 
          driver: '', 
          origin: '',
          destinations: [{ id: '1', name: '', time: '', observation: '' }],
          status: 'EM_TRANSITO'
        }
      ]
    }));
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    if (newSchedule.vehicles.length > 1) {
      setNewSchedule(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== vehicleId)
      }));
    }
  };

  const handleVehicleChange = (vehicleId: string, field: keyof Vehicle, value: any) => {
    setNewSchedule(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, [field]: value } : vehicle
      )
    }));
  };

  const handleAddDestination = (vehicleId: string) => {
    setNewSchedule(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              destinations: [
                ...vehicle.destinations,
                { id: Date.now().toString(), name: '', time: '', observation: '' }
              ]
            }
          : vehicle
      )
    }));
  };

  const handleRemoveDestination = (vehicleId: string, destinationId: string) => {
    setNewSchedule(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              destinations: vehicle.destinations.length > 1 
                ? vehicle.destinations.filter(dest => dest.id !== destinationId)
                : vehicle.destinations
            }
          : vehicle
      )
    }));
  };

  const handleDestinationChange = (vehicleId: string, destinationId: string, field: keyof Destination, value: string) => {
    setNewSchedule(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              destinations: vehicle.destinations.map(dest =>
                dest.id === destinationId ? { ...dest, [field]: value } : dest
              )
            }
          : vehicle
      )
    }));
  };

  const handleCreateSchedule = () => {
    if (newSchedule.vehicles.some(vehicle => 
          vehicle.plate && vehicle.driver && vehicle.origin && vehicle.destinations.some(dest => dest.name)
        )) {
      
      const scheduleNumber = todaySchedules.length + 1;
      const schedule: Schedule = {
        id: `schedule-${Date.now()}`,
        date: newSchedule.date,
        title: `Programação Diária ${scheduleNumber}`,
        vehicles: newSchedule.vehicles
          .filter(vehicle => vehicle.plate && vehicle.driver && vehicle.origin && vehicle.destinations.some(dest => dest.name))
          .map(vehicle => ({
            ...vehicle,
            destinations: vehicle.destinations.filter(dest => dest.name)
          })),
        createdAt: new Date().toISOString()
      };
      
      onUpdate([...schedules, schedule]);
      setNewSchedule({
        date: getCurrentDate(),
        vehicles: [{ 
          id: '1', 
          plate: '', 
          driver: '', 
          origin: '',
          destinations: [{ id: '1', name: '', time: '', observation: '' }],
          status: 'EM_TRANSITO'
        }]
      });
    } else {
      alert('Preencha pelo menos: Placa, Motorista, Origem e um Destino para cada veículo');
    }
  };

  const handleRemoveSchedule = (id: string) => {
    onUpdate(schedules.filter(s => s.id !== id));
  };

  const handleToggleVehicleStatus = (scheduleId: string, vehicleId: string) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === scheduleId 
        ? {
            ...schedule,
            vehicles: schedule.vehicles.map(vehicle =>
              vehicle.id === vehicleId 
                ? { 
                    ...vehicle, 
                    status: vehicle.status === 'EM_TRANSITO' ? 'CONCLUIDO' : 'EM_TRANSITO' as const
                  }
                : vehicle
            )
          }
        : schedule
    );
    onUpdate(updatedSchedules);
  };

  const generateWhatsAppMessage = (schedule: Schedule) => {
    const date = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR');
    let message = `🚛 *${schedule.title.toUpperCase()}*\n📅 Data: ${date}\n\n`;
    
    schedule.vehicles.forEach((vehicle, vehicleIndex) => {
      message += `🚚 Veículo ${vehicleIndex + 1}:\n`;
      message += `   *Placa: ${vehicle.plate}*\n`;
      message += `   👤 Motorista: ${vehicle.driver}\n`;
      message += `   📍 Origem: ${vehicle.origin}\n`;
      
      vehicle.destinations.forEach((dest, destIndex) => {
        message += `   🎯 Destino ${destIndex + 1}: ${dest.name}\n`;
        if (dest.time) {
          message += `   🕐 Horário: ${dest.time}\n`;
        }
        if (dest.observation) {
          message += `   💬 Obs: ${dest.observation}\n`;
        }
      });
      
      // LINHA DO STATUS REMOVIDA AQUI
      message += `\n`; // Apenas uma linha em branco entre veículos
    });
    
    message += `📈 Total de veículos: ${schedule.vehicles.length}`;
    
    return message;
  };

  const handlePreviewWhatsApp = (schedule: Schedule) => {
    const message = generateWhatsAppMessage(schedule);
    setPreviewMessage(message);
    setEditingMessage(message);
    setSelectedScheduleId(schedule.id);
    setShowPreview(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editingMessage);
    alert('Mensagem copiada para a área de transferência!');
    setShowPreview(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Programação Diária - {formatDate(selectedDate)}</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nova Programação</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Data da Programação</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Veículos</label>
                  <button
                    onClick={handleAddVehicle}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Adicionar Veículo</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newSchedule.vehicles.map((vehicle, vehicleIndex) => (
                    <div key={vehicle.id} className="bg-gray-600 rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Veículo {vehicleIndex + 1}</span>
                        {newSchedule.vehicles.length > 1 && (
                          <button
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <AutocompleteInput
                          value={vehicle.plate}
                          onChange={(value) => handleVehicleChange(vehicle.id, 'plate', value)}
                          suggestions={preRegistrationData.plates}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                          placeholder="Placa do veículo *"
                        />
                        
                        <AutocompleteInput
                          value={vehicle.driver}
                          onChange={(value) => handleVehicleChange(vehicle.id, 'driver', value)}
                          suggestions={preRegistrationData.drivers}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                          placeholder="Nome do motorista *"
                        />
                        
                        <AutocompleteInput
                          value={vehicle.origin}
                          onChange={(value) => handleVehicleChange(vehicle.id, 'origin', value)}
                          suggestions={preRegistrationData.origins}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                          placeholder="Local de origem *"
                        />
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">Destinos</span>
                            <button
                              onClick={() => handleAddDestination(vehicle.id)}
                              className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs flex items-center space-x-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Destino</span>
                            </button>
                          </div>
                          
                          {vehicle.destinations.map((destination, destIndex) => (
                            <div key={destination.id} className="bg-gray-700 rounded p-2 mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs">Destino {destIndex + 1}</span>
                                {vehicle.destinations.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveDestination(vehicle.id, destination.id)}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <AutocompleteInput
                                  value={destination.name}
                                  onChange={(value) => handleDestinationChange(vehicle.id, destination.id, 'name', value)}
                                  suggestions={preRegistrationData.destinations}
                                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500"
                                  placeholder="Nome do destino *"
                                />
                                
                                <input
                                  type="time"
                                  value={destination.time}
                                  onChange={(e) => handleDestinationChange(vehicle.id, destination.id, 'time', e.target.value)}
                                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500"
                                />
                                
                                <textarea
                                  value={destination.observation}
                                  onChange={(e) => handleDestinationChange(vehicle.id, destination.id, 'observation', e.target.value)}
                                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500 resize-none"
                                  rows={2}
                                  placeholder="Observações (opcional)"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleCreateSchedule}
                className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Criar Programação
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Programações do Dia ({todaySchedules.length})</h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">{schedule.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreviewWhatsApp(schedule)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleRemoveSchedule(schedule.id)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="mt-2">
                      <span className="text-gray-400">Veículos:</span>
                      {schedule.vehicles.map((vehicle, index) => (
                        <div key={vehicle.id} className="ml-4 mt-2 bg-gray-600 rounded p-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-400">{index + 1}.</span>
                              <span className="font-medium">{vehicle.plate}</span>
                            </div>
                            <button
                              onClick={() => handleToggleVehicleStatus(schedule.id, vehicle.id)}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                vehicle.status === 'EM_TRANSITO' 
                                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {vehicle.status === 'EM_TRANSITO' ? 'Concluir' : 'Reabrir'}
                            </button>
                          </div>
                          
                          <div className="text-xs space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span>{vehicle.driver}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>Origem: {vehicle.origin}</span>
                            </div>
                            
                            <div>
                              <span className="text-gray-400">Destinos:</span>
                              {vehicle.destinations.map((dest, destIndex) => (
                                <div key={dest.id} className="ml-2">
                                  <span>{destIndex + 1}. {dest.name}</span>
                                  {dest.time && <span className="text-gray-400"> ({dest.time})</span>}
                                  {dest.observation && (
                                    <div className="ml-2 text-gray-300 text-xs">
                                      {dest.observation}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">Status:</span>
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                vehicle.status === 'EM_TRANSITO' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-green-600 text-white'
                              }`}>
                                {vehicle.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Concluído'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {todaySchedules.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhuma programação criada para esta data.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Preview WhatsApp</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <textarea
              value={editingMessage}
              onChange={(e) => setEditingMessage(e.target.value)}
              className="w-full h-64 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 resize-none"
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-400">
                {editingMessage.length}/2000 caracteres
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                  Copiar Mensagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
