import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/auth/login', payload);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { error: 'Network error' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: { logout: (s) => { s.user = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
