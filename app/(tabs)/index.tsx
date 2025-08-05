import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Path, G, Use } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedG = Animated.createAnimatedComponent(G);

interface HomeScreenProps {
  buttonColor?: string;
  buttonOpacity?: number;
}

export default function HomeScreen({ buttonColor = 'whitesmoke', buttonOpacity = 0.8 }: HomeScreenProps) {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const wave4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
          delay,
        })
      );
    };

    const animation1 = createAnimation(wave1, 5000, 0);
    const animation2 = createAnimation(wave2, 6000, -1000);
    const animation3 = createAnimation(wave3, 7000, -2000);
    const animation4 = createAnimation(wave4, 8000, -3000);

    animation1.start();
    animation2.start();
    animation3.start();
    animation4.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
      animation4.stop();
    };
  }, []);

  const getTranslateX = (animatedValue: Animated.Value) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-90, 85],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(84,58,183,1)', 'rgba(0,172,193,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={[styles.waterDrop, { backgroundColor: buttonColor, opacity: buttonOpacity }]}>
        <Text style={styles.plusSign}>+</Text>
        <View style={styles.beforeHighlight} />
        <View style={styles.afterHighlight} />
      </View>
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
          <AnimatedG translateX={getTranslateX(wave1)}>
            <Use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
          </AnimatedG>
          <AnimatedG translateX={getTranslateX(wave2)}>
            <Use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          </AnimatedG>
          <AnimatedG translateX={getTranslateX(wave3)}>
            <Use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          </AnimatedG>
          <AnimatedG translateX={getTranslateX(wave4)}>
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
