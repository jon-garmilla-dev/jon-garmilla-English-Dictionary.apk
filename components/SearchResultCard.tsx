import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface SearchResultCardProps {
  word: string;
  phonetic: string;
  definition: string;
  onPress: () => void;
}

export function SearchResultCard({ word, phonetic, definition, onPress }: SearchResultCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.wordText}>{word}</Text>
          <Text style={styles.phoneticText}>{phonetic}</Text>
        </View>
        <Text style={styles.definitionText}>{definition}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wordText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneticText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  definitionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});
