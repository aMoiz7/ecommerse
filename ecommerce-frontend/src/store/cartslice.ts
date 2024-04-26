import  { createSlice } from '@reduxjs/toolkit';



const initialState:any =  {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
}


export const cartSlice = createSlice({
    name :"cartSlice",
    initialState,
   reducers:{
     addtocart : (state , action)=>{
       state.loading = true;
       console.log(action.payload.productId,"action paylo")
       
       const index = state.cartItems.findIndex((i:any) => i.productId == action.payload.productId)
    
       if(index!=-1) state.cartItems[index] = action.payload
        else state.cartItems.push(action.payload) 

       state.loading = false;
     },

     removefromcart : (state , action )=>{
       state.loading = true;

       state.cartItems = state.cartItems.filter((i:any)=> i.productId !== action.payload.productId )
       state.loading = false;
     },

     calculatePrice : (state:any)=>{
        const subtotal = state.cartitems.reduce((total:number , item:any)=> total+item.price * item.quantity , 0)

        state.subtotal = subtotal;
        state.subtotal = subtotal;
        state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
        state.tax = Math.round(state.subtotal * 0.18);
        state.total =
          state.subtotal + state.tax + state.shippingCharges - state.discount;
     },

     
    discountApplied: (state, action:any) => {
        state.discount = action.payload;
      },
      saveShippingInfo: (state, action:any) => {
        state.shippingInfo = action.payload;
      },
      resetCart: () => initialState,


   }
})


export const {
    addtocart,
    removefromcart,
    calculatePrice,
    discountApplied,
    saveShippingInfo,
    resetCart,
  } = cartSlice.actions;