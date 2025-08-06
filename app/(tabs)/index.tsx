import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Path, G, Use } from 'react-native-svg';
import Animated, * as Reanimated from 'react-native-reanimated';
const {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
  useAnimatedStyle,
  withSequence,
} = Reanimated;
import { Bubble } from '@/components/Bubble';

const { height } = Dimensions.get('window');
const AnimatedG = Animated.createAnimatedComponent(G);

export default function HomeScreen() {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const wave1 = useSharedValue(-90);
  const wave2 = useSharedValue(-90);
  const wave3 = useSharedValue(-90);
  const wave4 = useSharedValue(-90);

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (isPressed) return;
    setIsPressed(true);
    scale.value = withSequence(
      withTiming(1.2, { duration: 250 }),
      withTiming(1, { duration: 250 })
    );
    setTimeout(() => {
      router.push('/run');
      setIsPressed(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(84,58,183,1)', 'rgba(0,172,193,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <TouchableOpacity onPress={handlePress} disabled={isPressed}>
        <Animated.View style={animatedStyle}>
          <Bubble>
            <Text style={styles.plusSign}>+</Text>
          </Bubble>
        </Animated.View>
      </TouchableOpacity>
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
  plusSign: {
    fontSize: 100,
    color: 'rgba(0,0,0,0.2)',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});
