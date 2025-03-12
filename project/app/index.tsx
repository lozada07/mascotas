import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../libs/supabaseClient';  // Asegúrate de importar la configuración de Supabase
import { useEffect, useState } from 'react';

export default function WelcomeScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la pantalla
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);  // Si está autenticado, guarda el usuario
        router.navigate('/(app)/(tabs)');  // Redirige al usuario a la pantalla principal

      }
    });

    // Suscribirse a cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, session: { user: any } | null) => {
      setUser(session?.user);  // Actualiza el estado cuando cambie el usuario
    });

    return () => {
      authListener?.subscription.unsubscribe();  // Desuscribirse cuando el componente se desmonte
    };
  }, []);

  return (
    <ImageBackground
      source={
        { uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      }
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Pet Feeder</Text>
            <Text style={styles.subtitle}>
              Cuida a tus mascotas como se merecen
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {user ? (
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={() => router.push('/(app)/(tabs)')}
              >
                <Text style={styles.buttonText}>Ir a la app</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.registerButton]}
                  onPress={() => router.push('/(auth)/register')}
                >
                  <Text style={[styles.buttonText, styles.registerText]}>
                    Crear Cuenta
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: '40%',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 48,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#B4E4E0',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  registerText: {
    color: '#fff',
  },
});
