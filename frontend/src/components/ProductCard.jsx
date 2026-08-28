import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.image_url}
          alt={product.title}
          className="product-card-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="product-card-body">
        {product.category && (
          <span className="product-card-category">{product.category}</span>
        )}

        <h3 className="product-card-title">{product.title}</h3>

        <div className="product-card-price">₹{product.price}</div>

        <div className="product-card-meta">
          <span className="product-card-seller">
            Seller: {product.seller}
          </span>
          <span>Stock: {product.stock}</span>
        </div>

        <div className="product-card-footer">
          <button
            className="btn btn-primary btn-block btn-sm"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;