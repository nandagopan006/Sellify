import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice"
import cartReducer from "../features/cart/cartSlice"
import checkoutReducer from "../features/checkout/checkoutSlice";
import toastReducer from "../features/toast/toastSlice";
import authMiddleware from "./authMiddleware";

const store =configureStore({
    reducer:{
        auth : authReducer,
        products : productReducer,
        cart: cartReducer,
        checkout:checkoutReducer,
        toast: toastReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware),
})

export { store };
export default store;