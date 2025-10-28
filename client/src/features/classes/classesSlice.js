import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import service from './classesService';

export const listClasses = createAsyncThunk('classes/list', async (_, thunkAPI) => {
    try { return await service.listClasses(); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createClass = createAsyncThunk('classes/create', async (payload, thunkAPI) => {
    try { return await service.createClass(payload); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = { items: [], isLoading: false, isError: false, isSuccess: false, message: '' };

const classesSlice = createSlice({
    name: 'classes',
    initialState,
    reducers: { reset(state){ state.isLoading=false; state.isError=false; state.isSuccess=false; state.message=''; } },
    extraReducers: (builder) => {
        builder
            .addCase(listClasses.pending, (state)=>{ state.isLoading=true; })
            .addCase(listClasses.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items = action.payload; })
            .addCase(listClasses.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; })
            .addCase(createClass.fulfilled, (state, action)=>{ state.items.push(action.payload); })
            .addCase(createClass.rejected, (state, action)=>{ state.isError=true; state.message=action.payload; });
    }
});

export const { reset } = classesSlice.actions;
export default classesSlice.reducer;

