import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  serverUrl: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  // token: string | null; // If using token-based auth
}

const initialState: AuthState = {
  serverUrl: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  // token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    connectStart(state) {
      state.isConnecting = true;
      state.isConnected = false;
      state.error = null;
    },
    connectSuccess(state, action: PayloadAction<{ url: string /*, token?: string */ }>) {
      state.isConnecting = false;
      state.isConnected = true;
      state.serverUrl = action.payload.url;
      // state.token = action.payload.token || null;
      state.error = null;
    },
    connectFailure(state, action: PayloadAction<string>) {
      state.isConnecting = false;
      state.isConnected = false;
      state.error = action.payload;
    },
    disconnect(state) {
      state.serverUrl = null;
      state.isConnected = false;
      // state.token = null;
      state.isConnecting = false;
      state.error = null;
    },
  },
});

export const { connectStart, connectSuccess, connectFailure, disconnect } = authSlice.actions;

export default authSlice.reducer;
