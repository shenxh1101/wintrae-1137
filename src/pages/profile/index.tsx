import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUser } from '@/data/home';
import { mockMenuItems, roles } from '@/data/profile';

const ProfilePage: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(mockUser.role);

  const handleMenuClick = (item: any) => {
    if (item.path) {
      Taro.navigateTo({ url: item.path });
    } else {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    }
  };

  const handleRoleChange = (role: string) => {
    setCurrentRole(role as any);
    Taro.showToast({
      title: '角色切换成功',
      icon: 'success'
    });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  };

  const getRoleText = () => {
    switch (currentRole) {
      case 'elder':
        return '👴 老人';
      case 'family':
        return '👨‍👩‍👧 家属';
      case 'staff':
        return '👨‍💼 工作人员';
      default:
        return '';
    }
  };

  return (
    <ScrollView className={styles.profilePage} scrollY>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <View className={styles.avatar}>
            <Text style={{ fontSize: '72rpx', color: '#fff' }}>{mockUser.name.charAt(0)}</Text>
          </View>
          <View className={styles.profileDetail}>
            <Text className={styles.name}>{mockUser.name}</Text>
            <Text className={styles.roleTag}>{getRoleText()}</Text>
          </View>
          <Button className={styles.editButton}>编辑</Button>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>28</Text>
            <Text className={styles.statLabel}>打卡天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>5</Text>
            <Text className={styles.statLabel}>预约服务</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>3</Text>
            <Text className={styles.statLabel}>健康异常</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuCard}>
          {mockMenuItems.map(item => (
            <View
              key={item.id}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item)}
            >
              <View className={styles.menuIcon}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.menuTitle}>{item.title}</Text>
              {item.badge && (
                <View className={styles.badge}>{item.badge}</View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.roleSwitch}>
        <View className={styles.roleCard}>
          <Text className={styles.roleTitle}>🔄 切换角色</Text>
          <View className={styles.roleList}>
            {roles.map(role => (
              <View
                key={role.value}
                className={`${styles.roleItem} ${currentRole === role.value ? styles.active : ''}`}
                onClick={() => handleRoleChange(role.value)}
              >
                <View className={styles.roleIcon}>
                  <Text>{role.label.split(' ')[0]}</Text>
                </View>
                <View className={styles.roleInfo}>
                  <Text className={styles.roleLabel}>{role.label.split(' ')[1]}</Text>
                  <Text className={styles.roleDesc}>{role.desc}</Text>
                </View>
                {currentRole === role.value && (
                  <Text className={styles.roleCheck}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <Button className={styles.logoutButton} onClick={handleLogout}>
          退出登录
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
