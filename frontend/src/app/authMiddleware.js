import { logout } from "../features/auth/authSlice";

// Redux middleware: every action passes through here before it reaches the
// reducers. Django sends code "token_not_valid" when the login token has
// expired, so when we see that we clear the saved login. ProtectedRoute then
// sends the user to /login on its own.
const authMiddleware = (store) => (next) => (action) => {
  if (action.payload?.code === "token_not_valid") {
    store.dispatch(logout());
  }

  return next(action);
};

export default authMiddleware;
