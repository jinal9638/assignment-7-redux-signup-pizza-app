import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCartTotals } from '../features/cart/cartSlice';
import { logout } from '../features/user/userSlice';
import { showToast } from '../features/ui/uiSlice';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);
  const { totalCount } = useAppSelector(selectCartTotals);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully.', type: 'info' }));
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wide text-red-500">
            <span className="text-2xl">🍕</span>
            <span className="text-white">Pizza<span className="text-red-500">Express</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Menu
            </Link>

            <Link
              to="/cart"
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/cart') ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Cart
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-500 ${
                  isActive('/signup')
                    ? 'bg-red-600 text-white'
                    : 'text-red-400 hover:bg-red-600 hover:text-white'
                }`}
              >
                Sign Up
              </Link>
            ) : (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
                <span className="text-sm font-medium text-gray-300">
                  Hi, <span className="text-red-400">{currentUser?.fullName?.split(' ')[0] || 'User'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-red-600 text-xs px-3 py-1.5 rounded transition-colors text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-2 pt-2 pb-4 space-y-2 border-t border-slate-700">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            Menu
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
              isActive('/cart') ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <span>Cart</span>
            {totalCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {totalCount} items
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/signup') ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-slate-700'
              }`}
            >
              Sign Up
            </Link>
          ) : (
            <div className="pt-2 border-t border-slate-700 mt-2">
              <div className="px-3 py-1 text-sm text-gray-400">
                Logged in as <span className="text-white font-medium">{currentUser?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left mt-1 px-3 py-2 text-base font-medium text-red-400 hover:bg-slate-700 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}