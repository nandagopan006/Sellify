import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="empty-state" style={{ margin: "4rem auto" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>404</h1>

      <h3 className="empty-state-title">Page not found</h3>

      <p className="empty-state-desc">
        The page you are looking for does not exist or may have been moved.
      </p>

      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
