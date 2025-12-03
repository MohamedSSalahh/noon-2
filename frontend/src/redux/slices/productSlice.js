import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
  paginationResult: {},
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (queryString = '', { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products?${queryString}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.data;
      state.paginationResult = action.payload.paginationResult;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload.data;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default productSlice.reducer;
