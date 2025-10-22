import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RequestFormType } from '../../../favorites-requests/model/schema';

export type RequestType = RequestFormType & { id: string };

interface CurrentSearchState {
  request: RequestType | null;
}

const initialState: CurrentSearchState = {
  request: null,
};

const currentSearchSlice = createSlice({
  name: 'currentSearch',
  initialState,
  reducers: {
    setCurrentSearch: (state, action: PayloadAction<RequestType>) => {
      state.request = action.payload;
    },
    clearCurrentSearch: (state) => {
      state.request = null;
    },
  },
});

export const { setCurrentSearch, clearCurrentSearch } = currentSearchSlice.actions;
export const currentSearchReducer = currentSearchSlice.reducer;
