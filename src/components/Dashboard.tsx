import React from 'react';
import { Truck, Clock, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { StatusEntry, Schedule } from '../types';

interface DashboardProps {
  statusEntries: StatusEntry[];
  schedules: Schedule[];
  onStatusUpdate: (entries: StatusEntry[]) => void;
  onScheduleUpdate: (schedules: Schedule[]) => void;
  onNavigateToSchedule: () => void;
  getCurrentDate: () => string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  statusEntries, 
  schedules, 
  onScheduleUpdate,
  onNavigateToSchedule,
  getCurrentDate
}) => {
  const today = getCurrentDate();
  
  const todaySchedules = schedules.filter(schedule => schedule.date === today);
  const allVehicles = todaySchedules.flatMap(schedule => schedule.vehicles);
  const inTransitVehicles = allVehicles.filter(vehicle => vehicle.status === 'EM_TRANSITO');
  const completedVehicles = allVehicles.filter(vehicle => vehicle.status === 'CONCLUIDO');
  
  const todayStatus = statusEntries.filter(entry => entry.transportDate === today);
  const pendingStatus = todayStatus.filter(entry => entry.status === 'PENDENTE');
  const finishedStatus = todayStatus.filter(entry => entry.status === 'FINALIZADO');

  const handleCompleteVehicle = (scheduleId: string, vehicleId: string) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === scheduleId 
        ? {
            ...schedule,
            vehicles: schedule.vehicles.map(vehicle =>
              vehicle.id === vehicleId 
                ? { ...vehicle, status: 'CONCLUIDO' as const }
                : vehicle
            )
          }
        : schedule
    );
    onScheduleUpdate(updatedSchedules);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold">Dashboard - {formatDate(today)}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{allVehicles.length}</p>
                <p className="text-sm text-blue-300">Veículos Programados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-400">{inTransitVehicles.length}</p>
                <p className="text-sm text-orange-300">Em Trânsito</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-400">{completedVehicles.length}</p>
                <p className="text-sm text-green-300">Concluídos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-purple-400">{finishedStatus.length}/{todayStatus.length}</p>
                <p className="text-sm text-purple-300">Status Finalizados</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Veículos em Trânsito</h3>
              <button
                onClick={onNavigateToSchedule}
                className="text-orange-500 hover:text-orange-400 flex items-center space-x-1 text-sm"
              >
                <span>Ver Programação</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {todaySchedules.map((schedule) => 
                schedule.vehicles
                  .filter(vehicle => vehicle.status === 'EM_TRANSITO')
                  .map((vehicle) => (
                    <div key={`${schedule.id}-${vehicle.id}`} className="bg-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{vehicle.plate}</span>
                        </div>
                        <button
                          onClick={() => handleCompleteVehicle(schedule.id, vehicle.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Concluir
                        </button>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Motorista:</span>
                          <span>{vehicle.driver}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Origem:</span>
                          <span>{vehicle.origin}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Destinos:</span>
                          <span>{vehicle.destinations.map(d => d.name).join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Programação:</span>
                          <span>{schedule.title}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
              
              {inTransitVehicles.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  Nenhum veículo em trânsito hoje.
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Status dos Transportes</h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingStatus.slice(0, 5).map((entry) => (
                <div key={entry.id} className="bg-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">SAP: {entry.transportSap}</span>
                    <span className="bg-orange-600 text-xs px-2 py-1 rounded">PENDENTE</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>Rota: {entry.route}</div>
                    <div>Destino: {entry.destination}</div>
                  </div>
                </div>
              ))}
              
              {pendingStatus.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  Todos os transportes estão finalizados.
                </div>
              )}
              
              {pendingStatus.length > 5 && (
                <div className="text-center text-sm text-gray-400">
                  +{pendingStatus.length - 5} transportes pendentes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;