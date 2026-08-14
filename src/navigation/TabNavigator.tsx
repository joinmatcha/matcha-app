import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

import { HomeScreen } from '@/features/home';
import { ProfileScreen } from '@/features/profile';
import { SwipeScreen } from '@/features/swipe';
import Colors from '@/themes/colors';
import { TabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: '#8B9097',
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconShell, focused && styles.iconShellActive]}>
              <MaterialIcons name="home" color={color} size={26} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Swipe"
        component={SwipeScreen}
        options={{
          title: 'Métiers',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconShell, focused && styles.iconShellActive]}>
              <MaterialIcons name="favorite" color={color} size={25} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconShell, focused && styles.iconShellActive]}>
              <MaterialIcons name="person" color={color} size={26} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 81, 58, 0.08)',
    backgroundColor: 'rgba(255, 253, 249, 0.96)',
    shadowColor: '#22332C',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabBarLabel: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
  },
  iconShell: {
    width: 42,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: {
    backgroundColor: 'rgba(16, 24, 32, 0.08)',
  },
});
