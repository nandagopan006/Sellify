import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice"
import cartReducer from "../features/cart/cartSlice"
import checkoutReducer from "../features/checkout/checkoutSlice";

const store =configureStore({
    reducer:{
        auth : authReducer,
        products : productReducer,
        cart: cartReducer,
        checkout:checkoutReducer,
    }
})

export default store