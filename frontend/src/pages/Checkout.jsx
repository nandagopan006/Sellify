import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearCart } from "../features/cart/cartSlice";
import {
  checkout,
  resetCheckout,
} from "../features/checkout/checkoutSlice";
import { showToast } from "../features/toast/toastSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);
  const { status, error } = useSelector((state) => state.checkout);

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

    // The cart is kept in localStorage, which anyone can edit by hand, so
    // check every line one last time before building the request.
    const everyItemLooksRight = checkoutItems.every(
      (item) =>
        Number.isInteger(item.product_id) &&
        item.product_id > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1
    );

    if (checkoutItems.length === 0 || !everyItemLooksRight) {
      dispatch(showToast({
        message: "Your cart has an invalid item. Please remove it and try again.",
        type: "error",
      }));
      return;
    }

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
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">Your cart is empty</h2>
        <p className="empty-state-desc">Please add items to your cart before proceeding to checkout.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="page-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Checkout</h1>
        <p>Review your order and confirm purchase.</p>
      </div>

      <div className="checkout-card">
        {status === "success" ? (
          <div className="checkout-status-banner success">
            <h2 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Checkout successful!</h2>
            <p style={{ marginBottom: "1.5rem", color: "#065f46" }}>
              Thank you for your order. The seller will be notified.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Back to Products
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>Order Items</h2>

            <div className="checkout-items-box">
              {items.map((item) => (
                <div key={item.id} className="checkout-item-row">
                  <div>
                    <div className="checkout-item-name">{item.title}</div>
                    <div className="checkout-item-meta">
                      Quantity: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <div className="checkout-item-price">
                    ₹{Number(item.price) * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-total-card">
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: "1.35rem", color: "var(--primary-hover)" }}>
                ₹{total}
              </span>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Processing checkout..." : "Confirm Checkout"}
            </button>

            {status === "failure" && (
              <div className="checkout-status-banner failure" style={{ marginTop: "1rem" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {error?.message || error?.detail || "Checkout failed. Please try again."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
