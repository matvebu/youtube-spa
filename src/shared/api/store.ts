import { configureStore } from '@reduxjs/toolkit';
import { rtkApi } from './api';

export const store = configureStore({
  reducer: {
    [rtkApi.reducerPath]: rtkApi.reducer,
  },
  middleware: (gDM) => gDM().concat(rtkApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
