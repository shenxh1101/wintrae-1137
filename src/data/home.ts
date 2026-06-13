import { User, QuickAction, Announcement } from '@/types';

export const mockUser: User = {
  id: '1',
  name: '王大爷',
  avatar: 'https://picsum.photos/id/64/200/200',
  role: 'elder',
  phone: '13800138000',
  address: '阳光社区 1号楼 101室'
};

export const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: '健康打卡',
    icon: '💉',
    path: '/pages/health/index',
    color: '#00b42a',
    badge: 0
  },
  {
    id: '2',
    title: '服务预约',
    icon: '📅',
    path: '/pages/service/index',
    color: '#165dff',
    badge: 1
  },
  {
    id: '3',
    title: '紧急联系',
    icon: '📞',
    path: '/pages/emergency/index',
    color: '#f53f3f',
    badge: 0
  },
  {
    id: '4',
    title: '家属查看',
    icon: '👨‍👩‍👧',
    path: '/pages/family/index',
    color: '#ff7d00',
    badge: 0
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '端午节放假通知',
    content: '端午节期间，服务站正常开放，欢迎老人们前来活动。',
    date: '2024-06-10',
    important: true
  },
  {
    id: '2',
    title: '健康讲座邀请',
    content: '本周五下午2点，社区服务中心举办健康讲座，欢迎参加。',
    date: '2024-06-08',
    important: false
  },
  {
    id: '3',
    title: '助餐服务调整',
    content: '6月15日起，助餐服务时间调整为11:00-12:30。',
    date: '2024-06-05',
    important: false
  }
];
