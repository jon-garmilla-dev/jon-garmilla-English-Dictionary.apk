import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { View, StyleSheet } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const isExploreButton = props.accessibilityLabel?.includes('Explore');

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      style={styles.container}
    >
      <View style={[styles.bubble, {
        backgroundColor: isExploreButton ? 'rgba(255, 100, 80, 1)' : (props.accessibilityState?.selected ? 'black' : 'rgba(0,0,0,0.5)')
      }]}>
        {props.children}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
