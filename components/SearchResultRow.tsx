import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PillBubble } from './PillBubble';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SearchResultRowProps {
  word: string;
  phonetic: string;
  onPress: () => void;
}

export function SearchResultRow({ word, phonetic, onPress }: SearchResultRowProps) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    opacity.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(0, { duration: 200 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.container}>
        <View style={styles.bubbleContainer}>
          <PillBubble>
            <Text style={styles.bubbleText}>{phonetic}</Text>
          </PillBubble>
        </View>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <PillBubble color="rgba(0,0,0,0.4)">
            <Text style={styles.bubbleText}>{word}</Text>
          </PillBubble>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
    height: 80,
  },
  bubbleContainer: {
    height: 60,
  },
  animatedContainer: {
    position: 'absolute',
    left: 30, // to match the paddingHorizontal
    height: 60,
  },
  bubbleText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
