export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  action?: string;
  badge?: number;
}

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    title: '我的预约',
    icon: '📅',
    path: '/pages/service/index'
  },
  {
    id: '2',
    title: '健康记录',
    icon: '📊',
    path: '/pages/health-detail/index'
  },
  {
    id: '3',
    title: '消息通知',
    icon: '🔔',
    badge: 2
  },
  {
    id: '4',
    title: '设置',
    icon: '⚙️',
    path: '/pages/profile/index'
  }
];

export const settingsItems = [
  {
    id: '1',
    title: '账号安全',
    icon: '🔒',
    path: ''
  },
  {
    id: '2',
    title: '消息通知设置',
    icon: '🔕',
    path: ''
  },
  {
    id: '3',
    title: '隐私设置',
    icon: '👁️',
    path: ''
  },
  {
    id: '4',
    title: '关于我们',
    icon: 'ℹ️',
    path: ''
  }
];

export const roles = [
  { value: 'elder', label: '👴 老人', desc: '享受养老服务' },
  { value: 'family', label: '👨‍👩‍👧 家属', desc: '查看老人健康' },
  { value: 'staff', label: '👨‍💼 工作人员', desc: '提供服务管理' }
];
