
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileUrl: null, // Store image URL
  user: {
    name: '',
    email: '',
    connection: 0,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileImage: (state, action) => {
      state.profileUrl = action.payload; // Ensure payload is correct
    },
    profileDetail: (state, action) => {
      state.user.name = action.payload.username; 
      state.user.email = action.payload.email;
      // state.user.connection = action.payload.friends.active?.length || 0;
      state.user.connection = action.payload.friends?.filter(friend => friend.status === "active").length || 0;

    }
  },
});

export const { profileImage, profileDetail } = profileSlice.actions;
export default profileSlice.reducer;
