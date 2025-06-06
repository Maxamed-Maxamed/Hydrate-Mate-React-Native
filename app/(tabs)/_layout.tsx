// import { Colors } from '@/constants/Colors';
// import { Ionicons } from '@expo/vector-icons';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Tabs } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
// import { SafeAreaView } from 'react-native-safe-area-context';


// export default function TabsLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, }}>

   
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Tabs
//         screenOptions={{
//           tabBarActiveTintColor: Colors.light.tint,
//           tabBarInactiveTintColor: '#88B7E3',
//           tabBarStyle: {
//             elevation: 5,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: -2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             borderTopWidth: 0,
//             borderTopLeftRadius: 15,
//             borderTopRightRadius: 15,
//             height: 60,
//             paddingBottom: 5,
//             paddingTop: 5,
//           },
//         }}>
//         <Tabs.Screen
//           name="index"
//           options={{
//             title: 'Home',
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="history"
//           options={{
//             title: 'History',
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           options={{
//             title: 'Profile',
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="settings"
//           options={{
//             title: 'Settings',
//             headerShown: false,
//             tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
//           }}
//         />
//       </Tabs>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//      </SafeAreaView>
//   );
// }



import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider style={styles.SafeArea}>
      {/* SafeAreaProvider is used to ensure proper layout on devices with notches or rounded corners */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.light.tint,
            tabBarInactiveTintColor: colorScheme === 'dark' ? '#88B7E3' : '#000000',
            tabBarStyle: [
              styles.tabBar, 
              { backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff' }
            ],
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  tabBar: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 90,
    paddingBottom: 5,
    paddingTop: 5,
  }
});
