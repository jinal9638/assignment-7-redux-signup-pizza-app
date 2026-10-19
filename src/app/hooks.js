import { useDispatch, useSelector } from 'react-redux';

// Custom typed hooks for standard Redux usage throughout the app
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;