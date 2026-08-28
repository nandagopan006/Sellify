import React from "react";

// Pulls the most useful sentence out of a DRF error response.
function getErrorText(error) {
  if (!error) {
    return "";
  }

  // Field errors look like { errors: { email: ["..."] } }
  const fields = error.errors || error.error;

  if (fields) {
    const firstKey = Object.keys(fields)[0];
    const firstValue = fields[firstKey];

    if (Array.isArray(firstValue)) {
      return firstValue[0];
    }

    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return error.detail || error.message || "";
}

// Small red box used by pages to show an API / form error.
export function ErrorMessage({ error, message = "Something went wrong." }) {
  const text = getErrorText(error) || message;

  return (
    <div className="alert alert-error">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

// Wraps the whole app so one broken component does not blank the screen.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ margin: "4rem auto" }}>
          <h2 className="empty-state-title">Something went wrong</h2>
          <p className="empty-state-desc">
            An unexpected error occurred. Please refresh the page and try again.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
