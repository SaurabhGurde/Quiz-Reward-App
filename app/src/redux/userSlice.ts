import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export interface userSliceState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number | null;
  reward: number | null;
  referalCode: string;
  partnerReferalCode: string;
  dob: string;
}

const initialState: userSliceState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: null,
  reward: null,
  referalCode: '',
  partnerReferalCode: '',
  dob: '',
};

// export const fetchUserSignUp = createAsyncThunk(
//   'user/fetchUserSignUp',
//   async (id) => {
//     const response = await fetchProductById(id);

//     return response.data;
//   }
// );

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInitialUserDetails: (state, action) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.reward = action.payload.reward;
      state.referalCode = action.payload.referalCode;
      state.partnerReferalCode = action.payload.partnerReferalCode;
      state.dob = action.payload.dob;
    },
  },
});

export const {setInitialUserDetails} = userSlice.actions;
export default userSlice.reducer;
