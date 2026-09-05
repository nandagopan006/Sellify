import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import { signup, clearAuthError } from "../features/auth/authSlice";
import { showToast } from "../features/toast/toastSlice";
import { ErrorMessage } from "../components/Error";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const password = useWatch({
    control,
    name: "password",
  });

  // Login and Signup share state.auth.error, so clear any old one on the way in.
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(
      signup({
        username: data.username,
        email: data.email,
        password: data.password,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(showToast({ message: "Account created. Please login." }));
        navigate("/login");
      })
      .catch((rejected) => {
       
        const fieldErrors = rejected?.errors || rejected?.error;

        // No field details (server down, etc). The red banner already covers it.
        if (!fieldErrors) {
          return;
        }

        // Now show each message under the input it belongs to.
        // One loop turn: name = "username", messages = ["Too short."]
        for (const name in fieldErrors) {
          const messages = fieldErrors[name];
          const firstMessage = Array.isArray(messages) ? messages[0] : messages;

          setError(name, { type: "server", message: firstMessage });
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an account</h1>
          <p>Join Sellify to start buying and selling</p>
        </div>

        {error && (
          <ErrorMessage error={error} message="Signup failed. Please try again." />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. john_doe"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <span className="form-error">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 8 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="form-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.25rem" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="btn-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
