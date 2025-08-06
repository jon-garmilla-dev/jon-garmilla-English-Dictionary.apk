import React, { useState, useCallback, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface PulseType {
  id: number;
}

const Pulse = ({ onComplete, color, borderRadius }: { onComplete: () => void; color: string; borderRadius: number }) => {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withTiming(2.5, { duration: 500 }, (isFinished) => {
      if (isFinished) {
        runOnJS(onComplete)();
      }
    });
  }, [pulse, onComplete]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - pulse.value / 2.5,
    borderRadius: borderRadius,
  }));

  return <Animated.View style={[styles.pulse, { backgroundColor: color }, animatedPulseStyle]} />;
};

interface BubbleProps {
  children?: ReactNode;
  onPress?: () => void;
  color?: string;
  opacity?: number;
  size?: number;
}

export function Bubble({
  children,
  onPress,
  color = 'whitesmoke',
  opacity: initialOpacity = 0.8,
  size = 200, // Default size is 200
}: BubbleProps) {
  const opacity = useSharedValue(initialOpacity);
  const [pulses, setPulses] = useState<PulseType[]>([]);

  const addPulse = useCallback(() => {
    setPulses((currentPulses) => [...currentPulses, { id: Date.now() }]);
  }, []);

  const removePulse = useCallback((id: number) => {
    setPulses((currentPulses) => currentPulses.filter((p) => p.id !== id));
  }, []);

  const tap = Gesture.Tap()
    .onBegin(() => {
      runOnJS(addPulse)();
      if (onPress) {
        runOnJS(onPress)();
      }
      opacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(initialOpacity, { duration: 250 })
      );
    });

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dynamicStyles = {
    waterDrop: {
      height: size,
      width: size,
      borderRadius: size / 2,
      backgroundColor: color,
    },
  };

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.waterDrop, dynamicStyles.waterDrop, animatedOpacityStyle]}>
        {pulses.map((p) => (
          <Pulse key={p.id} onComplete={() => removePulse(p.id)} color={color} borderRadius={size / 2} />
        ))}
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  waterDrop: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  pulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
});
