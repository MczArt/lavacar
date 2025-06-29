/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          light: '#3b82f6',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        'brand-gray': {
          light: '#f3f4f6',
          DEFAULT: '#d1d5db',
          dark: '#4b5563',
        },
      },
    },
  },
  plugins: [],
}
