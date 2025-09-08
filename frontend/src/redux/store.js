import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});

export default store;
