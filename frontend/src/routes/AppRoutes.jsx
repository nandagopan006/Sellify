import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />}/>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />}/>
        <Route path="/checkout" element={<Checkout />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
