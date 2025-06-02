// Colors.ts
const tintColorLight = '#007BFF'; // Primary Blue
const tintColorDark = '#0A84FF'; // Slightly richer for dark mode

export const Colors = {
  light: {
    text: '#003366',           // Dark Blue Text
    background: '#EAF6FF',     // Soft Blue BG
    tint: tintColorLight,      // Accent
    icon: '#8E8E93',           // Light Gray (for tab icons)
    tabIconDefault: '#8E8E93', // Unfocused tab
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',           // Light text on dark BG
    background: '#121212',     // Dark mode base
    tint: tintColorDark,       // Accent in dark mode
    icon: '#CCCCCC',           // Lighter gray for icons
    tabIconDefault: '#999999',
    tabIconSelected: tintColorDark,
  },
};
