import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUser, mockQuickActions, mockAnnouncements } from '@/data/home';

const HomePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()]}`;
    setCurrentDate(dateStr);
  }, []);

  const handleActionClick = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  return (
    <ScrollView className={styles.homePage} scrollY>
      <View className={styles.welcomeCard}>
        <View className={styles.welcomeHeader}>
          <Image
            className={styles.avatar}
            src={mockUser.avatar}
            mode="aspectFill"
          />
          <View className={styles.welcomeInfo}>
            <Text className={styles.greeting}>您好，{mockUser.name}</Text>
            <View>
              <Text className={styles.roleTag}>
                {mockUser.role === 'elder' ? '👴 老人' : mockUser.role === 'family' ? '👨‍👩‍👧 家属' : '👨‍💼 工作人员'}
              </Text>
            </View>
            <Text className={styles.date}>{currentDate}</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        {mockQuickActions.map(action => (
          <View
            key={action.id}
            className={styles.actionCard}
            onClick={() => handleActionClick(action.path)}
          >
            {action.badge && action.badge > 0 ? (
              <View className={styles.badge}>{action.badge}</View>
            ) : null}
            <View
              className={styles.actionIcon}
              style={{ background: `${action.color}15` }}
            >
              <Text>{action.icon}</Text>
            </View>
            <Text className={styles.actionTitle}>{action.title}</Text>
            <Text className={styles.actionDesc}>
              {action.title === '健康打卡' && '记录每日健康数据'}
              {action.title === '服务预约' && '预约养老服务'}
              {action.title === '紧急联系' && '一键拨打求助'}
              {action.title === '家属查看' && '查看健康记录'}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.announcementSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📢 通知公告</Text>
          <Text className={styles.moreLink}>查看全部</Text>
        </View>
        <View className={styles.announcementList}>
          {mockAnnouncements.map(item => (
            <View key={item.id} className={styles.announcementItem}>
              <View className={styles.announcementTitle}>
                {item.title}
                {item.important && (
                  <Text className={styles.importantTag}>重要</Text>
                )}
              </View>
              <Text className={styles.announcementContent}>{item.content}</Text>
              <Text className={styles.announcementDate}>{item.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
