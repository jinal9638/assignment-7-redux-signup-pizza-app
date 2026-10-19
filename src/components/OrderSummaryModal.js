import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartTotals, clearCart } from '../features/cart/cartSlice';
import { toggleCheckoutModal, showToast } from '../features/ui/uiSlice';
import { useNavigate } from 'react-router-dom';

export default function OrderSummaryModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux Selectors
  const { isCheckoutModalOpen } = useAppSelector((state) => state.ui);
  const { items } = useAppSelector((state) => state.cart);
  const { currentUser } = useAppSelector((state) => state.user);
  const { subtotal, tax, deliveryFee, total } = useAppSelector(selectCartTotals);

  // Local State for Order Processing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handleClose = () => {
    if (orderPlaced) {
      dispatch(clearCart());
      setOrderPlaced(false);
    }
    dispatch(toggleCheckoutModal(false));
    navigate('/');
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    // Simulate API call for payment/order submission
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);
      dispatch(showToast({ message: 'Order placed successfully! 🍕', type: 'success' }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all transform animate-fadeIn">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span>{orderPlaced ? '🎉 Order Confirmed' : '🧾 Order Summary'}</span>
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {orderPlaced ? (
            /* Confirmation Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <h4 className="text-2xl font-bold text-gray-800">Thank you for your order!</h4>
              <p className="text-gray-600 text-sm">
                Your delicious pizza is being prepared and will be delivered to:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border text-left text-sm space-y-1">
                <p className="font-semibold text-gray-800">{currentUser?.fullName || 'Guest Customer'}</p>
                <p className="text-gray-600">{currentUser?.email || 'No email provided'}</p>
                <p className="text-gray-600">Standard Express Delivery (30 mins)</p>
              </div>
              <div className="pt-2 text-xs text-gray-400">
                Order Reference: <span className="font-mono font-semibold">#PZA-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>
          ) : (
            /* Checkout Summary View */
            <>
              {/* Customer Info */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm">
                <span className="font-semibold text-red-800">Delivering to: </span>
                <span className="text-red-900">
                  {currentUser?.fullName ? `${currentUser.fullName} (${currentUser.email})` : 'Guest Customer'}
                </span>
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Your Items</h4>
                <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.size} Pizza <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </p>
                        <p className="text-xs text-gray-500">Crust: {item.crust}</p>
                        {item.toppings?.length > 0 && (
                          <p className="text-xs text-gray-400">
                            Toppings: {item.toppings.join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-gray-700">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary Table */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST & Taxes (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
                </div>
                <hr className="my-2 border-slate-200" />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          {orderPlaced ? (
            <button
              onClick={handleClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              Done & Return to Menu
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting || items.length === 0}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Order (₹{total})</span>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}