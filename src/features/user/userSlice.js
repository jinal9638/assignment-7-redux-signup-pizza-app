import { createSlice } from '@reduxjs/toolkit';

const initialFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  gender: '',
  termsAccepted: false,
};

const initialState = {
  formData: initialFormData,
  errors: {},
  status: 'idle',
  isAuthenticated: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFormField(state, action) {
      const { name, value } = action.payload;

      // 1. Safety Guard: Prevent undefined error if rehydrated state missing formData
      if (!state.formData) {
        state.formData = { ...initialFormData };
      }

      state.formData[name] = value;

      // 2. Clear field error dynamically when user types
      if (state.errors && state.errors[name]) {
        delete state.errors[name];
      }
    },
    setErrors(state, action) {
      state.errors = action.payload || {};
    },
    setSubmitting(state, action) {
      state.status = action.payload;
    },
    signupSuccess(state, action) {
      state.status = 'idle';
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.errors = {};
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.formData = { ...initialFormData };
      state.errors = {};
      state.status = 'idle';
    },
  },
});

export const { updateFormField, setErrors, setSubmitting, signupSuccess, logout } = userSlice.actions;
export default userSlice.reducer;