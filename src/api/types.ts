export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  last_updated: string;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  last_modified?: string;
}

export interface FileContent {
  code: string;
}

export interface ServerConfig {
  url: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}
