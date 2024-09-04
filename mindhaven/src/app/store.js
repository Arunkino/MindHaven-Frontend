import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import chatReducer from '../features/user/chatSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import videoCallReducer from '../features/videoCall/videoCallSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // only persist user for now
};

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  notifications: notificationReducer,
  videoCall: videoCallReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;