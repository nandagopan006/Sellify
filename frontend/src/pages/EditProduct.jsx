import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchProduct,
  updateProduct,
} from "../features/products/productSlice";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/Error";
import {
  titleRules,
  descriptionRules,
  priceRules,
  categoryRules,
  imageUrlRules,
} from "../utils/validationRules";

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
    // Trim before sending, the same way the Sell form does.
    const productData = {
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      category: data.category.trim(),
      image_url: data.image_url.trim(),
      stock: 1,
    };

    dispatch(updateProduct({ productId: id, productData }))
      .unwrap()
      .then(() => {
        alert("Product updated successfully.");
        navigate(`/products/${id}`);
      })
      .catch(() => {
        
      });
  };

  if (loading && !selectedProduct) {
    return <Loading text="Loading product data..." />;
  }

  if (!selectedProduct) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">Product not found</h3>
        <p className="empty-state-desc">The product you want to edit does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Edit Product</h1>
        <p>Update the listing details for this product.</p>
      </div>

      <div className="form-card">
        {error && (
          <ErrorMessage error={error} message="Product update failed." />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Product Title</label>
            <input
              type="text"
              className="form-input"
              {...register("title", titleRules)}
            />
            {errors.title && (
              <span className="form-error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              {...register("description", descriptionRules)}
            />
            {errors.description && (
              <span className="form-error">{errors.description.message}</span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                {...register("price", priceRules)}
              />
              {errors.price && (
                <span className="form-error">{errors.price.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                {...register("category", categoryRules)}
              />
              {errors.category && (
                <span className="form-error">{errors.category.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-input"
              {...register("image_url", imageUrlRules)}
            />
            {errors.image_url && (
              <span className="form-error">{errors.image_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <span className="form-hint" style={{ fontWeight: 500, color: "var(--text-main)" }}>
              Stock: 1 (each listing is one item)
            </span>
          </div>

          <div style={{ marginTop: "1.75rem", display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/products/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
