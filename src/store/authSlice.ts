import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerConfig } from '../api/types';

interface AuthState {
  isConnected: boolean;
  isConnecting: boolean;
  serverConfig: ServerConfig | null;
  error: string | null;
}

const initialState: AuthState = {
  isConnected: false,
  isConnecting: false,
  serverConfig: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    connectStart(state) {
      state.isConnecting = true;
      state.error = null;
    },
    connectSuccess(state, action: PayloadAction<ServerConfig>) {
      state.isConnected = true;
      state.isConnecting = false;
      state.serverConfig = action.payload;
      state.error = null;
    },
    connectFailure(state, action: PayloadAction<string>) {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
    },
    disconnect(state) {
      state.isConnected = false;
      state.serverConfig = null;
    },
  },
});

export const { connectStart, connectSuccess, connectFailure, disconnect } = authSlice.actions;
export default authSlice.reducer;
