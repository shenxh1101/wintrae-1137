import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthRecord } from '@/types';

interface HealthContextType {
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  getRecentRecords: (days: number) => HealthRecord[];
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    const stored = Taro.getStorageSync('healthRecords');
    if (stored) {
      setHealthRecords(stored);
    }
  }, []);

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: `record_${Date.now()}`
    };

    const updatedRecords = [newRecord, ...healthRecords];
    setHealthRecords(updatedRecords);
    Taro.setStorageSync('healthRecords', updatedRecords);
  };

  const getRecentRecords = (days: number) => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return healthRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= cutoffDate;
    }).slice(0, days);
  };

  return (
    <HealthContext.Provider value={{ healthRecords, addHealthRecord, getRecentRecords }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider');
  }
  return context;
};

import Taro from '@tarojs/taro';
