import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.waterDrop}>
        <View style={styles.beforeHighlight} />
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
    borderRadius: 100,
    backgroundColor: 'whitesmoke',
    elevation: 10,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 15, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  beforeHighlight: {
    content: '""',
    position: 'absolute',
    top: 50,
    left: 30,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  afterHighlight: {
    content: '""',
    position: 'absolute',
    top: 25,
    left: 50,
    height: 20,
    width: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-30deg' }],
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
  },
});
