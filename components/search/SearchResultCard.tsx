import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SearchResultCardProps {
  word: string;
  phonetic: string;
  definition: string;
  onPress: () => void;
}

export function SearchResultCard({ word, phonetic, definition, onPress }: SearchResultCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setTimeout(() => {
      onPress();
    }, 200);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
    >
      <Animated.View style={[
        styles.card,
        animatedStyle,
        isHovered && styles.cardHovered
      ]}>
        <View style={styles.topRow}>
          <Text style={styles.wordText}>{word}</Text>
          <Text style={styles.phoneticText}>{phonetic}</Text>
        </View>
        <Text style={styles.definitionText}>{definition}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardHovered: {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wordText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneticText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  definitionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});
