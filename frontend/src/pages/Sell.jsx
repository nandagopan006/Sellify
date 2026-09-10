import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../features/products/productSlice";
import { ErrorMessage } from "../components/Error";
import {
  titleRules,
  descriptionRules,
  priceRules,
  categoryRules,
  imageUrlRules,
} from "../utils/validationRules";

function Sell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Trim before sending. The serializer strips these too, but the value we
    // store should be the value we validated, not one with stray spaces.
    const productData = {
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      category: data.category.trim(),
      image_url: data.image_url.trim(),
      stock: 1,
    };

    dispatch(createProduct(productData))
      .unwrap()
      .then(() => {
        alert("Product created successfully.");
        navigate("/");
      })
      .catch(() => {
        // The error is already shown by <ErrorMessage /> above the form.
      });
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Sell a Product</h1>
        <p>Add the details of the item you want to list on the marketplace.</p>
      </div>

      <div className="form-card">
        {error && (
          <ErrorMessage error={error} message="Product creation failed." />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Product Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apple iPhone 14 128GB"
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
              placeholder="Describe the condition, features, accessories included..."
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
                placeholder="49999"
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
                placeholder="e.g. Electronics, Vehicles"
                {...register("category", categoryRules)}
              />
              {errors.category && (
                <span className="form-error">{errors.category.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/photo-..."
              {...register("image_url", imageUrlRules)}
            />
            {errors.image_url && (
              <span className="form-error">{errors.image_url.message}</span>
            )}
            <span className="form-hint">Provide a direct link to an image hosted online.</span>
          </div>

          <div className="form-group">
            <span className="form-hint" style={{ fontWeight: 500, color: "var(--text-main)" }}>
              Stock: 1 (each listing is treated as an individual marketplace item)
            </span>
          </div>

          <div style={{ marginTop: "1.75rem", display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Sell Product"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Sell;
