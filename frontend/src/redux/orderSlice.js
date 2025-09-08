import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await API.get('/orders');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { error: 'Network error' });
  }
});

const slice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export default slice.reducer;
