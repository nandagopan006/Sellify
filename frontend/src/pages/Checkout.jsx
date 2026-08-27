import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearCart } from "../features/cart/cartSlice";
import {
  checkout,
  resetCheckout,
} from "../features/checkout/checkoutSlice";


function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(
    (state) => state.cart.items
  );

  const {
    status,
    error,
  } = useSelector(
    (state) => state.checkout
  );

  const total = items.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    const checkoutItems = items.map((item) => {
      return {
        product_id: item.id,
        quantity: item.quantity,
      };
    });

    dispatch(checkout(checkoutItems));
  };

  useEffect(() => {
    if (status === "success") {
      dispatch(clearCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  if (items.length === 0 && status !== "success") {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <button
        onClick={handleCheckout}
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Processing..."
          : "Confirm Checkout"}
      </button>

      {status === "success" && (
        <div>
          <p>Checkout successful! </p>

          <button onClick={() => navigate("/")}>
            Back to Products
          </button>
        </div>
      )}

      {status === "failure" && (
        <p>
          {error?.message || "Checkout failed."}
        </p>
      )}
    </div>
  );
}

export default Checkout;
