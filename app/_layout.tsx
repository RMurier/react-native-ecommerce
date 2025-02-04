import { CartProvider, useCart } from '../context/cartContext';
import { Stack, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function CartIcon() {
  const { cart } = useCart();
  const router = useRouter();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginRight: 15 }}>
      <View>
        <Ionicons name="cart-outline" size={28} color="black" />
        {totalItems > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 18,
              height: 18,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {totalItems}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerTitle: () => <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shop</Text>,
          headerRight: () => <CartIcon />,
        }}
      />
    </CartProvider>
  );
}
