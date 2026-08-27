import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../features/auth/authSlice";


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .finally(() => {
        navigate("/login");
      });
  };

  return (
    <nav>
      <button onClick={() => navigate("/")}>
        Sellify
      </button>

      <button onClick={() => navigate("/")}>
        Home
      </button>

      {isAuthenticated && (
        <>
          <button onClick={() => navigate("/sell")}>
            Sell
          </button>

          <button
            onClick={() => navigate("/my-products")}
          >
            My Products
          </button>

          <button onClick={() => navigate("/cart")}>
            Cart
          </button>

          <span>
            {user?.username}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}

      {!isAuthenticated && (
        <>
          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button onClick={() => navigate("/signup")}>
            Signup
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;