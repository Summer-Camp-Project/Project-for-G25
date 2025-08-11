/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e", // green-500 or any hex color you want
        "switch-background": "#e5e7eb", // gray-200 or custom
        card: "#f9fafb", // example for thumb bg
        "card-foreground": "#374151", // example text color
        "primary-foreground": "#ffffff", // white thumb on checked
        ring: "#22c55e", // green ring for focus
        input: "#d1d5db", // gray-300 for disabled etc.
      },
    },
  },
  plugins: [],
};
