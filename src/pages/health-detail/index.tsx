import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { useHealth } from '@/store/health';
import { HealthRecord } from '@/types';

const HealthDetailPage: React.FC = () => {
  const { healthRecords, getRecentRecords } = useHealth();
  const [displayRecords, setDisplayRecords] = useState<HealthRecord[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    normal: 0,
    warning: 0,
    abnormal: 0
  });

  useEffect(() => {
    const records = getRecentRecords(7);
    setDisplayRecords(records);

    const stats = {
      total: records.length,
      normal: records.filter(r => r.status === 'normal').length,
      warning: records.filter(r => r.status === 'warning').length,
      abnormal: records.filter(r => r.status === 'abnormal').length
    };
    setStatistics(stats);
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

  const getAverageBloodPressure = () => {
    if (displayRecords.length === 0) return { systolic: 0, diastolic: 0 };
    const validRecords = displayRecords.filter(r => r.bloodPressure);
    if (validRecords.length === 0) return { systolic: 0, diastolic: 0 };

    let totalSystolic = 0;
    let totalDiastolic = 0;
    validRecords.forEach(r => {
      const [sys, dia] = r.bloodPressure.split('/').map(Number);
      totalSystolic += sys;
      totalDiastolic += dia;
    });

    return {
      systolic: Math.round(totalSystolic / validRecords.length),
      diastolic: Math.round(totalDiastolic / validRecords.length)
    };
  };

  const getAverageBloodSugar = () => {
    if (displayRecords.length === 0) return 0;
    const validRecords = displayRecords.filter(r => r.bloodSugar);
    if (validRecords.length === 0) return 0;

    const total = validRecords.reduce((sum, r) => sum + parseFloat(r.bloodSugar), 0);
    return (total / validRecords.length).toFixed(1);
  };

  const getAverageSleepHours = () => {
    if (displayRecords.length === 0) return 0;
    const validRecords = displayRecords.filter(r => r.sleepHours);
    if (validRecords.length === 0) return 0;

    const total = validRecords.reduce((sum, r) => sum + r.sleepHours, 0);
    return (total / validRecords.length).toFixed(1);
  };

  const avgBP = getAverageBloodPressure();
  const avgSugar = getAverageBloodSugar();
  const avgSleep = getAverageSleepHours();

  return (
    <ScrollView className={styles.healthDetailPage} scrollY>
      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📊 近7天健康概览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.total}</Text>
            <Text className={styles.statLabel}>打卡天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.normal}</Text>
            <Text className={styles.statLabel}>正常天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.warning}</Text>
            <Text className={styles.statLabel}>偏高天数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.abnormal}</Text>
            <Text className={styles.statLabel}>异常天数</Text>
          </View>
        </View>
      </View>

      {displayRecords.length > 0 ? (
        <>
          <View className={styles.section}>
            <View className={styles.sectionCard}>
              <Text className={styles.sectionTitle}>🩸 血压趋势（近7天）</Text>
              <View className={styles.healthIndicator}>
                <View className={styles.indicatorItem}>
                  <Text className={styles.indicatorValue}>{avgBP.systolic || '--'}</Text>
                  <Text className={styles.indicatorLabel}>平均收缩压</Text>
                  <Text className={styles.indicatorUnit}>mmHg</Text>
                </View>
                <View className={styles.indicatorItem}>
                  <Text className={styles.indicatorValue}>{avgBP.diastolic || '--'}</Text>
                  <Text className={styles.indicatorLabel}>平均舒张压</Text>
                  <Text className={styles.indicatorUnit}>mmHg</Text>
                </View>
              </View>
              <View className={styles.trendList}>
                {displayRecords.map(record => (
                  <View key={record.id} className={styles.trendItem}>
                    <Text className={styles.trendDate}>{record.date.slice(5)}</Text>
                    <Text className={styles.trendValue}>{record.bloodPressure}</Text>
                    <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('bloodPressure', record.bloodPressure))}`}>
                      {getStatusText(getTrendStatus('bloodPressure', record.bloodPressure))}
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
                  <Text className={styles.indicatorValue}>{avgSugar || '--'}</Text>
                  <Text className={styles.indicatorLabel}>平均血糖</Text>
                  <Text className={styles.indicatorUnit}>mmol/L</Text>
                </View>
              </View>
              <View className={styles.trendList}>
                {displayRecords.map(record => (
                  <View key={record.id} className={styles.trendItem}>
                    <Text className={styles.trendDate}>{record.date.slice(5)}</Text>
                    <Text className={styles.trendValue}>{record.bloodSugar}</Text>
                    <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('bloodSugar', record.bloodSugar))}`}>
                      {getStatusText(getTrendStatus('bloodSugar', record.bloodSugar))}
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
                  <Text className={styles.indicatorValue}>{avgSleep || '--'}</Text>
                  <Text className={styles.indicatorLabel}>平均睡眠</Text>
                  <Text className={styles.indicatorUnit}>小时</Text>
                </View>
              </View>
              <View className={styles.trendList}>
                {displayRecords.map(record => (
                  <View key={record.id} className={styles.trendItem}>
                    <Text className={styles.trendDate}>{record.date.slice(5)}</Text>
                    <Text className={styles.trendValue}>{record.sleepHours}小时</Text>
                    <Text className={`${styles.trendStatus} ${getStatusClass(getTrendStatus('sleepHours', record.sleepHours))}`}>
                      {getStatusText(getTrendStatus('sleepHours', record.sleepHours))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionCard}>
              <Text className={styles.sectionTitle}>📋 完整记录</Text>
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
            </View>
          </View>
        </>
      ) : (
        <View style={{ padding: '32rpx', textAlign: 'center' }}>
          <Text style={{ color: '#86909c', fontSize: '28rpx' }}>暂无健康记录，请先在健康打卡中记录数据</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HealthDetailPage;
