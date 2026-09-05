import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { hideToast } from "../features/toast/toastSlice";

// Small message that slides in at the top right and disappears on its own.
// It is rendered in App.jsx (not inside a page) so it survives when the page
// changes: Signup shows it and then immediately navigates to /login.
export default function Toast() {
  const dispatch = useDispatch();
  const { id, message, type } = useSelector((state) => state.toast);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 3000);

    // Cancel the old timer if a new toast arrives before this one finishes.
    return () => clearTimeout(timer);
  }, [id, message, dispatch]);

  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`} role="status">
      <span>{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={() => dispatch(hideToast())}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
