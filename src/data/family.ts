export interface Message {
  id: string;
  content: string;
  time: string;
  type: 'to_station' | 'from_station';
  read: boolean;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  time: string;
  level: 'warning' | 'danger' | 'info';
}

export const mockMessages: Message[] = [
  {
    id: '1',
    content: '您好，我想预约下周的陪诊服务。',
    time: '2024-06-13 14:30',
    type: 'to_station',
    read: true
  },
  {
    id: '2',
    content: '已收到您的预约请求，服务人员会在24小时内与您联系确认。',
    time: '2024-06-13 15:20',
    type: 'from_station',
    read: true
  },
  {
    id: '3',
    content: '老人今天的血压有点高，请多关注。',
    time: '2024-06-12 10:00',
    type: 'from_station',
    read: false
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: '血压偏高提醒',
    description: '王大爷今日血压测量值为 145/95 mmHg，略高于正常值。',
    time: '2024-06-14 08:30',
    level: 'warning'
  },
  {
    id: '2',
    title: '血糖异常提醒',
    description: '王大爷今日血糖测量值为 8.5 mmol/L，高于正常值。',
    time: '2024-06-13 08:00',
    level: 'danger'
  },
  {
    id: '3',
    title: '睡眠时长不足',
    description: '王大爷连续3天睡眠时长不足6小时，建议关注。',
    time: '2024-06-12 09:00',
    level: 'info'
  }
];
