export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'elder' | 'family' | 'staff';
  phone: string;
  address: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  path: string;
  color: string;
  badge?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export interface HealthRecord {
  id: string;
  date: string;
  bloodPressure: string;
  bloodSugar: string;
  sleepHours: number;
  medication: string;
  status: 'normal' | 'warning' | 'abnormal';
}

export interface ServiceOrder {
  id: string;
  serviceName: string;
  serviceType: 'meal' | 'barber' | 'accompany' | 'visit';
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  staffName?: string;
  staffPhone?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}
