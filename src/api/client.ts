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

// APIから返されるメッセージの形式 (仮)
// サーバーの実際のレスポンスに合わせて調整が必要
export interface ApiMessage {
  id: string; // メッセージID
  content: string; // メッセージ内容
  sender_type: 'user' | 'assistant' | 'system'; // 送信者の種類
  created_at: string; // ISO 8601 形式のタイムスタンプ
  // 必要に応じて他のフィールド (例: metadata, attachments)
}

// アプリケーション内で使用するメッセージの形式
// ChatScreen.tsx の Message インターフェースと合わせるか、こちらに統一する
export interface AppMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot'; // 'assistant' を 'bot' にマッピング
  timestamp: Date; // Dateオブジェクトに変換
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
  console.log(`Fetching conversations from endpoint: ${axiosInstance.defaults.baseURL}/conversations`);
  try {
    // architecture.md に基づき、GET /api/conversations を想定
    // axiosInstance の baseURL は既に /api を含んでいるため、ここでは /conversations のみ指定
    const response = await axiosInstance.get<ConversationsApiResponse>('/conversations');
    console.log('[api/client] getConversations response status:', response.status);
    console.log('[api/client] getConversations response data:', JSON.stringify(response.data, null, 2));
    
    // APIレスポンスが { results: Conversation[], next_page_id: string | null } の形式であると仮定
    // そうでない場合は、直接 response.data を返すか、形式を調整する
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    } else if (Array.isArray(response.data)) { // もしレスポンスが直接 Conversation[] の場合
        console.warn('[api/client] getConversations response data is an array, not an object with "results". Ensure this is expected.');
        return response.data as Conversation[]; // 型アサーションが必要になる場合がある
    } else {
        console.error('[api/client] getConversations response data is not in expected format (expected {results: []} or []). Data:', response.data);
        throw new Error('Unexpected response format from /conversations endpoint.');
    }
  } catch (error: any) {
    let errorMessage = 'Error fetching conversations from API';
    if (axios.isAxiosError(error)) {
      console.error('[api/client] Axios error fetching conversations:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        errorMessage = `API Error ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        console.error('Error request:', error.request);
        errorMessage = 'No response received from server when fetching conversations.';
      }
    } else {
      console.error('[api/client] Non-Axios error fetching conversations:', error);
      errorMessage = error.message || 'An unknown error occurred.';
    }
    throw new Error(errorMessage);
  }
};

export const getConversationMessages = async (conversationId: string): Promise<AppMessage[]> => {
  if (!axiosInstance) {
    throw new Error('API client (axiosInstance) not initialized.');
  }
  if (!conversationId) {
    throw new Error('Conversation ID is required to fetch messages.');
  }
  console.log(`Fetching messages for conversation ${conversationId} from endpoint: ${axiosInstance.defaults.baseURL}/conversations/${conversationId}/messages`);
  try {
    const response = await axiosInstance.get<{ messages: ApiMessage[] }>(`/conversations/${conversationId}/messages`);
    console.log('[api/client] getConversationMessages response status:', response.status);

    if (response.data && Array.isArray(response.data.messages)) {
        return response.data.messages.map(apiMsg => ({
            id: apiMsg.id,
            text: apiMsg.content,
            sender: (apiMsg.sender_type === 'user' ? 'user' : 'bot') as 'user' | 'bot',
            timestamp: new Date(apiMsg.created_at),
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else if (Array.isArray(response.data)) { 
        console.warn('[api/client] getConversationMessages response data is an array. Ensure this is expected.');
        return (response.data as ApiMessage[]).map(apiMsg => ({
            id: apiMsg.id,
            text: apiMsg.content,
            sender: (apiMsg.sender_type === 'user' ? 'user' : 'bot') as 'user' | 'bot',
            timestamp: new Date(apiMsg.created_at),
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else {
      console.error('[api/client] getConversationMessages response data is not in expected format. Data:', response.data);
      throw new Error('Unexpected response format from messages endpoint.');
    }
  } catch (error: any) {
    let errorMessage = `Error fetching messages for conversation ${conversationId}`;
    if (axios.isAxiosError(error)) {
      console.error(`[api/client] Axios error fetching messages for ${conversationId}:`, error.message);
      if (error.response) {
        errorMessage = `API Error ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        errorMessage = 'No response received from server while fetching messages.';
      }
    } else {
      console.error(`[api/client] Non-Axios error fetching messages for ${conversationId}:`, error);
      errorMessage = error.message || 'An unknown error occurred.';
    }
    throw new Error(errorMessage);
  }
};

export const sendConversationMessage = async (conversationId: string, messageContent: string): Promise<AppMessage> => {
  if (!axiosInstance) {
    throw new Error('API client (axiosInstance) not initialized.');
  }
  if (!conversationId || !messageContent) {
    throw new Error('Conversation ID and message content are required to send a message.');
  }
  console.log(`Sending message to conversation ${conversationId}: ${messageContent}`);
  try {
    const response = await axiosInstance.post<ApiMessage>(`/conversations/${conversationId}/messages`, {
      content: messageContent,
    });
    console.log('[api/client] sendConversationMessage response status:', response.status);
    
    if (response.data && response.data.id) { 
        return {
            id: response.data.id,
            text: response.data.content,
            sender: (response.data.sender_type === 'user' ? 'user' : 'bot') as 'user' | 'bot',
            timestamp: new Date(response.data.created_at),
        };
    } else {
        console.error('[api/client] sendConversationMessage response data is not in expected format. Data:', response.data);
        throw new Error('Unexpected response format after sending message.');
    }

  } catch (error: any) {
    let errorMessage = `Error sending message to conversation ${conversationId}`;
    if (axios.isAxiosError(error)) {
      console.error(`[api/client] Axios error sending message to ${conversationId}:`, error.message);
      if (error.response) {
        errorMessage = `API Error ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        errorMessage = 'No response received from server while sending message.';
      }
    } else {
      console.error(`[api/client] Non-Axios error sending message to ${conversationId}:`, error);
      errorMessage = error.message || 'An unknown error occurred.';
    }
    throw new Error(errorMessage);
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
