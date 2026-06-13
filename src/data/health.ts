import { HealthRecord } from '@/types';

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    date: '2024-06-14',
    bloodPressure: '120/80',
    bloodSugar: '6.5',
    sleepHours: 7.5,
    medication: '降压药 1片',
    status: 'normal'
  },
  {
    id: '2',
    date: '2024-06-13',
    bloodPressure: '125/85',
    bloodSugar: '7.2',
    sleepHours: 6.5,
    medication: '降压药 1片',
    status: 'warning'
  },
  {
    id: '3',
    date: '2024-06-12',
    bloodPressure: '118/78',
    bloodSugar: '6.2',
    sleepHours: 8.0,
    medication: '降压药 1片',
    status: 'normal'
  },
  {
    id: '4',
    date: '2024-06-11',
    bloodPressure: '130/88',
    bloodSugar: '7.8',
    sleepHours: 5.5,
    medication: '降压药 1片，血糖药 1片',
    status: 'abnormal'
  },
  {
    id: '5',
    date: '2024-06-10',
    bloodPressure: '122/82',
    bloodSugar: '6.4',
    sleepHours: 7.0,
    medication: '降压药 1片',
    status: 'normal'
  },
  {
    id: '6',
    date: '2024-06-09',
    bloodPressure: '120/79',
    bloodSugar: '6.1',
    sleepHours: 7.5,
    medication: '降压药 1片',
    status: 'normal'
  },
  {
    id: '7',
    date: '2024-06-08',
    bloodPressure: '124/83',
    bloodSugar: '6.6',
    sleepHours: 6.0,
    medication: '降压药 1片',
    status: 'normal'
  }
];

export const healthStandards = {
  bloodPressure: { min: '90/60', max: '140/90', unit: 'mmHg' },
  bloodSugar: { min: '3.9', max: '6.1', unit: 'mmol/L', fasting: '3.9-6.1', afterMeal: '7.8' },
  sleepHours: { min: 6, max: 8, unit: '小时' }
};
