import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${productId}/reviews`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, reviewData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.isLoading = true; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload.data);
      });
  },
});

export default reviewSlice.reducer;
