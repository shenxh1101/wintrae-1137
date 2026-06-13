import React, { useState } from 'react';
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockServiceDetail } from '@/data/service-detail';

const ServiceDetailPage: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const serviceDetail = mockServiceDetail;

  const getStatusInfo = () => {
    switch (serviceDetail.status) {
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
    Taro.makePhoneCall({
      phoneNumber: serviceDetail.staff.phone
    });
  };

  const handleConfirm = () => {
    Taro.showModal({
      title: '确认到访',
      content: '确认已到达服务地点吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已确认到访',
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
    Taro.showToast({
      title: '请上传现场照片',
      icon: 'none'
    });
  };

  return (
    <ScrollView className={styles.serviceDetailPage} scrollY>
      <View className={styles.header}>
        <View className={styles.statusCard}>
          <View className={styles.statusInfo}>
            <Text className={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text className={styles.statusText}>{statusInfo.text}</Text>
          </View>
          <Text className={styles.orderId}>订单号：{serviceDetail.orderId}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>📋 服务信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服务项目</Text>
            <Text className={styles.infoValue}>{serviceDetail.serviceName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预约时间</Text>
            <Text className={styles.infoValue}>{serviceDetail.appointmentTime}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服务地址</Text>
            <Text className={styles.infoValue}>{serviceDetail.appointmentAddress}</Text>
          </View>
        </View>

        <View className={styles.staffCard}>
          <Text className={styles.cardTitle}>👨‍💼 服务人员</Text>
          <View className={styles.staffHeader}>
            <Image
              className={styles.staffAvatar}
              src={serviceDetail.staff.avatar}
              mode="aspectFill"
            />
            <View className={styles.staffInfo}>
              <Text className={styles.staffName}>{serviceDetail.staff.name}</Text>
              <Text className={styles.staffPosition}>{serviceDetail.staff.position}</Text>
              <Text className={styles.staffPhone}>{serviceDetail.staff.phone}</Text>
            </View>
            <Button className={styles.callButton} onClick={handleCall}>
              拨打电话
            </Button>
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>👴 老人信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>姓名</Text>
            <Text className={styles.infoValue}>{serviceDetail.elder.name}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>电话</Text>
            <Text className={styles.infoValue}>{serviceDetail.elder.phone}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>地址</Text>
            <Text className={styles.infoValue}>{serviceDetail.elder.address}</Text>
          </View>
        </View>

        {serviceDetail.status === 'confirmed' || serviceDetail.status === 'in_service' ? (
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
              <Text className={styles.cardTitle}>📷 现场照片</Text>
              <View className={styles.photoList}>
                {photos.map((photo, index) => (
                  <View key={index} className={styles.photoItem}>
                    <Image
                      className={styles.photoImage}
                      src={photo}
                      mode="aspectFill"
                    />
                  </View>
                ))}
                <View className={styles.addPhotoButton} onClick={handleAddPhoto}>
                  <Text>+</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        {serviceDetail.summary && (
          <View className={styles.summarySection}>
            <Text className={styles.cardTitle}>📝 服务小结</Text>
            <Text style={{ fontSize: '28rpx', color: '#4e5969', lineHeight: '1.8' }}>
              {serviceDetail.summary}
            </Text>
          </View>
        )}
      </View>

      {serviceDetail.status === 'confirmed' || serviceDetail.status === 'in_service' ? (
        <View className={styles.actionBar}>
          {serviceDetail.status === 'confirmed' && (
            <Button className={`${styles.actionButton} ${styles.confirmButton}`} onClick={handleConfirm}>
              确认到访
            </Button>
          )}
          {serviceDetail.status === 'in_service' && (
            <Button className={`${styles.actionButton} ${styles.completeButton}`} onClick={handleComplete}>
              完成服务
            </Button>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ServiceDetailPage;
