import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockEmergencyContacts, emergencyNumbers } from '@/data/emergency';

const EmergencyPage: React.FC = () => {
  const [contacts] = useState(mockEmergencyContacts);

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        Taro.showToast({
          title: '拨打失败',
          icon: 'none'
        });
      }
    });
  };

  const handleSendMessage = (contact: any) => {
    Taro.showModal({
      title: '发送短信',
      content: `确定向 ${contact.name} 发送求助短信吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '短信已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleAddContact = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  return (
    <ScrollView className={styles.emergencyPage} scrollY>
      <View className={styles.emergencyBanner}>
        <Text className={styles.bannerIcon}>🆘</Text>
        <Text className={styles.bannerTitle}>紧急求助</Text>
        <Text className={styles.bannerDesc}>遇到紧急情况，一键拨打求助</Text>
      </View>

      <View className={styles.emergencyNumbers}>
        {emergencyNumbers.map(item => (
          <View key={item.id} className={styles.emergencyNumberCard}>
            <View
              className={styles.emergencyIcon}
              style={{ background: `${item.color}15` }}
            >
              <Text>{item.icon}</Text>
            </View>
            <View className={styles.emergencyInfo}>
              <Text className={styles.emergencyName}>{item.name}</Text>
              <Text className={styles.emergencyPhone}>{item.phone}</Text>
            </View>
            <Button
              className={styles.callButton}
              onClick={() => handleCall(item.phone)}
            >
              拨打
            </Button>
          </View>
        ))}
      </View>

      <View className={styles.contactsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>紧急联系人</Text>
          <Button className={styles.addButton} onClick={handleAddContact}>
            + 添加
          </Button>
        </View>
        <View className={styles.contactsList}>
          {contacts.map(contact => (
            <View key={contact.id} className={styles.contactCard}>
              <View className={styles.contactAvatar}>
                <Text>{contact.name.charAt(0)}</Text>
              </View>
              <View className={styles.contactInfo}>
                <View className={styles.contactName}>
                  {contact.name}
                  {contact.isPrimary && (
                    <Text className={styles.primaryTag}>主要</Text>
                  )}
                </View>
                <Text className={styles.contactRelation}>{contact.relationship}</Text>
                <Text className={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <View className={styles.contactActions}>
                <Button
                  className={`${styles.actionButton} ${styles.callContactButton}`}
                  onClick={() => handleCall(contact.phone)}
                >
                  📞
                </Button>
                <Button
                  className={`${styles.actionButton} ${styles.messageButton}`}
                  onClick={() => handleSendMessage(contact)}
                >
                  💬
                </Button>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default EmergencyPage;
