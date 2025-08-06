import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryRow } from '@/components/EntryRow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function RunScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const inputOpacity = useSharedValue(0.1);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<string[]>([]);

  const handleAddEntry = () => {
    if (entry.trim()) {
      setEntries(prev => [...prev, entry.trim()]);
      setEntry('');
    }
  };

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${inputOpacity.value})`,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={['rgba(0,172,193,1)', 'rgba(255, 100, 80, 1)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={styles.header}>
          <Text style={styles.dateText}>{currentDate}</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButtonText}>{'<-'}</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.entriesContainer}>
          {entries.map((item, index) => (
            <EntryRow key={index} text={item} />
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <AnimatedTextInput
            style={[styles.input, animatedInputStyle]}
            placeholder="Write your entry..."
            value={entry}
            onChangeText={setEntry}
            onSubmitEditing={handleAddEntry}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            onFocus={() => {
              inputOpacity.value = withTiming(0.3);
            }}
            onBlur={() => {
              inputOpacity.value = withTiming(0.1);
            }}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
  },
  entriesContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  input: {
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 25,
    fontSize: 18,
    color: 'white',
    minHeight: 60,
  },
});
