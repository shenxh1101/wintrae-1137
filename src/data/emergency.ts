import { EmergencyContact } from '@/types';

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: '儿子王小明',
    phone: '13900139000',
    relationship: '儿子',
    isPrimary: true
  },
  {
    id: '2',
    name: '女儿王小红',
    phone: '13800138000',
    relationship: '女儿',
    isPrimary: false
  },
  {
    id: '3',
    name: '服务站热线',
    phone: '400-888-9999',
    relationship: '服务站',
    isPrimary: false
  }
];

export const emergencyNumbers = [
  {
    id: '120',
    name: '急救电话',
    phone: '120',
    icon: '🚑',
    color: '#f53f3f'
  },
  {
    id: '110',
    name: '报警电话',
    phone: '110',
    icon: '🚔',
    color: '#165dff'
  },
  {
    id: '119',
    name: '火警电话',
    phone: '119',
    icon: '🚒',
    color: '#ff7d00'
  }
];
