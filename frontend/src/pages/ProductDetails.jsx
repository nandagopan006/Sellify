import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProduct } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { showToast } from "../features/toast/toastSlice";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/Error";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  // A listing is gone once its stock runs out or it has been sold.
  const isOutOfStock = !selectedProduct?.stock || selectedProduct?.is_sold;

  const itemInCart = cartItems.find(
    (item) => item.id === selectedProduct?.id
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(showToast({
        message: "Please login to add products to your cart.",
        type: "error",
      }));
      navigate("/login");
      return;
    }

    if (currentUser && currentUser.username === selectedProduct.seller) {
      dispatch(showToast({
        message: "You cannot add your own product to the cart.",
        type: "error",
      }));
      return;
    }

    if (isOutOfStock) {
      dispatch(showToast({
        message: "This product is out of stock.",
        type: "error",
      }));
      return;
    }

    // The cart already holds everything the seller has, so adding again would
    // silently do nothing.
    if (itemInCart && itemInCart.quantity >= selectedProduct.stock) {
      dispatch(showToast({
        message: `Only ${selectedProduct.stock} in stock, and your cart already has ${itemInCart.quantity}.`,
        type: "error",
      }));
      return;
    }

    dispatch(addToCart(selectedProduct));
    dispatch(showToast({ message: "Added to cart." }));
  };

  if (loading) {
    return <Loading text="Loading product..." />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} message="Product could not be loaded." />
    );
  }

  if (!selectedProduct) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">Product not found</h3>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.username === selectedProduct.seller;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="product-details-layout">
        {/* Left: Product Image */}
        <div className="product-details-image-container">
          <img
            src={selectedProduct.image_url}
            alt={selectedProduct.title}
            className="product-details-image"
          />
        </div>

        {/* Right: Product Information */}
        <div className="product-details-info">
          {selectedProduct.category && (
            <span className="product-details-category">
              {selectedProduct.category}
            </span>
          )}

          <h1 className="product-details-title">{selectedProduct.title}</h1>

          <div className="product-details-price">₹{selectedProduct.price}</div>

          <div className="product-details-meta-card">
            <div className="meta-item">
              <span className="meta-label">Seller</span>
              <span className="meta-value">{selectedProduct.seller}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className="meta-value">
                {isOutOfStock ? "Out of stock" : selectedProduct.stock}
              </span>
            </div>
          </div>

          <div className="product-details-description">
            <h3>Description</h3>
            <p>{selectedProduct.description}</p>
          </div>

          <div className="product-details-actions">
            {!isOwner && isOutOfStock && (
              <button className="btn btn-primary btn-block" disabled>
                Out of Stock
              </button>
            )}

            {!isAuthenticated && !isOutOfStock && (
              <button
                className="btn btn-primary btn-block"
                onClick={() => navigate("/login")}
              >
                Login to Add to Cart
              </button>
            )}

            {isAuthenticated && isOwner && (
              <ErrorMessage message="This is your own product. You cannot add it to the cart." />
            )}

            {isAuthenticated && !isOwner && !isOutOfStock && (
              <button
                className="btn btn-primary btn-block"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}

            {isOwner && (
              <button
                className="btn btn-secondary btn-block"
                onClick={() => navigate(`/products/${selectedProduct.id}/edit`)}
              >
                Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
