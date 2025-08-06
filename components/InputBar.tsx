import React from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps } from 'react-native';

interface InputBarProps {
  isEditing?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
}

export function InputBar({ isEditing, value, onChangeText, onSubmitEditing }: InputBarProps) {
  return (
    <View style={styles.inputBar}>
      {isEditing ? (
        <TextInput
          style={styles.inputText}
          placeholder="Write your entry..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={value}
          onChangeText={onChangeText}
          autoFocus={true}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="done"
        />
      ) : (
        <Text style={styles.inputText}>{value || 'Write your entry...'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    padding: 20,
  },
  inputText: {
    color: 'white',
    fontSize: 18,
  },
});
