import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch,useSelector } from "react-redux";
import { fetchProduct } from "../features/products/productSlice";

import { addToCart } from "../features/cart/cartSlice";


function ProductDetails(){
  const {id} =useParams()

  const dispatch=useDispatch()

  const {selectedProduct,loading,error} = useSelector((state)=> state.products)

  useEffect(()=>{
    dispatch(fetchProduct(id))
  },[dispatch,id])

    if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p>Product could not be loaded.</p>;
  }

  if (!selectedProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <h1>{selectedProduct.title}</h1>

      <img
        src={selectedProduct.image_url}
        alt={selectedProduct.title}
        width="300"
      />

      <p>{selectedProduct.description}</p>

      <p>Price: ₹{selectedProduct.price}</p>

      <p>Category: {selectedProduct.category}</p>

      <p>Seller: {selectedProduct.seller}</p>

      <p>Stock: {selectedProduct.stock}</p>

      <button onClick={()=> dispatch(addToCart(selectedProduct))}>
        Add to Cart
      </button>
    </div>
  );


}

export default ProductDetails;