import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProductDetials from "../pages/ProductDetails";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />}/>
        <Route path="/products/:id" element={<ProductDetials/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;