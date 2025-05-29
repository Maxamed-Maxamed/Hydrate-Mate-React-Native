/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#007BFF'; // Primary Blue
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#002E5D', // Deep Blue Text
    background: '#E0F7FF', // Background Blue
    tint: tintColorLight,
    icon: '#007BFF', // Matching icon color with Primary Blue
    tabIconDefault: '#007BFF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
