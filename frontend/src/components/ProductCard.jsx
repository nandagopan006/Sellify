import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div>
      <img
        src={product.image_url}
        alt={product.title}
        width="200"
      />

      <h2>{product.title}</h2>

      <p>₹{product.price}</p>

      <p>{product.category}</p>

      <button
        onClick={() => navigate(`/products/${product.id}`)}
      >
        View Product
      </button>
    </div>
  );
}

export default ProductCard;