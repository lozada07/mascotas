import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { supabase } from '../../../libs/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';
import { Clock } from 'lucide-react-native';

export default function App() {
  const [user, setUser] = useState<any>(null);

  type RootStackParamList = {
    mascotas: undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
  const articles = {
    featured: [
      {
        id: 1,
        title: "comportamiento del perro",
        category: "Entrenamiento",
        image: require('../../../assets/images/hero/articulo1.png'),
        readTime: "5 min"
      },
      {
        id: 2,
        title: "Cuidado de Gatos",
        category: "Salud",
        image: require('../../../assets/images/hero/articulo2.png'),
        readTime: "4 min"
      }
    ]
  }

  const featuredPets = [
    {
      id: 1,
      name: 'Terry',
      price: 140.00,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Arandu',
      price: 241.99,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 3,
      name: 'Ketty',
      especie: "Gato",
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  const noticias = [
    {
      id: 1,
      name: 'Perro Familiar',
      especie: "Perro",
      image: require('../../../assets/images/hero/noticias.png'),
    },
    {
      id: 2,
      name: 'Gato Familiar',
      especie: "Gato",
      image: require('../../../assets/images/hero/noticias1.png'),

    },

  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greeting}>Hi {user ? user.user_metadata.display_name : 'Taban'} <Text style={styles.emoji}>👋</Text></Text>
            <Text style={styles.subGreeting}>Bienvenido de Vuelta</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}
            onPress={() => navigation.navigate('addmascotas')}>
            <FontAwesome6 name="add" size={15} color="black" />
            <Text style={styles.textButton}> Add Mascota</Text>
          </TouchableOpacity>
        </View>



        < View style={styles.featuredContainer}>
          {featuredPets.map(pet => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petImageContainer}>
                <Image source={{ uri: pet.image }} style={styles.petImage} />
              </View>
              <Text style={styles.petName}>
                {pet.name}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.seeMoreButton}>
          <Ionicons name="paw" size={18} color="#000" />
          <Text style={styles.seeMoreText}>Ver mas</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Especies</Text>

        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.expensiveContainer}
        >
          {noticias.map(pet => (
            <View key={pet.id} style={styles.expensivePetCard}>
              <Image source={pet.image} style={styles.expensivePetImage} />
              <View style={styles.expensivePetInfo}>
                <Text style={styles.expensivePetName}>{pet.name}</Text>
                <Text style={styles.expensivePetDescription}>{pet.especie}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Articulos</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.articleGrid}>
            {articles.featured.map(article => (
              <TouchableOpacity key={article.id} style={styles.articleCard}>
                <Image source={article.image} style={styles.articleImage} />
                <View style={styles.articleOverlay}>
                  <View style={styles.articleContent}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{article.category}</Text>
                    </View>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <View style={styles.articleMeta}>
                      <Clock size={12} color="#fff" />
                      <Text style={styles.readTime}>{article.readTime}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>


    </SafeAreaView >
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
    paddingTop: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2D3A3A',
  },
  emoji: {
    fontSize: 19,
  },
  subGreeting: {
    fontSize: 14,
    color: '#9B9B9B',
    marginTop: 4,
  },
  searchButton: {
    backgroundColor: '#B4E4E0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: "row",
    gap: 2
  },
  textButton: {
    fontSize: 14,
    fontWeight: '500'
  },

  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonSelected: {
    backgroundColor: '#000',
  },
  categoryText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 12,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 80,
    marginBottom: 20,
    marginTop: 40,
    gap: 20

  },
  petCard: {
    width: '48%',
    alignItems: 'center',
  },
  petImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#B4E4E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 55,
  },
  petName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  petColor: {
    color: '#9B9B9B',
    fontWeight: 'normal',
  },
  petPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  seeMoreButton: {
    backgroundColor: '#B4E4E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  seeMoreText: {
    color: '#333',
    marginLeft: 5,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  expensiveContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  expensivePetCard: {
    width: 200,
    height: 120,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  expensivePetImage: {
    width: '100%',
    height: '100%',
  },
  expensivePetInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  expensivePetName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  expensivePetDescription: {
    color: '#fff',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  lastSection: {
    marginBottom: 40, // Extra space for the last section
  },

  articleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  articleCard: {
    width: '48%',
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  articleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  articleContent: {
    padding: 12,
  },
  categoryBadge: {
    backgroundColor: '#B4E4E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  articleTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
});