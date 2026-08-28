import { Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Sell from "../pages/Sell";
import EditProduct from "../pages/EditProduct";
import MyProducts from "../pages/MyProducts";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicOnlyRoute>
        <Login />
        </PublicOnlyRoute>
      } />

      <Route path="/signup" element={
        <PublicOnlyRoute>
        <Signup />
        </PublicOnlyRoute>
        } />
      <Route path="/" element={<Home />} />
      
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <Sell />
          </ProtectedRoute>
        }
      />
      <Route path="/products/:id/edit" element={<EditProduct />} />
      <Route
        path="/my-products"
        element={
          <ProtectedRoute>
            <MyProducts />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
