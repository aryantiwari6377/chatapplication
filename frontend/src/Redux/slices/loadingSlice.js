
import { createSlice } from '@reduxjs/toolkit';



const loadingSlice = createSlice({
  name: 'loader',
  initialState: {
    loading: true,
    friends: [],
    requests: [],
    latestMessages: {}, // key: friendId -> { message, timestamp }
  },
  reducers: {
    loadingHandle: (state, action) => {
      state.loading = action.payload; 
    },

    friendList: (state, action) => {
      state.friends = action.payload;
    },

    notification: (state, action) => {
      state.requests = action.payload;
    },

    setLatestMessage: (state, action) => {
      const { friendId, message, timestamp } = action.payload;
      state.latestMessages[friendId] = { message, timestamp };
    },
  },
});

export const { loadingHandle, friendList, notification, setLatestMessage } = loadingSlice.actions;
export default loadingSlice.reducer;