import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ServerConfig } from './types';

// キーの定義
const SERVER_CONFIG_KEY = 'openhands_server_config';

// APIクライアントのシングルトンインスタンス
let apiClient: AxiosInstance | null = null;

/**
 * APIクライアントを初期化する
 * @param config サーバー設定
 * @returns 初期化されたAxiosインスタンス
 */
export const initializeApiClient = async (config: ServerConfig): Promise<AxiosInstance> => {
  // サーバー設定を保存
  await SecureStore.setItemAsync(SERVER_CONFIG_KEY, JSON.stringify(config));
  
  // Axiosインスタンスを作成
  apiClient = axios.create({
    baseURL: config.url,
    headers: {
      'Content-Type': 'application/json',
      ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
    },
    timeout: 10000
  });
  
  // レスポンスインターセプター
  apiClient.interceptors.response.use(
    response => response,
    error => {
      // エラーハンドリング
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
  
  return apiClient;
};

/**
 * 保存されたサーバー設定を取得する
 * @returns サーバー設定またはnull
 */
export const getServerConfig = async (): Promise<ServerConfig | null> => {
  const configStr = await SecureStore.getItemAsync(SERVER_CONFIG_KEY);
  if (!configStr) return null;
  
  try {
    return JSON.parse(configStr) as ServerConfig;
  } catch (error) {
    console.error('Failed to parse server config:', error);
    return null;
  }
};

/**
 * APIクライアントを取得する（必要に応じて初期化）
 * @returns Axiosインスタンス
 */
export const getApiClient = async (): Promise<AxiosInstance> => {
  if (apiClient) return apiClient;
  
  const config = await getServerConfig();
  if (!config) {
    throw new Error('Server configuration not found');
  }
  
  return initializeApiClient(config);
};

/**
 * サーバー接続をテストする
 * @param url サーバーURL
 * @returns 接続成功かどうか
 */
export const testServerConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${url}/api/options/config`);
    return response.status === 200;
  } catch (error) {
    console.error('Server connection test failed:', error);
    return false;
  }
};
