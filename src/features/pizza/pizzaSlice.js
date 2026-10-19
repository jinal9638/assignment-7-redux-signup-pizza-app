import { createSlice, createSelector } from '@reduxjs/toolkit';

const BASE_PRICES = {
  Small: 199,
  Medium: 299,
  Large: 399,
};

const CRUST_PRICES = {
  'Hand Tossed': 0,
  'Thin Crust': 30,
  'Cheese Burst': 75,
};

const TOPPING_PRICES = {
  Pepperoni: 40,
  Mushrooms: 30,
  Onions: 20,
  Olives: 30,
  // Premium Toppings (available for Large size)
  'Truffle Mushroom': 80,
  'Double Cheese': 60,
  'Smoked Chicken': 90,
};

const initialState = {
  size: 'Medium',
  crust: 'Hand Tossed',
  toppings: [],
  sides: [],
  quantity: 1,
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setSize: (state, action) => {
      state.size = action.payload;
      // If user changes size away from Large, remove premium toppings
      if (action.payload !== 'Large') {
        state.toppings = state.toppings.filter(
          (t) => !['Truffle Mushroom', 'Double Cheese', 'Smoked Chicken'].includes(t)
        );
      }
    },
    setCrust: (state, action) => {
      state.crust = action.payload;
    },
    toggleTopping: (state, action) => {
      const topping = action.payload;
      if (state.toppings.includes(topping)) {
        state.toppings = state.toppings.filter((t) => t !== topping);
      } else {
        state.toppings.push(topping);
      }
    },
    resetCustomizer: () => initialState,
  },
});

export const { setSize, setCrust, toggleTopping, resetCustomizer } = pizzaSlice.actions;

// Memoized selector for calculating dynamic single-pizza price
export const selectCalculatedPrice = createSelector(
  [(state) => state.pizza],
  (pizza) => {
    let base = BASE_PRICES[pizza.size] || 0;
    let crust = CRUST_PRICES[pizza.crust] || 0;
    let toppingsTotal = pizza.toppings.reduce(
      (sum, item) => sum + (TOPPING_PRICES[item] || 0),
      0
    );
    return base + crust + toppingsTotal;
  }
);

export default pizzaSlice.reducer;