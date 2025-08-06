import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchResultCard } from '@/components/SearchResultCard';

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
      // Sort history from newest to oldest
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
      <LinearGradient
        colors={['rgba(84,58,183,1)', 'rgba(0,172,193,1)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
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
