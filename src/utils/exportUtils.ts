import { StatusEntry, Schedule } from '../types';

export const exportToWhatsApp = (entries: StatusEntry[]): string => {
  const today = new Date('2025-07-15T00:00:00').toLocaleDateString('pt-BR');
  let message = `🚛 *RELATÓRIO DE TRANSPORTES*\n📅 Data: ${today}\n\n`;
  
  const pendingEntries = entries.filter(entry => entry.status === 'PENDENTE');
  const finishedEntries = entries.filter(entry => entry.status === 'FINALIZADO');
  
  if (pendingEntries.length > 0) {
    message += `⏳ *PENDENTES (${pendingEntries.length})*\n`;
    pendingEntries.forEach((entry, index) => {
      message += `${index + 1}. SAP: ${entry.transportSap}\n`;
      message += `   Rota: ${entry.route}\n`;
      message += `   Destino: ${entry.destination}\n`;
      if (entry.plate) message += `   Placa: ${entry.plate}\n`;
      if (entry.driver) message += `   Motorista: ${entry.driver}\n`;
      message += '\n';
    });
  }
  
  if (finishedEntries.length > 0) {
    message += `✅ *FINALIZADOS (${finishedEntries.length})*\n`;
    finishedEntries.forEach((entry, index) => {
      message += `${index + 1}. SAP: ${entry.transportSap}\n`;
      message += `   Rota: ${entry.route}\n`;
      message += `   Destino: ${entry.destination}\n`;
      if (entry.plate) message += `   Placa: ${entry.plate}\n`;
      if (entry.driver) message += `   Motorista: ${entry.driver}\n`;
      message += '\n';
    });
  }
  
  message += `📊 *RESUMO*\n`;
  message += `Total: ${entries.length}\n`;
  message += `Pendentes: ${pendingEntries.length}\n`;
  message += `Finalizados: ${finishedEntries.length}`;
  
  // Truncate message if it exceeds 2000 characters
  if (message.length > 2000) {
    message = message.substring(0, 1950) + '...\n\n*Mensagem truncada*';
  }
  
  return message;
};

export const exportToExcel = (entries: StatusEntry[], filename: string) => {
  const headers = [
    'OPERAÇÃO', 'Nº', 'INDÚSTRIA', 'HORÁRIO PREVISTO', 'PLACA', 'MOTORISTA',
    'ORIGEM', 'DESTINO', 'DATA TRANSPORTE', 'TRANSPORTE SAP', 'ROTA', 'PESO',
    'CAIXAS', 'RESPONSÁVEL', 'INÍCIO', 'FIM', 'PALLETS REFRIGERADOS',
    'PALLETS SECOS', 'QTD PALLETS', 'SEPARAÇÃO', 'OBSERVAÇÃO', 'TERMO PALLET',
    'CTE', 'MDFE', 'AE', 'HORÁRIO SAÍDA ORIGEM', 'HORÁRIO DESTINO CHEGADA',
    'DOC RELATÓRIO FINANCEIRO', 'DOC TERMO PALLETS', 'DOC PROTOCOLOS',
    'DOC CANHOTOS', 'STATUS'
  ];
  
  const csvContent = [
    headers.join(','),
    ...entries.map(entry => [
      entry.operation,
      entry.number,
      entry.industry,
      entry.scheduledTime,
      entry.plate,
      entry.driver,
      entry.origin,
      entry.destination,
      new Date(entry.transportDate + 'T00:00:00').toLocaleDateString('pt-BR'),
      entry.transportSap,
      entry.route,
      entry.weight,
      entry.boxes,
      entry.responsible,
      entry.start,
      entry.end,
      entry.refrigeratedPallets,
      entry.dryPallets,
      entry.refrigeratedPallets + entry.dryPallets,
      entry.separation,
      entry.observation,
      entry.palletTerm,
      entry.cte,
      entry.mdfe,
      entry.ae,
      entry.originDepartureTime,
      entry.destinationArrivalTime,
      entry.financialReportDoc ? 'SIM' : 'NÃO',
      entry.palletTermDoc ? 'SIM' : 'NÃO',
      entry.protocolsDoc ? 'SIM' : 'NÃO',
      entry.receiptsDoc ? 'SIM' : 'NÃO',
      entry.status
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date('2025-07-15').toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportStatusToExcel = (entries: StatusEntry[], filename: string, type: 'daily' | 'monthly' = 'daily') => {
  const today = new Date('2025-07-15T00:00:00');
  let filteredEntries = entries;
  
  if (type === 'daily') {
    const todayStr = '2025-07-15';
    filteredEntries = entries.filter(entry => entry.transportDate === todayStr);
  } else if (type === 'monthly') {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.transportDate + 'T00:00:00');
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
  }
  
  exportToExcel(filteredEntries, `${filename}-${type}`);
};

export const exportSchedulesToExcel = (schedules: Schedule[], filename: string, type: 'daily' | 'monthly' = 'daily') => {
  const today = new Date('2025-07-15T00:00:00');
  let filteredSchedules = schedules;
  
  if (type === 'daily') {
    const todayStr = '2025-07-15';
    filteredSchedules = schedules.filter(schedule => schedule.date === todayStr);
  } else if (type === 'monthly') {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    filteredSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date + 'T00:00:00');
      return scheduleDate.getMonth() === currentMonth && scheduleDate.getFullYear() === currentYear;
    });
  }
  
  const headers = [
    'DATA', 'TÍTULO', 'PLACA', 'MOTORISTA', 'ORIGEM', 'DESTINOS', 'STATUS VEÍCULO', 'CRIADO EM'
  ];
  
  const rows: string[] = [];
  
  filteredSchedules.forEach(schedule => {
    schedule.vehicles.forEach(vehicle => {
      rows.push([
        new Date(schedule.date + 'T00:00:00').toLocaleDateString('pt-BR'),
        schedule.title,
        vehicle.plate,
        vehicle.driver,
        vehicle.origin,
        vehicle.destinations.map(d => `${d.name}${d.time ? ` (${d.time})` : ''}`).join('; '),
        vehicle.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Concluído',
        new Date(schedule.createdAt).toLocaleString('pt-BR')
      ].join(','));
    });
  });
  
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${type}-${today.toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};