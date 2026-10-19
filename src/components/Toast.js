import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { hideToast } from '../features/ui/uiSlice';

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600 border-emerald-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-slate-800 border-slate-700',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center animate-bounce">
      <div
        className={`flex items-center space-x-3 text-white px-4 py-3 rounded-xl shadow-2xl border ${
          bgColors[toast.type] || bgColors.info
        }`}
      >
        <span className="font-bold text-sm bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
          {icons[toast.type] || icons.info}
        </span>
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={() => dispatch(hideToast())}
          className="ml-3 text-white/70 hover:text-white font-bold text-lg leading-none focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}