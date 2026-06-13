import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useService } from '@/store/service';
import { mockServices } from '@/data/service';

const staffList = [
  { name: '李师傅', phone: '13900139001', position: '专业理发师' },
  { name: '王护士', phone: '13900139002', position: '专业陪诊师' },
  { name: '张医生', phone: '13900139003', position: '健康管理师' },
  { name: '刘阿姨', phone: '13900139004', position: '家政服务员' }
];

const ServicePage: React.FC = () => {
  const { serviceOrders, addServiceOrder, updateOrderStatus, getActiveOrders, getCompletedOrders } = useService();
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');
  const [displayActiveOrders, setDisplayActiveOrders] = useState<any[]>([]);
  const [displayCompletedOrders, setDisplayCompletedOrders] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const active = getActiveOrders();
    let completed = getCompletedOrders();

    if (filterType === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      completed = completed.filter(order => {
        const orderDate = new Date(order.appointmentTime);
        return orderDate >= today;
      });
    } else if (filterType === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      completed = completed.filter(order => {
        const orderDate = new Date(order.appointmentTime);
        return orderDate >= weekAgo;
      });
    }

    setDisplayActiveOrders(active);
    setDisplayCompletedOrders(completed);
  }, [serviceOrders, getActiveOrders, getCompletedOrders, filterType, refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

          const serviceType = service.id === '1' ? 'meal' :
                            service.id === '2' ? 'barber' :
                            service.id === '3' ? 'accompany' : 'visit';

          addServiceOrder({
            serviceName: service.name,
            serviceType,
            appointmentTime,
            status: 'pending',
            staffName: '待分配',
            staffPhone: ''
          });

          Taro.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000
          });

          setActiveTab('orders');

          setTimeout(() => {
            const latestOrders = getActiveOrders();
            const latestOrder = latestOrders[0];

            if (latestOrder && latestOrder.status === 'pending') {
              const randomStaff = staffList[Math.floor(Math.random() * staffList.length)];

              updateOrderStatus(latestOrder.id, 'confirmed', {
                name: randomStaff.name,
                phone: randomStaff.phone
              });

              Taro.showToast({
                title: '服务站已确认订单',
                icon: 'success',
                duration: 2000
              });
            }
          }, 2000);
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
    switch (status) {
      case 'pending':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'in_service':
        return '服务中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const getProgressText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待服务站确认...';
      case 'confirmed':
        return '服务人员已分配，等待上门';
      case 'in_service':
        return '服务进行中';
      case 'completed':
        return '服务已完成';
      default:
        return '';
    }
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
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>📋 待服务订单（{displayActiveOrders.length}）</Text>
              </View>
              {displayActiveOrders.map(order => (
                <View
                  key={order.id}
                  className={styles.orderCard}
                  onClick={() => handleViewDetail(order.id)}
                >
                  <View className={styles.orderHeader}>
                    <View>
                      <Text className={styles.orderName}>{order.serviceName}</Text>
                      <Text className={styles.orderProgress}>{getProgressText(order.status)}</Text>
                    </View>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>

                  <View className={styles.orderInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>📅 预约时间：</Text>
                      <Text className={styles.infoValue}>{order.appointmentTime}</Text>
                    </View>
                    {order.staffName && order.staffName !== '待分配' && (
                      <>
                        <View className={styles.infoRow}>
                          <Text className={styles.infoLabel}>👨‍💼 服务人员：</Text>
                          <Text className={styles.infoValue}>{order.staffName}</Text>
                        </View>
                        <View className={styles.infoRow}>
                          <Text className={styles.infoLabel}>📞 联系电话：</Text>
                          <Text className={styles.infoValue}>{order.staffPhone}</Text>
                        </View>
                      </>
                    )}
                  </View>

                  {order.staffName && order.staffName !== '待分配' && (
                    <View className={styles.staffInfo}>
                      <View className={styles.staffRow}>
                        <Text className={styles.staffName}>👨‍💼 {order.staffName}</Text>
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

          <View className={styles.filterSection}>
            <View className={styles.filterTabs}>
              <Button
                className={`${styles.filterTab} ${filterType === 'all' ? styles.filterActive : ''}`}
                onClick={() => setFilterType('all')}
              >
                全部
              </Button>
              <Button
                className={`${styles.filterTab} ${filterType === 'today' ? styles.filterActive : ''}`}
                onClick={() => setFilterType('today')}
              >
                今天
              </Button>
              <Button
                className={`${styles.filterTab} ${filterType === 'week' ? styles.filterActive : ''}`}
                onClick={() => setFilterType('week')}
              >
                本周
              </Button>
            </View>
          </View>

          {displayCompletedOrders.length > 0 && (
            <>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>📚 历史记录（{displayCompletedOrders.length}）</Text>
              </View>
              {displayCompletedOrders.map(order => (
                <View
                  key={order.id}
                  className={styles.orderCard}
                  onClick={() => handleViewDetail(order.id)}
                >
                  <View className={styles.orderHeader}>
                    <View>
                      <Text className={styles.orderName}>{order.serviceName}</Text>
                      <Text className={styles.orderTime}>完成时间：{order.completedTime || order.appointmentTime}</Text>
                    </View>
                    <Text className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>

                  <View className={styles.orderInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>👨‍💼 服务人员：</Text>
                      <Text className={styles.infoValue}>{order.staffName || '未知'}</Text>
                    </View>
                    {order.summary && (
                      <View className={styles.summaryRow}>
                        <Text className={styles.summaryLabel}>📝 服务小结：</Text>
                        <Text className={styles.summaryContent}>{order.summary}</Text>
                      </View>
                    )}
                  </View>

                  {order.photos && order.photos.length > 0 && (
                    <View className={styles.photoPreview}>
                      <Text className={styles.photoLabel}>📷 服务照片：</Text>
                      <View className={styles.photoList}>
                        {order.photos.slice(0, 3).map((photo: string, index: number) => (
                          <View key={index} className={styles.photoThumb}>
                            <Text style={{ fontSize: '32rpx' }}>📷</Text>
                          </View>
                        ))}
                        {order.photos.length > 3 && (
                          <View className={styles.photoMore}>
                            <Text style={{ fontSize: '24rpx', color: '#86909c' }}>+{order.photos.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
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
