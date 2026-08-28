import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../features/auth/authSlice";


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">
        <h2>Sellify</h2>
      </Link>

      <div>
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/sell">
              Sell
            </Link>

            <Link to="/my-products">
              My Products
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <span>
              Hello, {user?.username}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;