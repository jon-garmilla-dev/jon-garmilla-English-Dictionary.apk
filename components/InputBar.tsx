import React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface InputBarProps {
  isEditing?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onClose?: () => void;
}

export function InputBar({ isEditing, value, onChangeText, onSubmitEditing, onClose }: InputBarProps) {
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
      {isEditing && onClose && (
        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
          <IconSymbol name="xmark" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    paddingLeft: 15,
  },
});
