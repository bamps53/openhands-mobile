import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, getConversations } from '../api/client';

export interface ConversationState {
  conversations: Conversation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  status: 'idle',
  error: null,
};

export const fetchConversations = createAsyncThunk<Conversation[], void, { rejectValue: string }>(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[conversationSlice] Fetching conversations from API...');
      const data = await getConversations(); 
      console.log('[conversationSlice] Successfully fetched conversations, data:', JSON.stringify(data, null, 2));
      return data;
    } catch (error: any) {
      let errorMessage = 'Failed to fetch conversations';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('[conversationSlice] Error fetching conversations:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        console.log('[conversationSlice] fetchConversations.pending');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        console.log('[conversationSlice] fetchConversations.fulfilled, payload:', JSON.stringify(action.payload, null, 2));
        state.status = 'succeeded';
        state.conversations = action.payload; 
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        console.log('[conversationSlice] fetchConversations.rejected, error:', action.payload, action.error.message);
        state.status = 'failed';
        state.error = action.payload ? action.payload : action.error.message || 'Unknown error';
      });
  },
});

export default conversationSlice.reducer;
