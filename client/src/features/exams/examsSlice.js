import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import service from './examsService';

export const createExam = createAsyncThunk('exams/create', async (payload, thunkAPI) => {
    try { return await service.createExam(payload); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const listMyExams = createAsyncThunk('exams/listMine', async (_, thunkAPI) => {
    try { return await service.listMyExams(); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getExamById = createAsyncThunk('exams/getById', async (id, thunkAPI) => {
    try { return await service.getExamById(id); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateExam = createAsyncThunk('exams/update', async ({ id, payload }, thunkAPI) => {
    try { return await service.updateExam(id, payload); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteExam = createAsyncThunk('exams/delete', async (id, thunkAPI) => {
    try { return await service.deleteExam(id); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const listPublicExams = createAsyncThunk('exams/listPublic', async (params, thunkAPI) => {
    try { return await service.listPublicExams(params); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getExamForTaking = createAsyncThunk('exams/getForTaking', async (id, thunkAPI) => {
    try { return await service.getExamForTaking(id); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const submitExam = createAsyncThunk('exams/submit', async ({ id, answers }, thunkAPI) => {
    try { return await service.submitExam(id, answers); } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = { items: [], publicItems: [], current: null, attempt: null, isLoading: false, isError: false, isSuccess: false, message: '' };

const examsSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: { reset(state){ state.isLoading=false; state.isError=false; state.isSuccess=false; state.message=''; } },
    extraReducers: (builder) => {
        builder
            .addCase(createExam.pending, (state)=>{ state.isLoading=true; })
            .addCase(createExam.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items.unshift(action.payload); })
            .addCase(createExam.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; })
            .addCase(listMyExams.pending, (state)=>{ state.isLoading=true; })
            .addCase(listMyExams.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.items = action.payload; })
            .addCase(listMyExams.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; });
        builder
            .addCase(getExamById.pending, (state)=>{ state.isLoading=true; state.current=null; })
            .addCase(getExamById.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.current = action.payload; })
            .addCase(getExamById.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; state.current=null; });
        builder
            .addCase(updateExam.fulfilled, (state, action)=>{
                state.current = action.payload;
                const idx = state.items.findIndex((e)=>e._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteExam.fulfilled, (state, action)=>{
                state.items = state.items.filter((e)=> e._id !== action.payload);
                if (state.current && state.current._id === action.payload) state.current = null;
            });
        builder
            .addCase(listPublicExams.pending, (state)=>{ state.isLoading=true; })
            .addCase(listPublicExams.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.publicItems = action.payload; })
            .addCase(listPublicExams.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; })
            .addCase(getExamForTaking.pending, (state)=>{ state.isLoading=true; state.current=null; })
            .addCase(getExamForTaking.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.current = action.payload; })
            .addCase(getExamForTaking.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; state.current=null; })
            .addCase(submitExam.pending, (state)=>{ state.isLoading=true; state.attempt=null; })
            .addCase(submitExam.fulfilled, (state, action)=>{ state.isLoading=false; state.isSuccess=true; state.attempt = action.payload; })
            .addCase(submitExam.rejected, (state, action)=>{ state.isLoading=false; state.isError=true; state.message=action.payload; state.attempt=null; });
    }
});

export const { reset } = examsSlice.actions;
export default examsSlice.reducer;

