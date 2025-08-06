import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputBar } from '@/components/InputBar';
import { SearchResultCard } from '@/components/SearchResultCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      const storedEntries = await AsyncStorage.getItem('entries');
      const currentEntries = storedEntries ? JSON.parse(storedEntries) : [];
      const newEntries = [...currentEntries, { word, phonetic }];
      await AsyncStorage.setItem('entries', JSON.stringify(newEntries));
      router.back();
    } catch (e) {
      console.error("Failed to save new entry.", e);
    }
  };

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.modalContainer}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalInputWrapper}>
              <InputBar
                isEditing={true}
                value={entry}
                onChangeText={handleSearch}
                onSubmitEditing={() => {}}
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
        </SafeAreaView>
      </GestureHandlerRootView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
