import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Colors from the user's CSS
const v1 = '#be91c6';
const v2 = '#8a65cc';
const v3 = '#5e30d9';
const v4 = '#3b1895';
const s1 = '#fea798';
const s2 = '#ff846e';
const cloudColor = '#fea798';

const Light = ({ delay, top, width, left }: { delay: number; top: DimensionValue; width: DimensionValue; left: DimensionValue }) => {
  const opacity = useSharedValue(0);
  const scaleX = useSharedValue(0.1);

  useEffect(() => {
    const animation = withRepeat(
      withSequence(
        withDelay(delay, withTiming(0.6, { duration: 75 })), // 50% slower
        withTiming(0, { duration: 2250 }) // 50% slower
      ),
      -1
    );
    opacity.value = animation;
    scaleX.value = animation;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleX: scaleX.value }],
  }));

  return <Animated.View style={[styles.light, { top, width, left }, animatedStyle]} />;
};

export function LandscapeBackground() {
  const cloud1X = useSharedValue(-width);
  const cloud2X = useSharedValue(-width * 1.5);

  useEffect(() => {
    cloud1X.value = withRepeat(withTiming(width, { duration: 120000, easing: Easing.linear }), -1);
    cloud2X.value = withRepeat(withTiming(width, { duration: 100000, easing: Easing.linear }), -1);
  }, []);

  const cloud1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud1X.value }],
  }));

  const cloud2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud2X.value }],
  }));

  return (
    <View style={styles.landscape}>
      <LinearGradient
        colors={[v1, s1, v1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.sun} />

      <Animated.View style={[styles.cloud, styles.cloud1, cloud1AnimatedStyle]} />
      <Animated.View style={[styles.cloud, styles.cloud2, cloud2AnimatedStyle]} />
      
      <View style={[styles.mountain, styles.mountain1]} />
      <View style={[styles.mountain, styles.mountain2]} />
      <View style={[styles.mountain, styles.mountain3]} />

      <View style={styles.water}>
        <LinearGradient
          colors={['#fea79855', v2]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.horizonLine} />
        <Light delay={0} top="1%" width="30%" left="45.5%" />
        <Light delay={500} top="3%" width="3%" left="54%" />
        <Light delay={1000} top="5%" width="10%" left="55%" />
        <Light delay={1500} top="2%" width="14%" left="53%" />
        <Light delay={2000} top="4%" width="11%" left="54.5%" />
      </View>

      <View style={[styles.lotus, styles.lotus1]} />
      <View style={[styles.lotus, styles.lotus2]} />
      <View style={[styles.lotus, styles.lotus3]} />
      
      <View style={styles.front}>
        <View style={styles.stone} />
        <View style={styles.grass} />
        <View style={[styles.grass, styles.grass1]} />
        <View style={[styles.grass, styles.grass2]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  landscape: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  mountain: {
    position: 'absolute',
  },
  mountain1: {
    width: width * 0.4,
    height: height * 0.15,
    bottom: '50%',
    left: -width * 0.1,
    backgroundColor: v3, // Simplified background
    borderTopLeftRadius: width * 0.9,
    borderTopRightRadius: width * 0.5,
  },
  mountain2: {
    width: width * 0.4,
    height: height * 0.075,
    bottom: '50%',
    left: width * 0.05,
    backgroundColor: v4, // Simplified background
    borderTopLeftRadius: width * 0.6,
    borderTopRightRadius: width * 0.3,
  },
  mountain3: {
    width: width * 0.5,
    height: height * 0.06,
    bottom: '50%',
    right: -width * 0.425,
    backgroundColor: v4, // Simplified background
    borderTopLeftRadius: width * 0.4,
  },
  water: {
    position: 'absolute',
    top: '50%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sun: {
    position: 'absolute',
    backgroundColor: 'white',
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    left: '60%',
    marginLeft: -width * 0.1,
    top: '50%',
    marginTop: -width * 0.1,
  },
  light: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  horizonLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  lotus: {
    position: 'absolute',
    width: width * 0.1,
    height: height * 0.05,
    backgroundColor: v3,
    borderRadius: width * 0.05,
    opacity: 0.7,
  },
  lotus1: {
    bottom: height * 0.1,
    right: width * 0.05,
    width: width * 0.2,
  },
  lotus2: {
    bottom: height * 0.2,
    right: width * 0.15,
    height: height * 0.03,
    transform: [{ skewX: '-10deg' }],
    opacity: 0.5,
  },
  lotus3: {
    bottom: height * 0.1,
    right: width * 0.35,
    transform: [{ rotate: '180deg' }, { skewX: '-20deg' }],
    opacity: 0.8,
    width: width * 0.15,
  },
  cloud: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.06,
    backgroundColor: cloudColor,
    borderRadius: height * 0.03,
    opacity: 0.3,
  },
  cloud1: {
    top: '15%',
    left: '60%',
  },
  cloud2: {
    top: '24%',
    left: '20%',
    opacity: 0.2,
  },
  front: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 1,
  },
  stone: {
    position: 'absolute',
    bottom: -height * 0.05,
    left: 0,
    height: height * 0.2,
    width: width * 0.4,
    backgroundColor: v4,
    borderTopRightRadius: width * 0.4,
  },
  grass: {
    position: 'absolute',
    height: height * 0.4,
    width: width * 0.1,
    bottom: 0,
    borderTopRightRadius: width * 0.1,
    borderRightWidth: 5,
    borderRightColor: v4,
  },
  grass1: {
    left: width * 0.14,
    bottom: -height * 0.02,
    transform: [{ scaleX: -1 }],
    borderRightColor: v3,
  },
  grass2: {
    right: 0,
    left: 'auto',
    height: height * 0.2,
    bottom: -height * 0.02,
    transform: [{ scaleX: -1 }],
  },
});
