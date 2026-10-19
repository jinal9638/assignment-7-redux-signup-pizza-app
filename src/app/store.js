import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import pizzaReducer from '../features/pizza/pizzaSlice';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';
import { loadState, saveState } from '../utils/localStorage';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    pizza: pizzaReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    user: store.getState().user, // Direct save complete user state structure
    cart: {
      items: store.getState().cart.items,
    },
  });
});