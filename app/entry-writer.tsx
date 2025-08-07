import { InputBar } from '@/components/search/InputBar';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EntryWriterModal() {
  const router = useRouter();

  const [entry, setEntry] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setEntry(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`https://api.datamuse.com/sug?s=${text.trim()}`);
      const suggestions = await response.json();
      
      const detailedResults = await Promise.all(
        suggestions.map(async (suggestion: any) => {
          try {
            const detailResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${suggestion.word}`);
            const detailData = await detailResponse.json();
            if (Array.isArray(detailData) && detailData.length > 0) {
              return detailData[0];
            }
            return null;
          } catch (error) {
            return null;
          }
        })
      );

      setSearchResults(detailedResults.filter(Boolean));
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
  };

  const handleAddEntry = async (word: string, phonetic: string) => {
    try {
      const todayString = new Date().toISOString().split('T')[0];
      const storedRunString = await AsyncStorage.getItem('currentRun');
      let currentRun = storedRunString ? JSON.parse(storedRunString) : { date: todayString, entries: [] };

      if (currentRun.date !== todayString && currentRun.entries.length > 0) {
        const historyString = await AsyncStorage.getItem('history');
        const history = historyString ? JSON.parse(historyString) : [];
        const dayToSave = {
          id: currentRun.date,
          ...currentRun,
        };

        const existingEntryIndex = history.findIndex((entry: any) => entry.id === dayToSave.id);

        if (existingEntryIndex > -1) {
          history[existingEntryIndex] = dayToSave;
          await AsyncStorage.setItem('history', JSON.stringify(history));
        } else {
          const newHistory = [...history, dayToSave];
          await AsyncStorage.setItem('history', JSON.stringify(newHistory));
        }
        
        currentRun = { date: todayString, entries: [] };
      }

      const newEntries = [...currentRun.entries, { word, phonetic }];
      const newRun = { ...currentRun, date: todayString, entries: newEntries };
      
      await AsyncStorage.setItem('currentRun', JSON.stringify(newRun));
      router.back();
    } catch (e) {
      console.error("Failed to save new entry.", e);
    }
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalInputWrapper}>
              <InputBar
                isEditing={true}
                value={entry}
                onChangeText={handleSearch}
                onSubmitEditing={() => {}}
                onClose={() => router.back()}
              />
              {searchResults.length > 0 && (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <SearchResultCard
                      word={item.word}
                      phonetic={item.phonetics[0]?.text || ''}
                      definition={item.meanings[0]?.definitions[0]?.definition || ''}
                      onPress={() => handleAddEntry(item.word, item.phonetics[0]?.text || '')}
                    />
                  )}
                />
              )}
            </View>
          </Pressable>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalContent: {
    flex: 1,
  },
  modalInputWrapper: {
    flex: 1,
  },
});
