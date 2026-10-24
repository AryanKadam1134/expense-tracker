export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Mode - Clean and professional
        light: {
          bg: {
            primary: "#ffffff", // Main background
            secondary: "#f3f7f4",
            tertiary: "#e7f0e9",
            hover: "#edf4ef",
          },
          text: {
            primary: "#172b24",
            secondary: "#52645b",
            tertiary: "#84938b",
          },
          border: {
            primary: "#e1e9e3",
            secondary: "#cbd8ce",
          },
          input: {
            bg: "#ffffff",
            bgFocus: "#f8fbf8",
            bgDisabled: "#f1f5f2",
            border: "#d6e1d8",
            borderFocus: "transparent",
            ring: "#5b9a75",
            text: "#172b24",
            placeholder: "#9ca3af",
            error: "#ef4444",
          },
        },
        // Dark Mode - Subtle, easy on the eyes
        dark: {
          bg: {
            primary: "#142019",
            secondary: "#101914",
            tertiary: "#1c2b21",
            hover: "#26382c",
          },
          text: {
            primary: "#f0f7f1",
            secondary: "#d2e0d5",
            tertiary: "#91a397",
          },
          border: {
            primary: "#2b3b30",
            secondary: "#3b5041",
          },
          input: {
            bg: "#1a1a1a",
            bgFocus: "#1e3024",
            bgDisabled: "#1a2920",
            border: "#3b5041",
            borderFocus: "transparent",
            ring: "#79bf91",
            text: "#f0f7f1",
            placeholder: "#737373",
            error: "#f87171",
          },
        },
      },
    },
  },
};
