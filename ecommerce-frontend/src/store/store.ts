import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './userslice'
import { productApi } from './reduxapi/productapi';
import { cartSlice } from './cartslice';

export const store = configureStore({
    reducer:{
        [userReducer.name] : userReducer.reducer,
        productApi: productApi.reducer,
        cartSlice : cartSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productApi.middleware), // Add RTK-Query middleware
    });
  



export type RootState = ReturnType<typeof store.getState>;