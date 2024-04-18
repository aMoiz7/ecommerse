import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './userslice'

export const store = configureStore({
    reducer:{
        [userReducer.name] : userReducer.reducer
    }
}) 

export type RootState = ReturnType<typeof store.getState>;