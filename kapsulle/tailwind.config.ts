import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // The theme object is no longer needed here for defining tokens.
  // We will define them directly in our CSS file.
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config