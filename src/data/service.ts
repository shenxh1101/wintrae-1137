import { ServiceOrder } from '@/types';

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: string;
  available: boolean;
}

export const mockServices: Service[] = [
  {
    id: '1',
    name: '助餐服务',
    icon: '🍱',
    description: '营养午餐配送到家',
    price: '15元/份',
    available: true
  },
  {
    id: '2',
    name: '理发服务',
    icon: '✂️',
    description: '专业理发师上门服务',
    price: '30元/次',
    available: true
  },
  {
    id: '3',
    name: '陪诊服务',
    icon: '🏥',
    description: '陪同就医全程陪护',
    price: '80元/次',
    available: true
  },
  {
    id: '4',
    name: '上门巡访',
    icon: '👨‍⚕️',
    description: '定期健康检查巡访',
    price: '免费',
    available: true
  },
  {
    id: '5',
    name: '康复理疗',
    icon: '💆',
    description: '专业康复师上门理疗',
    price: '100元/次',
    available: false
  },
  {
    id: '6',
    name: '家政服务',
    icon: '🧹',
    description: '居家保洁整理服务',
    price: '50元/次',
    available: true
  }
];

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: '1',
    serviceName: '助餐服务',
    serviceType: 'meal',
    appointmentTime: '2024-06-15 11:30',
    status: 'pending',
    staffName: '待分配',
    staffPhone: ''
  },
  {
    id: '2',
    serviceName: '理发服务',
    serviceType: 'barber',
    appointmentTime: '2024-06-16 14:00',
    status: 'confirmed',
    staffName: '李师傅',
    staffPhone: '13900139000'
  },
  {
    id: '3',
    serviceName: '陪诊服务',
    serviceType: 'accompany',
    appointmentTime: '2024-06-10 08:00',
    status: 'completed',
    staffName: '王护士',
    staffPhone: '13800138001'
  },
  {
    id: '4',
    serviceName: '上门巡访',
    serviceType: 'visit',
    appointmentTime: '2024-06-08 10:00',
    status: 'completed',
    staffName: '张医生',
    staffPhone: '13700137000'
  }
];

export const serviceTypeLabels = {
  meal: '助餐',
  barber: '理发',
  accompany: '陪诊',
  visit: '巡访'
};

export const serviceStatusLabels = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消'
};
