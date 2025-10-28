import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import service from './questionsService';

export const createQuestion = createAsyncThunk('questions/create', async (payload, thunkAPI) => {
    try { return await service.createQuestion(payload); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const listMyQuestions = createAsyncThunk('questions/listMine', async (_, thunkAPI) => {
    try { return await service.listMyQuestions(); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, payload }, thunkAPI) => {
    try { return await service.updateQuestion(id, payload); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id, thunkAPI) => {
    try { return await service.deleteQuestion(id); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = { items: [], isLoading: false, isError: false, isSuccess: false, message: '' };

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: { reset(state){ state.isLoading=false; state.isError=false; state.isSuccess=false; state.message=''; } },
    extraReducers: (builder) => {
        builder
            .addCase(createQuestion.pending, (state)=>{ state.isLoading = true; })
            .addCase(createQuestion.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items.unshift(action.payload); })
            .addCase(createQuestion.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; })
            .addCase(listMyQuestions.pending, (state)=>{ state.isLoading = true; })
            .addCase(listMyQuestions.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items = action.payload; })
            .addCase(listMyQuestions.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; });
        builder
            .addCase(updateQuestion.fulfilled, (state, action)=>{
                const idx = state.items.findIndex((q)=>q._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteQuestion.fulfilled, (state, action)=>{
                state.items = state.items.filter((q)=> q._id !== action.payload);
            });
    }
});

export const { reset } = questionsSlice.actions;
export default questionsSlice.reducer;

