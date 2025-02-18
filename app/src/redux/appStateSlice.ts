import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export interface userSliceState {
  isLoading: boolean;
}

const initialState: userSliceState = {
  isLoading: false,
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setIsloading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setIsloading} = appStateSlice.actions;
export default appStateSlice.reducer;
