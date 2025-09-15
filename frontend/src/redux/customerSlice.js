// redux/customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// ✅ Fetch all customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/customers");
      console.log("API customers response:", res.data);

      // Check if response structure is correct
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }

      // If structure is unexpected, return empty array
      console.warn("Unexpected API response format:", res.data);
      return [];
    } catch (err) {
      console.error("Error fetching customers:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data || { error: "Network error" }
      );
    }
  }
);

// ✅ Add a new customer
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customerData, thunkAPI) => {
    try {
      const res = await API.post("/customers", customerData);
      if (res.data?.success) return res.data.data;
      return thunkAPI.rejectWithValue(res.data || { error: "Failed to add customer" });
    } catch (err) {
      console.error("Error adding customer:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || { error: "Network error" });
    }
  }
);

// ✅ Update an existing customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await API.put(`/customers/${id}`, data);
      if (res.data?.success) return res.data.data;
      return thunkAPI.rejectWithValue(res.data || { error: "Failed to update customer" });
    } catch (err) {
      console.error("Error updating customer:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || { error: "Network error" });
    }
  }
);

// ✅ Delete a customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, thunkAPI) => {
    try {
      const res = await API.delete(`/customers/${id}`);
      if (res.data?.success) return id; // Return deleted ID
      return thunkAPI.rejectWithValue(res.data || { error: "Failed to delete customer" });
    } catch (err) {
      console.error("Error deleting customer:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || { error: "Network error" });
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchCustomers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // addCustomer
    builder
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // add new customer at the top
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateCustomer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteCustomer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
