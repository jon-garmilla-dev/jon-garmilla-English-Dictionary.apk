import React, { createContext, useState, useContext, ReactNode } from 'react';

type TabName = 'index' | 'list';

interface TabNavigationContextType {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

export const TabNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabName>('index');

  return (
    <TabNavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabNavigationContext.Provider>
  );
};

export const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (context === undefined) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  return context;
};
