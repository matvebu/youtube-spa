import { authApi } from '../../../features/auth/api/authApi';
import { videoApi } from '../../../features/video-search/api/videoApi';
import { requestsReducer } from '../../../features/favorites-requests/model/store/requestsSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userReducer } from '../../../features/auth/model/store/userSlice';
import { currentSearchReducer } from '../../../features/video-search/model/store/currentSearchSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['requests', 'currentSearch', 'currentUser'],
  blacklist: [authApi.reducerPath, videoApi.reducerPath],
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [videoApi.reducerPath]: videoApi.reducer,
  requests: requestsReducer,
  currentUser: userReducer,
  currentSearch: currentSearchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, videoApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
