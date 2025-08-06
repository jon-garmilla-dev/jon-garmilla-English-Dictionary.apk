import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { EntryRow } from '@/components/EntryRow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InputBar } from '@/components/InputBar';

export default function RunScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const [entries, setEntries] = useState<{ word: string, phonetic: string }[]>([]);

  const loadEntries = useCallback(async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('entries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (e) {
      console.error("Failed to load entries.", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
          <LinearGradient
            colors={['rgba(0,172,193,1)', 'rgba(84,58,183,1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" color="white" size={24} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.entriesContainer}>
            {entries.map((item, index) => (
              <EntryRow key={index} word={item.word} phonetic={item.phonetic} />
            ))}
          </ScrollView>

          <Pressable onPress={() => router.push('/entry-writer')} style={styles.inputWrapper}>
            <InputBar value="" />
          </Pressable>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
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
    opacity: 0.7,
    textAlign: 'right',
  },
  backButton: {
    padding: 10,
  },
  entriesContainer: {
    paddingVertical: 10,
  },
  inputWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
