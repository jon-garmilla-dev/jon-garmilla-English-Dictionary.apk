import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.waterDrop}>
        <Text style={styles.plusSign}>+</Text>
        {/* Replicating the ::before pseudo-element */}
        <View style={styles.beforeHighlight} />
        {/* Replicating the ::after pseudo-element */}
        <View style={styles.afterHighlight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
  waterDrop: {
    position: 'relative',
    height: 200,
    width: 200,
    borderRadius: 100, // Half of height/width to make a circle
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center',
    // Android shadow
    elevation: 10,
    // iOS shadow
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 15, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 20,
    // A simple border to mimic the inset shadow effect
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  plusSign: {
    fontSize: 100,
    color: 'rgba(0,0,0,0.2)',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1
  },
  beforeHighlight: {
    position: 'absolute',
    top: 50,
    left: 30,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.8, // mix-blend-mode is not supported, using opacity instead
  },
  afterHighlight: {
    position: 'absolute',
    top: 25,
    left: 50,
    height: 20,
    width: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-30deg' }],
    // Using a border to simulate the inset shadow
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
  },
});
