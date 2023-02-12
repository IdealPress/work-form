const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./styles/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./slices/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Circular Std", ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.inherit'),
            a: {
              'text-decoration': 'underline',
              'text-underline-offset': '1px',
              'text-decoration-thickness': '2px',
              '&:hover': {
                color: theme('colors.gray.300'),
              }
            }
          },
        },
        lg: {
          css: {
            a: {
              'text-decoration': 'underline',
              'text-underline-offset': '1px',
              'text-decoration-thickness': '2px',
            }
          }
        },
        xl: {
          css: {
            a: {
              'text-decoration': 'underline',
              'text-underline-offset': '1px',
              'text-decoration-thickness': '2px',
            }
          }
        }
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
