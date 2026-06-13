import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockServices, mockServiceOrders, serviceStatusLabels } from '@/data/service';

const ServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');

  const handleServiceClick = (service: any) => {
    if (!service.available) {
      Taro.showToast({
        title: '该服务暂不可用',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '预约服务',
      content: `确定预约 ${service.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '预约成功',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleCallStaff = (phone: string) => {
    if (!phone) {
      Taro.showToast({
        title: '暂无服务人员信息',
        icon: 'none'
      });
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: phone
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const pendingOrders = mockServiceOrders.filter(order => order.status === 'pending' || order.status === 'confirmed');
  const completedOrders = mockServiceOrders.filter(order => order.status === 'completed' || order.status === 'cancelled');

  return (
    <ScrollView className={styles.servicePage} scrollY>
      <View className={styles.tabBar}>
        <Button
          className={`${styles.tabItem} ${activeTab === 'services' ? styles.active : ''}`}
          onClick={() => setActiveTab('services')}
        >
          服务列表
        </Button>
        <Button
          className={`${styles.tabItem} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          我的预约
        </Button>
      </View>

      {activeTab === 'services' ? (
        <View className={styles.serviceList}>
          {mockServices.map(service => (
            <View
              key={service.id}
              className={`${styles.serviceCard} ${!service.available ? styles.disabled : ''}`}
              onClick={() => handleServiceClick(service)}
            >
              {!service.available && (
                <Text className={styles.unavailableTag}>暂不可用</Text>
              )}
              <View className={styles.serviceIcon}>
                <Text>{service.icon}</Text>
              </View>
              <Text className={styles.serviceName}>{service.name}</Text>
              <Text className={styles.serviceDesc}>{service.description}</Text>
              <Text className={styles.servicePrice}>{service.price}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.orderList}>
          {pendingOrders.length > 0 && (
            <>
              <Text style={{ fontSize: '28rpx', color: '#4e5969', marginBottom: '16rpx' }}>待服务</Text>
              {pendingOrders.map(order => (
                <View key={order.id} className={styles.orderCard}>
                  <View className={styles.orderHeader}>
                    <Text className={styles.orderName}>{order.serviceName}</Text>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {serviceStatusLabels[order.status]}
                    </Text>
                  </View>
                  <View className={styles.orderInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>预约时间：</Text>
                      <Text className={styles.infoValue}>{order.appointmentTime}</Text>
                    </View>
                  </View>
                  {order.staffName && order.staffName !== '待分配' && (
                    <View className={styles.staffInfo}>
                      <View className={styles.staffRow}>
                        <Text className={styles.staffName}>
                          服务人员：{order.staffName}
                        </Text>
                        <Button
                          className={styles.callButton}
                          onClick={() => handleCallStaff(order.staffPhone || '')}
                        >
                          拨打电话
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          {completedOrders.length > 0 && (
            <>
              <Text style={{ fontSize: '28rpx', color: '#4e5969', marginBottom: '16rpx', marginTop: '32rpx' }}>历史记录</Text>
              {completedOrders.map(order => (
                <View key={order.id} className={styles.orderCard}>
                  <View className={styles.orderHeader}>
                    <Text className={styles.orderName}>{order.serviceName}</Text>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {serviceStatusLabels[order.status]}
                    </Text>
                  </View>
                  <View className={styles.orderInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>服务时间：</Text>
                      <Text className={styles.infoValue}>{order.appointmentTime}</Text>
                    </View>
                    {order.staffName && (
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>服务人员：</Text>
                        <Text className={styles.infoValue}>{order.staffName}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}

          {mockServiceOrders.length === 0 && (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📅</Text>
              <Text className={styles.emptyText}>暂无预约记录</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ServicePage;
