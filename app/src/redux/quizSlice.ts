import { createSlice } from "@reduxjs/toolkit";
import { questionType } from "../types";

interface State extends questionType {
  index: number;
}

const initialState: State[] = [];

const quizSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    updateAnswer: (state, action) => {
      state[action.payload.index] = action.payload;
    },
  },
});

export const { updateAnswer } = quizSlice.actions;
export default quizSlice.reducer;
