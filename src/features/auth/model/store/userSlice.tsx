import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = { email: '' };

const userSlice = createSlice({
  name: 'currentUser',
  initialState: initialState,
  selectors: {
    getCurrentUser: (state) => state.email,
  },

  reducers: {
    upsertUser: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    removeUser: (state) => {
      state.email = '';
    },
  },
});

export const { upsertUser, removeUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const { getCurrentUser } = userSlice.selectors;
