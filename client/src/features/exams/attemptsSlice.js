import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import service from './attemptsService';

export const listMyAttempts = createAsyncThunk('attempts/listMine', async (_, thunkAPI) => {
    try { return await service.listMyAttempts(); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = { items: [], isLoading: false, isError: false, isSuccess: false, message: '' };

const attemptsSlice = createSlice({
    name: 'attempts',
    initialState,
    reducers: { reset(state){ state.isLoading=false; state.isError=false; state.isSuccess=false; state.message=''; } },
    extraReducers: (builder) => {
        builder
            .addCase(listMyAttempts.pending, (state)=>{ state.isLoading=true; })
            .addCase(listMyAttempts.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items = action.payload; })
            .addCase(listMyAttempts.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; });
    }
});

export const { reset } = attemptsSlice.actions;
export default attemptsSlice.reducer;

