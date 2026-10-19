import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null, // { message: '', type: 'success' | 'error' | 'info' }
  isCheckoutModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    toggleCheckoutModal: (state, action) => {
      state.isCheckoutModalOpen = action.payload ?? !state.isCheckoutModalOpen;
    },
  },
});

export const { showToast, hideToast, toggleCheckoutModal } = uiSlice.actions;
export default uiSlice.reducer;