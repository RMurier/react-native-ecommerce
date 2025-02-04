import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

interface CartState {
  cart: Product[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'INCREASE_QUANTITY'; id: string }
  | { type: 'DECREASE_QUANTITY'; id: string }
  | { type: 'LOAD_CART'; cart: Product[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingProduct = state.cart.find(item => item.id === action.product.id);
      if (existingProduct) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.product, quantity: 1 }] };

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.id) };

    case 'INCREASE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };

    case 'DECREASE_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map(item =>
            item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0),
      };

    case 'LOAD_CART':
      return { ...state, cart: action.cart };

    default:
      return state;
  }
};

const CartContext = createContext<{
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          dispatch({ type: 'LOAD_CART', cart: JSON.parse(storedCart) });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier', error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(state.cart)).catch(error =>
      console.error('Erreur lors de la sauvegarde du panier', error)
    );
  }, [state.cart]);

  const addToCart = (product: Product) => dispatch({ type: 'ADD_TO_CART', product });
  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', id });
  const increaseQuantity = (id: string) => dispatch({ type: 'INCREASE_QUANTITY', id });
  const decreaseQuantity = (id: string) => dispatch({ type: 'DECREASE_QUANTITY', id });

  return (
    <CartContext.Provider value={{ cart: state.cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
