import { createSlice } from "@reduxjs/toolkit";

import { login, logout, logoutUser } from "../auth/authSlice";
import { getAuthData } from "../auth/authStorage";
import {
  getCartItems,
  saveCartItems,
  clearCartItems,
  removeLegacyCartItems,
} from "./cartStorage";

removeLegacyCartItems();

// On a page refresh the logged-in user comes back from storage, so the cart we
// start with is the one saved under that user's id (nobody logged in: empty).
const savedUserId = getAuthData()?.user?.id || null;

const initialState = {
  userId: savedUserId,
  items: getCartItems(savedUserId),
};

// Used for every way a session can end.
const resetCart = (state) => {
  clearCartItems(state.userId);

  state.userId = null;
  state.items = [];
};

const cartSlice=createSlice({
  name:"cart",
  initialState,

  reducers :{
    addToCart(state,action){
      const product = action.payload

      // A listing with nothing left, or one the seller already sold, must
      // never reach the cart at all.
      if (!product.stock || product.is_sold) {
        return;
      }

      const existingItem =state.items.find((item)=> item.id === product.id)

      if (existingItem){
        // Clicking "Add to Cart" again must not push the quantity past the
        // stock the seller actually has.
        if (existingItem.quantity >= product.stock) {
          return;
        }

        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,quantity:1,
        });

      }

      saveCartItems(state.userId, state.items);
    },
    removeFromCart(state,action) {
      const productId =action.payload

      state.items =state.items.filter((item)=> item.id != productId);

      saveCartItems(state.userId, state.items);
    },

    clearCart(state){
      state.items=[];

      clearCartItems(state.userId);
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

    saveCartItems(state.userId, state.items);
  }
},

  },

  extraReducers: (builder) => {
    builder
      // A login loads that user's own cart, so a new account never inherits the
      // items the previous one left in the browser.
      .addCase(login.fulfilled, (state, action) => {
        const userId = action.payload.user?.id || null;

        state.userId = userId;
        state.items = getCartItems(userId);
      })

      // Logging out throws the cart away for good: the saved copy is deleted
      // too, so nothing is left behind for the next person on this browser.
      // logoutUser can still fail (no network, dead token) and the user is
      // logged out either way, so the cart has to go in that case as well.
      .addCase(logout, resetCart)
      .addCase(logoutUser.fulfilled, resetCart)
      .addCase(logoutUser.rejected, resetCart)
  },

})

export const {addToCart,removeFromCart,clearCart,updateQuantity}= cartSlice.actions

export default cartSlice.reducer
