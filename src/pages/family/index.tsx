import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockHealthRecords } from '@/data/health';
import { mockMessages, mockAlerts } from '@/data/family';
import { mockUser } from '@/data/home';

const FamilyPage: React.FC = () => {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      Taro.showToast({
        title: '请输入留言内容',
        icon: 'none'
      });
      return;
    }

    Taro.showToast({
      title: '留言已发送',
      icon: 'success'
    });
    setMessageText('');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return styles.statusNormal;
      case 'warning':
        return styles.statusWarning;
      case 'abnormal':
        return styles.statusDanger;
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '偏高';
      case 'abnormal':
        return '异常';
      default:
        return '';
    }
  };

  const getAlertClass = (level: string) => {
    switch (level) {
      case 'warning':
        return styles.alertWarning;
      case 'danger':
        return styles.alertDanger;
      case 'info':
        return styles.alertInfo;
      default:
        return '';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <ScrollView className={styles.familyPage} scrollY>
      <View className={styles.elderInfo}>
        <View className={styles.elderAvatar}>
          <Text>{mockUser.name.charAt(0)}</Text>
        </View>
        <View className={styles.elderDetail}>
          <Text className={styles.elderName}>{mockUser.name}</Text>
          <Text className={styles.elderAddress}>{mockUser.address}</Text>
          <Text className={styles.elderStatus}>🟢 健康状态良好</Text>
        </View>
      </View>

      <View className={styles.healthSection}>
        <Text className={styles.sectionTitle}>📊 近7天健康记录</Text>
        {mockHealthRecords.length > 0 ? (
          <View className={styles.healthList}>
            {mockHealthRecords.slice(0, 7).map(record => (
              <View key={record.id} className={styles.healthItem}>
                <Text className={styles.healthDate}>{record.date.slice(5)}</Text>
                <View className={styles.healthData}>
                  <Text className={styles.dataTag}>
                    血压 {record.bloodPressure}
                  </Text>
                  <Text className={styles.dataTag}>
                    血糖 {record.bloodSugar}
                  </Text>
                  <Text className={styles.dataTag}>
                    睡眠 {record.sleepHours}h
                  </Text>
                </View>
                <Text className={`${styles.statusBadge} ${getStatusClass(record.status)}`}>
                  {getStatusText(record.status)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.noData}>
            <Text>暂无健康记录</Text>
          </View>
        )}
      </View>

      <View className={styles.alertsSection}>
        <Text className={styles.sectionTitle}>🚨 异常提醒</Text>
        {mockAlerts.length > 0 ? (
          <>
            {mockAlerts.map(alert => (
              <View key={alert.id} className={`${styles.alertCard} ${getAlertClass(alert.level)}`}>
                <Text className={styles.alertIcon}>{getAlertIcon(alert.level)}</Text>
                <View className={styles.alertContent}>
                  <Text className={styles.alertTitle}>{alert.title}</Text>
                  <Text className={styles.alertDesc}>{alert.description}</Text>
                  <Text className={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View className={styles.noData}>
            <Text>暂无异常提醒</Text>
          </View>
        )}
      </View>

      <View className={styles.messageSection}>
        <Text className={styles.sectionTitle}>💬 留言服务站</Text>
        <View className={styles.messageList}>
          {mockMessages.map(message => (
            <View
              key={message.id}
              className={`${styles.messageItem} ${message.type === 'to_station' ? styles.toStation : styles.fromStation}`}
            >
              <Text className={styles.messageContent}>{message.content}</Text>
              <Text className={styles.messageTime}>{message.time}</Text>
            </View>
          ))}
        </View>
        <View className={styles.inputArea}>
          <Input
            className={styles.messageInput}
            type="text"
            placeholder="请输入留言内容"
            value={messageText}
            onInput={(e) => setMessageText(e.detail.value)}
          />
          <Button className={styles.sendButton} onClick={handleSendMessage}>
            发送
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default FamilyPage;
