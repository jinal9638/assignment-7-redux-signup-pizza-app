import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setSize,
  setCrust,
  toggleTopping,
  resetCustomizer,
  selectCalculatedPrice,
} from '../features/pizza/pizzaSlice';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';

// Available options configuration
const SIZES = [
  { id: 'Small', label: 'Small (8")', price: '₹199' },
  { id: 'Medium', label: 'Medium (11")', price: '₹299' },
  { id: 'Large', label: 'Large (14")', price: '₹399' },
];

const CRUSTS = [
  { id: 'Hand Tossed', label: 'Hand Tossed', extra: 'FREE' },
  { id: 'Thin Crust', label: 'Thin Crust', extra: '+₹30' },
  { id: 'Cheese Burst', label: 'Cheese Burst', extra: '+₹75' },
];

const STANDARD_TOPPINGS = [
  { id: 'Pepperoni', name: 'Pepperoni', price: 40 },
  { id: 'Mushrooms', name: 'Mushrooms', price: 30 },
  { id: 'Onions', name: 'Onions', price: 20 },
  { id: 'Olives', name: 'Black Olives', price: 30 },
];

const PREMIUM_TOPPINGS = [
  { id: 'Truffle Mushroom', name: 'Truffle Mushroom 🌟', price: 80 },
  { id: 'Double Cheese', name: 'Double Cheese 🌟', price: 60 },
  { id: 'Smoked Chicken', name: 'Smoked Chicken 🌟', price: 90 },
];

export default function PizzaCustomizer() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { size, crust, toppings ,totalPrice} = useAppSelector((state) => state.pizza);
  const singlePizzaPrice = useAppSelector(selectCalculatedPrice);

  const isLargeSize = size === 'Large';

  const handleAddToCart = () => {
    // 1. Create a shallow copy before sorting to avoid read-only array mutation
    const sortedToppings = [...toppings].sort();

    // 2. Build the cart item object using the correct variable names
    const cartItem = {
      id: `${size}-${crust}-${sortedToppings.join('-') || 'plain'}`,
      size: size,
      crust: crust,
      toppings: sortedToppings,
      unitPrice: totalPrice || singlePizzaPrice,
      quantity: 1,
    };

    // 3. Dispatch actions
    dispatch(addToCart(cartItem));
    dispatch(
      showToast({
        message: `${size} Pizza added to cart! 🍕`,
        type: 'success',
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto my-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-6">
        <h2 className="text-2xl font-bold">Customize Your Pizza</h2>
        <p className="text-red-100 text-sm mt-1">
          Pick your size, crust, and favorite toppings with live pricing.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customization Options (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Size Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              1. Choose Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => dispatch(setSize(item.id))}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    size === item.id
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-400 font-semibold text-red-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-sm">{item.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Crust Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              2. Choose Crust
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CRUSTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => dispatch(setCrust(item.id))}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    crust === item.id
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-400 font-semibold text-red-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-sm">{item.label}</div>
                  <div className="text-xs text-red-500 font-medium mt-0.5">{item.extra}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Standard Toppings */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              3. Standard Toppings
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {STANDARD_TOPPINGS.map((item) => {
                const isSelected = toppings.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => dispatch(toggleTopping(item.id))}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-50 text-red-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-gray-500">+₹{item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Premium Toppings (Dynamic state lock based on Size) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                4. Premium Toppings
              </label>
              {!isLargeSize && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  🔒 Select "Large" to unlock
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PREMIUM_TOPPINGS.map((item) => {
                const isSelected = toppings.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!isLargeSize}
                    onClick={() => dispatch(toggleTopping(item.id))}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      !isLargeSize
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
                        : isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold ring-2 ring-amber-300'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs text-gray-500">+₹{item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Live Order Preview & Action (Right Column) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">
              Live Preview
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span className="font-semibold text-gray-900">{size}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Crust:</span>
                <span className="font-semibold text-gray-900">{crust}</span>
              </div>

              <div>
                <span className="text-gray-500 block mb-1">Toppings ({toppings.length}):</span>
                {toppings.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">No extra toppings selected</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {toppings.map((t) => (
                      <span
                        key={t}
                        className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-md font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart Button */}
          <div className="mt-8 pt-4 border-t border-slate-200 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-600">Calculated Price:</span>
              <span className="text-2xl font-extrabold text-red-600">₹{singlePizzaPrice}</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>🛒</span>
                <span>Add Pizza to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => dispatch(resetCustomizer())}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Reset Selection
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}