import { createSlice } from "@reduxjs/toolkit";

const initialState ={
  items:[],
}

const cartSlice=createSlice({
  name:"cart",
  initialState,

  reducers :{
    addToCart(state,action){
      const product = action.payload

      const existingItem =state.items.find((item)=> item.id === product.id)

      if (existingItem){
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,quantity:1,
        });

      }
    },
    removeFromCart(state,action) {
      const productId =action.payload

      state.items =state.items.filter((item)=> item.id != productId);
    },

    clearCart(state){
      state.items=[];
    },

    updateQuantity(state, action) {
  const { id, quantity } = action.payload;

  const item = state.items.find(
    (item) => item.id === id
  );

  if (!item) {
    return;
  }

  if (quantity >= 1 && quantity <= item.stock) {
    item.quantity = quantity;
  }
},

  },


})

export const {addToCart,removeFromCart,clearCart,updateQuantity}= cartSlice.actions

export default cartSlice.reducer