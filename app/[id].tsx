import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Récupérer les détails du produit depuis l’API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#77dd77" style={{ marginTop: 20 }} />;
  }

  if (!product) {
    return <Text style={styles.error}>Produit introuvable</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.title}</Text>
      <Text style={styles.price}>{product.price} €</Text>
      <Text style={styles.description}>{product.description}</Text>

      <Button title="Ajouter au panier" onPress={() => addToCart(product)} />
      <Button title="Retour" onPress={() => router.back()} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  image: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  price: { fontSize: 18, color: 'green', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  error: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
});
