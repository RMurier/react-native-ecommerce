import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Récupérer les produits depuis l'API publique
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="#77dd77" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // ✅ Grille avec 2 colonnes
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>{item.price} €</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#77dd77',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  row: { justifyContent: 'space-between', marginHorizontal: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '48%',
  },
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 5 },
  name: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  price: { fontSize: 14, color: 'gray', marginTop: 3 },
});
