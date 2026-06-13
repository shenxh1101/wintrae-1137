import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useHealth } from '@/store/health';
import { HealthRecord } from '@/types';

const HealthPage: React.FC = () => {
  const { healthRecords, addHealthRecord, getRecentRecords } = useHealth();
  const [formData, setFormData] = useState({
    bloodPressure: '',
    bloodSugar: '',
    sleepHours: '',
    medication: ''
  });

  useEffect(() => {
    if (healthRecords.length === 0) {
      const stored = Taro.getStorageSync('healthRecords');
    }
  }, [healthRecords]);

  const handleSubmit = () => {
    if (!formData.bloodPressure || !formData.bloodSugar || !formData.sleepHours) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const status = calculateStatus(
      formData.bloodPressure,
      formData.bloodSugar,
      parseFloat(formData.sleepHours)
    );

    addHealthRecord({
      date: dateStr,
      bloodPressure: formData.bloodPressure,
      bloodSugar: formData.bloodSugar,
      sleepHours: parseFloat(formData.sleepHours),
      medication: formData.medication,
      status
    });

    Taro.showToast({
      title: '打卡成功',
      icon: 'success'
    });

    setFormData({
      bloodPressure: '',
      bloodSugar: '',
      sleepHours: '',
      medication: ''
    });
  };

  const calculateStatus = (
    bloodPressure: string,
    bloodSugar: string,
    sleepHours: number
  ): 'normal' | 'warning' | 'abnormal' => {
    const [systolic] = bloodPressure.split('/').map(Number);
    const sugar = parseFloat(bloodSugar);

    const bpAbnormal = systolic > 140 || systolic < 90;
    const sugarAbnormal = sugar > 7.8 || sugar < 3.9;
    const sleepAbnormal = sleepHours < 5 || sleepHours > 9;

    if ((bpAbnormal && systolic > 160) || sugarAbnormal && sugar > 10) {
      return 'abnormal';
    }
    if (bpAbnormal || sugarAbnormal || sleepAbnormal) {
      return 'warning';
    }
    return 'normal';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return styles.statusNormal;
      case 'warning':
        return styles.statusWarning;
      case 'abnormal':
        return styles.statusAbnormal;
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

  const displayRecords = getRecentRecords(7);

  return (
    <ScrollView className={styles.healthPage} scrollY>
      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>💡 健康小贴士</Text>
        <Text className={styles.tipsContent}>
          建议每天同一时间测量血压并记录，保持规律作息有助于改善睡眠质量。
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>📝 今日打卡</Text>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>🩸 血压（mmHg）</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.inputField}
              type="text"
              placeholder="请输入血压，如 120/80"
              value={formData.bloodPressure}
              onInput={(e) => setFormData({ ...formData, bloodPressure: e.detail.value })}
            />
            <Text className={styles.inputUnit}>mmHg</Text>
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>🩺 血糖（mmol/L）</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.inputField}
              type="digit"
              placeholder="请输入血糖值"
              value={formData.bloodSugar}
              onInput={(e) => setFormData({ ...formData, bloodSugar: e.detail.value })}
            />
            <Text className={styles.inputUnit}>mmol/L</Text>
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>😴 睡眠时长</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.inputField}
              type="digit"
              placeholder="请输入睡眠时长"
              value={formData.sleepHours}
              onInput={(e) => setFormData({ ...formData, sleepHours: e.detail.value })}
            />
            <Text className={styles.inputUnit}>小时</Text>
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>💊 用药情况</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.inputField}
              type="text"
              placeholder="请输入用药情况"
              value={formData.medication}
              onInput={(e) => setFormData({ ...formData, medication: e.detail.value })}
            />
          </View>
        </View>

        <Button className={styles.submitButton} onClick={handleSubmit}>
          提交打卡
        </Button>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>📅 打卡记录</Text>
        {displayRecords.length > 0 ? (
          <View className={styles.historyList}>
            {displayRecords.map(record => (
              <View key={record.id} className={styles.historyItem}>
                <Text className={styles.historyDate}>{record.date}</Text>
                <View className={styles.historyData}>
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
            <Text>暂无打卡记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HealthPage;
