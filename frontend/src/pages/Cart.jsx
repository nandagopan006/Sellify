import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";


function Cart(){

  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const items = useSelector((state)=>state.cart.items)

  const total = items.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0
);

 return (
    <div>
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id}>
              <h2>{item.title}</h2>

              <p>Price: ₹{item.price}</p>

              <div>
  <button
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

  <span>{item.quantity}</span>

  <button
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
  onClick={() => dispatch(removeFromCart(item.id))}
>
  Remove
</button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>
        </>
      )}
      <button
  onClick={() => navigate("/checkout")}
>
  Checkout
</button>
    </div>
    
  );
}

export default Cart;