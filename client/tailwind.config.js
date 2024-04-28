import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {themes: ["light", "dark"]}
}