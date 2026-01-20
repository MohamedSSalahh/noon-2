import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../utils/apiConfig';

const initialState = {
  messages: [],
  users: [],
  isLoading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${API_URL}/chat/${userId}`, {
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

export const fetchChatUsers = createAsyncThunk(
  'chat/fetchChatUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().authState;
      const response = await fetch(`${API_URL}/chat/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
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
      // Check if message already exists to prevent duplicates
      const exists = state.messages.some(m => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateMessageId: (state, action) => {
       const { tempId, realId, message } = action.payload;
       const index = state.messages.findIndex(m => m._id === tempId);
       if (index !== -1) {
           // We keep the existing message content but update the ID
           // We also update the message content if provided
           state.messages[index] = { ...state.messages[index], _id: realId, ...(message && { message }) };
       }
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
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { addMessage, updateMessageId, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
