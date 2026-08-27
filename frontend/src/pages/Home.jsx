import { useEffect } from "react";

import { useDispatch,useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/products/productSlice";

function Home(){
  const dispatch =useDispatch()

  const {products,loading,error} =useSelector((state)=> state.products)

  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div>
      <h1>Sellify</h1>

      <h2>Avabile products</h2>

      {products.length === 0 ? (
        <p>NO AVAILIBLE PRODUCTS </p>
      ) : (
        products.map((product)=>(
          <ProductCard key={product.id} product={product} />
        ))
      )}

    </div>
  )
  
}
export default Home ;
