import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  subCategories: [],
  selectedCategory: {},
  selectedSubCategory: {},
  selectedProduct: {},
  isLoading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    selectSubCategories: (state, action) => {
      state.subCategories.push(action.payload);
    },
    removeSubCategories: (state) => {
      state.subCategories = [];
    },
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    removeSelectedCategory: (state) => {
      state.selectedCategory = {};
    },
    selectSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;
    },
    removeSelectedSubCategory: (state) => {
      state.selectedSubCategory = {};
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    removeSelectedProduct: (state) => {
      state.selectedProduct = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { selectSubCategories, removeSubCategories, selectCategory, removeSelectedCategory, selectSubCategory, removeSelectedSubCategory, selectProduct, removeSelectedProduct } = categorySlice.actions;

export default categorySlice.reducer;