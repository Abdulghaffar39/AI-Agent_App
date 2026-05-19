import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import BookingScreen from './src/screens/BookingScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import TraceScreen from './src/screens/TraceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  bgDark: '#0A0E1A',
  bgCard: '#141829',
  primary: '#6C63FF',
  accent: '#00D9A6',
  textPrimary: '#FFFFFF',
  textMuted: '#5A6188',
};

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.bgCard },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: '700', fontSize: 16 },
  contentStyle: { backgroundColor: COLORS.bgDark },
};

function TabIcon({ icon, label, focused }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={{
        fontSize: 10, marginTop: 2, fontWeight: '600',
        color: focused ? COLORS.primary : COLORS.textMuted,
      }}>{label}</Text>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen}
        options={{ title: '🔧 Results' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: '✅ Booking Details' }}
      />
      <Stack.Screen 
        name="Trace" 
        component={TraceScreen}
        options={{ title: '🔍 Agent Traces' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.bgCard,
            borderTopColor: 'rgba(108,99,255,0.1)',
            height: 60,
            paddingBottom: 6,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="📋" label="Bookings" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
