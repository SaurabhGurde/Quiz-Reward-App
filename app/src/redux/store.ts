import { configureStore } from "@reduxjs/toolkit";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userSlice from "../redux/userSlice"
import appStateSlice from '../redux/appStateSlice'
import quizSlice from '../redux/quizSlice'

const store = configureStore({
    reducer: {
       user: userSlice,
       appState: appStateSlice,
       quizData: quizSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;