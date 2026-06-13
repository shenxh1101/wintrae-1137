import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useService } from '@/store/service';
import { mockServices, serviceStatusLabels } from '@/data/service';

const ServicePage: React.FC = () => {
  const { serviceOrders, addServiceOrder, getActiveOrders, getCompletedOrders } = useService();
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');
  const [displayActiveOrders, setDisplayActiveOrders] = useState<any[]>([]);
  const [displayCompletedOrders, setDisplayCompletedOrders] = useState<any[]>([]);

  useEffect(() => {
    const active = getActiveOrders();
    const completed = getCompletedOrders();
    setDisplayActiveOrders(active);
    setDisplayCompletedOrders(completed);
  }, [serviceOrders, getActiveOrders, getCompletedOrders]);

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
          const now = new Date();
          const appointmentDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          const appointmentTime = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')} 10:00`;

          const orderId = addServiceOrder({
            serviceName: service.name,
            serviceType: service.id === '1' ? 'meal' :
                        service.id === '2' ? 'barber' :
                        service.id === '3' ? 'accompany' : 'visit',
            appointmentTime,
            status: 'pending',
            staffName: '待分配',
            staffPhone: ''
          });

          Taro.showToast({
            title: '预约成功',
            icon: 'success'
          });

          setActiveTab('orders');
        }
      }
    });
  };

  const handleCallStaff = (phone: string) => {
    if (!phone || phone === '待分配') {
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

  const handleViewDetail = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/service-detail/index?orderId=${orderId}`
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'in_service':
        return styles.statusInService;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    return serviceStatusLabels[status as keyof typeof serviceStatusLabels] || status;
  };

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
          {displayActiveOrders.length > 0 && (
            <>
              <Text style={{ fontSize: '28rpx', color: '#4e5969', marginBottom: '16rpx' }}>待服务</Text>
              {displayActiveOrders.map(order => (
                <View
                  key={order.id}
                  className={styles.orderCard}
                  onClick={() => handleViewDetail(order.id)}
                >
                  <View className={styles.orderHeader}>
                    <Text className={styles.orderName}>{order.serviceName}</Text>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallStaff(order.staffPhone || '');
                          }}
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

          {displayCompletedOrders.length > 0 && (
            <>
              <Text style={{ fontSize: '28rpx', color: '#4e5969', marginBottom: '16rpx', marginTop: '32rpx' }}>历史记录</Text>
              {displayCompletedOrders.map(order => (
                <View
                  key={order.id}
                  className={styles.orderCard}
                  onClick={() => handleViewDetail(order.id)}
                >
                  <View className={styles.orderHeader}>
                    <Text className={styles.orderName}>{order.serviceName}</Text>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
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
                    {order.summary && (
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>服务小结：</Text>
                        <Text className={styles.infoValue} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.summary}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}

          {displayActiveOrders.length === 0 && displayCompletedOrders.length === 0 && (
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
