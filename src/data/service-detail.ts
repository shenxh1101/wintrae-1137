export interface ServiceDetail {
  id: string;
  orderId: string;
  serviceName: string;
  serviceType: 'meal' | 'barber' | 'accompany' | 'visit';
  appointmentTime: string;
  appointmentAddress: string;
  status: 'pending' | 'confirmed' | 'in_service' | 'completed' | 'cancelled';
  staff: {
    name: string;
    phone: string;
    avatar: string;
    position: string;
  };
  elder: {
    name: string;
    phone: string;
    address: string;
  };
  summary?: string;
  photos?: string[];
  createdAt: string;
}

export const mockServiceDetail: ServiceDetail = {
  id: '1',
  orderId: 'ORD20240615001',
  serviceName: '陪诊服务',
  serviceType: 'accompany',
  appointmentTime: '2024-06-15 08:00',
  appointmentAddress: '北京大学第一医院',
  status: 'confirmed',
  staff: {
    name: '王护士',
    phone: '13900139000',
    avatar: 'https://picsum.photos/id/64/200/200',
    position: '专业陪诊师'
  },
  elder: {
    name: '王大爷',
    phone: '13800138000',
    address: '阳光社区 1号楼 101室'
  },
  createdAt: '2024-06-10 14:30'
};
