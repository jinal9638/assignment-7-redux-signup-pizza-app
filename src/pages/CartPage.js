import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  selectCartTotals,
} from '../features/cart/cartSlice';
import { toggleCheckoutModal, showToast } from '../features/ui/uiSlice';
import OrderSummaryModal from '../components/OrderSummaryModal';

export default function CartPage() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const { subtotal, tax, deliveryFee, total, totalCount } = useAppSelector(selectCartTotals);

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(showToast({ message: 'Cart cleared successfully', type: 'info' }));
  };

  const handleCheckout = () => {
    dispatch(toggleCheckoutModal(true));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6 flex items-center space-x-3">
        <span>🛒</span>
        <span>Your Shopping Cart</span>
        {totalCount > 0 && (
          <span className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-lg mx-auto my-10 border border-slate-100">
          <div className="text-6xl mb-4">🍕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Looks like you haven't added any customized pizzas yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            Explore Menu & Customize
          </Link>
        </div>
      ) : (
        /* Active Cart View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Customized Pizzas
              </span>
              <button
                onClick={handleClearCart}
                className="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  {/* Pizza Specs */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-slate-800">
                        {item.size} Pizza
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {item.crust}
                      </span>
                    </div>

                    {item.toppings && item.toppings.length > 0 ? (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-600">Toppings:</span>{' '}
                        {item.toppings.join(', ')}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No extra toppings</p>
                    )}

                    <div className="text-sm font-semibold text-red-600 pt-1">
                      ₹{item.unitPrice} <span className="text-xs text-gray-400 font-normal">each</span>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))}
                        className="w-7 h-7 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded shadow-xs flex items-center justify-center transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))}
                        className="w-7 h-7 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded shadow-xs flex items-center justify-center transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal per line item */}
                    <div className="text-right min-w-[70px]">
                      <div className="text-base font-bold text-slate-900">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                    </div>

                    {/* Trash / Delete button */}
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.id));
                        dispatch(showToast({ message: 'Item removed', type: 'info' }));
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Card (Right Column) */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 h-fit space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3">Order Summary</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST / Taxes (5%)</span>
                <span className="font-semibold text-slate-800">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}
                </span>
              </div>

              <hr className="my-3 border-slate-200" />

              <div className="flex justify-between items-baseline text-base font-bold text-slate-900">
                <span>Total Payable</span>
                <span className="text-2xl font-extrabold text-red-600">₹{total}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg">
                💡 <span className="font-medium">Tip:</span> You can sign up or log in to save order history to your profile.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </div>

        </div>
      )}

      {/* Render Checkout Confirmation Modal */}
      <OrderSummaryModal />
    </div>
  );
}