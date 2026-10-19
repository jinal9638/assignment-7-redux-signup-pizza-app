import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // action.payload: { id, size, crust, toppings, unitPrice, quantity }
      const existingIndex = state.items.findIndex(
        (item) =>
          item.size === action.payload.size &&
          item.crust === action.payload.crust &&
          JSON.stringify(item.toppings.sort()) === JSON.stringify(action.payload.toppings.sort())
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload; // delta: +1 or -1
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Memoized selector to compute subtotal, tax, and final amount
export const selectCartTotals = createSelector(
  [(state) => state.cart.items],
  (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const deliveryFee = subtotal > 0 ? 49 : 0;
    const total = subtotal + tax + deliveryFee;
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, deliveryFee, total, totalCount };
  }
);

export default cartSlice.reducer;