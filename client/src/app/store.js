import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../features/auth/authSlice';
import questionsReducer from './../features/questions/questionsSlice';
import examsReducer from './../features/exams/examsSlice';
import attemptsReducer from './../features/exams/attemptsSlice';
import historyReducer from './../features/exams/historySlice';
import classesReducer from './../features/classes/classesSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		questions: questionsReducer,
		exams: examsReducer,
		attempts: attemptsReducer,
		history: historyReducer,
		classes: classesReducer,
	},
});