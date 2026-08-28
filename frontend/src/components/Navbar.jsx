import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.length;

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
          Sellify
        </Link>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

        <nav className={`nav-menu ${mobileOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </Link>


          {isAuthenticated ? (
            <>
              <Link to="/sell" className="nav-link" onClick={() => setMobileOpen(false)}>
                Sell
              </Link>

              <Link to="/my-products" className="nav-link" onClick={() => setMobileOpen(false)}>
                My Products
              </Link>

              <Link to="/cart" className="nav-link" onClick={() => setMobileOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user?.username && (
                <span className="nav-user-greeting">
                  Hello, {user.username}
                </span>
              )}

              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>
                Login
              </Link>

              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;