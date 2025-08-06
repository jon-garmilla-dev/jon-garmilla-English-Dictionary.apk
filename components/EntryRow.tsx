import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { PillBubble } from './PillBubble';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface EntryRowProps {
  text: string;
}

export function EntryRow({ text }: EntryRowProps) {
  const opacity = useSharedValue(0); // Start fully transparent

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
    <View style={styles.rowContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.bubbleContainer}
      >
        <PillBubble>
          <Text style={styles.bubbleText} numberOfLines={1}>{text}</Text>
        </PillBubble>
      </Pressable>

      <Animated.View style={[{ position: 'absolute', right: 20 }, animatedStyle]}>
        <View style={styles.bubbleContainer}>
          <PillBubble color="rgba(0,0,0,0.4)">
            <Text style={styles.bubbleText} numberOfLines={1}>{text}</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    height: 80, // Give the row a fixed height to contain the bubbles
  },
  bubbleContainer: {
    height: 60, // A fixed height for the pill
  },
  bubbleText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
