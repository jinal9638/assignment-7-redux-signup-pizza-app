import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import karein
import { updateFormField, setErrors, setSubmitting, signupSuccess } from '../features/user/userSlice';
import { showToast } from '../features/ui/uiSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. navigate instance banayein
  
  const userState = useSelector((state) => state.user) || {};
  
  const formData = userState.formData || {
    fullName: userState.fullName || '',
    email: userState.email || '',
    phoneNumber: userState.phoneNumber || '',
    password: '',
    confirmPassword: '',
    gender: '',
    termsAccepted: false,
  };
  
  const errors = userState.errors || {};
  const status = userState.status || 'idle';

  const validate = () => {
    const errs = {};
    if (!formData.fullName?.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address.';
    if (!formData.phoneNumber?.match(/^[0-9]{10}$/)) errs.phoneNumber = 'Phone number must be 10 digits.';
    if ((formData.password?.length || 0) < 6) errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!formData.gender) errs.gender = 'Please select a gender.';
    if (!formData.termsAccepted) errs.termsAccepted = 'You must accept the terms.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      dispatch(setErrors(validationErrors));
      return;
    }

    dispatch(setSubmitting('loading'));
    
    setTimeout(() => {
      dispatch(signupSuccess({ fullName: formData.fullName, email: formData.email }));
      dispatch(showToast({ message: 'Signup Successful! Welcome to PizzaApp.', type: 'success' }));
      
      // 3. Successful signup ke baad Menu page par redirect karein
      navigate('/'); 
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
            value={formData.fullName || ''}
            onChange={(e) => dispatch(updateFormField({ name: 'fullName', value: e.target.value }))}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
            value={formData.email || ''}
            onChange={(e) => dispatch(updateFormField({ name: 'email', value: e.target.value }))}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
            value={formData.phoneNumber || ''}
            onChange={(e) => dispatch(updateFormField({ name: 'phoneNumber', value: e.target.value }))}
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
              value={formData.password || ''}
              onChange={(e) => dispatch(updateFormField({ name: 'password', value: e.target.value }))}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
              value={formData.confirmPassword || ''}
              onChange={(e) => dispatch(updateFormField({ name: 'confirmPassword', value: e.target.value }))}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-red-500"
            value={formData.gender || ''}
            onChange={(e) => dispatch(updateFormField({ name: 'gender', value: e.target.value }))}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={!!formData.termsAccepted}
            onChange={(e) => dispatch(updateFormField({ name: 'termsAccepted', value: e.target.checked }))}
          />
          <label htmlFor="terms" className="text-sm text-gray-700">I accept Terms & Conditions</label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}