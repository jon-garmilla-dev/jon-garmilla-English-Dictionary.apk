import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PillBubble } from '@/components/PillBubble';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { EntryRow } from '@/components/EntryRow';
import { SearchResultCard } from '@/components/SearchResultCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InputBar } from '@/components/InputBar';

export default function RunScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<{ word: string, phonetic: string }[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

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

  const handleAddEntry = (word: string, phonetic: string) => {
    setEntries(prev => [...prev, { word, phonetic }]);
    setEntry('');
    setSearchResults([]);
    setIsWriting(false);
  };

  const handleClose = () => {
    setIsWriting(false);
  }

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

          {/* Fake Input Area - only shown when not writing */}
          {!isWriting && (
            <Pressable onPress={() => setIsWriting(true)} style={styles.inputWrapper}>
              <InputBar value={entry} />
            </Pressable>
          )}
        </SafeAreaView>
      </GestureHandlerRootView>

      {/* Writing Modal */}
      <Modal
        transparent={true}
        visible={isWriting}
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent={true}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.modalContainer}>
              <Pressable style={styles.modalContent}>
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
      </Modal>
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
  resultText: {
    color: 'white',
    fontSize: 16,
  },
});
