import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabNavigationProvider, useTabNavigation } from '@/context/TabNavigationContext';
import { CustomTabBar } from '@/components/CustomTabBar';

import HomeScreen from './index';
import ListScreen from './list';

const AppContent = () => {
  const { activeTab } = useTabNavigation();

  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'index' && <HomeScreen />}
      {activeTab === 'list' && <ListScreen />}
      <CustomTabBar />
    </View>
  );
};

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TabNavigationProvider>
        <AppContent />
      </TabNavigationProvider>
    </GestureHandlerRootView>
  );
}
