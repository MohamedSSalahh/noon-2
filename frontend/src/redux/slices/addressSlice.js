import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (addressData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.data;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.data;
      });
  },
});

export default addressSlice.reducer;
