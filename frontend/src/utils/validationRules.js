export const MAX_TITLE_LENGTH = 150;
export const MAX_CATEGORY_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_PRICE = 99999999.99;

export const usernameRules = {
  required: "Username is required.",
  validate: {
    notOnlySpaces: (value) =>
      value.trim().length > 0 || "Username is required.",
    longEnough: (value) =>
      value.trim().length >= 3 ||
      "Username must be at least 3 characters long.",
    startsWithLetter: (value) =>
      /^[a-zA-Z]/.test(value.trim()) ||
      "Username must start with a letter.",
    allowedCharacters: (value) =>
      /^[a-zA-Z0-9_]+$/.test(value.trim()) ||
      "Username can only contain letters, numbers, and underscores.",
  },
};

export const emailRules = {
  required: "Email is required.",
  validate: {
    looksLikeAnEmail: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
      "Please provide a valid email address.",
  },
};

export const passwordRules = {
  required: "Password is required.",
  validate: {
    longEnough: (value) =>
      value.length >= 8 || "Password must be at least 8 characters long.",
    hasUppercase: (value) =>
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter.",
    hasLowercase: (value) =>
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter.",
    hasDigit: (value) =>
      /[0-9]/.test(value) || "Password must contain at least one digit.",
    hasSpecialCharacter: (value) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
      "Password must contain at least one special character.",
  },
};

export const loginPasswordRules = {
  required: "Password is required.",
};

export const buildConfirmPasswordRules = (password) => ({
  required: "Please confirm your password.",
  validate: {
    matchesPassword: (value) =>
      value === password || "Passwords do not match.",
  },
});

export const titleRules = {
  required: "Title is required.",
  validate: {
    notOnlySpaces: (value) => value.trim().length > 0 || "Title is required.",
    longEnough: (value) =>
      value.trim().length >= 3 || "Title must be at least 3 characters long.",
    startsWithLetter: (value) =>
      /^[a-zA-Z]/.test(value.trim()) || "Title must start with a letter.",
    notTooLong: (value) =>
      value.trim().length <= MAX_TITLE_LENGTH ||
      `Title cannot be longer than ${MAX_TITLE_LENGTH} characters.`,
  },
};

export const descriptionRules = {
  required: "Description is required.",
  validate: {
    notOnlySpaces: (value) =>
      value.trim().length > 0 || "Description is required.",
    longEnough: (value) =>
      value.trim().length >= 10 ||
      "Description must be at least 10 characters long.",
    startsWithLetter: (value) =>
      /^[a-zA-Z]/.test(value.trim()) ||
      "Description must start with a letter.",
    notTooLong: (value) =>
      value.trim().length <= MAX_DESCRIPTION_LENGTH ||
      `Description cannot be longer than ${MAX_DESCRIPTION_LENGTH} characters.`,
  },
};

export const priceRules = {
  required: "Price is required.",
  validate: {
    isANumber: (value) =>
      !Number.isNaN(Number(value)) || "Price must be a number.",
    greaterThanZero: (value) =>
      Number(value) > 0 || "Price must be greater than zero.",
    notTooLarge: (value) =>
      Number(value) <= MAX_PRICE ||
      `Price cannot be more than ${MAX_PRICE}.`,
    atMostTwoDecimals: (value) =>
      /^\d+(\.\d{1,2})?$/.test(String(value).trim()) ||
      "Price can have at most 2 decimal places.",
  },
};

export const categoryRules = {
  required: "Category is required.",
  validate: {
    notOnlySpaces: (value) =>
      value.trim().length > 0 || "Category is required.",
    longEnough: (value) =>
      value.trim().length >= 2 ||
      "Category must be at least 2 characters long.",
    startsWithLetter: (value) =>
      /^[a-zA-Z]/.test(value.trim()) || "Category must start with a letter.",
    notTooLong: (value) =>
      value.trim().length <= MAX_CATEGORY_LENGTH ||
      `Category cannot be longer than ${MAX_CATEGORY_LENGTH} characters.`,
  },
};

export const imageUrlRules = {
  required: "Image URL is required.",
  validate: {
    startsWithHttp: (value) => {
      const url = value.trim();

      return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        "Image URL must start with http:// or https://."
      );
    },
  },
};

export const getPriceFilterError = (minPrice, maxPrice) => {
  const min = minPrice.trim();
  const max = maxPrice.trim();

  if (min !== "" && Number.isNaN(Number(min))) {
    return "Min price must be a number.";
  }

  if (min !== "" && Number(min) < 0) {
    return "Min price cannot be negative.";
  }

  if (max !== "" && Number.isNaN(Number(max))) {
    return "Max price must be a number.";
  }

  if (max !== "" && Number(max) < 0) {
    return "Max price cannot be negative.";
  }

  if (min !== "" && max !== "" && Number(min) > Number(max)) {
    return "Min price cannot be greater than max price.";
  }

  return "";
};
