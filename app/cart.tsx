import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useCart } from '../context/cartContext';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();

  // ✅ Calcul du total du panier
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <View style={styles.container}>
      {/* ✅ Titre du panier */}
      <Text style={styles.title}>Votre pannier</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Votre panier est vide</Text>
      ) : (
        <>
          {/* ✅ Liste des produits dans le panier */}
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.price}>Price: {item.price} €</Text>
                </View>

                {/* ✅ Gestion des quantités */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(item.id)}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item.id)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* ✅ Affichage du total et champ email */}
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: {totalPrice} €</Text>
            <TextInput
              placeholder="Votre email"
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.submitButton} onPress={() => alert('Commande passée')}>
              <Text style={styles.submitButtonText}>Payer</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  // ✅ Titre stylisé
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#4CAF50', marginBottom: 20 },

  // ✅ Carte des produits
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#666' },

  // ✅ Gestion des quantités
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#4CAF50',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  quantity: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },

  // ✅ Footer avec le total et le champ email
  footer: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

