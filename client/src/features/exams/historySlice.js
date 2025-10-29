import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import historyService from './historyService';

const initialState = {
    attempts: [],
    currentAttempt: null,
    isLoading: false,
    isError: false,
    message: '',
};

// Get exam history
export const getExamHistory = createAsyncThunk(
    'history/getHistory',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.auth?.account?.token || localStorage.getItem('token');
            return await historyService.getExamHistory(token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get exam attempt detail
export const getExamAttemptDetail = createAsyncThunk(
    'history/getAttemptDetail',
    async (attemptId, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.auth?.account?.token || localStorage.getItem('token');
            return await historyService.getExamAttemptDetail(attemptId, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        clearCurrentAttempt: (state) => {
            state.currentAttempt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get exam history
            .addCase(getExamHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getExamHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.attempts = action.payload.data.attempts;
            })
            .addCase(getExamHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get exam attempt detail
            .addCase(getExamAttemptDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getExamAttemptDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAttempt = action.payload.data.attempt;
            })
            .addCase(getExamAttemptDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearCurrentAttempt } = historySlice.actions;
export default historySlice.reducer;
