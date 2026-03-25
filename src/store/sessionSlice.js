import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token:null,
  isAuthenticated: false
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user ?? null;
      state.token = action.payload.token ?? null;
      state.isAuthenticated = !!action.payload.user;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = sessionSlice.actions;
export default sessionSlice.reducer;