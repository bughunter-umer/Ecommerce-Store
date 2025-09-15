import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import customerReducer from "./customerSlice"; // ✅

const store = configureStore({
  reducer: {
    products: productReducer,
    orders: orderReducer,
    customers: customerReducer, // ✅
  },
});

export default store;
