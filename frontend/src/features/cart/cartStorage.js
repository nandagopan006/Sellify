// Every account gets its own cart key, so two users sharing the same browser
// never end up looking at each other's items.
const getCartKey = (userId) => `cart_${userId}`;

export const saveCartItems = (userId, items) => {
  if (!userId) {
    return;
  }

  localStorage.setItem(
    getCartKey(userId),
    JSON.stringify(items)
  );
};

export const getCartItems = (userId) => {
  if (!userId) {
    return [];
  }

  const cartData = localStorage.getItem(getCartKey(userId));

  if (!cartData) {
    return [];
  }

  return JSON.parse(cartData);
};

export const clearCartItems = (userId) => {
  if (!userId) {
    return;
  }

  localStorage.removeItem(getCartKey(userId));
};

// Earlier builds saved every cart under one shared "cart" key. Drop it so those
// leftover items stop showing up for whoever logs in next.
export const removeLegacyCartItems = () => {
  localStorage.removeItem("cart");
};
