export const saveCartItems = (items) => {
  localStorage.setItem(
    "cart",
    JSON.stringify(items)
  );
};

export const getCartItems = () => {
  const cartData = localStorage.getItem("cart");

  if (!cartData) {
    return [];
  }

  return JSON.parse(cartData);
};

export const clearCartItems = () => {
  localStorage.removeItem("cart");
};
