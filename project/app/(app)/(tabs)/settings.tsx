import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  AntDesign
} from '@expo/vector-icons';

import { NavigationProp } from '@react-navigation/native';
import { supabase } from '@/libs/supabaseClient';
import { router } from 'expo-router';

export default function ProfileScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [user, setUser] = useState<any>(null);



  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);

      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, session: { user: any } | null) => {
      setUser(session?.user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  // Mock user data



  const settingsOptions = [
    {
      icon: 'settings-outline',
      label: 'Ajustes ',
      iconProvider: Ionicons
    },

    {
      icon: 'bell-outline',
      label: 'Notifications',
      iconProvider: MaterialCommunityIcons
    },
    {
      icon: 'shield-outline',
      label: 'Privacidad & Seguridad',
      iconProvider: Ionicons
    },
    {
      icon: 'help-circle-outline',
      label: 'Ayuda  & Soporte',
      iconProvider: Ionicons
    },
  ];

  const handleLogout = async () => {
    try {
      // Llama a supabase para cerrar sesión
      await supabase.auth.signOut();


      router.replace('/(auth)/login');

    } catch (error) {
      console.error('Error al hacer logout', (error as any).message);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Text style={styles.headerTitle}></Text>


      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={require("../../../assets/images/hero/avatar.png")}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user ? user.user_metadata.display_name : ''} </Text>
          <Text style={styles.userEmail}>{user ? user.user_metadata.email : ""}</Text>


        </View>


        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ajustes</Text>

          <View style={styles.settingsContainer}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  index === settingsOptions.length - 1 && styles.lastSettingItem
                ]}
              >
                <View style={styles.settingIconContainer}>
                  <option.iconProvider name={option.icon as any} size={22} color="#2D3A3A" />
                </View>
                <Text style={styles.settingLabel}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9B9B9B" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#000000" />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A3A',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#B4E4E0',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3A3A',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#9B9B9B',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 12,
    color: '#B4E4E0',
    marginBottom: 20,
    fontWeight: "700"
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A3A',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A3A',
  },
  seeAllText: {
    color: '#B4E4E0',
    fontWeight: '500',
  },
  petsContainer: {
    paddingBottom: 10,
  },
  petCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 100,
  },
  petImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B4E4E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3A3A',
    marginBottom: 3,
  },
  petDetails: {
    fontSize: 12,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  addPetCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 100,
  },
  addPetCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B4E4E0',
  },
  settingsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2D3A3A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#B4E4E0',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});