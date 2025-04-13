import {configureStore} from '@reduxjs/toolkit';
import profileSlice from './slices/profileSlice';
import loadingSlice from './slices/loadingSlice';

const store = configureStore({
    reducer:{
         profile: profileSlice,
         loader: loadingSlice,
    },
})

export default store;