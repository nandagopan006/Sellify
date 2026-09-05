import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, clearAuthError } from "../features/auth/authSlice";
import { showToast } from "../features/toast/toastSlice";
import { ErrorMessage } from "../components/Error";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Login and Signup share state.auth.error, so clear any old one on the way in.
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data))
    .unwrap()
    .then((result)=> {
      const username = result?.user?.username;

      dispatch(showToast({
        message: username ? `Welcome back, ${username}!` : "Login successful.",
      }));

      navigate("/", { replace: true } );
    })
    .catch(() => {

      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your Sellify account</p>
        </div>

        {error && (
          <ErrorMessage error={error} message="Login failed. Please check your credentials." />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
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
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.25rem" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="btn-link"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;