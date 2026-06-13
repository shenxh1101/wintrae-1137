import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useService } from '@/store/service';

const ServiceDetailPage: React.FC = () => {
  const { getOrderById, updateOrderStatus, updateOrderSummary } = useService();
  const [summary, setSummary] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params as any;
    if (params?.orderId) {
      setOrderId(params.orderId);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
        if (orderData.summary) {
          setSummary(orderData.summary);
        }
        if (orderData.photos && orderData.photos.length > 0) {
          setPhotos(orderData.photos);
        }
      }
    }
  }, [orderId, getOrderById]);

  const getStatusInfo = () => {
    if (!order) return { icon: '❓', text: '加载中', color: '#86909c' };

    switch (order.status) {
      case 'pending':
        return { icon: '⏳', text: '待确认', color: '#86909c' };
      case 'confirmed':
        return { icon: '✅', text: '已确认', color: '#165dff' };
      case 'in_service':
        return { icon: '🔄', text: '服务中', color: '#ff7d00' };
      case 'completed':
        return { icon: '🎉', text: '已完成', color: '#00b42a' };
      case 'cancelled':
        return { icon: '❌', text: '已取消', color: '#f53f3f' };
      default:
        return { icon: '❓', text: '未知', color: '#86909c' };
    }
  };

  const statusInfo = getStatusInfo();

  const handleCall = () => {
    if (!order?.staffPhone) {
      Taro.showToast({
        title: '暂无服务人员信息',
        icon: 'none'
      });
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: order.staffPhone
    });
  };

  const handleConfirm = () => {
    Taro.showModal({
      title: '确认到访',
      content: '确认已到达服务地点，开始服务吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderStatus(order.id, 'in_service', {
            name: order.staffName || '服务人员',
            phone: order.staffPhone || '13900139000'
          });

          setOrder({
            ...order,
            status: 'in_service'
          });

          Taro.showToast({
            title: '已开始服务',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleComplete = () => {
    if (!summary.trim()) {
      Taro.showToast({
        title: '请填写服务小结',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '完成服务',
      content: '确认提交服务小结并完成服务吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderSummary(order.id, summary, photos);

          setOrder({
            ...order,
            status: 'completed',
            summary,
            photos
          });

          Taro.showToast({
            title: '服务已完成',
            icon: 'success'
          });

          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths].slice(0, 9);
        setPhotos(newPhotos);
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  if (!order) {
    return (
      <View className={styles.serviceDetailPage}>
        <View style={{ padding: '32rpx', textAlign: 'center' }}>
          <Text>订单加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.serviceDetailPage} scrollY>
      <View className={styles.header}>
        <View className={styles.statusCard}>
          <View className={styles.statusInfo}>
            <Text className={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text className={styles.statusText}>{statusInfo.text}</Text>
          </View>
          <Text className={styles.orderId}>订单号：{order.id}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>📋 服务信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服务项目</Text>
            <Text className={styles.infoValue}>{order.serviceName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预约时间</Text>
            <Text className={styles.infoValue}>{order.appointmentTime}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服务地址</Text>
            <Text className={styles.infoValue}>阳光社区 1号楼 101室</Text>
          </View>
        </View>

        <View className={styles.staffCard}>
          <Text className={styles.cardTitle}>👨‍💼 服务人员</Text>
          <View className={styles.staffHeader}>
            <View className={styles.staffAvatar}>
              <Text style={{ fontSize: '48rpx' }}>👨‍💼</Text>
            </View>
            <View className={styles.staffInfo}>
              <Text className={styles.staffName}>{order.staffName || '待分配'}</Text>
              <Text className={styles.staffPosition}>专业服务人员</Text>
              <Text className={styles.staffPhone}>{order.staffPhone || '暂无'}</Text>
            </View>
            {order.staffPhone && order.staffPhone !== '待分配' && (
              <Button className={styles.callButton} onClick={handleCall}>
                拨打电话
              </Button>
            )}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>👴 老人信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>姓名</Text>
            <Text className={styles.infoValue}>王大爷</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>电话</Text>
            <Text className={styles.infoValue}>13800138000</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>地址</Text>
            <Text className={styles.infoValue}>阳光社区 1号楼 101室</Text>
          </View>
        </View>

        {(order.status === 'confirmed' || order.status === 'in_service') && (
          <>
            <View className={styles.summarySection}>
              <Text className={styles.cardTitle}>📝 服务小结</Text>
              <Input
                className={styles.summaryInput}
                type="textarea"
                placeholder="请填写服务小结，记录服务过程和老人状态..."
                value={summary}
                onInput={(e) => setSummary(e.detail.value)}
              />
            </View>

            <View className={styles.photoSection}>
              <Text className={styles.cardTitle}>📷 现场照片（{photos.length}/9）</Text>
              <View className={styles.photoList}>
                {photos.map((photo, index) => (
                  <View key={index} className={styles.photoItem}>
                    <Image
                      className={styles.photoImage}
                      src={photo}
                      mode="aspectFill"
                      onClick={() => handleRemovePhoto(index)}
                    />
                  </View>
                ))}
                {photos.length < 9 && (
                  <View className={styles.addPhotoButton} onClick={handleAddPhoto}>
                    <Text>+</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {order.summary && order.status === 'completed' && (
          <View className={styles.summarySection}>
            <Text className={styles.cardTitle}>📝 服务小结</Text>
            <Text style={{ fontSize: '28rpx', color: '#4e5969', lineHeight: '1.8' }}>
              {order.summary}
            </Text>
          </View>
        )}

        {order.photos && order.photos.length > 0 && order.status === 'completed' && (
          <View className={styles.photoSection}>
            <Text className={styles.cardTitle}>📷 服务照片（{order.photos.length}张）</Text>
            <View className={styles.photoList}>
              {order.photos.map((photo: string, index: number) => (
                <View key={index} className={styles.photoItem}>
                  <Image
                    className={styles.photoImage}
                    src={photo}
                    mode="aspectFill"
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {(order.status === 'confirmed' || order.status === 'in_service') && (
        <View className={styles.actionBar}>
          {order.status === 'confirmed' && (
            <Button className={`${styles.actionButton} ${styles.confirmButton}`} onClick={handleConfirm}>
              确认到访
            </Button>
          )}
          {order.status === 'in_service' && (
            <Button className={`${styles.actionButton} ${styles.completeButton}`} onClick={handleComplete}>
              完成服务
            </Button>
          )}
        </View>
      )}

      {order.status === 'pending' && (
        <View className={styles.actionBar}>
          <View style={{ width: '100%', textAlign: 'center', padding: '20rpx' }}>
            <Text style={{ color: '#86909c', fontSize: '28rpx' }}>
              等待服务站确认订单...
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ServiceDetailPage;
