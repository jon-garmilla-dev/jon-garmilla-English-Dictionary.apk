import { LandscapeBackground } from '@/components/LandscapeBackground';
import { SearchResultCard } from '@/components/SearchResultCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Day {
  id: string;
  date: string;
  entries: { word: string; phonetic: string }[];
}

export default function ListScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<Day[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const historyString = await AsyncStorage.getItem('history');
      const parsedHistory = historyString ? JSON.parse(historyString) : [];
      setHistory(parsedHistory.reverse());
    } catch (e) {
      console.error("Failed to load history.", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const renderItem = ({ item, index }: { item: Day, index: number }) => (
    <SearchResultCard
      word={`Day ${history.length - index}`}
      phonetic={item.date}
      definition={`${item.entries.length} words`}
      onPress={() =>
        router.push({
          pathname: '/run',
          params: {
            entries: JSON.stringify(item.entries),
            date: item.date,
          },
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <LandscapeBackground />
      <Text style={styles.title}>History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
