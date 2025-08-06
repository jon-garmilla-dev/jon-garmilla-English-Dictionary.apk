import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { PillBubble } from './PillBubble';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/IconSymbol';

interface EntryRowProps {
  word: string;
  phonetic: string;
  isEditing?: boolean;
  onDelete?: () => void;
}

export function EntryRow({ word, phonetic, isEditing, onDelete }: EntryRowProps) {
  const router = useRouter();
  const wordOpacity = useSharedValue(0);
  const phoneticOpacity = useSharedValue(1);

  const wordAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: wordOpacity.value,
      pointerEvents: wordOpacity.value === 1 ? 'auto' : 'none',
    };
  });

  const phoneticAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isEditing ? 1 : phoneticOpacity.value,
    };
  });

  const handlePressIn = () => {
    if (isEditing) return;
    wordOpacity.value = withTiming(1, { duration: 200 });
    phoneticOpacity.value = withTiming(0, { duration: 200 });
  };

  const handlePressOut = () => {
    if (isEditing) return;
    wordOpacity.value = withTiming(0, { duration: 200 });
    phoneticOpacity.value = withTiming(1, { duration: 200 });
  };

  const fetchWordDetails = async () => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        router.push({
          pathname: '/word-detail',
          params: { details: JSON.stringify(data[0]) },
        });
      } else {
        router.push({
          pathname: '/word-detail',
          params: { details: JSON.stringify({ word: 'Not Found', phonetics: [], meanings: [] }) },
        });
      }
    } catch (error) {
      console.error(error);
      router.push({
        pathname: '/word-detail',
        params: { details: JSON.stringify({ word: 'Error', phonetics: [], meanings: [] }) },
      });
    }
  };

  return (
    <View style={styles.rowContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isEditing}
      >
        <Animated.View style={[styles.leftContainer, phoneticAnimatedStyle, isEditing && styles.disabled]}>
          <PillBubble>
            <Text style={[styles.bubbleText, !phonetic && styles.fallbackText]} numberOfLines={1}>{phonetic || word}</Text>
          </PillBubble>
        </Animated.View>
      </Pressable>
      
      <Pressable
        onPress={isEditing ? onDelete : fetchWordDetails}
        style={styles.rightContainer}
      >
        <Animated.View style={phoneticAnimatedStyle}>
          <PillBubble>
            {isEditing ? (
              <Text style={styles.deleteText}>X</Text>
            ) : (
              <Text style={styles.bubbleText}>?</Text>
            )}
          </PillBubble>
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.animatedContainer, wordAnimatedStyle]}>
        <View style={styles.bubbleContainer}>
          <PillBubble color="rgba(0,0,0,0.4)">
            <Text style={styles.bubbleText} numberOfLines={1}>{word}</Text>
          </PillBubble>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
    height: 80,
  },
  leftContainer: {
    height: 60,
  },
  rightContainer: {
    height: 60,
    justifyContent: 'center',
  },
  bubbleContainer: {
    height: 60,
  },
  animatedContainer: {
    position: 'absolute',
    right: 30,
    height: 60,
  },
  bubbleText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fallbackText: {
    fontStyle: 'italic',
    opacity: 0.8,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 22,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  }
});
