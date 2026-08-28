import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchProduct,
  updateProduct,
} from "../features/products/productSlice";

function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      reset({
        title: selectedProduct.title,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        image_url: selectedProduct.image_url,
      });
    }
  }, [selectedProduct, reset]);

  const onSubmit = (data) => {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: 1,
    };

    dispatch(updateProduct({ productId: id, productData }))
      .unwrap()
      .then(() => {
        alert("Product updated successfully.");
        navigate(`/products/${id}`);
      });
  };

  if (loading && !selectedProduct) {
    return <p>Loading product...</p>;
  }

  if (!selectedProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input {...register("title", { required: "Title is required" })} />
        {errors.title && <p>{errors.title.message}</p>}

        <label>Description</label>
        <textarea
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
        />
        {errors.description && <p>{errors.description.message}</p>}

        <label>Price</label>
        <input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0.01, message: "Price must be greater than zero" },
          })}
        />
        {errors.price && <p>{errors.price.message}</p>}

        <label>Category</label>
        <input {...register("category", { required: "Category is required" })} />
        {errors.category && <p>{errors.category.message}</p>}

        <label>Image URL</label>
        <input
          type="url"
          {...register("image_url", { required: "Image URL is required" })}
        />
        {errors.image_url && <p>{errors.image_url.message}</p>}

        <p>Stock: 1 (each listing is one item)</p>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>

      {error && <p>{error.message || "Product update failed."}</p>}
    </div>
  );
}

export default EditProduct;
