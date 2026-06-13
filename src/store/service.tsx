import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ServiceOrder } from '@/types';
import Taro from '@tarojs/taro';

interface ServiceContextType {
  serviceOrders: ServiceOrder[];
  addServiceOrder: (order: Omit<ServiceOrder, 'id'>) => string;
  updateOrderStatus: (orderId: string, status: ServiceOrder['status'], staff?: { name: string; phone: string }) => void;
  updateOrderSummary: (orderId: string, summary: string, photos: string[]) => void;
  getActiveOrders: () => ServiceOrder[];
  getCompletedOrders: () => ServiceOrder[];
  getOrderById: (orderId: string) => ServiceOrder | undefined;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);

  useEffect(() => {
    const stored = Taro.getStorageSync('serviceOrders');
    if (stored) {
      setServiceOrders(stored);
    }
  }, []);

  const addServiceOrder = (order: Omit<ServiceOrder, 'id'>): string => {
    const newOrder: ServiceOrder = {
      ...order,
      id: `order_${Date.now()}`
    };

    const updatedOrders = [newOrder, ...serviceOrders];
    setServiceOrders(updatedOrders);
    Taro.setStorageSync('serviceOrders', updatedOrders);
    return newOrder.id;
  };

  const updateOrderStatus = (
    orderId: string,
    status: ServiceOrder['status'],
    staff?: { name: string; phone: string }
  ) => {
    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          ...(staff && {
            staffName: staff.name,
            staffPhone: staff.phone
          })
        };
      }
      return order;
    });

    setServiceOrders(updatedOrders);
    Taro.setStorageSync('serviceOrders', updatedOrders);
  };

  const updateOrderSummary = (orderId: string, summary: string, photos: string[]) => {
    const now = new Date();
    const completedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          summary,
          photos,
          status: 'completed' as const,
          completedTime
        };
      }
      return order;
    });

    setServiceOrders(updatedOrders);
    Taro.setStorageSync('serviceOrders', updatedOrders);
  };

  const updateOrderFeedback = (orderId: string, feedback: string) => {
    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          feedback
        };
      }
      return order;
    });

    setServiceOrders(updatedOrders);
    Taro.setStorageSync('serviceOrders', updatedOrders);
  };

  const getActiveOrders = () => {
    return serviceOrders.filter(order =>
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'in_service'
    );
  };

  const getCompletedOrders = () => {
    return serviceOrders.filter(order =>
      order.status === 'completed' || order.status === 'cancelled'
    );
  };

  const getOrderById = (orderId: string) => {
    return serviceOrders.find(order => order.id === orderId);
  };

  return (
    <ServiceContext.Provider
      value={{
        serviceOrders,
        addServiceOrder,
        updateOrderStatus,
        updateOrderSummary,
        updateOrderFeedback,
        getActiveOrders,
        getCompletedOrders,
        getOrderById
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within ServiceProvider');
  }
  return context;
};
