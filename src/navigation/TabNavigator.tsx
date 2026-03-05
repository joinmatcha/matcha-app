import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProfileScreen } from '@/features/profile';
import { SwipeScreen } from '@/features/swipe';
import Colors from '@/themes/colors';
import { TabParamList } from '@/types/navigation';

import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: '#8B9097',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Swipe"
        component={SwipeScreen}
        options={{
          title: 'Métiers',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
