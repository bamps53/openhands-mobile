import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Placeholder reducer
const placeholderReducer = (state = {}, action: any) => state;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    placeholder: placeholderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// RootState型をエクスポートして、アプリケーション全体で型安全にアクセスできるようにする
export type RootState = ReturnType<typeof store.getState>;
// AppDispatch型をエクスポートして、型安全なディスパッチを可能にする
export type AppDispatch = typeof store.dispatch;
