import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useHealth } from '@/store/health';
import { useService } from '@/store/service';
import { mockMessages, mockAlerts } from '@/data/family';
import { mockUser } from '@/data/home';

const FamilyPage: React.FC = () => {
  const { healthRecords, getRecentRecords } = useHealth();
  const { serviceOrders, getActiveOrders, getCompletedOrders, updateOrderFeedback } = useService();
  const [messageText, setMessageText] = useState('');
  const [displayRecords, setDisplayRecords] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const records = getRecentRecords(7);
    setDisplayRecords(records);

    const active = getActiveOrders();
    const completed = getCompletedOrders();
    setActiveOrders(active);
    setCompletedOrders(completed);
  }, [healthRecords, getRecentRecords, serviceOrders, getActiveOrders, getCompletedOrders]);

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

  const handleSubmitFeedback = (orderId: string) => {
    const feedback = feedbackMap[orderId];
    if (!feedback?.trim()) {
      Taro.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return;
    }

    updateOrderFeedback(orderId, feedback);

    Taro.showToast({
      title: '反馈已提交',
      icon: 'success'
    });

    setCompletedOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, feedback } : order
      )
    );
  };

  const handleFeedbackChange = (orderId: string, value: string) => {
    setFeedbackMap(prev => ({
      ...prev,
      [orderId]: value
    }));
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

  const getServiceStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'in_service':
        return '服务中';
      case 'completed':
        return '已完成';
      default:
        return status;
    }
  };

  const getServiceStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'in_service':
        return styles.statusInService;
      case 'completed':
        return styles.statusCompleted;
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
        {displayRecords.length > 0 ? (
          <View className={styles.healthList}>
            {displayRecords.map(record => (
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

      <View className={styles.serviceSection}>
        <Text className={styles.sectionTitle}>📅 服务记录</Text>

        {activeOrders.length > 0 && (
          <View className={styles.serviceGroup}>
            <Text className={styles.serviceGroupTitle}>🔄 进行中的服务</Text>
            {activeOrders.map(order => (
              <View key={order.id} className={styles.serviceCard}>
                <View className={styles.serviceHeader}>
                  <Text className={styles.serviceName}>{order.serviceName}</Text>
                  <Text className={`${styles.serviceStatus} ${getServiceStatusClass(order.status)}`}>
                    {getServiceStatusText(order.status)}
                  </Text>
                </View>
                <View className={styles.serviceInfo}>
                  <Text className={styles.serviceTime}>📅 {order.appointmentTime}</Text>
                  {order.staffName && order.staffName !== '待分配' && (
                    <Text className={styles.serviceStaff}>👨‍💼 {order.staffName}</Text>
                  )}
                </View>
                <Text className={styles.serviceProgress}>
                  {order.status === 'pending' && '等待服务站确认...'}
                  {order.status === 'confirmed' && '服务人员已分配，等待上门'}
                  {order.status === 'in_service' && '服务进行中'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {completedOrders.length > 0 && (
          <View className={styles.serviceGroup}>
            <Text className={styles.serviceGroupTitle}>✅ 已完成的服务</Text>
            {completedOrders.map(order => (
              <View key={order.id} className={styles.serviceCard}>
                <View className={styles.serviceHeader}>
                  <Text className={styles.serviceName}>{order.serviceName}</Text>
                  <Text className={`${styles.serviceStatus} ${getServiceStatusClass(order.status)}`}>
                    {getServiceStatusText(order.status)}
                  </Text>
                </View>
                <View className={styles.serviceInfo}>
                  <Text className={styles.serviceTime}>📅 {order.completedTime || order.appointmentTime}</Text>
                  {order.staffName && (
                    <Text className={styles.serviceStaff}>👨‍💼 {order.staffName}</Text>
                  )}
                </View>
                {order.summary && (
                  <View className={styles.serviceSummary}>
                    <Text className={styles.summaryLabel}>服务小结：</Text>
                    <Text className={styles.summaryText}>{order.summary}</Text>
                  </View>
                )}
                {order.photos && order.photos.length > 0 && (
                  <View className={styles.servicePhotos}>
                    <Text className={styles.photosLabel}>📷 {order.photos.length}张照片</Text>
                  </View>
                )}
                <View className={styles.feedbackArea}>
                  {order.feedback ? (
                    <View className={styles.feedbackDisplay}>
                      <Text className={styles.feedbackLabel}>💬 我的反馈：</Text>
                      <Text className={styles.feedbackText}>{order.feedback}</Text>
                    </View>
                  ) : (
                    <>
                      <Input
                        className={styles.feedbackInput}
                        type="text"
                        placeholder="输入服务反馈..."
                        value={feedbackMap[order.id] || ''}
                        onInput={(e) => handleFeedbackChange(order.id, e.detail.value)}
                      />
                      <Button
                        className={styles.feedbackSubmitButton}
                        onClick={() => handleSubmitFeedback(order.id)}
                      >
                        提交
                      </Button>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeOrders.length === 0 && completedOrders.length === 0 && (
          <View className={styles.noData}>
            <Text>暂无服务记录</Text>
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
