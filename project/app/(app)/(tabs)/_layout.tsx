import { Tabs } from 'expo-router';
import { Clock, Settings, User } from 'lucide-react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#B4E4E0',
          borderTopColor: '#e1e1e1',
        },

        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#6f6f6f',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="pets" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comidas"
        options={{
          title: 'Comidas',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs >
  );
}