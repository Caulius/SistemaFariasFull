import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { StatusEntry, Schedule, PreRegistrationData, Transport } from '../types';

// Collections
const COLLECTIONS = {
  STATUS_ENTRIES: 'statusEntries',
  SCHEDULES: 'schedules',
  PRE_REGISTRATION: 'preRegistration',
  TRANSPORTS: 'transports'
};

// Status Entries
export const getStatusEntries = async (): Promise<StatusEntry[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.STATUS_ENTRIES));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StatusEntry));
  } catch (error) {
    console.error('Error getting status entries:', error);
    return [];
  }
};

export const addStatusEntry = async (entry: Omit<StatusEntry, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.STATUS_ENTRIES), entry);
    return docRef.id;
  } catch (error) {
    console.error('Error adding status entry:', error);
    throw error;
  }
};

export const updateStatusEntry = async (id: string, entry: Partial<StatusEntry>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.STATUS_ENTRIES, id);
    await updateDoc(docRef, entry);
  } catch (error) {
    console.error('Error updating status entry:', error);
    throw error;
  }
};

export const deleteStatusEntry = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.STATUS_ENTRIES, id));
  } catch (error) {
    console.error('Error deleting status entry:', error);
    throw error;
  }
};

// Schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.SCHEDULES), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Schedule));
  } catch (error) {
    console.error('Error getting schedules:', error);
    return [];
  }
};

export const addSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SCHEDULES), {
      ...schedule,
      createdAt: Timestamp.now().toDate().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding schedule:', error);
    throw error;
  }
};

export const updateSchedule = async (id: string, schedule: Partial<Schedule>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.SCHEDULES, id);
    await updateDoc(docRef, schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SCHEDULES, id));
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

// Pre Registration Data
export const getPreRegistrationData = async (): Promise<PreRegistrationData> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRE_REGISTRATION));
    if (querySnapshot.empty) {
      return {
        operations: [],
        numbers: [],
        industries: [],
        origins: [],
        destinations: [],
        plates: [],
        drivers: []
      };
    }
    
    const doc = querySnapshot.docs[0];
    return doc.data() as PreRegistrationData;
  } catch (error) {
    console.error('Error getting pre-registration data:', error);
    return {
      operations: [],
      numbers: [],
      industries: [],
      origins: [],
      destinations: [],
      plates: [],
      drivers: []
    };
  }
};

export const updatePreRegistrationData = async (data: PreRegistrationData): Promise<void> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRE_REGISTRATION));
    
    if (querySnapshot.empty) {
      await addDoc(collection(db, COLLECTIONS.PRE_REGISTRATION), data);
    } else {
      const docRef = doc(db, COLLECTIONS.PRE_REGISTRATION, querySnapshot.docs[0].id);
      await updateDoc(docRef, data);
    }
  } catch (error) {
    console.error('Error updating pre-registration data:', error);
    throw error;
  }
};

// Transports
export const getTransports = async (): Promise<Transport[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.TRANSPORTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transport));
  } catch (error) {
    console.error('Error getting transports:', error);
    return [];
  }
};

export const addTransport = async (transport: Omit<Transport, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSPORTS), transport);
    return docRef.id;
  } catch (error) {
    console.error('Error adding transport:', error);
    throw error;
  }
};

export const updateTransport = async (id: string, transport: Partial<Transport>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.TRANSPORTS, id);
    await updateDoc(docRef, transport);
  } catch (error) {
    console.error('Error updating transport:', error);
    throw error;
  }
};

export const deleteTransport = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TRANSPORTS, id));
  } catch (error) {
    console.error('Error deleting transport:', error);
    throw error;
  }
};