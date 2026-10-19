import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartTotals, clearCart } from '../features/cart/cartSlice';
import { showToast, toggleCheckoutModal } from '../features/ui/uiSlice';
import OrderSummaryModal from '../components/OrderSummaryModal';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const { items } = useAppSelector((state) => state.cart);
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);
  const { subtotal, tax, deliveryFee, total, totalCount } = useAppSelector(selectCartTotals);

  // Address & Payment Local Form State
  const [address, setAddress] = useState({
    street: '',
    city: 'Surat',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-md text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 text-sm mb-6">
          Add some delicious pizzas to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!address.street.trim()) newErrors.street = 'Street address is required.';
    if (!address.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Enter a valid 6-digit pincode.';
    return newErrors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    dispatch(toggleCheckoutModal(true));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6 flex items-center space-x-2">
        <span>📦</span>
        <span>Checkout</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Delivery Address & Payment Form (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">1. Contact Details</h2>
            {isAuthenticated ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-900">
                <span className="font-semibold">Logged in as: </span>
                {currentUser?.fullName} ({currentUser?.email})
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                <span className="font-semibold">Ordering as Guest. </span>
                <Link to="/signup" className="underline font-bold text-amber-900 hover:text-amber-700 ml-1">
                  Sign up here
                </Link>{' '}
                to save orders to your profile.
              </div>
            )}
          </div>

          {/* Delivery Address Form */}
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">2. Delivery Address</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address / House No. / Landmark
              </label>
              <textarea
                rows="2"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="e.g. Flat 302, Royal Residency, City Light"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-gray-50 text-gray-700"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  maxLength="6"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="395007"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Payment Method Options */}
            <div className="pt-4 border-t">
              <h2 className="text-lg font-bold text-gray-800 mb-3">3. Payment Options</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={address.paymentMethod === 'cod'}
                    onChange={() => setAddress({ ...address, paymentMethod: 'cod' })}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-800">💵 Cash / UPI on Delivery</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={address.paymentMethod === 'card'}
                    onChange={() => setAddress({ ...address, paymentMethod: 'card' })}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-800">💳 Credit / Debit Card</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-base mt-4"
            >
              Review & Complete Order
            </button>
          </form>

        </div>

        {/* Order Summary Sidebar (Right Column) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3">Order Summary ({totalCount} items)</h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 text-sm flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{item.size} Pizza (x{item.quantity})</p>
                  <p className="text-xs text-gray-500">Crust: {item.crust}</p>
                </div>
                <span className="font-semibold text-gray-900">₹{item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm border border-slate-200">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST & Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
            </div>
            <hr className="my-2 border-slate-200" />
            <div className="flex justify-between items-baseline text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-xl font-extrabold text-red-600">₹{total}</span>
            </div>
          </div>
        </div>

      </div>

      <OrderSummaryModal />
    </div>
  );
}