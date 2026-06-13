import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { HealthProvider } from '@/store/health';
import { ServiceProvider } from '@/store/service';
import './app.scss';

function App(props) {
  useEffect(() => {});

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <HealthProvider>
      <ServiceProvider>
        {props.children}
      </ServiceProvider>
    </HealthProvider>
  );
}

export default App;
