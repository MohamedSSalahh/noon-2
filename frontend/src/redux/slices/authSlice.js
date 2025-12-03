import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
};

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || 'Signup failed');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || 'Login failed');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        // Signup
        builder.addCase(signupUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(signupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.data));
            localStorage.setItem('token', action.payload.token);
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.data));
            localStorage.setItem('token', action.payload.token);
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
