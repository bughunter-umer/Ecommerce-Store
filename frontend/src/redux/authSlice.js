import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const login = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const res = await API.post('/auth/login', payload);

      // ✅ Save token in localStorage (or cookies if you prefer)
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      return res.data; // return full response (user + token)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { error: 'Network error' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    logout: (s) => {
      s.user = null;
      s.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;   // ✅ now includes role
        s.token = a.payload.token; // ✅ store token too
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
