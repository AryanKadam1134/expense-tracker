export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Mode - Clean and professional
        light: {
          bg: {
            primary: "#ffffff", // Main background
            secondary: "#f6f7f9", // Secondary background
            tertiary: "#e7eaf0", // Tertiary surfaces / skeletons
            hover: "#e8eaed", // Hover state
          },
          text: {
            primary: "#1a1a1a", // Primary text
            secondary: "#4a4a4a", // Secondary text
            tertiary: "#6b7280", // Tertiary text
          },
          border: {
            primary: "#e5e7eb", // Primary border
            secondary: "#d1d5db", // Secondary border
          },
          input: {
            bg: "#ffffff",
            bgFocus: "#f3f4f6",
            bgDisabled: "#f3f4f6",
            border: "#d1d5db",
            borderFocus: "transparent",
            ring: "#3b82f6",
            text: "#1a1a1a",
            placeholder: "#9ca3af",
            error: "#ef4444",
          },
        },
        // Dark Mode - Subtle, easy on the eyes
        dark: {
          bg: {
            primary: "#0f0f0f", // Main background - almost black but warm
            secondary: "#1a1a1a", // Slightly lighter
            tertiary: "#242424", // Secondary surfaces
            hover: "#2d2d2d", // Hover state
          },
          text: {
            primary: "#f5f5f5", // Primary text - soft white
            secondary: "#d4d4d4", // Secondary text
            tertiary: "#9ca3af", // Tertiary text - muted
          },
          border: {
            primary: "#2d2d2d", // Primary border
            secondary: "#404040", // Secondary border
          },
          input: {
            bg: "#1a1a1a",
            bgFocus: "#262626",
            bgDisabled: "#262626",
            border: "#404040",
            borderFocus: "transparent",
            ring: "#60a5fa",
            text: "#f5f5f5",
            placeholder: "#737373",
            error: "#f87171",
          },
        },
      },
    },
  },
};
