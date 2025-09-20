// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/products");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to fetch products" });
    }
  }
);

// ✅ Save product (create or update)
export const saveProduct = createAsyncThunk(
  "products/save",
  async ({ product, editingId }, { rejectWithValue }) => {
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, product);
      } else {
        await API.post("/products", product);
      }
      return true; // we’ll refetch after save
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to save product" });
    }
  }
);

// ✅ Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Failed to delete product" });
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // saveProduct
      .addCase(saveProduct.rejected, (s, a) => {
        s.error = a.payload;
      })

      // deleteProduct
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      })
      .addCase(deleteProduct.rejected, (s, a) => {
        s.error = a.payload;
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
