import { createSlice } from "@reduxjs/toolkit";


interface UserType {
    id: string;
    name: string;
    email: string;
  }

  interface UserState {
    user: UserType | null; // Use UserType instead of 'object'
    loading: boolean;
  }

const initialState :UserState  ={
    user: null,
    loading :true
}

export const userReducer = createSlice({
    name: "userReducer" ,
    initialState,
    reducers:{
        userExist:(state , action)=>{
         if(action.payload){
            state.loading =false
            state.user= action.payload
         }
         else{
            state.loading =true
            state.user = null;
         }
        }
    }

})

export const {userExist} = userReducer.actions