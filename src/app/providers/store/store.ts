import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../../../features/auth/api/authApi';
import { videoApi } from '../../../features/video-search/api/videoApi';
import { requestsReducer } from '../../../features/favorites-requests/model/store/requestsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
    requests: requestsReducer,
  },
  middleware: (gDM) => gDM().concat(authApi.middleware, videoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
