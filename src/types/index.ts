export interface Transport {
  id: string;
  transportSap: string;
  route: string;
  weight: number;
  boxes: number;
}

export interface StatusEntry {
  id: string;
  operation: string;
  number: string;
  industry: string;
  scheduledTime: string;
  plate: string;
  driver: string;
  origin: string;
  destination: string;
  transportDate: string;
  transportSap: string;
  route: string;
  weight: number;
  boxes: number;
  responsible: string;
  start: string;
  end: string;
  refrigeratedPallets: number;
  dryPallets: number;
  separation: string;
  observation: string;
  palletTerm: string;
  cte: string;
  mdfe: string;
  ae: string;
  originDepartureTime: string;
  destinationArrivalTime: string;
  financialReportDoc: boolean;
  palletTermDoc: boolean;
  protocolsDoc: boolean;
  receiptsDoc: boolean;
  status: 'PENDENTE' | 'FINALIZADO';
}

export interface PreRegistrationData {
  operations: string[];
  numbers: string[];
  industries: string[];
  origins: string[];
  destinations: string[];
  plates: string[];
  drivers: string[];
}

export interface Destination {
  id: string;
  name: string;
  time?: string;
  observation?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  driver: string;
  origin: string;
  destinations: Destination[];
  status: 'EM_TRANSITO' | 'CONCLUIDO';
}

export interface Schedule {
  id: string;
  date: string;
  title: string;
  vehicles: Vehicle[];
  createdAt: string;
}