import { configureStore } from '@reduxjs/toolkit';

// 必要に応じてスライスをインポート
// import someReducer from './slices/someSlice';

// Placeholder reducer
const placeholderReducer = (state = {}, action: any) => state;

export const store = configureStore({
  reducer: {
    // 必要に応じてリデューサーを追加
    // some: someReducer,
    placeholder: placeholderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
