import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerConfig } from '../api/types';
import * as authReducer from '../src/store/authSlice';

describe('authSlice', () => {
  const initialState = {
    isConnected: false,
    isConnecting: false,
    serverConfig: null,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer.default(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle connectStart', () => {
    const actual = authReducer.default(initialState, authReducer.connectStart());
    expect(actual.isConnecting).toEqual(true);
    expect(actual.error).toEqual(null);
  });

  it('should handle connectSuccess', () => {
    const serverConfig: ServerConfig = { url: 'http://test-server.com' };
    const actual = authReducer.default(
      { ...initialState, isConnecting: true },
      authReducer.connectSuccess(serverConfig)
    );
    expect(actual.isConnected).toEqual(true);
    expect(actual.isConnecting).toEqual(false);
    expect(actual.serverConfig).toEqual(serverConfig);
    expect(actual.error).toEqual(null);
  });

  it('should handle connectFailure', () => {
    const errorMessage = 'Connection failed';
    const actual = authReducer.default(
      { ...initialState, isConnecting: true },
      authReducer.connectFailure(errorMessage)
    );
    expect(actual.isConnected).toEqual(false);
    expect(actual.isConnecting).toEqual(false);
    expect(actual.error).toEqual(errorMessage);
  });

  it('should handle disconnect', () => {
    const serverConfig: ServerConfig = { url: 'http://test-server.com' };
    const connectedState = {
      isConnected: true,
      isConnecting: false,
      serverConfig,
      error: null,
    };
    const actual = authReducer.default(connectedState, authReducer.disconnect());
    expect(actual.isConnected).toEqual(false);
    expect(actual.serverConfig).toEqual(null);
  });
});
