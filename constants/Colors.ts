// constants/Colors.ts

const tintColorLight = '#007AFF'; // Primary Blue
const tintColorDark = '#3391FF';  // Slightly richer for dark mode

export const Colors = {
  light: {
    text: '#1E3A5F',            // Dark Blue Text
    background: '#EAF6FF',      // Soft Blue BG
    tint: tintColorLight,       // Accent
    icon: '#94A3B8',            // Light Gray for icons
    tabIconDefault: '#A0AEC0',  // Unfocused tab
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',            // Light text on dark BG
    background: '#0A192F',      // Deep Navy Blue
    tint: tintColorDark,        // Accent
    icon: '#CBD5E1',            // Lighter gray for icons
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
  },
};
