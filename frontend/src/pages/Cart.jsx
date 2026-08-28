import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
} from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div>
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>Review your selected items before proceeding to checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-desc">Looks like you haven't added anything to your cart yet.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-price">₹{item.price}</div>
                  {item.category && (
                    <p className="form-hint">Category: {item.category}</p>
                  )}
                </div>

                <div className="cart-item-actions">
                  <div className="qty-stepper">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>

                    <span className="qty-value">{item.quantity}</span>

                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      disabled={item.quantity === item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Order Summary</h2>

            <div className="cart-summary-row">
              <span>Total Items</span>
              <span>
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span style={{ color: "var(--primary-hover)" }}>₹{total}</span>
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: "1.5rem" }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <button
              className="btn btn-secondary btn-block btn-sm"
              style={{ marginTop: "0.75rem" }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;