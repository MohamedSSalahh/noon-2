import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
