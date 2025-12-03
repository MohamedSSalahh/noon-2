import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ cartId, shippingAddress }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/orders/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/orders`, {
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle success
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
