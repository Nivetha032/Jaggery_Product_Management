/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Ensures Tailwind scans all your component files
      "./public/index.html", // Includes your main HTML file
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4A90E2", // Example custom color
          secondary: "#50E3C2",
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"], // Custom font
        },
      },
    },
    plugins: [],
  };
  