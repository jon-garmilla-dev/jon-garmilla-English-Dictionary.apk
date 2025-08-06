import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

const Synonyms = ({ data }: { data: string[] }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.topicContainer}>
      <Text style={styles.topicTitle}>Synonyms</Text>
      <Text style={styles.topicContent}>{data.join(', ')}</Text>
    </View>
  );
};

const Antonyms = ({ data }: { data: string[] }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.topicContainer}>
      <Text style={styles.topicTitle}>Antonyms</Text>
      <Text style={styles.topicContent}>{data.join(', ')}</Text>
    </View>
  );
};

export default function WordDetailModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [wordDetails, setWordDetails] = useState<any>(null);

  useEffect(() => {
    if (params.details && typeof params.details === 'string') {
      try {
        setWordDetails(JSON.parse(params.details));
      } catch (e) {
        console.error("Failed to parse word details:", e);
      }
    }
  }, [params.details]);

  const phoneticInfo = wordDetails?.phonetics?.find((p: any) => p.text && p.audio);
  const primaryPhonetic = phoneticInfo?.text || wordDetails?.phonetics?.find((p: any) => p.text)?.text || '';
  
  let audioUrl = null;
  const rawAudioUrl = phoneticInfo?.audio;
  if (rawAudioUrl) {
    if (rawAudioUrl.startsWith('http')) {
      audioUrl = rawAudioUrl;
    } else {
      audioUrl = `https:${rawAudioUrl}`;
    }
  }

  const player = useAudioPlayer(audioUrl);

  const playSound = () => {
    player.seekTo(0);
    player.play();
  };

  if (!wordDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.wordText}>{wordDetails.word}</Text>
          <View style={styles.phoneticRow}>
            <Text style={styles.phoneticText}>{primaryPhonetic}</Text>
            <Pressable
              onPress={playSound}
              disabled={!audioUrl}
              style={[styles.audioButton, !audioUrl && styles.audioButtonDisabled]}
              hitSlop={10}
            >
              <IconSymbol name="speaker.wave.2.fill" size={22} color="white" />
            </Pressable>
          </View>
        </View>

        {wordDetails.origin && (
          <View style={styles.originContainer}>
            <Text style={styles.originText}>{wordDetails.origin}</Text>
          </View>
        )}

        {wordDetails.meanings.map((meaning: any, index: number) => (
          <View key={index} style={styles.meaningContainer}>
            <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
            {meaning.definitions.map((def: any, i: number) => (
              <View key={i} style={styles.definitionBlock}>
                <Text style={styles.definitionText}>{i + 1}. {def.definition}</Text>
                {def.example && (
                  <Text style={styles.exampleText}>{`"${def.example}"`}</Text>
                )}
              </View>
            ))}
            <Synonyms data={meaning.synonyms} />
            <Antonyms data={meaning.antonyms} />
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.closeButton} onPress={() => router.back()} hitSlop={10}>
        <IconSymbol name="xmark" size={20} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 25,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 25,
    padding: 10,
    zIndex: 2,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 15,
    marginBottom: 15,
  },
  originContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  originText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  wordText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneticText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
  },
  audioButton: {
    padding: 5,
  },
  audioButtonDisabled: {
    opacity: 0.3,
  },
  meaningContainer: {
    marginBottom: 20,
  },
  partOfSpeech: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  definitionBlock: {
    marginBottom: 15,
  },
  definitionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 22,
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 5,
    marginLeft: 15,
  },
  topicContainer: {
    marginTop: 10,
  },
  topicTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topicContent: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    marginTop: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  }
});
