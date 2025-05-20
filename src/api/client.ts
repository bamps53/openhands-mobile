import axios, { AxiosInstance } from 'axios';

// API client for OpenHands server

export interface ApiClientConfig {
  url: string;
  token?: string;
}

let axiosInstance: AxiosInstance | null = null;

/**
 * APIクライアントを初期化します。
 * @param config - APIクライアントの設定（基本URLなど）
 */
export const initializeApiClient = async (config: ApiClientConfig): Promise<void> => {
  // 元の config.url をログに出力
  console.log(`Initializing API client with provided URL: ${config.url}`);

  let apiBaseUrl = config.url;
  // config.url の末尾にスラッシュがあれば削除
  if (apiBaseUrl.endsWith('/')) {
    apiBaseUrl = apiBaseUrl.slice(0, -1);
  }
  // /api を追加
  apiBaseUrl = `${apiBaseUrl}/api`;

  console.log(`Setting axiosInstance baseURL to: ${apiBaseUrl}`);

  axiosInstance = axios.create({
    baseURL: apiBaseUrl, // 修正: /api を付与したURLを使用
    timeout: 10000, // 10秒タイムアウト
    headers: {
      'Content-Type': 'application/json',
      ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {}),
    },
  });
  console.log(`API client initialized. Actual Base URL used: ${axiosInstance.defaults.baseURL}`);
};

/**
 * サーバーへの接続をテストします。
 * この関数は ServerConnectionScreen で新しいURLを検証するために使われるため、
 * 常に引数の baseUrl を使用してテストします。
 * @param baseUrl - テスト対象の基本URL (例: http://localhost:3000)
 * @returns 接続に成功した場合は true、失敗した場合は false
 */
export const testServerConnection = async (baseUrl: string): Promise<boolean> => {
  console.log(`Attempting to test server connection to: ${baseUrl}`);
  // 常に新しい一時的なAxiosインスタンスを作成してテストする
  const tempAxiosInstance = axios.create({
    baseURL: baseUrl, // 提供されたbaseUrlを使用
    timeout: 5000,    // 5秒タイムアウト
    headers: {
      'Content-Type': 'application/json',
    },
  });

  try {
    // docs/architecture.md のエンドポイント定義に基づき '/api/options/config' を使用
    await tempAxiosInstance.get('/api/options/config');
    console.log(`Successfully connected to ${baseUrl}/api/options/config.`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to connect to ${baseUrl}/api/options/config. Axios error:`, error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    } else {
      console.error(`Failed to connect to ${baseUrl}/api/options/config. Non-Axios error:`, error);
    }
    return false;
  }
};

// APIレスポンスの形式に合わせて Conversation インターフェースを更新
export interface Conversation {
  conversation_id: string; // id から変更
  title: string;           // name から変更
  last_updated_at: string; // timestamp から変更
  status?: string;          // オプションで追加
  // 必要に応じて他のフィールドも追加可能
  // selected_repository?: string;
  // trigger?: string;
  // created_at?: string;
}

// APIレスポンス全体の型 (ページネーションを考慮する場合)
interface ConversationsApiResponse {
  results: Conversation[];
  next_page_id: string | null;
}

export const getConversations = async (): Promise<Conversation[]> => {
  if (!axiosInstance) {
    throw new Error('API client (axiosInstance) not initialized. Cannot fetch conversations.');
  }
  console.log(`Fetching conversations from base URL: ${axiosInstance.defaults.baseURL}`);

  try {
    // docs/architecture.md によると、'/api/conversations' は会話の作成・取得のエンドポイントとして定義されている。
    // APIは { results: Conversation[], next_page_id: string | null } という形式で返すため、型を指定
    const response = await axiosInstance.get<ConversationsApiResponse>('/conversations');
    
    // 追加ログ: APIレスポンスの詳細を確認
    console.log('[client.ts] getConversations - Response status:', response.status);
    console.log('[client.ts] getConversations - Response data:', JSON.stringify(response.data, null, 2));
    if (response.data) {
      console.log('[client.ts] getConversations - Response data.results:', JSON.stringify(response.data.results, null, 2));
    } else {
      console.log('[client.ts] getConversations - Response data is undefined or null.');
    }

    console.log('Successfully fetched conversations from API.'); // 既存のログ
    // response.data.results が実際の会話配列
    return response.data.results; 
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    throw error;
  }
};

export const getApiClientConfig = (): ApiClientConfig | null => {
  if (axiosInstance && axiosInstance.defaults.baseURL) {
    return {
      url: axiosInstance.defaults.baseURL,
    };
  }
  return null;
};
