import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchMyProducts,deleteProduct } from "../features/products/productSlice";

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
    return <p>Loading your products...</p>;
  }

  if (error) {
    return <p>Could not load your products.</p>;
  }

  return (
    <div>
      <h1>My Products</h1>

      {products.length === 0 ? (
        <p>You have not listed any products yet.</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>Price: ₹{product.price}</p>
            <p>Status: {product.is_sold ? "Sold" : "Available"}</p>
            <p>Stock: {product.stock}</p>

            {!product.is_sold && (
              <>
                <button
                  onClick={() =>
                    navigate(`/products/${product.id}/edit`)
                  }
                >
                  Edit
                </button>

                <button
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
        ))
      )}
    </div>
  );
}

export default MyProducts;
