import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PillBubbleProps {
  children?: ReactNode;
  color?: string;
}

export function PillBubble({ children, color = 'rgba(0,0,0,0.2)' }: PillBubbleProps) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
    borderRadius: 1000, // Ensures it's always a pill shape
  },
});
