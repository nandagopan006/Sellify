function ProductCard({ product }) {
  return (
    <div>
      <img
        src={product.image_url}
        alt={product.title}
        width="200"
      />

      <h2>{product.title}</h2>

      <p>{product.description}</p>

      <p>₹{product.price}</p>

      <p>{product.category}</p>

      <p>Seller: {product.seller}</p>
    </div>
  );
}

export default ProductCard;