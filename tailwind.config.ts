import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grain: {
          ink: "#17211b",
          muted: "#5e6a60",
          line: "#d9ded6",
          paper: "#fbfbf7",
          field: "#f1f4ec",
          green: "#167a5b",
          teal: "#0d7c86",
          amber: "#b46a19",
          rose: "#bc4758",
          blue: "#365c9d"
        }
      },
      boxShadow: {
        soft: "0 14px 35px rgba(23, 33, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
