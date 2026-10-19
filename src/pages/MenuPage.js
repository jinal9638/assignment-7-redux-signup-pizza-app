import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setSize, setCrust, toggleTopping } from '../features/pizza/pizzaSlice';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import PizzaCustomizer from '../components/PizzaCustomizer';

const POPULAR_PIZZAS = [
  {
    id: 'margherita',
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, tomato sauce, basil, and olive oil.',
    price: 249,
    size: 'Medium',
    crust: 'Hand Tossed',
    toppings: [],
    badge: 'Bestseller',
  },
  {
    id: 'pepperoni-supreme',
    name: 'Pepperoni Supreme',
    description: 'Double pepperoni, loaded cheese, and signature tomato sauce.',
    price: 369,
    size: 'Medium',
    crust: 'Thin Crust',
    toppings: ['Pepperoni'],
    badge: 'Popular',
  },
  {
    id: 'veggie-paradise',
    name: 'Veggie Paradise',
    description: 'Black olives, mushrooms, onions, and sweet corn.',
    price: 329,
    size: 'Medium',
    crust: 'Hand Tossed',
    toppings: ['Mushrooms', 'Onions', 'Olives'],
    badge: 'Veg',
  },
];

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('customizer'); // 'customizer' | 'popular'

  const handleQuickAdd = (pizza) => {
    const cartItem = {
      id: `${pizza.id}-${Date.now()}`,
      size: pizza.size,
      crust: pizza.crust,
      toppings: pizza.toppings,
      unitPrice: pizza.price,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
    dispatch(
      showToast({
        message: `Added ${pizza.name} to cart! 🍕`,
        type: 'success',
      })
    );
  };

  const handleCustomizeClick = (pizza) => {
    dispatch(setSize(pizza.size));
    dispatch(setCrust(pizza.crust));
    pizza.toppings.forEach((t) => dispatch(toggleTopping(t)));
    setActiveTab('customizer');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <span className="bg-red-600/30 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-widest">
            Freshly Baked Every Order
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Craving Pizza? <br />
            <span className="text-red-500">Build Your Own</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Customize every layer or pick from our chef's classic recipes. Real-time dynamic pricing powered by Redux Toolkit.
          </p>
        </div>
        <div className="text-7xl md:text-8xl animate-pulse">🍕</div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('customizer')}
            className={`pb-3 px-6 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'customizer'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            🛠️ Custom Pizza Builder
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`pb-3 px-6 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'popular'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            ⭐ Chef Specialties
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'customizer' ? (
        <PizzaCustomizer />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POPULAR_PIZZAS.map((pizza) => (
            <div
              key={pizza.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {pizza.badge}
                  </span>
                  <span className="text-lg font-extrabold text-red-600">₹{pizza.price}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{pizza.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{pizza.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 mb-4">
                  <p><span className="font-semibold text-gray-700">Size:</span> {pizza.size}</p>
                  <p><span className="font-semibold text-gray-700">Crust:</span> {pizza.crust}</p>
                  <p>
                    <span className="font-semibold text-gray-700">Toppings:</span>{' '}
                    {pizza.toppings.length > 0 ? pizza.toppings.join(', ') : 'Standard Cheese'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleQuickAdd(pizza)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-xs"
                >
                  Quick Add (₹{pizza.price})
                </button>
                <button
                  onClick={() => handleCustomizeClick(pizza)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition-colors text-xs"
                >
                  Customize Selection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}