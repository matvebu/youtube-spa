import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../../../features/auth/api/authApi';
import { videoApi } from '../../../features/video-search/api/videoApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
  },
  middleware: (gDM) => gDM().concat(authApi.middleware, videoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
