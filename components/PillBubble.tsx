import React, { useState, useCallback, ReactNode } from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface PulseType {
  id: number;
  size: number;
}

const Pulse = ({ onComplete, color, size }: { onComplete: () => void; color: string; size: number }) => {
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
    width: size,
    height: size,
    borderRadius: size / 2,
  }));

  return <Animated.View style={[styles.pulse, { backgroundColor: color }, animatedPulseStyle]} />;
};

interface PillBubbleProps {
  children?: ReactNode;
  onPress?: () => void;
  color?: string;
}

export function PillBubble({
  children,
  onPress,
  color = 'rgba(0,0,0,0.2)',
}: PillBubbleProps) {
  const [pulses, setPulses] = useState<PulseType[]>([]);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const addPulse = useCallback(() => {
    if (layout.height > 0) {
      setPulses((currentPulses) => [...currentPulses, { id: Date.now(), size: layout.height }]);
    }
  }, [layout.height]);

  const removePulse = useCallback((id: number) => {
    setPulses((currentPulses) => currentPulses.filter((p) => p.id !== id));
  }, []);

  const tap = Gesture.Tap()
    .onBegin(() => {
      runOnJS(addPulse)();
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.pill, { backgroundColor: color }]} onLayout={onLayout}>
        {pulses.map((p) => (
          <Pulse key={p.id} onComplete={() => removePulse(p.id)} color={color} size={p.size} />
        ))}
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
    borderRadius: 1000,
  },
  pulse: {
    position: 'absolute',
    zIndex: 0,
  },
});
