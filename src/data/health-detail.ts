import { HealthRecord } from '@/types';

export const mockHealthStatistics = {
  avgBloodPressure: { systolic: 122, diastolic: 82 },
  avgBloodSugar: 6.5,
  avgSleepHours: 6.8,
  totalRecords: 28,
  normalDays: 25,
  warningDays: 2,
  abnormalDays: 1
};

export const healthTrends = {
  bloodPressure: [
    { date: '06-08', value: '120/80' },
    { date: '06-09', value: '118/78' },
    { date: '06-10', value: '122/82' },
    { date: '06-11', value: '130/88' },
    { date: '06-12', value: '118/78' },
    { date: '06-13', value: '125/85' },
    { date: '06-14', value: '120/80' }
  ],
  bloodSugar: [
    { date: '06-08', value: 6.1 },
    { date: '06-09', value: 6.4 },
    { date: '06-10', value: 6.2 },
    { date: '06-11', value: 7.8 },
    { date: '06-12', value: 6.6 },
    { date: '06-13', value: 7.2 },
    { date: '06-14', value: 6.5 }
  ],
  sleepHours: [
    { date: '06-08', value: 6.0 },
    { date: '06-09', value: 7.5 },
    { date: '06-10', value: 7.0 },
    { date: '06-11', value: 5.5 },
    { date: '06-12', value: 8.0 },
    { date: '06-13', value: 6.5 },
    { date: '06-14', value: 7.5 }
  ]
};
