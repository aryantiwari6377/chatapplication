
import { createSlice } from '@reduxjs/toolkit';



const loadingSlice = createSlice({
                name: 'loader',
                 initialState:{
                    loading: true,
                    friends: [],
                    requests:[],
                 },
                 reducers : {
                     loadingHandle : (state,action) => {
                           state.loading = action.payload; 
                     },

                     friendList: (state, action) => {
                           state.friends = action.payload;
                     },

                     notification: (state, action) =>{
                        state.requests = action.payload;
                     }

                 },

});



export const { loadingHandle, friendList, notification } = loadingSlice.actions;
export default loadingSlice.reducer;