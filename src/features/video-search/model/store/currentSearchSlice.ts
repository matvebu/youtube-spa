import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RequestFormType } from '../../../favorites-requests/model/schema';

type CurrentRequestType = RequestFormType & { id?: string };

interface CurrentSearchState {
  request: CurrentRequestType | null;
}

const initialState: CurrentSearchState = {
  request: null,
};

const currentSearchSlice = createSlice({
  name: 'currentSearch',
  initialState,
  reducers: {
    setCurrentSearch: (state, action: PayloadAction<CurrentRequestType>) => {
      state.request = action.payload;
    },
    clearCurrentSearch: (state) => {
      state.request = null;
    },
  },
});

export const { setCurrentSearch, clearCurrentSearch } = currentSearchSlice.actions;
export const currentSearchReducer = currentSearchSlice.reducer;
