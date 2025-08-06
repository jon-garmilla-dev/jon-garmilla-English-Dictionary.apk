import { Stack, useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { EntryRow } from '@/components/EntryRow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InputBar } from '@/components/InputBar';

export default function RunScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState('');
  const [entries, setEntries] = useState<{ word: string, phonetic: string }[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (params.entries) {
      setIsReadOnly(true);
      setEntries(JSON.parse(params.entries as string));
    }
  }, [params.entries]);

  const handleAutomaticSave = useCallback(async () => {
    if (isReadOnly) return;
    try {
      const todayString = new Date().toLocaleDateString();
      const currentRunString = await AsyncStorage.getItem('currentRun');
      
      if (currentRunString) {
        const currentRun = JSON.parse(currentRunString);
        if (currentRun.date !== todayString && currentRun.entries.length > 0) {
          const historyString = await AsyncStorage.getItem('history');
          const history = historyString ? JSON.parse(historyString) : [];
          const dayToSave = {
            id: new Date(currentRun.date).getTime().toString(),
            ...currentRun
          };
          const newHistory = [...history, dayToSave];
          await AsyncStorage.setItem('history', JSON.stringify(newHistory));
          await AsyncStorage.removeItem('currentRun');
          setEntries([]);
        } else {
          setEntries(currentRun.entries);
        }
      } else {
        setEntries([]);
      }
    } catch (e) {
      console.error("Failed to handle automatic save.", e);
    }
  }, [isReadOnly]);

  useFocusEffect(
    useCallback(() => {
      handleAutomaticSave();
    }, [handleAutomaticSave])
  );

  const handleDeleteEntry = async (indexToDelete: number) => {
    const newEntries = entries.filter((_, index) => index !== indexToDelete);
    setEntries(newEntries);
    try {
      const storedRunString = await AsyncStorage.getItem('currentRun');
      if (storedRunString) {
        const currentRun = JSON.parse(storedRunString);
        const newRun = { ...currentRun, entries: newEntries };
        await AsyncStorage.setItem('currentRun', JSON.stringify(newRun));
      }
    } catch (e) {
      console.error("Failed to delete entry.", e);
    }
  };

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
            <Pressable onPress={() => router.replace('/')} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color="white" size={24} />
            </Pressable>
            <Text style={styles.dateText}>{isReadOnly ? params.date : currentDate}</Text>
            {!isReadOnly ? (
              <Pressable onPress={() => setIsEditing(!isEditing)} style={styles.headerButton}>
                <IconSymbol name="pencil" color={isEditing ? '#ff9500' : 'white'} size={24} />
              </Pressable>
            ) : (
              <View style={styles.headerButton} /> // Spacer
            )}
          </View>
          <ScrollView contentContainerStyle={styles.entriesContainer}>
            {entries.map((item, index) => (
              <EntryRow
                key={index}
                word={item.word}
                phonetic={item.phonetic}
                isEditing={isEditing}
                onDelete={() => handleDeleteEntry(index)}
              />
            ))}
          </ScrollView>

          {!isReadOnly && (
            <Pressable onPress={() => router.push('/entry-writer')} style={styles.inputWrapper}>
              <InputBar value="" />
            </Pressable>
          )}
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
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.7,
    textAlign: 'center',
  },
  headerButton: {
    padding: 10,
    width: 44, // Ensure buttons have same width for centering
    alignItems: 'center',
  },
  entriesContainer: {
    paddingVertical: 10,
  },
  inputWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
