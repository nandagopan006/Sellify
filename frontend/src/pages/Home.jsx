import { useEffect, useState } from "react";

import { useDispatch,useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/products/productSlice";

function Home(){
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(()=>{
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

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div>
      <h1>Sellify</h1>

      <h2>Available Products</h2>

      <form onSubmit={handleFilter}>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Electronics"
          />
        </div>

        <div>
          <label>Minimum Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="10000"
          />
        </div>

        <div>
          <label>Maximum Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="50000"
          />
        </div>

        <button type="submit">Apply Filters</button>
        <button type="button" onClick={handleClearFilter}>
          Clear Filters
        </button>
      </form>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product)=>(
          <ProductCard key={product.id} product={product} />
        ))
      )}

    </div>
  )
  
}
export default Home ;
