// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// ✅ Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/orders");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to fetch orders" });
    }
  }
);

// ✅ Add or update an order
export const saveOrder = createAsyncThunk(
  "orders/save",
  async (order, { rejectWithValue }) => {
    try {
      if (order.id) {
        const res = await API.put(`/orders/${order.id}`, order);
        return res.data;
      } else {
        const res = await API.post("/orders", order);
        return res.data;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to save order" });
    }
  }
);



// ✅ Delete order
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/orders/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to delete order" });
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    resetOrders: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // saveOrder
      .addCase(saveOrder.fulfilled, (s, a) => {
        const savedOrder = a.payload;
        if (!savedOrder) return;

        const index = s.items.findIndex((o) => o.id === savedOrder.id);
        if (index >= 0) {
          // update existing
          s.items[index] = savedOrder;
        } else {
          // add new
          s.items.push(savedOrder);
        }
      })
      .addCase(saveOrder.rejected, (s, a) => {
        s.error = a.payload;
      })

      // deleteOrder
      .addCase(deleteOrder.fulfilled, (s, a) => {
        s.items = s.items.filter((o) => o.id !== a.payload);
      })
      .addCase(deleteOrder.rejected, (s, a) => {
        s.error = a.payload;
      });
  },
});

export const { resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
