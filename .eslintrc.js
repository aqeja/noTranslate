module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "prefer-const": [
      "error",
      {
        destructuring: "all",
      },
    ],
    "react/jsx-key": "error",
  },
};
