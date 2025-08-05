import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Path, G, Use } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const AnimatedG = Animated.createAnimatedComponent(G);

interface PulseType {
  id: number;
}

const Pulse = ({ onComplete }: { onComplete: () => void }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withTiming(2.5, { duration: 500 }, (isFinished) => {
      if (isFinished) {
        runOnJS(onComplete)();
      }
    });
  }, [pulse, onComplete]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - pulse.value / 2.5,
  }));

  return <Animated.View style={[styles.pulse, animatedPulseStyle]} />;
};

interface HomeScreenProps {
  buttonColor?: string;
  buttonOpacity?: number;
}

export default function HomeScreen({ buttonColor = 'whitesmoke', buttonOpacity = 0.8 }: HomeScreenProps) {
  const wave1 = useSharedValue(-90);
  const wave2 = useSharedValue(-90);
  const wave3 = useSharedValue(-90);
  const wave4 = useSharedValue(-90);
  const opacity = useSharedValue(buttonOpacity);
  const [pulses, setPulses] = useState<PulseType[]>([]);

  const addPulse = useCallback(() => {
    setPulses((currentPulses) => [...currentPulses, { id: Date.now() }]);
  }, []);

  const removePulse = useCallback((id: number) => {
    setPulses((currentPulses) => currentPulses.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    wave1.value = withRepeat(withTiming(85, { duration: 5000, easing: Easing.linear }), -1, true);
    wave2.value = withRepeat(withTiming(85, { duration: 6000, easing: Easing.linear }), -1, true);
    wave3.value = withRepeat(withTiming(85, { duration: 7000, easing: Easing.linear }), -1, true);
    wave4.value = withRepeat(withTiming(85, { duration: 8000, easing: Easing.linear }), -1, true);
  }, [wave1, wave2, wave3, wave4]);

  const animatedWave1Props = useAnimatedProps(() => ({ translateX: wave1.value }));
  const animatedWave2Props = useAnimatedProps(() => ({ translateX: wave2.value }));
  const animatedWave3Props = useAnimatedProps(() => ({ translateX: wave3.value }));
  const animatedWave4Props = useAnimatedProps(() => ({ translateX: wave4.value }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const tap = Gesture.Tap()
    .onBegin(() => {
      runOnJS(addPulse)();
      opacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(buttonOpacity, { duration: 250 })
      );
    });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(84,58,183,1)', 'rgba(0,172,193,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.waterDrop, { backgroundColor: buttonColor }, animatedOpacityStyle]}>
          {pulses.map((p) => (
            <Pulse key={p.id} onComplete={() => removePulse(p.id)} />
          ))}
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.beforeHighlight} />
          <View style={styles.afterHighlight} />
        </Animated.View>
      </GestureDetector>
      <View style={styles.waveContainer}>
        <Svg
          style={styles.waves}
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <Defs>
            <Path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </Defs>
          <AnimatedG animatedProps={animatedWave1Props}>
            <Use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
          </AnimatedG>
          <AnimatedG animatedProps={animatedWave2Props}>
            <Use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          </AnimatedG>
          <AnimatedG animatedProps={animatedWave3Props}>
            <Use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          </AnimatedG>
          <AnimatedG animatedProps={animatedWave4Props}>
            <Use href="#gentle-wave" x="48" y="7" fill="#fff" />
          </AnimatedG>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.15,
    minHeight: 100,
    maxHeight: 150,
  },
  waves: {
    width: '100%',
    height: '100%',
  },
  waterDrop: {
    position: 'relative',
    height: 200,
    width: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 15, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    zIndex: 1,
  },
  pulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: 'whitesmoke',
    zIndex: 0,
  },
  plusSign: {
    fontSize: 100,
    color: 'rgba(0,0,0,0.2)',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  beforeHighlight: {
    position: 'absolute',
    top: 50,
    left: 30,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  afterHighlight: {
    position: 'absolute',
    top: 25,
    left: 50,
    height: 20,
    width: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-30deg' }],
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
  },
});
