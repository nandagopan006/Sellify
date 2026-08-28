import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { fetchProducts } from "../features/products/productSlice";
import { ErrorMessage } from "../components/Error";

function Home() {
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleFilter = (event) => {
    event.preventDefault();
    dispatch(fetchProducts({ category, minPrice, maxPrice }));
  };

  const handleClearFilter = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    dispatch(fetchProducts());
  };

  return (
    <div>
      {/* Hero / Welcome Section */}
      <section className="hero-banner">
        <h1>Find what you need.</h1>
        <p>Buy and sell products easily on Sellify marketplace.</p>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <h2 className="filter-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter Products
        </h2>

        <form onSubmit={handleFilter} className="filter-form">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Electronics, Books..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Price (₹)</label>
            <input
              type="number"
              className="form-input"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Price (₹)</label>
            <input
              type="number"
              className="form-input"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="50000"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClearFilter}
          >
            Clear Filters
          </button>
        </form>
      </section>

      {/* Available Products Section */}
      <section>
        <div className="products-section-header">
          <h2>Available Products</h2>
          {!loading && !error && (
            <p style={{ fontSize: "0.875rem" }}>
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {loading ? (
          <Loading text="Loading products..." />
        ) : error ? (
          <ErrorMessage error={error} message="Failed to load products." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-desc">
              Try adjusting your filters or browse all listings.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilter}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
