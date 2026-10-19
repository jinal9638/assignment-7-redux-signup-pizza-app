import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import MenuPage from './pages/MenuPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Route Views */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-900 text-gray-400 text-xs text-center py-6 border-t border-slate-800">
          <p>© {new Date().getFullYear()} PizzaExpress. All rights reserved.</p>
        </footer>

        {/* Global Floating Toast Notifications */}
        <Toast />
      </div>
    </Router>
  );
}