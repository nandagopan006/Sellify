import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchMyProducts, deleteProduct } from "../features/products/productSlice";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/Error";

function MyProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  if (loading) {
    return <Loading text="Loading your listings..." />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} message="Could not load your products." />
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>My Products</h1>
          <p>Manage the items you have listed on Sellify.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/sell")}>
          + List New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">You have not listed any products yet</h3>
          <p className="empty-state-desc">Start selling today by adding your first product listing.</p>
          <button className="btn btn-primary" onClick={() => navigate("/sell")}>
            Sell a Product
          </button>
        </div>
      ) : (
        <div className="my-products-list">
          {products.map((product) => (
            <div key={product.id} className="my-product-row">
              <div className="my-product-main">
                <h3 className="my-product-title">{product.title}</h3>
                <div className="my-product-badges">
                  <span className="badge badge-price">₹{product.price}</span>
                  <span className={`badge ${product.is_sold ? "badge-sold" : "badge-available"}`}>
                    {product.is_sold ? "Sold" : "Available"}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              <div className="my-product-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View
                </button>

                {!product.is_sold && (
                  <>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to delete this product?"
                        );

                        if (confirmed) {
                          dispatch(deleteProduct(product.id));
                        }
                      }}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
