import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { useHealth } from '@/store/health';
import { mockHealthStatistics, healthTrends } from '@/data/health-detail';

const HealthDetailPage: React.FC = () => {
  const { healthRecords, getRecentRecords } = useHealth();
  const [displayRecords, setDisplayRecords] = useState<any[]>([]);

  useEffect(() => {
    const records = getRecentRecords(7);
    setDisplayRecords(records);
  }, [healthRecords, getRecentRecords]);

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

  const getTrendStatus = (type: string, value: string | number) => {
    if (type === 'bloodPressure') {
      const [systolic] = value.toString().split('/').map(Number);
      if (systolic >= 90 && systolic <= 140) return 'normal';
      if (systolic > 140 && systolic <= 160) return 'warning';
      return 'danger';
    }
    if (type === 'bloodSugar') {
      const num = Number(value);
      if (num >= 3.9 && num <= 6.1) return 'normal';
      if (num > 6.1 && num <= 7.8) return 'warning';
      return 'danger';
    }
    if (type === 'sleepHours') {
      const num = Number(value);
      if (num >= 6 && num <= 8) return 'normal';
      if (num >= 5 && num < 6) return 'warning';
      return 'danger';
    }
    return 'normal';
  };

  return (
    <ScrollView className={styles.healthDetailPage} scrollY>
      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📊 本月健康概览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{displayRecords.length > 0 ? displayRecords.length : mockHealthStatistics.totalRecords}</Text>
            <Text className={styles.statLabel}>打卡天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {displayRecords.filter(r => r.status === 'normal').length || mockHealthStatistics.normalDays}
            </Text>
            <Text className={styles.statLabel}>正常天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {displayRecords.filter(r => r.status === 'warning').length || mockHealthStatistics.warningDays}
            </Text>
            <Text className={styles.statLabel}>偏高天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {displayRecords.filter(r => r.status === 'abnormal').length || mockHealthStatistics.abnormalDays}
            </Text>
            <Text className={styles.statLabel}>异常天数</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>🩸 血压趋势（近7天）</Text>
          <View className={styles.healthIndicator}>
            <View className={styles.indicatorItem}>
              <Text className={styles.indicatorValue}>{mockHealthStatistics.avgBloodPressure.systolic}</Text>
              <Text className={styles.indicatorLabel}>平均收缩压</Text>
              <Text className={styles.indicatorUnit}>mmHg</Text>
            </View>
            <View className={styles.indicatorItem}>
              <Text className={styles.indicatorValue}>{mockHealthStatistics.avgBloodPressure.diastolic}</Text>
              <Text className={styles.indicatorLabel}>平均舒张压</Text>
              <Text className={styles.indicatorUnit}>mmHg</Text>
            </View>
          </View>
          <View className={styles.trendList}>
            {healthTrends.bloodPressure.map((item, index) => (
              <View key={index} className={styles.trendItem}>
                <Text className={styles.trendDate}>{item.date}</Text>
                <Text className={styles.trendValue}>{item.value}</Text>
                <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('bloodPressure', item.value))}`}>
                  {getStatusText(getTrendStatus('bloodPressure', item.value))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>🩺 血糖趋势（近7天）</Text>
          <View className={styles.healthIndicator}>
            <View className={styles.indicatorItem}>
              <Text className={styles.indicatorValue}>{mockHealthStatistics.avgBloodSugar}</Text>
              <Text className={styles.indicatorLabel}>平均血糖</Text>
              <Text className={styles.indicatorUnit}>mmol/L</Text>
            </View>
          </View>
          <View className={styles.trendList}>
            {healthTrends.bloodSugar.map((item, index) => (
              <View key={index} className={styles.trendItem}>
                <Text className={styles.trendDate}>{item.date}</Text>
                <Text className={styles.trendValue}>{item.value}</Text>
                <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('bloodSugar', item.value))}`}>
                  {getStatusText(getTrendStatus('bloodSugar', item.value))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>😴 睡眠趋势（近7天）</Text>
          <View className={styles.healthIndicator}>
            <View className={styles.indicatorItem}>
              <Text className={styles.indicatorValue}>{mockHealthStatistics.avgSleepHours}</Text>
              <Text className={styles.indicatorLabel}>平均睡眠</Text>
              <Text className={styles.indicatorUnit}>小时</Text>
            </View>
          </View>
          <View className={styles.trendList}>
            {healthTrends.sleepHours.map((item, index) => (
              <View key={index} className={styles.trendItem}>
                <Text className={styles.trendDate}>{item.date}</Text>
                <Text className={styles.trendValue}>{item.value}小时</Text>
                <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('sleepHours', item.value))}`}>
                  {getStatusText(getTrendStatus('sleepHours', item.value))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📋 完整记录</Text>
          {displayRecords.length > 0 ? (
            <View className={styles.recordList}>
              {displayRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <Text className={styles.recordDate}>{record.date}</Text>
                  <View className={styles.recordData}>
                    <Text className={styles.dataTag}>血压 {record.bloodPressure}</Text>
                    <Text className={styles.dataTag}>血糖 {record.bloodSugar}</Text>
                    <Text className={styles.dataTag}>睡眠 {record.sleepHours}h</Text>
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
      </View>
    </ScrollView>
  );
};

export default HealthDetailPage;
