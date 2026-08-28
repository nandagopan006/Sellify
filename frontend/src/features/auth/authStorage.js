export const saveAuthData = (authData) => {
  localStorage.setItem(
    "auth",
    JSON.stringify(authData)
  );
};

export const getAuthData = () => {
  const authData = localStorage.getItem("auth");

  if (!authData) {
    return null;
  }

  return JSON.parse(authData);
};

export const clearAuthData = () => {
  localStorage.removeItem("auth");
};