import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTabNavigation } from '@/context/TabNavigationContext';
import { IconSymbol } from './ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const Ripple = forwardRef((props, ref) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useImperativeHandle(ref, () => ({
    start() {
      scale.value = 0;
      opacity.value = 1;
      scale.value = withTiming(4, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 });
    }
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
});
Ripple.displayName = 'Ripple';

const TabButton = ({ name, icon, activeTab, setActiveTab }: any) => {
  const scale = useSharedValue(1);
  const rippleRef = useRef<any>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    rippleRef.current?.start();

    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => {
      setActiveTab(name);
    }, 150);
  };

  return (
    <Pressable onPress={handlePress} style={styles.pressableContainer}>
      <Animated.View style={[styles.bubble, {
        backgroundColor: activeTab === name ? 'black' : 'rgba(0,0,0,0.5)'
      }, animatedStyle]}>
        <Ripple ref={rippleRef} />
        <IconSymbol name={icon} size={28} color="white" style={{ zIndex: 1 }} />
      </Animated.View>
    </Pressable>
  );
};

export function CustomTabBar() {
  const { activeTab, setActiveTab } = useTabNavigation();

  return (
    <View style={styles.container}>
      <TabButton name="index" icon="house.fill" activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabButton name="list" icon="list.bullet" activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pressableContainer: {
    width: 50,
    height: 50,
  },
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'black',
  },
});
